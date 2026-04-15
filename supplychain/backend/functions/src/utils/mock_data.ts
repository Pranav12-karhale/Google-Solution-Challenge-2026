import type { SupplyChain } from '../schemas/supply_chain_schema.js';

/**
 * Mock supply chain data for development without an API key.
 * This simulates what the AI would generate for various business ideas.
 */

export function generateMockSupplyChain(businessIdea: string): SupplyChain {
  const ideaLower = businessIdea.toLowerCase();

  // Default to a DTC consumer goods chain
  let chain = getDTCConsumerGoodsChain(businessIdea);

  if (ideaLower.includes('coffee') || ideaLower.includes('tea') || ideaLower.includes('matcha')) {
    chain = getBeverageChain(businessIdea);
  } else if (ideaLower.includes('fashion') || ideaLower.includes('clothing') || ideaLower.includes('apparel') || ideaLower.includes('sneaker')) {
    chain = getFashionChain(businessIdea);
  } else if (ideaLower.includes('electronics') || ideaLower.includes('tech') || ideaLower.includes('gadget')) {
    chain = getElectronicsChain(businessIdea);
  } else if (ideaLower.includes('food') || ideaLower.includes('organic') || ideaLower.includes('farm')) {
    chain = getFoodChain(businessIdea);
  }

  return chain;
}

