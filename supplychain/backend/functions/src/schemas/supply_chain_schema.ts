import { z } from 'zod';

// ============================================================
// Component Types - The UI building blocks the Flutter app knows
// ============================================================

export const ComponentType = z.enum([
  'kpi_card_row',
  'inventory_table',
  'status_tracker',
  'analytics_chart',
  'approval_form',
  'order_list',
  'map_view',
  'document_upload',
  'qr_scanner',
  'data_grid',
  'timeline',
  'notification_feed',
]);

// ============================================================
// Page Component - A single UI widget configuration
// ============================================================

export const PageComponentSchema = z.object({
  type: ComponentType.describe('The widget type to render from the component registry'),
  args: z.record(z.any()).describe('Configuration arguments specific to this component type'),
});

// ============================================================
// Node UI Config - How a node's page should render
// ============================================================

export const NodeUIConfigSchema = z.object({
  icon: z.string().describe('Material icon name for navigation (e.g., "agriculture", "factory", "warehouse")'),
  color: z.string().describe('Hex color code for the node accent (e.g., "#4CAF50")'),
  page_components: z.array(PageComponentSchema).min(1).describe('Array of UI components to render on this node page'),
});

// ============================================================
// Node Metadata - Flexible key-value store for node properties
// ============================================================

export const NodeMetadataSchema = z.object({
  location: z.string().optional().describe('Geographic location of this node'),
  coordinates: z.object({
    lat: z.number().describe('Latitude of the location'),
    lng: z.number().describe('Longitude of the location'),
  }).optional().describe('Geographic coordinates for mapping'),
  lead_time_days: z.number().optional().describe('Average lead time in days'),
  capacity: z.string().optional().describe('Capacity description (e.g., "500kg/month")'),
  cost_per_unit: z.string().optional().describe('Cost information'),
  certifications: z.array(z.string()).optional().describe('Compliance certifications'),
  contact_email: z.string().optional().describe('Primary contact email'),
  api_endpoint: z.string().optional().describe('External API integration endpoint'),
  // Disruption & Risk Metadata
  geopolitical_risk: z.number().min(0).max(10).optional().describe('Risk score 0-10 based on political stability, tariffs, sanctions'),
  climate_risk: z.number().min(0).max(10).optional().describe('Risk score 0-10 based on weather, earthquakes, etc.'),
  cyber_risk: z.number().min(0).max(10).optional().describe('Risk score 0-10 based on IT infrastructure and ransomware risk'),
  supplier_tier: z.enum(['tier_1', 'tier_2', 'tier_3']).optional().describe('Supplier tier for mapping visibility'),
  backup_supplier_id: z.string().optional().describe('ID of the pre-approved alternate supplier'),
}).passthrough();

// ============================================================
// Node Types - All possible supply chain node categories
// ============================================================

export const NodeType = z.enum([
  'supplier',
  'manufacturer',
  'processor',
  'warehouse',
  'distributor',
  'retailer',
  'quality_control',
  'customs',
  'logistics',
  'packaging',
  'cold_storage',
  'fulfillment_center',
  'last_mile_delivery',
  'returns_center',
  'raw_material_source',
]).describe('The category/type of this supply chain node');

// ============================================================
// Supply Chain Node
// ============================================================

export const SupplyChainNodeSchema = z.object({
  id: z.string().describe('Unique identifier for this node (e.g., "node_1")'),
  name: z.string().describe('Human-readable name (e.g., "Matcha Farm (Uji, Japan)")'),
  type: NodeType,
  description: z.string().describe('Brief description of this node in the supply chain'),
  status: z.enum(['active', 'warning', 'critical', 'offline']).default('active'),
  order: z.number().describe('Display order in the chain (0-indexed)'),
  metadata: NodeMetadataSchema,
  ui_config: NodeUIConfigSchema,
});

// ============================================================
// Edge - Relationship between two nodes
// ============================================================

export const EdgeSchema = z.object({
  id: z.string().describe('Unique identifier for this edge'),
  source_node_id: z.string().describe('ID of the source node'),
  target_node_id: z.string().describe('ID of the target node'),
  relationship: z.string().describe('Type of relationship between nodes (e.g., "supplies_to", "ships_to", "processes_for")'),
  metadata: z.object({
    transport_mode: z.string().optional().describe('Mode of transport (e.g., "air_freight", "sea", "road")'),
    estimated_days: z.number().optional().describe('Estimated transit time in days'),
    cost_estimate: z.string().optional().describe('Estimated cost for this edge'),
  }).passthrough(),
});

// ============================================================
// Complete Supply Chain Output
// ============================================================

export const SupplyChainSchema = z.object({
  id: z.string().describe('Unique supply chain identifier'),
  name: z.string().describe('Name of the supply chain derived from the business idea'),
  business_idea: z.string().describe('The original user-provided business idea'),
  status: z.enum(['generating', 'active', 'disrupted']).default('active'),
  created_at: z.string().describe('ISO8601 timestamp'),
  nodes: z.array(SupplyChainNodeSchema).min(2).describe('Array of supply chain nodes (minimum 2)'),
  edges: z.array(EdgeSchema).min(1).describe('Array of edges connecting nodes'),
});

