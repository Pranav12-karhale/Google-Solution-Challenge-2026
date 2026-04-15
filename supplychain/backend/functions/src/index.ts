import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateMockSupplyChain } from './utils/mock_data.js';
import type { SupplyChain } from './schemas/supply_chain_schema.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store (simulates Firestore)
const supplyChains: Map<string, SupplyChain> = new Map();

const USE_AI = !!process.env.GOOGLE_GENAI_API_KEY;

// ============================================================
// POST /api/generate - Generate supply chain from business idea
// ============================================================
app.post('/api/generate', async (req, res) => {
  try {
    const { businessIdea } = req.body;
    if (!businessIdea || typeof businessIdea !== 'string') {
      res.status(400).json({ error: 'businessIdea is required' });
      return;
    }

    console.log(`\n🧠 Generating supply chain for: "${businessIdea}"`);
    console.log(`   Mode: ${USE_AI ? '🤖 AI (Gemini)' : '📋 Mock Data'}\n`);

    let chain: SupplyChain;

    if (USE_AI) {
      // Dynamic import to avoid loading Genkit when not needed
      const { generateSupplyChainFlow } = await import('./flows/generate_chain.js');
      chain = await generateSupplyChainFlow({ businessIdea });
    } else {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      chain = generateMockSupplyChain(businessIdea);
    }

    // Store in memory
    supplyChains.set(chain.id, chain);

    console.log(`✅ Generated chain: ${chain.name} (${chain.nodes.length} nodes, ${chain.edges.length} edges)`);
    chain.nodes.forEach(n => console.log(`   📦 ${n.name} (${n.type}) — ${n.ui_config.page_components.length} components`));

    res.json({ success: true, supply_chain: chain });
  } catch (error: any) {
    console.error('❌ Generation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// GET /api/chains - List all supply chains
// ============================================================
app.get('/api/chains', (req: express.Request, res: express.Response) => {
  const chains = Array.from(supplyChains.values()).map(c => ({
    id: c.id,
    name: c.name,
    business_idea: c.business_idea,
    status: c.status,
    created_at: c.created_at,
    node_count: c.nodes.length,
  }));
  res.json({ chains });
});

// ============================================================
// GET /api/chains/:id - Get full supply chain with nodes
// ============================================================
app.get('/api/chains/:id', (req: express.Request, res: express.Response) => {
  const chain = supplyChains.get(req.params.id as string);
  if (!chain) {
    res.status(404).json({ error: 'Supply chain not found' });
    return;
  }
  res.json({ supply_chain: chain });
});

// ============================================================
// GET /api/chains/:chainId/nodes/:nodeId - Get single node
// ============================================================
app.get('/api/chains/:chainId/nodes/:nodeId', (req: express.Request, res: express.Response) => {
  const chain = supplyChains.get(req.params.chainId as string);
  if (!chain) {
    res.status(404).json({ error: 'Supply chain not found' });
    return;
  }
  const node = chain.nodes.find(n => n.id === req.params.nodeId);
  if (!node) {
    res.status(404).json({ error: 'Node not found' });
    return;
  }
  res.json({ node });
});

// ============================================================
// POST /api/chains/:id/add-node - Add node to existing chain
// (Simulates self-healing / AI adding new nodes)
// ============================================================
app.post('/api/chains/:id/add-node', async (req: express.Request, res: express.Response) => {
  try {
    const chain = supplyChains.get(req.params.id as string);
    if (!chain) {
      res.status(404).json({ error: 'Supply chain not found' });
      return;
    }

    const { reason } = req.body;
    console.log(`\n🔧 Adding node to chain ${chain.name}: "${reason}"`);

    // Simulate AI generating a new Quality Control node
    const newNode = {
      id: `node_${chain.nodes.length + 1}`,
      name: `Crisis Response: ${reason}`,
      type: 'quality_control' as const,
      description: `Dynamically generated node in response to: ${reason}`,
      status: 'active' as const,
      order: chain.nodes.length,
      metadata: { location: 'Dynamic', generated_reason: reason },
      ui_config: {
        icon: 'emergency',
        color: '#F44336',
        page_components: [
          {
            type: 'kpi_card_row' as const,
            args: {
              cards: [
                { label: 'Issue Status', unit: '', dataKey: 'status', value: 'Active' },
                { label: 'Impact Level', unit: '', dataKey: 'impact', value: 'High' },
                { label: 'Resolution ETA', unit: 'hrs', dataKey: 'eta', value: 24 },
              ],
            },
          },
          {
            type: 'timeline' as const,
            args: {
              dataSource: 'crisis_events',
              showDate: true,
              data: [
                { date: new Date().toISOString(), event: `Crisis detected: ${reason}`, status: 'error' },
                { date: new Date().toISOString(), event: 'AI generated crisis response node', status: 'info' },
                { date: new Date().toISOString(), event: 'Awaiting resolution actions', status: 'pending' },
              ],
            },
          },
          {
            type: 'approval_form' as const,
            args: {
              title: 'Crisis Resolution Actions',
              fields: [
                { name: 'action', type: 'select', label: 'Resolution Action', required: true, options: ['Reroute Shipment', 'Find Alternative Supplier', 'Delay Order', 'Expedite Backup'] },
                { name: 'notes', type: 'textarea', label: 'Notes', required: false },
              ],
              actions: [
                { label: 'Execute Resolution', action: 'resolve', variant: 'primary' },
                { label: 'Escalate', action: 'escalate', variant: 'warning' },
              ],
            },
          },
        ],
      },
    };

    chain.nodes.push(newNode);

    // Add edge from last non-crisis node
    const newEdge = {
      id: `edge_crisis_${Date.now()}`,
      source_node_id: chain.nodes[chain.nodes.length - 2].id,
      target_node_id: newNode.id,
      relationship: 'inspects_for' as const,
      metadata: { transport_mode: 'emergency', estimated_days: 0 },
    };
    chain.edges.push(newEdge);

    console.log(`✅ Added crisis node: ${newNode.name}`);

    res.json({ success: true, node: newNode, edge: newEdge });
  } catch (error: any) {
    console.error('❌ Add node failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// DELETE /api/chains/:id - Delete a supply chain
// ============================================================
app.delete('/api/chains/:id', (req: express.Request, res: express.Response) => {
  if (supplyChains.delete(req.params.id as string)) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Supply chain not found' });
  }
});

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    mode: USE_AI ? 'ai' : 'mock',
    chains_count: supplyChains.size,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Start server
// ============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  🚀 Adaptive Supply Chain Backend               ║
║  ────────────────────────────────────────────    ║
║  Server:  http://localhost:${PORT}                 ║
║  Mode:    ${USE_AI ? '🤖 AI (Gemini)           ' : '📋 Mock Data             '}           ║
║  API:     http://localhost:${PORT}/api              ║
╚══════════════════════════════════════════════════╝
  `);
});
