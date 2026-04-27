import dotenv from 'dotenv';
dotenv.config();
import { generateSupplyChainFlow } from './src/flows/generate_chain.js';

async function test() {
  try {
    console.log("Starting flow...");
    const result = await generateSupplyChainFlow({
      businessIdea: "A global chocolate company",
      clientLocation: { lat: 40, lng: -74, address: "New York" },
      strictLocal: false,
      destination: "London",
      chainScope: "auto"
    });
    console.log("Success:", result.id);
  } catch(e: any) {
    console.error("FATAL ERROR IN FLOW:");
    console.error(e.message);
    if (e.stack) console.error(e.stack);
  }
}
test();
