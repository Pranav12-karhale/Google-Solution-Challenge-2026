import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  SupplyChainSchema,
  BusinessAnalysisSchema,
  SupplyChainNodeSchema,
  EdgeSchema,
  NodeUIConfigSchema,
  PageComponentSchema,
  NodeType,
  type SupplyChain,
  type BusinessAnalysis,
} from '../schemas/supply_chain_schema.js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// Initialize Genkit with Google AI (Gemini)
// ============================================================

const ai = genkit({
  plugins: [googleAI()],
});

const PRIORITIZED_MODELS = [
  'googleai/gemini-3.1-pro',
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.5-flash-lite',
  'googleai/gemini-2.0-flash-lite',
  'googleai/gemini-1.5-flash',
];

// Hard timeout (seconds) for the entire fallback loop
const OVERALL_TIMEOUT_MS = 60_000;
// Max delay we'll ever wait for a single retry
const MAX_RETRY_DELAY_MS = 5_000;

let _aiInstances: any[] | null = null;
function getAiInstances() {
  if (_aiInstances) return _aiInstances;
  
  _aiInstances = [
    process.env.GOOGLE_GENAI_API_KEY ? genkit({ plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })] }) : null,
    process.env.GOOGLE_GENAI_API_KEY_BACKUP ? genkit({ plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY_BACKUP })] }) : null,
  ].filter(Boolean);
  
  if (_aiInstances.length === 0) {
    console.warn("⚠️ WARNING: getAiInstances found 0 valid API keys in environment variables!");
  }
  
  return _aiInstances;
}

/**
 * Helper to attempt generation with multiple models in order of priority.
 * Designed to fail fast: caps delays, skips rate-limited models immediately
 * (quota is project-wide, so waiting won't help), and enforces a hard timeout.
 */
