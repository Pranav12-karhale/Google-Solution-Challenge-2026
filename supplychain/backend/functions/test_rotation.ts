import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const ai1 = genkit({ plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })] });
    console.log('AI1 created');
    
    const ai2 = genkit({ plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY_BACKUP })] });
    console.log('AI2 created');
    
    const res = await ai2.generate({
      model: 'googleai/gemini-2.5-flash-lite',
      prompt: 'say hi',
    });
    console.log('AI2 generated:', res.text);
  } catch(err: any) {
    console.error(err.message);
  }
}

test();
