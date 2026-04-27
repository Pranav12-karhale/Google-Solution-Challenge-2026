import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  SupplyChainSchema,
  DisruptionEventSchema,
  MitigationActionSchema,
  type SupplyChain,
  type DisruptionEvent,
} from '../schemas/supply_chain_schema.js';
import { v4 as uuidv4 } from 'uuid';
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

const OVERALL_TIMEOUT_MS = 30_000;
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
            config: model.includes('pro') ? { thinkingLevel: 'high' } : {},
          });

          if (output) {
            console.log(`   ✅ Success with: ${model} (key ${keyIdx + 1})`);
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

  throw new Error(`All models failed. Last error: ${lastError?.message || lastError}`);
}

// Playbook is imported from disruption_playbook.ts

export const resolveDisruptionFlow = ai.defineFlow(
  {
    name: 'resolveDisruption',
    inputSchema: z.object({
      supplyChain: SupplyChainSchema,
      disruption: DisruptionEventSchema,
    }),
    outputSchema: MitigationActionSchema,
  },
  async (input) => {
    return await generateWithFallback({
      prompt: `You are an elite Supply Chain Disruption Resolution Agent. Your job is to analyze an active disruption and propose an actionable mitigation plan based strictly on the provided Playbook.

Playbook Rules (10 Sections):
${DISRUPTION_PLAYBOOK}

Current Disruption:
Type: ${input.disruption.type}
Severity: ${input.disruption.severity}
Description: "${input.disruption.description}"
Affected Nodes: ${input.disruption.affected_node_ids.join(', ')}

Your task:
1. Determine the best mitigation strategy from the 10-section playbook that exactly matches the disruption type.
2. Select the "action_type" (reroute, activate_backup, release_buffer, etc.).
3. If new backup nodes or routes are needed, define them in "proposed_node_changes" and "proposed_edge_changes". Assign them IDs that start with 'node_backup_' and 'edge_backup_'.
4. Provide a clear description of the action.
5. Estimate the cost impact and time delay (or time saved by acting early).

You have access to the full supply chain structure to generate the correct IDs and logic.`,
      outputSchema: MitigationActionSchema,
    });
  }
);