async function generateWithFallback<T extends z.ZodTypeAny>(options: {
  prompt: string;
  outputSchema: T;
}) {
  let lastError: any;
  const deadline = Date.now() + OVERALL_TIMEOUT_MS;

  for (const model of PRIORITIZED_MODELS) {
    if (Date.now() >= deadline) {
      console.warn(`   ⏰ Overall timeout reached (${OVERALL_TIMEOUT_MS / 1000}s). Giving up on AI.`);
      break;
    }

    const aiInstances = getAiInstances();
    for (let keyIdx = 0; keyIdx < aiInstances.length; keyIdx++) {
      const currentAi = aiInstances[keyIdx];

      for (let attempt = 0; attempt < 2; attempt++) {
        if (Date.now() >= deadline) break;

        try {
          console.log(`   📡 Trying model: ${model} with key ${keyIdx + 1}${attempt > 0 ? ` (retry ${attempt})` : ''}...`);
          const { output } = await currentAi.generate({
            model,
            prompt: options.prompt,
            output: { schema: options.outputSchema },
            config: {},
          });

          if (output) {
            console.log(`   ✅ Success with: ${model} (key ${keyIdx + 1})`);
            return output;
          }
        } catch (error: any) {
          lastError = error;
          const msg = error.message || String(error);
          console.warn(`   ⚠️ ${model} (key ${keyIdx + 1}) failed: ${msg.substring(0, 120)}...`);

          if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
            if (keyIdx < aiInstances.length - 1) {
              console.log(`   🔄 Rate limited. Switching to next API key immediately...`);
              break; // Move to next key
            } else {
              console.log(`   ⏭️ All keys exhausted for ${model}. Falling back to next model...`);
              keyIdx = aiInstances.length; // break key loop
              break; // Try next model
            }
          }

          if (msg.includes('503')) {
            const delayMs = Math.min(MAX_RETRY_DELAY_MS, 3000);
            console.log(`   ⏳ Server overloaded, waiting ${delayMs}ms then trying next...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            break; // Try next key
          }

          // Any other error (404 model not found, etc.) — skip immediately
          console.log(`   ⏭️ Non-retryable error, trying next model...`);
          keyIdx = aiInstances.length; // force key loop to end
          break; // break attempt loop
        }
      }
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message || lastError}`);
}

// ============================================================
// Agent 1: Business Analyzer
// Breaks down the business idea into structured components
// ============================================================

const analyzeBusinessFlow = ai.defineFlow(
  {
    name: 'analyzeBusiness',
    inputSchema: z.object({ 
      businessIdea: z.string(),
      clientLocation: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string(),
      }).optional(),
      strictLocal: z.boolean().optional(),
    }),
    outputSchema: BusinessAnalysisSchema,
  },
  async (input) => {
    const locationContext = input.clientLocation
      ? `\nClient Location: ${input.clientLocation.address} (Lat: ${input.clientLocation.lat}, Lng: ${input.clientLocation.lng})\nStrict Local Sourcing: ${input.strictLocal ? 'YES - This must be a hyper-local business.' : 'No'}`
      : '';

    return await generateWithFallback({
      prompt: `You are a supply chain expert and business analyst. Analyze the following business idea and break it down into its logistical components.

Business Idea: "${input.businessIdea}"${locationContext}

Identify:
1. The primary industry this business operates in
2. The type of product or service
3. The target market and geography
4. Key business requirements for the supply chain
5. Any regulatory or compliance needs (food safety, customs, certifications, etc.)
6. The types of supply chain nodes that would be needed
7. The overall complexity of the supply chain
8. Any special considerations (cold chain, hazardous materials, perishables, etc.)

Be specific and practical. Think about real-world logistics.`,
      outputSchema: BusinessAnalysisSchema,
    });
  }
);

// ============================================================
// Agent 2: Chain Architect
// Designs the node graph with proper relationships
// ============================================================

const architectChainFlow = ai.defineFlow(
  {
    name: 'architectChain',
    inputSchema: z.object({
      businessIdea: z.string(),
      analysis: BusinessAnalysisSchema,
      clientLocation: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string(),
      }).optional(),
      strictLocal: z.boolean().optional(),
    }),
    outputSchema: z.object({
      nodes: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: NodeType,
        description: z.string(),
        order: z.number(),
        metadata: z.record(z.any()),
      })),
      edges: z.array(z.object({
        id: z.string(),
        source_node_id: z.string(),
        target_node_id: z.string(),
        relationship: z.string(),
        metadata: z.record(z.any()),
      })),
    }),
  },
  async (input) => {
    const outputSchema = z.object({
      nodes: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: NodeType,
        description: z.string(),
        order: z.number(),
        metadata: z.record(z.any()),
      })),
      edges: z.array(z.object({
        id: z.string(),
        source_node_id: z.string(),
        target_node_id: z.string(),
        relationship: z.string(),
        metadata: z.record(z.any()),
      })),
    });

    const locationContext = input.clientLocation
      ? `\nClient Location: ${input.clientLocation.address} (Lat: ${input.clientLocation.lat}, Lng: ${input.clientLocation.lng})\nStrict Local Sourcing: ${input.strictLocal ? 'YES - MUST use businesses very close to these coordinates' : 'Preferred'}`
      : '';

    return await generateWithFallback({
      prompt: `You are a supply chain architect. Based on the following business analysis, design a complete supply chain node graph.

Business Idea: "${input.businessIdea}"${locationContext}

Analysis:
- Industry: ${input.analysis.industry}
- Product Type: ${input.analysis.product_type}
- Target Market: ${input.analysis.target_market}
- Key Requirements: ${input.analysis.key_requirements.join(', ')}
- Compliance Needs: ${input.analysis.compliance_needs.join(', ')}
- Suggested Node Types: ${input.analysis.estimated_node_types.join(', ')}
- Complexity: ${input.analysis.complexity}
- Special Considerations: ${input.analysis.special_considerations.join(', ')}

Design the supply chain with:
1. Specific, named nodes with realistic geographic locations. 
   - CRITICAL REQUIREMENT: You MUST use FACTUAL, ACTUALLY EXISTING businesses (real factories, real warehouses, real shops, real distributors) whenever possible. Do NOT invent names like "Acme Warehouse". 
   - If the business idea mentions a specific city or region, OR if a Client Location is provided above, you MUST find real businesses operating near that specific location.
   - If Strict Local Sourcing is YES, you MUST anchor the primary operations (manufacturing, warehousing, fulfillment) as close to the Client Location's latitude/longitude as possible.
   - If no location context is provided at all, use real-world industry hubs (e.g., TSMC in Taiwan for chips, Port of Long Beach, etc.).
2. Proper ordering from raw materials to end consumer.
3. Logical edges connecting nodes with appropriate relationships.
4. Realistic metadata for each node, INCLUDING precise real-world geographic coordinates (latitude/longitude) for these actual businesses.
5. Include quality control, customs, or compliance nodes where the analysis requires them.
6. Use sequential node IDs like "node_1", "node_2", etc.
7. Use sequential edge IDs like "edge_1", "edge_2", etc.

Create an appropriate number of nodes depending on complexity. 
CRITICAL RULES FOR LOCALIZATION:
- If Strict Local Sourcing is YES, you MUST build a HYPER-LOCAL supply chain. EVERY single node (raw materials, manufacturing, warehousing, distribution) MUST be located within a 100-mile radius of the Client Location. DO NOT include international or cross-border nodes under any circumstances.
- If Strict Local is NO but a local business is specified, keep the supply chain localized where possible but use global hubs if necessary.
- Be strictly factual and practical.`,
      outputSchema,
    });
  }
);