// ============================================================
// Disruption and Mitigation Schemas (Agentic Management)
// ============================================================

export const DisruptionEventSchema = z.object({
  id: z.string().describe('Unique ID for the disruption'),
  type: z.enum([
    'geopolitical', 'climate', 'transport', 'economic', 'cyber', 'labor', 'regulatory', 'demand', 'structural'
  ]).describe('Category of the disruption based on the playbook'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Impact severity'),
  description: z.string().describe('Detailed description of what happened'),
  affected_node_ids: z.array(z.string()).describe('IDs of nodes directly affected'),
  affected_edge_ids: z.array(z.string()).describe('IDs of edges directly affected'),
  timestamp: z.string().describe('When the disruption occurred'),
});

export const MitigationActionSchema = z.object({
  id: z.string().describe('Unique ID for the mitigation action'),
  action_type: z.enum([
    'reroute', 'activate_backup', 'release_buffer', 'renegotiate', 'human_review', 'escalate'
  ]).describe('Type of action to take'),
  description: z.string().describe('Description of the mitigation'),
  cost_impact: z.number().describe('Estimated cost impact in USD'),
  time_impact_days: z.number().describe('Estimated time impact in days (negative if saves time)'),
  proposed_node_changes: z.array(SupplyChainNodeSchema).optional().describe('Nodes to add or modify'),
  proposed_edge_changes: z.array(EdgeSchema).optional().describe('Edges to add or modify'),
});

// ============================================================
// Anticipated Risks (Agent 1.5 - Pre-generation)
// ============================================================

export const AnticipatedRiskSchema = z.object({
  risk_category: z.string().describe('Category of the risk based on the disruption playbook'),
  description: z.string().describe('Detailed description of the anticipated risk'),
  regions_to_avoid: z.array(z.string()).describe('Geographic regions or countries that should be actively avoided in routing'),
  recommended_routing_strategy: z.string().describe('Specific instruction on how the supply chain should be structured to avoid this risk'),
});

// ============================================================
// Business Analysis Output (Agent 1)
// ============================================================

export const BusinessAnalysisSchema = z.object({
  industry: z.string().describe('Primary industry category'),
  product_type: z.string().describe('Type of product or service'),
  target_market: z.string().describe('Target market/geography'),
  key_requirements: z.array(z.string()).describe('Key business requirements identified'),
  compliance_needs: z.array(z.string()).describe('Regulatory/compliance requirements'),
  estimated_node_types: z.array(NodeType).describe('Suggested node types for this business'),
  complexity: z.enum(['simple', 'moderate', 'complex']).describe('Overall supply chain complexity'),
  special_considerations: z.array(z.string()).describe('Special handling or requirements'),
});

// ============================================================
// Risk Scanning Schemas (Auto-Detection)
// ============================================================

export const NodeRiskDetailSchema = z.object({
  category: z.enum([
    'geopolitical', 'climate', 'transport', 'cyber', 'economic', 'labor', 'regulatory'
  ]).describe('Risk domain'),
  score: z.number().min(0).max(10).describe('Risk severity 0-10'),
  headline: z.string().describe('Short headline e.g. "Earthquake Zone"'),
  explanation: z.string().describe('Plain-language explanation for non-experts'),
  recommended_action: z.string().describe('What the user should do about it'),
});

export const RiskScanResultSchema = z.object({
  node_id: z.string().describe('ID of the node being assessed'),
  node_name: z.string().describe('Name of the node for display'),
  location: z.string().describe('Location string of the node'),
  overall_risk: z.number().min(0).max(10).describe('Aggregate risk score 0-10'),
  risks: z.array(NodeRiskDetailSchema).describe('Breakdown by risk category'),
});

export const RiskReportSchema = z.object({
  chain_id: z.string().describe('ID of the supply chain scanned'),
  scanned_at: z.string().describe('ISO8601 timestamp of when the scan ran'),
  overall_chain_risk: z.number().min(0).max(10).describe('Average risk across all nodes'),
  results: z.array(RiskScanResultSchema).describe('Per-node risk assessments'),
});

// ============================================================
// Type exports
// ============================================================

export type PageComponent = z.infer<typeof PageComponentSchema>;
export type NodeUIConfig = z.infer<typeof NodeUIConfigSchema>;
export type SupplyChainNode = z.infer<typeof SupplyChainNodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type SupplyChain = z.infer<typeof SupplyChainSchema>;
export type DisruptionEvent = z.infer<typeof DisruptionEventSchema>;
export type MitigationAction = z.infer<typeof MitigationActionSchema>;
export type AnticipatedRisk = z.infer<typeof AnticipatedRiskSchema>;
export type BusinessAnalysis = z.infer<typeof BusinessAnalysisSchema>;
export type NodeRiskDetail = z.infer<typeof NodeRiskDetailSchema>;
export type RiskScanResult = z.infer<typeof RiskScanResultSchema>;
export type RiskReport = z.infer<typeof RiskReportSchema>;
