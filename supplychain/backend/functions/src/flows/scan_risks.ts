import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  SupplyChainSchema,
  RiskScanResultSchema,
  RiskReportSchema,
  type SupplyChain,
  type RiskReport,
} from '../schemas/supply_chain_schema.js';
import { DISRUPTION_PLAYBOOK } from './disruption_playbook.js';

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

const OVERALL_TIMEOUT_MS = 45_000; // longer timeout — scanning all nodes
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

async function generateWithFallback<T extends z.ZodTypeAny>(options: {
  prompt: string;
  outputSchema: T;
}) {
  let lastError: any;
  const deadline = Date.now() + OVERALL_TIMEOUT_MS;

  for (const model of PRIORITIZED_MODELS) {
    if (Date.now() >= deadline) {
      console.warn(`   ⏰ Overall timeout reached. Giving up on AI.`);
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
          });

          if (output) {
            console.log(`   ✅ Risk scan success with: ${model} (key ${keyIdx + 1})`);
            return output;
          }
        } catch (error: any) {
          lastError = error;
          const msg = error.message || String(error);
          console.warn(`   ⚠️ ${model} (key ${keyIdx + 1}) failed: ${msg.substring(0, 80)}...`);

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

  throw new Error(`All models failed for risk scan. Last error: ${lastError?.message || lastError}`);
}

export const scanSupplyChainRisksFlow = ai.defineFlow(
  {
    name: 'scanSupplyChainRisks',
    inputSchema: z.object({
      supplyChain: SupplyChainSchema,
    }),
    outputSchema: z.object({
      results: z.array(RiskScanResultSchema),
    }),
  },
  async (input) => {
    const nodesSummary = input.supplyChain.nodes.map(n => {
      const loc = n.metadata?.location || 'Unknown';
      const coords = n.metadata?.coordinates
        ? `(${n.metadata.coordinates.lat}, ${n.metadata.coordinates.lng})`
        : '';
      return `- ${n.id}: "${n.name}" | Type: ${n.type} | Location: ${loc} ${coords}`;
    }).join('\n');

    return await generateWithFallback({
      prompt: `You are a world-class supply chain risk intelligence analyst. Your job is to assess the real-world risks facing each node in a supply chain based on its GEOGRAPHIC LOCATION and TYPE.

We have a strict 10-section Disruption Playbook. You must scan the nodes to detect vulnerabilities that match these 10 categories:

PLAYBOOK CATEGORIES TO SCAN FOR:
${DISRUPTION_PLAYBOOK}

SUPPLY CHAIN NODES:
${nodesSummary}

IMPORTANT INSTRUCTIONS:
- Score each risk 0-10 (0 = negligible, 10 = extreme immediate threat).
- Only include risks that score 3 or higher (skip negligible risks).
- The "headline" should be 2-5 words identifying the risk from the 10-section playbook (e.g., "Trade War Risk", "Earthquake Zone", "Just-in-Time Fragility").
- The "explanation" MUST be written for a startup founder with ZERO supply chain experience. Use simple language, no jargon.
- The "recommended_action" MUST be a specific, actionable step drawn DIRECTLY from the Playbook's "Solutions" (e.g., "Implement a 90-day strategic buffer", "Establish a sea-air hybrid backup").
- The "overall_risk" for each node should be the WEIGHTED AVERAGE of its individual risk scores.
- Be realistic and grounded — base your analysis on actual known risks for these real-world locations and node types.

Return results for EVERY node in the chain.`,
      outputSchema: z.object({
        results: z.array(RiskScanResultSchema),
      }),
    });
  }
);