// ============================================================
// Agent 3: UI Config Generator (BATCHED)
// Assigns page_components to each node based on its type in a single request
// ============================================================

const batchGenerateUIConfigFlow = ai.defineFlow(
  {
    name: 'batchGenerateUIConfig',
    inputSchema: z.object({
      nodes: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: NodeType,
        description: z.string(),
        metadata: z.record(z.any()),
      })),
      analysis: BusinessAnalysisSchema,
    }),
    outputSchema: z.object({
      configs: z.record(z.string(), NodeUIConfigSchema),
    }),
  },
  async (input) => {
    const nodesContext = input.nodes.map(n => `- Node ID: [${n.id}]\n  Name: "${n.name}" (Type: ${n.type})\n  Description: ${n.description}`).join('\n\n');

    return await generateWithFallback({
      prompt: `You are a UI/UX expert for supply chain management. Generate the UI configuration for a supply chain node page.
You are receiving a list of ${input.nodes.length} nodes. You MUST generate a completely unique, highly specific UI configuration for EVERY SINGLE node in this list. Do not skip any node.

Industry: ${input.analysis.industry}
Compliance Needs: ${input.analysis.compliance_needs.join(', ')}

Here are the ${input.nodes.length} nodes you need to configure:
${nodesContext}

Available component types:
- "kpi_card_row": Row of metric cards. Args: { cards: [{ label, unit, dataKey }] }
- "inventory_table": Sortable data grid. Args: { columns: string[], dataSource: string, sortable: boolean, filterable: boolean }
- "status_tracker": Pipeline/stage tracker. Args: { stages: string[], dataKey: string }
- "analytics_chart": Charts. Args: { chartType: "line"|"bar"|"pie", title: string, xAxis: string, yAxis: string, dataSource: string }
- "approval_form": Action form. Args: { fields: [{ name, type, label, required }], actions: [{ label, action, variant }] }
- "order_list": Order management. Args: { columns: string[], statusFilters: string[], dataSource: string }
- "data_grid": Generic table. Args: { columns: string[], dataSource: string, editable: boolean }
- "timeline": Event timeline. Args: { dataSource: string, showDate: boolean }
- "notification_feed": Alerts. Args: { categories: string[], dataSource: string }
- "map_view": Map display. Args: { origin: { lat: number, lng: number }, destination: { lat: number, lng: number }, showRoute: boolean }
- "document_upload": File upload. Args: { acceptedTypes: string[], maxSizeMB: number, label: string }
- "qr_scanner": QR scanner. Args: { outputField: string, label: string }

For EVERY node ID, provide its configuration in the output dictionary.
For each configuration:
1. Choose an appropriate Material icon name for this node type.
2. Choose an appropriate hex color.
3. Select 3-6 components that are most relevant for managing this specific node type in this industry.
4. Configure each component's args with realistic, specific values for this node.
CRITICAL: If you select "map_view", you must populate the "origin" coordinates using this node's geographic coordinates from the metadata, and "destination" connecting to the next logical location. If you drop the args it will crash.`,
      outputSchema: z.object({
        configs: z.record(z.string(), NodeUIConfigSchema),
      }),
    });
  }
);

