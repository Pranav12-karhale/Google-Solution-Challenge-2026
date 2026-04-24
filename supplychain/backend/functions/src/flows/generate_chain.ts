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
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.5-flash-lite',
  'googleai/gemini-1.5-flash',
];

// Hard timeout (seconds) for the entire fallback loop
const OVERALL_TIMEOUT_MS = 30_000;
// Max delay we'll ever wait for a single retry
const MAX_RETRY_DELAY_MS = 5_000;

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
    // Check hard timeout
    if (Date.now() >= deadline) {
      console.warn(`   ⏰ Overall timeout reached (${OVERALL_TIMEOUT_MS / 1000}s). Giving up on AI.`);
      break;
    }

    try {
      console.log(`   📡 Trying model: ${model}...`);
      const { output } = await ai.generate({
        model,
        prompt: options.prompt,
        output: { schema: options.outputSchema },
        config: model.includes('3.1-pro') ? { thinkingLevel: 'high' } : {},
      });

      if (output) {
        console.log(`   ✅ Success with: ${model}`);
        return output;
      }
    } catch (error: any) {
      lastError = error;
      const msg = error.message || String(error);
      console.warn(`   ⚠️ ${model} failed: ${msg.substring(0, 80)}...`);

      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        // Quota is project-wide on free tier — waiting won't help, skip to next model
        console.log(`   ⏭️ Rate limited (project-wide quota). Skipping to next model...`);
        continue;
      }

      if (msg.includes('503')) {
        // Server overloaded — wait briefly then try next model
        const delayMs = Math.min(MAX_RETRY_DELAY_MS, 3000);
        console.log(`   ⏳ Server overloaded, waiting ${delayMs}ms then trying next...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }

      // Any other error (404 model not found, etc.) — skip immediately
      console.log(`   ⏭️ Non-retryable error, trying next model...`);
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
    inputSchema: z.object({ businessIdea: z.string() }),
    outputSchema: BusinessAnalysisSchema,
  },
  async (input) => {
    return await generateWithFallback({
      prompt: `You are a supply chain expert and business analyst. Analyze the following business idea and break it down into its logistical components.

Business Idea: "${input.businessIdea}"

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

    return await generateWithFallback({
      prompt: `You are a supply chain architect. Based on the following business analysis, design a complete supply chain node graph.

Business Idea: "${input.businessIdea}"

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
1. Specific, named nodes with realistic geographic locations (e.g., "Coffee Roasting Facility (Portland, OR)", "Semiconductor Fab (Hsinchu, Taiwan)", "Distribution Center (Memphis, TN)", not just "Manufacturer" or "Warehouse")
2. Proper ordering from raw materials to end consumer
3. Logical edges connecting nodes with appropriate relationships
4. Realistic metadata for each node, INCLUDING precise real-world geographic coordinates (latitude/longitude) for each node based on its realistic location.
5. Include quality control, customs, or compliance nodes where the analysis requires them
6. Use sequential node IDs like "node_1", "node_2", etc.
7. Use sequential edge IDs like "edge_1", "edge_2", etc.

Create an appropriate number of nodes depending on complexity (can be short for local or extensive for inter-country supply). Design a modern hybrid chain (e.g., 'Core + Plus')—long enough to remain economically competitive (global hubs for cost/scale), but short enough to survive a crisis (parallel localized nodes for agility). Be realistic and practical.`,
      outputSchema,
    });
  }
);

// ============================================================
// Agent 3: UI Config Generator
// Assigns page_components to each node based on its type
// ============================================================

const generateUIConfigFlow = ai.defineFlow(
  {
    name: 'generateUIConfig',
    inputSchema: z.object({
      node: z.object({
        id: z.string(),
        name: z.string(),
        type: NodeType,
        description: z.string(),
        metadata: z.record(z.any()),
      }),
      analysis: BusinessAnalysisSchema,
    }),
    outputSchema: NodeUIConfigSchema,
  },
  async (input) => {
    return await generateWithFallback({
      prompt: `You are a UI/UX expert for supply chain management. Generate the UI configuration for a supply chain node page.

Node: "${input.node.name}" (Type: ${input.node.type})
Description: ${input.node.description}
Industry: ${input.analysis.industry}
Compliance Needs: ${input.analysis.compliance_needs.join(', ')}

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

Choose an appropriate Material icon name for this node type.
Choose an appropriate hex color.
Select 3-6 components that are most relevant for managing this specific node type in this industry.
Configure each component's args with realistic, specific values for this node.
CRITICAL: If you select "map_view", you must populate the "origin" coordinates using this node's geographic coordinates from the metadata, and "destination" connecting to the next logical location. If you drop the args it will crash.`,
      outputSchema: NodeUIConfigSchema,
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
    inputSchema: z.object({ businessIdea: z.string() }),
    outputSchema: SupplyChainSchema,
  },
  async (input) => {
    // Step 1: Analyze the business idea
    const analysis = await analyzeBusinessFlow(input);

    // Step 2: Architect the chain (nodes + edges)
    const architecture = await architectChainFlow({
      businessIdea: input.businessIdea,
      analysis,
    });

    // Step 3: Generate UI configs for each node SEQUENTIALLY to avoid rate limits
    const nodesWithUI = [];
    for (const node of architecture.nodes) {
      // Add slight delay between requests just to be safe
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const uiConfig = await generateUIConfigFlow({
        node,
        analysis,
      });

      nodesWithUI.push({
        ...node,
        status: 'active' as const,
        ui_config: uiConfig,
      });
    }

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