function getBeverageChain(idea: string): SupplyChain {
  return {
    id: 'sc_bev_001',
    name: 'Premium Beverage Supply Chain',
    business_idea: idea,
    status: 'active',
    created_at: new Date().toISOString(),
    nodes: [
      {
        id: 'node_1',
        name: 'Tea Farm (Uji, Kyoto, Japan)',
        type: 'raw_material_source',
        description: 'Organic tea leaf cultivation in the historic Uji region, known for premium matcha production.',
        status: 'active',
        order: 0,
        metadata: {
          location: 'Uji, Kyoto, Japan',
          lead_time_days: 14,
          capacity: '500kg/month',
          certifications: ['JAS Organic', 'Fair Trade'],
        },
        ui_config: {
          icon: 'agriculture',
          color: '#4CAF50',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Monthly Yield', unit: 'kg', dataKey: 'monthly_yield', value: 480 },
                  { label: 'Quality Grade', unit: '', dataKey: 'quality_grade', value: 'A+' },
                  { label: 'Lead Time', unit: 'days', dataKey: 'lead_time', value: 14 },
                  { label: 'Active Batches', unit: '', dataKey: 'active_batches', value: 12 },
                ],
              },
            },
            {
              type: 'status_tracker',
              args: {
                stages: ['Planted', 'Growing', 'Shading', 'Harvesting', 'Drying', 'Ready to Ship'],
                dataKey: 'current_stage',
                currentStage: 3,
              },
            },
            {
              type: 'inventory_table',
              args: {
                columns: ['Batch ID', 'Harvest Date', 'Weight (kg)', 'Grade', 'Status'],
                dataSource: 'inventory',
                sortable: true,
                filterable: true,
                data: [
                  { batch_id: 'B-2024-001', harvest_date: '2024-03-15', weight: 45, grade: 'A+', status: 'Shipped' },
                  { batch_id: 'B-2024-002', harvest_date: '2024-03-22', weight: 38, grade: 'A', status: 'Processing' },
                  { batch_id: 'B-2024-003', harvest_date: '2024-04-01', weight: 52, grade: 'A+', status: 'Ready' },
                  { batch_id: 'B-2024-004', harvest_date: '2024-04-08', weight: 41, grade: 'B+', status: 'Growing' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'line',
                title: 'Monthly Yield Trend',
                xAxis: 'month',
                yAxis: 'yield_kg',
                dataSource: 'yield_history',
                data: [
                  { month: 'Jan', yield_kg: 320 },
                  { month: 'Feb', yield_kg: 380 },
                  { month: 'Mar', yield_kg: 450 },
                  { month: 'Apr', yield_kg: 480 },
                  { month: 'May', yield_kg: 520 },
                  { month: 'Jun', yield_kg: 490 },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_2',
        name: 'Quality Control Lab (Osaka)',
        type: 'quality_control',
        description: 'Testing facility for pesticide residue, heavy metals, and grading tea leaf quality.',
        status: 'active',
        order: 1,
        metadata: {
          location: 'Osaka, Japan',
          lead_time_days: 3,
          certifications: ['ISO 17025', 'FSSAI'],
        },
        ui_config: {
          icon: 'science',
          color: '#FF9800',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Tests Today', unit: '', dataKey: 'tests_today', value: 8 },
                  { label: 'Pass Rate', unit: '%', dataKey: 'pass_rate', value: 96.5 },
                  { label: 'Avg Turnaround', unit: 'hrs', dataKey: 'avg_turnaround', value: 4.2 },
                  { label: 'Pending', unit: '', dataKey: 'pending', value: 3 },
                ],
              },
            },
            {
              type: 'approval_form',
              args: {
                title: 'Batch Quality Approval',
                fields: [
                  { name: 'batch_id', type: 'text', label: 'Batch ID', required: true },
                  { name: 'grade', type: 'select', label: 'Grade', required: true, options: ['A+', 'A', 'B+', 'B', 'Reject'] },
                  { name: 'pesticide_clear', type: 'checkbox', label: 'Pesticide Residue Clear', required: true },
                  { name: 'notes', type: 'textarea', label: 'Inspector Notes', required: false },
                ],
                actions: [
                  { label: 'Approve', action: 'approve', variant: 'primary' },
                  { label: 'Flag for Review', action: 'flag', variant: 'warning' },
                  { label: 'Reject', action: 'reject', variant: 'danger' },
                ],
              },
            },
            {
              type: 'data_grid',
              args: {
                columns: ['Test ID', 'Batch', 'Test Type', 'Result', 'Inspector', 'Date'],
                dataSource: 'test_results',
                editable: false,
                data: [
                  { test_id: 'T-001', batch: 'B-2024-001', test_type: 'Pesticide', result: 'Pass', inspector: 'Dr. Tanaka', date: '2024-03-16' },
                  { test_id: 'T-002', batch: 'B-2024-001', test_type: 'Heavy Metal', result: 'Pass', inspector: 'Dr. Sato', date: '2024-03-16' },
                  { test_id: 'T-003', batch: 'B-2024-002', test_type: 'Pesticide', result: 'Pass', inspector: 'Dr. Tanaka', date: '2024-03-23' },
                ],
              },
            },
            {
              type: 'timeline',
              args: {
                dataSource: 'events',
                showDate: true,
                data: [
                  { date: '2024-04-05 09:00', event: 'Batch B-2024-003 received for testing', status: 'info' },
                  { date: '2024-04-05 11:30', event: 'Pesticide test completed — PASS', status: 'success' },
                  { date: '2024-04-05 14:00', event: 'Heavy metal test in progress', status: 'pending' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_3',
        name: 'Processing Plant (Nagoya)',
        type: 'processor',
        description: 'Stone-grinding facility converting dried tea leaves into fine matcha powder.',
        status: 'active',
        order: 2,
        metadata: {
          location: 'Nagoya, Japan',
          lead_time_days: 5,
          capacity: '300kg/month',
        },
        ui_config: {
          icon: 'precision_manufacturing',
          color: '#2196F3',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Daily Output', unit: 'kg', dataKey: 'daily_output', value: 12.5 },
                  { label: 'Machine Utilization', unit: '%', dataKey: 'utilization', value: 87 },
                  { label: 'Waste Rate', unit: '%', dataKey: 'waste_rate', value: 2.3 },
                  { label: 'Batches in Queue', unit: '', dataKey: 'queue', value: 4 },
                ],
              },
            },
            {
              type: 'status_tracker',
              args: {
                stages: ['Received', 'Stone Grinding', 'Sifting', 'Blending', 'Packaging Ready'],
                dataKey: 'processing_stage',
                currentStage: 2,
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'bar',
                title: 'Weekly Production Output',
                xAxis: 'week',
                yAxis: 'output_kg',
                dataSource: 'production',
                data: [
                  { week: 'W1', output_kg: 55 },
                  { week: 'W2', output_kg: 62 },
                  { week: 'W3', output_kg: 58 },
                  { week: 'W4', output_kg: 71 },
                ],
              },
            },
            {
              type: 'inventory_table',
              args: {
                columns: ['Input Batch', 'Output Batch', 'Input Weight', 'Output Weight', 'Mesh Grade', 'Status'],
                dataSource: 'processing',
                sortable: true,
                filterable: true,
                data: [
                  { input_batch: 'B-2024-001', output_batch: 'P-2024-001', input_weight: '45kg', output_weight: '43.2kg', mesh_grade: 'Ultra-fine', status: 'Complete' },
                  { input_batch: 'B-2024-002', output_batch: 'P-2024-002', input_weight: '38kg', output_weight: '—', mesh_grade: '—', status: 'Grinding' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_4',
        name: 'International Logistics (Tokyo → USA)',
        type: 'logistics',
        description: 'Air freight handling, customs documentation, and international shipping coordination.',
        status: 'active',
        order: 3,
        metadata: {
          location: 'Narita Airport, Tokyo',
          lead_time_days: 5,
          transport_mode: 'air_freight',
        },
        ui_config: {
          icon: 'local_shipping',
          color: '#9C27B0',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'In Transit', unit: 'shipments', dataKey: 'in_transit', value: 3 },
                  { label: 'Avg Transit Time', unit: 'days', dataKey: 'avg_transit', value: 4.8 },
                  { label: 'On-Time Rate', unit: '%', dataKey: 'on_time', value: 94.2 },
                  { label: 'Customs Cleared', unit: '', dataKey: 'customs_cleared', value: 42 },
                ],
              },
            },
            {
              type: 'map_view',
              args: {
                dataSource: 'shipments',
                showRoute: true,
                routes: [
                  { from: { lat: 35.7649, lng: 140.3864 }, to: { lat: 33.9425, lng: -118.4081 }, status: 'in_transit' },
                ],
              },
            },
            {
              type: 'order_list',
              args: {
                columns: ['Shipment ID', 'Origin', 'Destination', 'Weight', 'Status', 'ETA'],
                statusFilters: ['Pending', 'In Transit', 'Customs', 'Delivered'],
                dataSource: 'shipments',
                data: [
                  { shipment_id: 'SH-2024-015', origin: 'Tokyo', destination: 'Los Angeles', weight: '150kg', status: 'In Transit', eta: '2024-04-10' },
                  { shipment_id: 'SH-2024-016', origin: 'Tokyo', destination: 'New York', weight: '80kg', status: 'Customs', eta: '2024-04-12' },
                ],
              },
            },
            {
              type: 'document_upload',
              args: {
                acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
                maxSizeMB: 10,
                label: 'Upload Customs Documents',
              },
            },
          ],
        },
      },
      {
        id: 'node_5',
        name: 'Distribution Warehouse (Los Angeles)',
        type: 'warehouse',
        description: 'Central US distribution hub for inventory storage and order fulfillment.',
        status: 'active',
        order: 4,
        metadata: {
          location: 'Los Angeles, CA, USA',
          capacity: '2000 sq ft',
          lead_time_days: 1,
        },
        ui_config: {
          icon: 'warehouse',
          color: '#00BCD4',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Total SKUs', unit: '', dataKey: 'total_skus', value: 8 },
                  { label: 'Units in Stock', unit: '', dataKey: 'units_in_stock', value: 2450 },
                  { label: 'Orders Today', unit: '', dataKey: 'orders_today', value: 34 },
                  { label: 'Space Used', unit: '%', dataKey: 'space_used', value: 72 },
                ],
              },
            },
            {
              type: 'inventory_table',
              args: {
                columns: ['SKU', 'Product Name', 'Quantity', 'Reorder Point', 'Location', 'Status'],
                dataSource: 'warehouse_inventory',
                sortable: true,
                filterable: true,
                data: [
                  { sku: 'MCH-30G', product_name: 'Matcha Ceremonial 30g', quantity: 850, reorder_point: 200, location: 'A1-03', status: 'In Stock' },
                  { sku: 'MCH-100G', product_name: 'Matcha Ceremonial 100g', quantity: 420, reorder_point: 100, location: 'A1-04', status: 'In Stock' },
                  { sku: 'MCH-LATTE', product_name: 'Matcha Latte Mix 250g', quantity: 95, reorder_point: 150, location: 'A2-01', status: 'Low Stock' },
                  { sku: 'MCH-STARTER', product_name: 'Matcha Starter Kit', quantity: 310, reorder_point: 50, location: 'B1-02', status: 'In Stock' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'pie',
                title: 'Inventory by Product',
                xAxis: 'product',
                yAxis: 'quantity',
                dataSource: 'inventory_breakdown',
                data: [
                  { product: 'Ceremonial 30g', quantity: 850 },
                  { product: 'Ceremonial 100g', quantity: 420 },
                  { product: 'Latte Mix', quantity: 95 },
                  { product: 'Starter Kit', quantity: 310 },
                ],
              },
            },
            {
              type: 'notification_feed',
              args: {
                categories: ['Low Stock', 'Incoming Shipment', 'Order Alert'],
                dataSource: 'warehouse_alerts',
                data: [
                  { category: 'Low Stock', message: 'MCH-LATTE below reorder point (95/150)', priority: 'high', time: '2 hours ago' },
                  { category: 'Incoming Shipment', message: 'SH-2024-015 arriving in 5 days', priority: 'medium', time: '4 hours ago' },
                  { category: 'Order Alert', message: '15 new orders pending fulfillment', priority: 'medium', time: '30 min ago' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_6',
        name: 'D2C Fulfillment & Shipping',
        type: 'fulfillment_center',
        description: 'Direct-to-consumer order processing, packaging, and last-mile delivery coordination.',
        status: 'active',
        order: 5,
        metadata: {
          location: 'Los Angeles, CA, USA',
          lead_time_days: 2,
          shipping_partners: ['USPS', 'FedEx', 'UPS'],
        },
        ui_config: {
          icon: 'deployed_code',
          color: '#E91E63',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Orders Today', unit: '', dataKey: 'orders_today', value: 34 },
                  { label: 'Shipped', unit: '', dataKey: 'shipped', value: 28 },
                  { label: 'Avg Ship Time', unit: 'hrs', dataKey: 'avg_ship_time', value: 6.5 },
                  { label: 'Returns', unit: '', dataKey: 'returns', value: 2 },
                ],
              },
            },
            {
              type: 'order_list',
              args: {
                columns: ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Carrier'],
                statusFilters: ['Pending', 'Packing', 'Shipped', 'Delivered', 'Returned'],
                dataSource: 'orders',
                data: [
                  { order_id: 'ORD-4521', customer: 'Sarah M.', items: '2x MCH-30G', total: '$58.00', status: 'Shipped', carrier: 'USPS' },
                  { order_id: 'ORD-4522', customer: 'James L.', items: '1x MCH-STARTER', total: '$45.00', status: 'Packing', carrier: 'FedEx' },
                  { order_id: 'ORD-4523', customer: 'Emily R.', items: '3x MCH-LATTE', total: '$72.00', status: 'Pending', carrier: '—' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'line',
                title: 'Daily Orders (Last 7 Days)',
                xAxis: 'day',
                yAxis: 'orders',
                dataSource: 'order_trend',
                data: [
                  { day: 'Mon', orders: 28 },
                  { day: 'Tue', orders: 35 },
                  { day: 'Wed', orders: 31 },
                  { day: 'Thu', orders: 42 },
                  { day: 'Fri', orders: 38 },
                  { day: 'Sat', orders: 22 },
                  { day: 'Sun', orders: 18 },
                ],
              },
            },
            {
              type: 'timeline',
              args: {
                dataSource: 'fulfillment_events',
                showDate: true,
                data: [
                  { date: '2024-04-05 08:00', event: 'Morning batch picked (15 orders)', status: 'success' },
                  { date: '2024-04-05 10:30', event: 'FedEx pickup completed', status: 'success' },
                  { date: '2024-04-05 12:00', event: 'Afternoon packing started (19 orders)', status: 'pending' },
                ],
              },
            },
          ],
        },
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'road', estimated_days: 1 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'inspects_for', metadata: { transport_mode: 'road', estimated_days: 1 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'ships_to', metadata: { transport_mode: 'road', estimated_days: 1 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'ships_to', metadata: { transport_mode: 'air_freight', estimated_days: 5 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'stores_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
    ],
  };
}

function getFashionChain(idea: string): SupplyChain {
  return {
    id: 'sc_fsh_001',
    name: 'Fashion & Apparel Supply Chain',
    business_idea: idea,
    status: 'active',
    created_at: new Date().toISOString(),
    nodes: [
      {
        id: 'node_1', name: 'Textile Mill (Gujarat, India)', type: 'raw_material_source',
        description: 'Organic cotton sourcing and fabric weaving facility.', status: 'active', order: 0,
        metadata: { location: 'Ahmedabad, Gujarat, India', lead_time_days: 21, capacity: '10,000 meters/month' },
        ui_config: { icon: 'texture', color: '#8BC34A', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Monthly Output', unit: 'm', dataKey: 'output', value: 9200 }, { label: 'Quality Score', unit: '%', dataKey: 'quality', value: 94 }, { label: 'Lead Time', unit: 'days', dataKey: 'lead_time', value: 21 }] } },
          { type: 'inventory_table', args: { columns: ['Fabric Type', 'Color', 'Length (m)', 'Status'], dataSource: 'fabric_inventory', sortable: true, filterable: true, data: [{ fabric_type: 'Organic Cotton', color: 'Natural White', length: 2400, status: 'Ready' }, { fabric_type: 'Cotton Blend', color: 'Indigo', length: 1800, status: 'Weaving' }] } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Fabric Production', xAxis: 'month', yAxis: 'meters', dataSource: 'production', data: [{ month: 'Jan', meters: 8500 }, { month: 'Feb', meters: 9100 }, { month: 'Mar', meters: 9200 }] } },
        ]},
      },
      {
        id: 'node_2', name: 'Design & Pattern Making (Milan)', type: 'processor',
        description: 'Fashion design studio with CAD pattern generation.', status: 'active', order: 1,
        metadata: { location: 'Milan, Italy', lead_time_days: 14 },
        ui_config: { icon: 'design_services', color: '#E91E63', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Active Designs', unit: '', dataKey: 'designs', value: 24 }, { label: 'Approved', unit: '', dataKey: 'approved', value: 18 }, { label: 'In Review', unit: '', dataKey: 'review', value: 6 }] } },
          { type: 'approval_form', args: { title: 'Design Approval', fields: [{ name: 'design_id', type: 'text', label: 'Design ID', required: true }, { name: 'verdict', type: 'select', label: 'Decision', required: true, options: ['Approve', 'Revise', 'Reject'] }], actions: [{ label: 'Submit', action: 'submit', variant: 'primary' }] } },
          { type: 'data_grid', args: { columns: ['Design ID', 'Name', 'Season', 'Status', 'Designer'], dataSource: 'designs', editable: false, data: [{ design_id: 'D-101', name: 'Urban Runner', season: 'FW25', status: 'Approved', designer: 'Marco R.' }] } },
        ]},
      },
      {
        id: 'node_3', name: 'Manufacturing Unit (Ho Chi Minh City)', type: 'manufacturer',
        description: 'Cut-make-trim manufacturing with ethical labor certification.', status: 'active', order: 2,
        metadata: { location: 'Ho Chi Minh City, Vietnam', lead_time_days: 30, capacity: '5000 units/month' },
        ui_config: { icon: 'factory', color: '#FF9800', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units Produced', unit: '', dataKey: 'produced', value: 4200 }, { label: 'Defect Rate', unit: '%', dataKey: 'defects', value: 1.8 }, { label: 'Workers Active', unit: '', dataKey: 'workers', value: 120 }] } },
          { type: 'status_tracker', args: { stages: ['Cutting', 'Sewing', 'Finishing', 'QC', 'Packed'], dataKey: 'stage', currentStage: 2 } },
          { type: 'inventory_table', args: { columns: ['Order', 'Style', 'Size Run', 'Qty', 'Progress'], dataSource: 'production_orders', sortable: true, filterable: true, data: [{ order: 'PO-501', style: 'Urban Runner', size_run: 'S-XL', qty: 1000, progress: '68%' }] } },
        ]},
      },
      {
        id: 'node_4', name: 'Quality Control & Compliance', type: 'quality_control',
        description: 'Product quality inspection and ethical compliance verification.', status: 'active', order: 3,
        metadata: { location: 'Ho Chi Minh City, Vietnam', lead_time_days: 3 },
        ui_config: { icon: 'verified', color: '#4CAF50', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Inspected Today', unit: '', dataKey: 'inspected', value: 450 }, { label: 'Pass Rate', unit: '%', dataKey: 'pass_rate', value: 97.8 }] } },
          { type: 'approval_form', args: { title: 'Batch Inspection', fields: [{ name: 'batch', type: 'text', label: 'Batch ID', required: true }, { name: 'result', type: 'select', label: 'Result', required: true, options: ['Pass', 'Minor Defects', 'Fail'] }], actions: [{ label: 'Approve Batch', action: 'approve', variant: 'primary' }, { label: 'Reject', action: 'reject', variant: 'danger' }] } },
        ]},
      },
      {
        id: 'node_5', name: 'Distribution Hub (Rotterdam)', type: 'warehouse',
        description: 'European distribution center for global order routing.', status: 'active', order: 4,
        metadata: { location: 'Rotterdam, Netherlands', capacity: '50,000 units' },
        ui_config: { icon: 'warehouse', color: '#2196F3', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units Stored', unit: '', dataKey: 'stored', value: 32000 }, { label: 'Orders Today', unit: '', dataKey: 'orders', value: 180 }] } },
          { type: 'inventory_table', args: { columns: ['SKU', 'Product', 'Size', 'Qty', 'Zone'], dataSource: 'warehouse', sortable: true, filterable: true, data: [{ sku: 'UR-BLK-M', product: 'Urban Runner Black M', size: 'M', qty: 1200, zone: 'A3' }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'sea', estimated_days: 14 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'digital', estimated_days: 0 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'ships_to', metadata: { transport_mode: 'sea', estimated_days: 21 } },
    ],
  };
}

function getElectronicsChain(idea: string): SupplyChain {
  return {
    id: 'sc_elc_001', name: 'Electronics Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Component Supplier (Shenzhen)', type: 'supplier', description: 'Electronic component sourcing — chips, PCBs, displays.', status: 'active', order: 0, metadata: { location: 'Shenzhen, China' },
        ui_config: { icon: 'memory', color: '#607D8B', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Components', unit: 'types', dataKey: 'types', value: 42 }, { label: 'Lead Time', unit: 'days', dataKey: 'lead', value: 28 }] } },
          { type: 'inventory_table', args: { columns: ['Part #', 'Name', 'Stock', 'MOQ', 'Lead Time'], dataSource: 'components', sortable: true, filterable: true, data: [{ part: 'IC-A7X', name: 'ARM Cortex A7', stock: 5000, moq: 1000, lead_time: '14d' }] } },
        ]},
      },
      { id: 'node_2', name: 'Assembly Factory (Taipei)', type: 'manufacturer', description: 'SMT assembly and product integration.', status: 'active', order: 1, metadata: { location: 'Taipei, Taiwan' },
        ui_config: { icon: 'build', color: '#FF5722', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units/Day', unit: '', dataKey: 'daily', value: 500 }, { label: 'Yield', unit: '%', dataKey: 'yield', value: 98.2 }] } },
          { type: 'status_tracker', args: { stages: ['SMT', 'Assembly', 'Testing', 'Burn-in', 'Packaging'], dataKey: 'stage', currentStage: 2 } },
        ]},
      },
      { id: 'node_3', name: 'Certification Lab (UL, FCC)', type: 'quality_control', description: 'Regulatory certification testing.', status: 'active', order: 2, metadata: { location: 'Taipei, Taiwan' },
        ui_config: { icon: 'verified_user', color: '#4CAF50', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Certifications', unit: '', dataKey: 'certs', value: 4 }, { label: 'Pending', unit: '', dataKey: 'pending', value: 1 }] } },
          { type: 'data_grid', args: { columns: ['Cert Type', 'Status', 'Expiry', 'Lab'], dataSource: 'certifications', editable: false, data: [{ cert_type: 'FCC', status: 'Approved', expiry: '2025-12', lab: 'UL Taiwan' }] } },
        ]},
      },
      { id: 'node_4', name: 'Global Fulfillment (USA)', type: 'fulfillment_center', description: 'US fulfillment center for D2C electronics.', status: 'active', order: 3, metadata: { location: 'Dallas, TX, USA' },
        ui_config: { icon: 'deployed_code', color: '#9C27B0', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Orders Today', unit: '', dataKey: 'orders', value: 89 }, { label: 'Shipped', unit: '', dataKey: 'shipped', value: 76 }] } },
          { type: 'order_list', args: { columns: ['Order', 'Customer', 'Product', 'Status'], statusFilters: ['Pending', 'Shipped', 'Delivered'], dataSource: 'orders', data: [{ order: 'E-7891', customer: 'Mike T.', product: 'Smart Hub v2', status: 'Shipped' }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'road', estimated_days: 2 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'ships_to', metadata: { transport_mode: 'air_freight', estimated_days: 7 } },
    ],
  };
}

function getFoodChain(idea: string): SupplyChain {
  return {
    id: 'sc_food_001', name: 'Organic Food Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Organic Farm (Sonoma County, CA)', type: 'raw_material_source', description: 'Certified organic farm producing seasonal vegetables.', status: 'active', order: 0, metadata: { location: 'Sonoma County, CA', certifications: ['USDA Organic'] },
        ui_config: { icon: 'grass', color: '#4CAF50', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Harvest Today', unit: 'lbs', dataKey: 'harvest', value: 1200 }, { label: 'Fields Active', unit: '', dataKey: 'fields', value: 8 }] } },
          { type: 'status_tracker', args: { stages: ['Planting', 'Growing', 'Harvesting', 'Washing', 'Packed'], dataKey: 'stage', currentStage: 2 } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Weekly Harvest', xAxis: 'week', yAxis: 'lbs', dataSource: 'harvest', data: [{ week: 'W1', lbs: 1100 }, { week: 'W2', lbs: 1200 }, { week: 'W3', lbs: 1350 }] } },
        ]},
      },
      { id: 'node_2', name: 'Cold Storage & Packing (Sacramento)', type: 'cold_storage', description: 'Temperature-controlled facility for produce packing and storage.', status: 'active', order: 1, metadata: { location: 'Sacramento, CA', temperature_range: '34-38°F' },
        ui_config: { icon: 'ac_unit', color: '#00BCD4', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Temperature', unit: '°F', dataKey: 'temp', value: 36 }, { label: 'Units Stored', unit: '', dataKey: 'units', value: 4500 }, { label: 'Shelf Life Left', unit: 'days', dataKey: 'shelf', value: 5 }] } },
          { type: 'inventory_table', args: { columns: ['Product', 'Batch', 'Weight', 'Temp', 'Expires'], dataSource: 'cold_inventory', sortable: true, filterable: true, data: [{ product: 'Baby Spinach', batch: 'F-401', weight: '200 lbs', temp: '36°F', expires: '2024-04-10' }] } },
        ]},
      },
      { id: 'node_3', name: 'Last-Mile Delivery (Bay Area)', type: 'last_mile_delivery', description: 'Same-day delivery fleet for farm-to-table produce.', status: 'active', order: 2, metadata: { location: 'San Francisco Bay Area' },
        ui_config: { icon: 'electric_bike', color: '#FF9800', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Deliveries Today', unit: '', dataKey: 'deliveries', value: 45 }, { label: 'On Time', unit: '%', dataKey: 'on_time', value: 96 }] } },
          { type: 'map_view', args: { dataSource: 'delivery_routes', showRoute: true } },
          { type: 'order_list', args: { columns: ['Order', 'Customer', 'Items', 'ETA', 'Driver'], statusFilters: ['Pending', 'En Route', 'Delivered'], dataSource: 'deliveries', data: [{ order: 'D-301', customer: 'Lisa W.', items: 'Veggie Box', eta: '2:30 PM', driver: 'Carlos M.' }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'refrigerated_truck', estimated_days: 1 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'ships_to', metadata: { transport_mode: 'refrigerated_van', estimated_days: 0 } },
    ],
  };
}

function getDTCConsumerGoodsChain(idea: string): SupplyChain {
  return {
    id: 'sc_dtc_001', name: 'D2C Consumer Goods Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Raw Material Supplier', type: 'supplier', description: 'Primary raw material sourcing and procurement.', status: 'active', order: 0, metadata: { location: 'Various', lead_time_days: 14 },
        ui_config: { icon: 'inventory_2', color: '#795548', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Suppliers', unit: '', dataKey: 'suppliers', value: 5 }, { label: 'Avg Lead Time', unit: 'days', dataKey: 'lead', value: 14 }, { label: 'Cost Index', unit: '', dataKey: 'cost', value: 1.02 }] } },
          { type: 'data_grid', args: { columns: ['Supplier', 'Material', 'Price/Unit', 'Lead Time', 'Rating'], dataSource: 'suppliers', editable: false, data: [{ supplier: 'GlobalMat Inc.', material: 'Base Material A', price_unit: '$2.50', lead_time: '12 days', rating: '4.5/5' }] } },
        ]},
      },
      { id: 'node_2', name: 'Manufacturing & Assembly', type: 'manufacturer', description: 'Product manufacturing and assembly line.', status: 'active', order: 1, metadata: { location: 'Domestic', capacity: '10,000 units/month' },
        ui_config: { icon: 'factory', color: '#F44336', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Daily Output', unit: 'units', dataKey: 'output', value: 350 }, { label: 'Efficiency', unit: '%', dataKey: 'efficiency', value: 91 }] } },
          { type: 'status_tracker', args: { stages: ['Prep', 'Assembly', 'Testing', 'Finishing', 'Packaged'], dataKey: 'stage', currentStage: 2 } },
        ]},
      },
      { id: 'node_3', name: 'Quality Assurance', type: 'quality_control', description: 'Product testing and quality certification.', status: 'active', order: 2, metadata: { location: 'On-site' },
        ui_config: { icon: 'verified', color: '#4CAF50', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Pass Rate', unit: '%', dataKey: 'pass', value: 97.5 }, { label: 'Tested Today', unit: '', dataKey: 'tested', value: 340 }] } },
          { type: 'approval_form', args: { title: 'QA Approval', fields: [{ name: 'batch', type: 'text', label: 'Batch', required: true }, { name: 'result', type: 'select', label: 'Result', required: true, options: ['Pass', 'Fail'] }], actions: [{ label: 'Submit', action: 'submit', variant: 'primary' }] } },
        ]},
      },
      { id: 'node_4', name: 'Warehouse & Distribution', type: 'warehouse', description: 'Central warehouse for inventory and order fulfillment.', status: 'active', order: 3, metadata: { location: 'Central US' },
        ui_config: { icon: 'warehouse', color: '#2196F3', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units in Stock', unit: '', dataKey: 'stock', value: 8500 }, { label: 'Orders Today', unit: '', dataKey: 'orders', value: 120 }] } },
          { type: 'inventory_table', args: { columns: ['SKU', 'Product', 'Qty', 'Location'], dataSource: 'inventory', sortable: true, filterable: true, data: [{ sku: 'PRD-001', product: 'Main Product', qty: 8500, location: 'Zone A' }] } },
        ]},
      },
      { id: 'node_5', name: 'Last-Mile Delivery', type: 'last_mile_delivery', description: 'Direct-to-consumer shipping and delivery.', status: 'active', order: 4, metadata: { location: 'Nationwide' },
        ui_config: { icon: 'local_shipping', color: '#9C27B0', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Deliveries Today', unit: '', dataKey: 'deliveries', value: 95 }, { label: 'On-Time Rate', unit: '%', dataKey: 'on_time', value: 94 }] } },
          { type: 'order_list', args: { columns: ['Order', 'Customer', 'Status', 'ETA'], statusFilters: ['Pending', 'Shipped', 'Delivered'], dataSource: 'orders', data: [{ order: 'O-9001', customer: 'Alex K.', status: 'Shipped', eta: 'Apr 7' }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'road', estimated_days: 3 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'ships_to', metadata: { transport_mode: 'road', estimated_days: 2 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'delivers_to', metadata: { transport_mode: 'courier', estimated_days: 2 } },
    ],
  };
}