// ============================================================
// Main Orchestrator Flow
// Chains Agent 1 → Agent 2 → Agent 3 for each node
// ============================================================

export const generateSupplyChainFlow = ai.defineFlow(
  {
    name: 'generateSupplyChain',
    inputSchema: z.object({ 
      businessIdea: z.string(),
      clientLocation: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string(),
      }).optional(),
      strictLocal: z.boolean().optional(),
      destination: z.string().optional(),
      chainScope: z.string().optional(),
      displayStrategy: z.string().optional(),
    }),
    outputSchema: SupplyChainSchema,
  },
  async (input) => {
    // Step 1: Analyze the business idea
    const analysis = await analyzeBusinessFlow({
      businessIdea: input.businessIdea,
      clientLocation: input.clientLocation,
      strictLocal: input.strictLocal,
    });

    // Step 2: Architect the chain (nodes + edges)
    const architecture = await architectChainFlow({
      businessIdea: input.businessIdea,
      analysis,
      clientLocation: input.clientLocation,
      strictLocal: input.strictLocal,
    });

    // Step 3: Generate UI configs for ALL nodes in a single batched request to avoid rate limits
    console.log(`   🎨 Batching UI configurations for ${architecture.nodes.length} nodes...`);
    const uiConfigsResponse = await batchGenerateUIConfigFlow({
      nodes: architecture.nodes,
      analysis,
    });
    
    console.log(`   🐛 DEBUG uiConfigsResponse:`, JSON.stringify(uiConfigsResponse).substring(0, 500));
    
    const uiConfigs = uiConfigsResponse.configs || {};

    const nodesWithUI = architecture.nodes.map(node => {
      // Fallback config if AI accidentally missed one (extremely rare)
      let config: any = uiConfigs[node.id] || uiConfigs[`[${node.id}]`];
      if (typeof config === 'string') {
        try { config = JSON.parse(config); } catch (e) { config = null; }
      }
      if (config && config.components && !config.page_components) {
        config.page_components = config.components;
      }
      if (!config || typeof config !== 'object') {
        config = {
          icon: 'factory',
          color: '#4CAF50',
          page_components: [{ type: 'kpi_card_row', args: { cards: [] } }]
        };
      }
      return {
        ...node,
        status: 'active' as const,
        ui_config: config,
      };
    });

    // Step 4: Assemble the complete supply chain
    const supplyChain: SupplyChain = {
      id: `sc_${uuidv4().split('-')[0]}`,
      name: `${analysis.product_type} Supply Chain`,
      business_idea: input.businessIdea,
      status: 'active',
      created_at: new Date().toISOString(),
      nodes: nodesWithUI,
      edges: architecture.edges.map((edge) => ({
        ...edge,
        relationship: edge.relationship as any,
      })),
    };

    // Validate against our schema
    const validated = SupplyChainSchema.parse(supplyChain);
    return validated;
  }
);

export { ai };
