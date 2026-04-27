import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = genkit({
  plugins: [googleAI()],
});

const PRIORITIZED_MODELS = [
  'googleai/gemini-3.1-pro',
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.5-flash-lite',
  'googleai/gemini-2.0-flash-lite',
];

async function test() {
  for (const model of PRIORITIZED_MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const { output } = await ai.generate({
        model,
        prompt: "Say hello",
      });
      console.log(`Success with: ${model}`, output);
      return;
    } catch (error: any) {
      console.log(`Failed with: ${model}`, error.message);
    }
  }
}
test();
