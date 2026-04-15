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
  relationship: z.enum([
    'supplies_to',
    'ships_to',
    'processes_for',
    'stores_for',
    'distributes_to',
    'inspects_for',
    'packages_for',
    'delivers_to',
    'returns_to',
  ]).describe('Type of relationship between nodes'),
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
// Type exports
// ============================================================

export type PageComponent = z.infer<typeof PageComponentSchema>;
export type NodeUIConfig = z.infer<typeof NodeUIConfigSchema>;
export type SupplyChainNode = z.infer<typeof SupplyChainNodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type SupplyChain = z.infer<typeof SupplyChainSchema>;
export type BusinessAnalysis = z.infer<typeof BusinessAnalysisSchema>;
