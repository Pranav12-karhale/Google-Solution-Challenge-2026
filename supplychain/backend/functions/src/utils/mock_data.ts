import type { SupplyChain } from '../schemas/supply_chain_schema.js';

/**
 * Mock supply chain data for development without an API key.
 * These are highly detailed, realistic supply chains that simulate what the AI would generate.
 */

export function generateMockSupplyChain(businessIdea: string): SupplyChain {
  const ideaLower = businessIdea.toLowerCase();

  if (ideaLower.includes('coffee') || ideaLower.includes('tea') || ideaLower.includes('matcha') || ideaLower.includes('beverage')) {
    return getBeverageChain(businessIdea);
  } else if (ideaLower.includes('fashion') || ideaLower.includes('clothing') || ideaLower.includes('apparel') || ideaLower.includes('sneaker') || ideaLower.includes('shoe')) {
    return getFashionChain(businessIdea);
  } else if (ideaLower.includes('electronics') || ideaLower.includes('tech') || ideaLower.includes('gadget') || ideaLower.includes('phone') || ideaLower.includes('laptop')) {
    return getElectronicsChain(businessIdea);
  } else if (ideaLower.includes('food') || ideaLower.includes('organic') || ideaLower.includes('farm') || ideaLower.includes('grocery')) {
    return getFoodChain(businessIdea);
  } else if (ideaLower.includes('pharma') || ideaLower.includes('medicine') || ideaLower.includes('drug') || ideaLower.includes('health')) {
    return getPharmaChain(businessIdea);
  } else if (ideaLower.includes('auto') || ideaLower.includes('car') || ideaLower.includes('vehicle') || ideaLower.includes('ev')) {
    return getAutomotiveChain(businessIdea);
  }

  // Default
  return getDTCConsumerGoodsChain(businessIdea);
}

// ============================================================
// Beverage Chain — 9 nodes, global Japan→USA flow
// ============================================================
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
        name: 'Tea Plantation (Uji, Kyoto, Japan)',
        type: 'raw_material_source',
        description: 'Organic tea leaf cultivation in the historic Uji region. Shade-grown tencha leaves for premium ceremonial-grade matcha — 4-week shading period before harvest.',
        status: 'active',
        order: 0,
        metadata: {
          location: 'Uji, Kyoto, Japan',
          coordinates: { lat: 34.8842, lng: 135.8048 },
          lead_time_days: 14,
          capacity: '500kg/month',
          certifications: ['JAS Organic', 'Fair Trade', 'Rainforest Alliance'],
        },
        ui_config: {
          icon: 'agriculture',
          color: '#2E7D32',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Monthly Yield', unit: 'kg', dataKey: 'monthly_yield', value: 480 },
                  { label: 'Quality Grade', unit: '', dataKey: 'quality_grade', value: 'A+' },
                  { label: 'Active Fields', unit: '', dataKey: 'active_fields', value: 12 },
                  { label: 'Harvest Cycle', unit: 'days', dataKey: 'harvest_cycle', value: 28 },
                ],
              },
            },
            {
              type: 'status_tracker',
              args: {
                stages: ['Soil Prep', 'Planting', 'Shading (4 wks)', 'Harvesting', 'Steaming', 'Drying', 'Ready to Ship'],
                dataKey: 'current_stage',
                currentStage: 3,
              },
            },
            {
              type: 'inventory_table',
              args: {
                columns: ['Batch ID', 'Field', 'Harvest Date', 'Weight (kg)', 'Grade', 'Moisture %', 'Status'],
                dataSource: 'inventory',
                sortable: true,
                filterable: true,
                data: [
                  { batch_id: 'B-2026-001', field: 'Uji-North A3', harvest_date: '2026-03-15', weight: 45, grade: 'A+', moisture: 4.2, status: 'Shipped' },
                  { batch_id: 'B-2026-002', field: 'Uji-South B1', harvest_date: '2026-03-22', weight: 38, grade: 'A', moisture: 4.5, status: 'Processing' },
                  { batch_id: 'B-2026-003', field: 'Uji-East C2', harvest_date: '2026-04-01', weight: 52, grade: 'A+', moisture: 3.9, status: 'Ready' },
                  { batch_id: 'B-2026-004', field: 'Uji-West D1', harvest_date: '2026-04-08', weight: 41, grade: 'B+', moisture: 5.1, status: 'Drying' },
                  { batch_id: 'B-2026-005', field: 'Uji-North A1', harvest_date: '2026-04-12', weight: 36, grade: 'A', moisture: 4.8, status: 'Harvesting' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'line',
                title: 'Monthly Yield Trend (2026)',
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
            {
              type: 'notification_feed',
              args: {
                categories: ['Weather', 'Harvest', 'Soil'],
                dataSource: 'farm_alerts',
                data: [
                  { category: 'Weather', message: 'Rain expected Apr 25-27 — ideal for post-harvest recovery', priority: 'low', time: '1 hour ago' },
                  { category: 'Harvest', message: 'Field C2 ready for first cut — Grade A+ expected', priority: 'high', time: '3 hours ago' },
                  { category: 'Soil', message: 'pH levels optimal (6.2) across all North fields', priority: 'low', time: '1 day ago' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_2',
        name: 'Quality Control Lab (Osaka, Japan)',
        type: 'quality_control',
        description: 'ISO 17025 accredited testing facility for pesticide residue, heavy metals, microbial contamination, and organoleptic grading of tea leaves.',
        status: 'active',
        order: 1,
        metadata: {
          location: 'Osaka, Japan',
          coordinates: { lat: 34.6937, lng: 135.5023 },
          lead_time_days: 3,
          certifications: ['ISO 17025', 'FSSAI', 'JAS Inspector'],
        },
        ui_config: {
          icon: 'science',
          color: '#FF8F00',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Tests This Week', unit: '', dataKey: 'tests_week', value: 34 },
                  { label: 'Pass Rate', unit: '%', dataKey: 'pass_rate', value: 96.5 },
                  { label: 'Avg Turnaround', unit: 'hrs', dataKey: 'avg_turnaround', value: 4.2 },
                  { label: 'Pending Review', unit: '', dataKey: 'pending', value: 3 },
                ],
              },
            },
            {
              type: 'approval_form',
              args: {
                title: 'Batch Quality Certification',
                fields: [
                  { name: 'batch_id', type: 'text', label: 'Batch ID', required: true },
                  { name: 'grade', type: 'select', label: 'Final Grade', required: true, options: ['A+ Ceremonial', 'A Ceremonial', 'B+ Culinary', 'B Culinary', 'Reject'] },
                  { name: 'pesticide_clear', type: 'checkbox', label: 'Pesticide Residue Clear', required: true },
                  { name: 'heavy_metal_clear', type: 'checkbox', label: 'Heavy Metal Test Clear', required: true },
                  { name: 'microbial_clear', type: 'checkbox', label: 'Microbial Test Clear', required: true },
                  { name: 'notes', type: 'textarea', label: 'Inspector Notes', required: false },
                ],
                actions: [
                  { label: 'Certify & Approve', action: 'approve', variant: 'primary' },
                  { label: 'Flag for Re-test', action: 'flag', variant: 'warning' },
                  { label: 'Reject Batch', action: 'reject', variant: 'danger' },
                ],
              },
            },
            {
              type: 'data_grid',
              args: {
                columns: ['Test ID', 'Batch', 'Test Type', 'Result', 'Value', 'Threshold', 'Inspector', 'Date'],
                dataSource: 'test_results',
                editable: false,
                data: [
                  { test_id: 'T-001', batch: 'B-2026-001', test_type: 'Pesticide Panel', result: 'Pass', value: '<0.01 ppm', threshold: '0.05 ppm', inspector: 'Dr. Tanaka', date: '2026-03-16' },
                  { test_id: 'T-002', batch: 'B-2026-001', test_type: 'Heavy Metal (Pb)', result: 'Pass', value: '0.02 mg/kg', threshold: '0.5 mg/kg', inspector: 'Dr. Sato', date: '2026-03-16' },
                  { test_id: 'T-003', batch: 'B-2026-002', test_type: 'Microbial Count', result: 'Pass', value: '120 CFU/g', threshold: '1000 CFU/g', inspector: 'Dr. Tanaka', date: '2026-03-23' },
                  { test_id: 'T-004', batch: 'B-2026-003', test_type: 'Organoleptic', result: 'Pass', value: '92/100', threshold: '75/100', inspector: 'Master Yamamoto', date: '2026-04-02' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'bar',
                title: 'Test Results by Category (Last 30 Days)',
                xAxis: 'category',
                yAxis: 'count',
                dataSource: 'test_summary',
                data: [
                  { category: 'Pesticide', count: 28, pass: 27, fail: 1 },
                  { category: 'Heavy Metal', count: 28, pass: 28, fail: 0 },
                  { category: 'Microbial', count: 24, pass: 23, fail: 1 },
                  { category: 'Organoleptic', count: 20, pass: 19, fail: 1 },
                ],
              },
            },
            {
              type: 'timeline',
              args: {
                dataSource: 'lab_events',
                showDate: true,
                data: [
                  { date: '2026-04-20 09:00', event: 'Batch B-2026-003 received for testing', status: 'info' },
                  { date: '2026-04-20 11:30', event: 'Pesticide panel completed — PASS', status: 'success' },
                  { date: '2026-04-20 13:15', event: 'Heavy metal test completed — PASS', status: 'success' },
                  { date: '2026-04-20 14:00', event: 'Microbial culture started — Results in 24hrs', status: 'pending' },
                  { date: '2026-04-20 15:30', event: 'Organoleptic tasting by Master Yamamoto scheduled', status: 'pending' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_3',
        name: 'Stone Mill Processing (Nishio, Aichi)',
        type: 'processor',
        description: 'Traditional granite stone-grinding facility converting dried tencha leaves into ultra-fine matcha powder. Each mill produces only 40g/hour to preserve nutrients and flavor.',
        status: 'active',
        order: 2,
        metadata: {
          location: 'Nishio, Aichi, Japan',
          coordinates: { lat: 34.8424, lng: 137.0595 },
          lead_time_days: 5,
          capacity: '300kg/month',
        },
        ui_config: {
          icon: 'precision_manufacturing',
          color: '#1565C0',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Daily Output', unit: 'kg', dataKey: 'daily_output', value: 12.5 },
                  { label: 'Mill Utilization', unit: '%', dataKey: 'utilization', value: 87 },
                  { label: 'Particle Size', unit: 'μm', dataKey: 'particle_size', value: 5.2 },
                  { label: 'Waste Rate', unit: '%', dataKey: 'waste_rate', value: 2.3 },
                ],
              },
            },
            {
              type: 'status_tracker',
              args: {
                stages: ['Leaf Inspection', 'De-stemming', 'Stone Grinding', 'Sifting (300 mesh)', 'Color Check', 'Nitrogen Sealed'],
                dataKey: 'processing_stage',
                currentStage: 2,
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'bar',
                title: 'Weekly Production Output (kg)',
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
                columns: ['Input Batch', 'Output Batch', 'Input Weight', 'Output Weight', 'Mesh Grade', 'Color Score', 'Status'],
                dataSource: 'processing',
                sortable: true,
                filterable: true,
                data: [
                  { input_batch: 'B-2026-001', output_batch: 'P-2026-001', input_weight: '45kg', output_weight: '43.2kg', mesh_grade: 'Ultra-fine (5μm)', color_score: '96/100', status: 'Complete' },
                  { input_batch: 'B-2026-002', output_batch: 'P-2026-002', input_weight: '38kg', output_weight: '—', mesh_grade: '—', color_score: '—', status: 'Grinding' },
                  { input_batch: 'B-2026-003', output_batch: 'P-2026-003', input_weight: '52kg', output_weight: '—', mesh_grade: '—', color_score: '—', status: 'Queued' },
                ],
              },
            },
            {
              type: 'notification_feed',
              args: {
                categories: ['Machine', 'Quality', 'Schedule'],
                dataSource: 'mill_alerts',
                data: [
                  { category: 'Machine', message: 'Stone Mill #3 scheduled for re-dressing in 48hrs', priority: 'medium', time: '2 hours ago' },
                  { category: 'Quality', message: 'Color score dip on P-2026-002 — switch to Mill #1', priority: 'high', time: '30 min ago' },
                  { category: 'Schedule', message: '3 batches queued for processing this week', priority: 'low', time: '4 hours ago' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_4',
        name: 'Packaging & Branding (Nagoya)',
        type: 'packaging',
        description: 'Nitrogen-flush sealed packaging in custom-branded tins and pouches. Food-grade facility with HACCP certification for premium retail readiness.',
        status: 'active',
        order: 3,
        metadata: {
          location: 'Nagoya, Japan',
          coordinates: { lat: 35.1815, lng: 136.9066 },
          lead_time_days: 2,
          certifications: ['HACCP', 'ISO 22000'],
        },
        ui_config: {
          icon: 'inventory_2',
          color: '#6A1B9A',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Units Packed Today', unit: '', dataKey: 'packed_today', value: 1200 },
                  { label: 'Nitrogen Seal Rate', unit: '%', dataKey: 'seal_rate', value: 99.8 },
                  { label: 'Packaging Waste', unit: '%', dataKey: 'waste', value: 1.1 },
                  { label: 'SKUs Active', unit: '', dataKey: 'skus', value: 8 },
                ],
              },
            },
            {
              type: 'inventory_table',
              args: {
                columns: ['SKU', 'Product', 'Format', 'Units Ready', 'Expiry Batch', 'Label Status'],
                dataSource: 'packaging_inventory',
                sortable: true,
                filterable: true,
                data: [
                  { sku: 'MCH-CER-30', product: 'Ceremonial Matcha 30g', format: 'Tin', units_ready: 800, expiry_batch: 'Dec 2027', label_status: 'Printed' },
                  { sku: 'MCH-CER-100', product: 'Ceremonial Matcha 100g', format: 'Pouch', units_ready: 420, expiry_batch: 'Dec 2027', label_status: 'Printed' },
                  { sku: 'MCH-LAT-250', product: 'Latte Mix 250g', format: 'Resealable Bag', units_ready: 350, expiry_batch: 'Nov 2027', label_status: 'Pending' },
                  { sku: 'MCH-STR-KIT', product: 'Matcha Starter Kit', format: 'Gift Box', units_ready: 180, expiry_batch: 'Jan 2028', label_status: 'Printed' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'pie',
                title: 'Production Mix by SKU',
                xAxis: 'product',
                yAxis: 'units',
                dataSource: 'sku_mix',
                data: [
                  { product: 'Ceremonial 30g', units: 800 },
                  { product: 'Ceremonial 100g', units: 420 },
                  { product: 'Latte Mix', units: 350 },
                  { product: 'Starter Kit', units: 180 },
                ],
              },
            },
            {
              type: 'qr_scanner',
              args: {
                outputField: 'batch_verification',
                label: 'Scan Batch QR for Traceability Verification',
              },
            },
          ],
        },
      },
      {
        id: 'node_5',
        name: 'Customs & Export (Narita Airport, Tokyo)',
        type: 'customs',
        description: 'Japan customs clearance, phytosanitary certification, and export documentation for FDA-compliant food products bound for the United States.',
        status: 'active',
        order: 4,
        metadata: {
          location: 'Narita International Airport, Tokyo, Japan',
          coordinates: { lat: 35.7649, lng: 140.3864 },
          lead_time_days: 2,
          certifications: ['AEO Certified', 'FDA Registered'],
        },
        ui_config: {
          icon: 'gavel',
          color: '#C62828',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Cleared This Week', unit: 'shipments', dataKey: 'cleared', value: 5 },
                  { label: 'Avg Clear Time', unit: 'hrs', dataKey: 'clear_time', value: 8.5 },
                  { label: 'Pending Docs', unit: '', dataKey: 'pending_docs', value: 2 },
                  { label: 'Rejection Rate', unit: '%', dataKey: 'rejections', value: 0.3 },
                ],
              },
            },
            {
              type: 'data_grid',
              args: {
                columns: ['Shipment ID', 'HS Code', 'Dest. Country', 'Value (USD)', 'Phyto Cert', 'FDA Prior Notice', 'Status'],
                dataSource: 'customs_records',
                editable: false,
                data: [
                  { shipment_id: 'EXP-2026-041', hs_code: '0902.10', dest_country: 'USA', value: '$28,500', phyto_cert: '✅ Approved', fda_prior: '✅ Filed', status: 'Cleared' },
                  { shipment_id: 'EXP-2026-042', hs_code: '0902.10', dest_country: 'USA', value: '$15,200', phyto_cert: '✅ Approved', fda_prior: '⏳ Processing', status: 'Pending' },
                  { shipment_id: 'EXP-2026-043', hs_code: '2101.20', dest_country: 'Canada', value: '$9,800', phyto_cert: '⏳ Pending', fda_prior: 'N/A', status: 'Draft' },
                ],
              },
            },
            {
              type: 'document_upload',
              args: {
                acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
                maxSizeMB: 25,
                label: 'Upload Customs & Phytosanitary Documents',
              },
            },
            {
              type: 'timeline',
              args: {
                dataSource: 'customs_events',
                showDate: true,
                data: [
                  { date: '2026-04-18 08:00', event: 'EXP-2026-041 submitted to Japan Customs', status: 'info' },
                  { date: '2026-04-18 14:30', event: 'Phytosanitary certificate issued by MAFF', status: 'success' },
                  { date: '2026-04-19 09:00', event: 'FDA Prior Notice filed — confirmation received', status: 'success' },
                  { date: '2026-04-19 16:00', event: 'Shipment cleared — loaded onto JAL Cargo JL0061', status: 'success' },
                  { date: '2026-04-20 10:00', event: 'EXP-2026-042 FDA filing in progress', status: 'pending' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_6',
        name: 'Air Freight Logistics (Tokyo → Los Angeles)',
        type: 'logistics',
        description: 'Temperature-controlled air freight from Narita to LAX. Real-time GPS tracking and IoT temperature monitoring for perishable cargo.',
        status: 'active',
        order: 5,
        metadata: {
          location: 'Narita → LAX Route',
          coordinates: { lat: 35.7649, lng: 140.3864 },
          lead_time_days: 3,
          transport_mode: 'air_freight',
        },
        ui_config: {
          icon: 'flight',
          color: '#7B1FA2',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'In Transit', unit: 'shipments', dataKey: 'in_transit', value: 2 },
                  { label: 'Avg Transit Time', unit: 'hrs', dataKey: 'avg_transit', value: 11.5 },
                  { label: 'On-Time Rate', unit: '%', dataKey: 'on_time', value: 94.2 },
                  { label: 'Temp Deviation', unit: 'incidents', dataKey: 'temp_dev', value: 0 },
                ],
              },
            },
            {
              type: 'map_view',
              args: {
                dataSource: 'active_shipments',
                showRoute: true,
                routes: [
                  { from: { lat: 35.7649, lng: 140.3864 }, to: { lat: 33.9425, lng: -118.4081 }, status: 'in_transit', label: 'JAL Cargo JL0061' },
                ],
              },
            },
            {
              type: 'order_list',
              args: {
                columns: ['Flight', 'Shipment ID', 'Weight', 'Temp Range', 'Departed', 'ETA', 'Status'],
                statusFilters: ['Scheduled', 'In Transit', 'Landed', 'Cleared'],
                dataSource: 'flights',
                data: [
                  { flight: 'JL0061', shipment_id: 'EXP-2026-041', weight: '150kg', temp_range: '15-20°C', departed: 'Apr 19 18:00 JST', eta: 'Apr 19 12:00 PDT', status: 'In Transit' },
                  { flight: 'NH7956', shipment_id: 'EXP-2026-039', weight: '80kg', temp_range: '15-20°C', departed: 'Apr 17 20:00 JST', eta: 'Apr 17 14:00 PDT', status: 'Cleared' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'line',
                title: 'Temperature Log — In-Transit Shipment',
                xAxis: 'time',
                yAxis: 'temp_celsius',
                dataSource: 'iot_temp',
                data: [
                  { time: '0h', temp_celsius: 18 },
                  { time: '2h', temp_celsius: 17.5 },
                  { time: '4h', temp_celsius: 17.2 },
                  { time: '6h', temp_celsius: 17.8 },
                  { time: '8h', temp_celsius: 18.1 },
                  { time: '10h', temp_celsius: 17.9 },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_7',
        name: 'US Customs & FDA Clearance (Los Angeles)',
        type: 'customs',
        description: 'US Customs and Border Protection clearance at Port of Los Angeles. FDA food safety inspection and prior notice verification for imported food products.',
        status: 'active',
        order: 6,
        metadata: {
          location: 'Los Angeles, CA, USA',
          coordinates: { lat: 33.9425, lng: -118.4081 },
          lead_time_days: 1,
        },
        ui_config: {
          icon: 'security',
          color: '#D84315',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'FDA Hold', unit: 'shipments', dataKey: 'fda_hold', value: 0 },
                  { label: 'Cleared Today', unit: '', dataKey: 'cleared_today', value: 3 },
                  { label: 'Duty Paid (MTD)', unit: '$', dataKey: 'duty_mtd', value: 4250 },
                  { label: 'Avg Clear Time', unit: 'hrs', dataKey: 'clear_time', value: 6 },
                ],
              },
            },
            {
              type: 'data_grid',
              args: {
                columns: ['Entry #', 'Shipment', 'CBP Status', 'FDA Status', 'Duty', 'Bond', 'Released'],
                dataSource: 'us_customs',
                editable: false,
                data: [
                  { entry: 'ENT-89714', shipment: 'EXP-2026-039', cbp_status: '✅ Cleared', fda_status: '✅ Released', duty: '$1,140', bond: 'Continuous', released: 'Apr 17' },
                  { entry: 'ENT-89721', shipment: 'EXP-2026-041', cbp_status: '⏳ Review', fda_status: '⏳ Inspection', duty: '$2,280', bond: 'Continuous', released: 'Pending' },
                ],
              },
            },
            {
              type: 'document_upload',
              args: {
                acceptedTypes: ['application/pdf'],
                maxSizeMB: 15,
                label: 'Upload CBP Entry Summary (Form 7501)',
              },
            },
          ],
        },
      },
      {
        id: 'node_8',
        name: 'Distribution Warehouse (Los Angeles)',
        type: 'warehouse',
        description: 'Climate-controlled central US distribution hub. Handles B2B wholesale and D2C e-commerce fulfillment with WMS-integrated inventory management.',
        status: 'active',
        order: 7,
        metadata: {
          location: 'Commerce, Los Angeles, CA',
          coordinates: { lat: 33.9975, lng: -118.1557 },
          capacity: '5,000 sq ft',
          lead_time_days: 1,
        },
        ui_config: {
          icon: 'warehouse',
          color: '#00838F',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Total SKUs', unit: '', dataKey: 'total_skus', value: 8 },
                  { label: 'Units in Stock', unit: '', dataKey: 'units_in_stock', value: 4850 },
                  { label: 'Orders Today', unit: '', dataKey: 'orders_today', value: 67 },
                  { label: 'Space Utilized', unit: '%', dataKey: 'space_used', value: 72 },
                ],
              },
            },
            {
              type: 'inventory_table',
              args: {
                columns: ['SKU', 'Product', 'Qty', 'Reorder Pt', 'Zone', 'Lot #', 'Expiry', 'Status'],
                dataSource: 'warehouse_inventory',
                sortable: true,
                filterable: true,
                data: [
                  { sku: 'MCH-CER-30', product: 'Matcha Ceremonial 30g', qty: 1450, reorder_pt: 400, zone: 'A1-03', lot: 'P-2026-001', expiry: 'Dec 2027', status: 'In Stock' },
                  { sku: 'MCH-CER-100', product: 'Matcha Ceremonial 100g', qty: 820, reorder_pt: 200, zone: 'A1-04', lot: 'P-2026-001', expiry: 'Dec 2027', status: 'In Stock' },
                  { sku: 'MCH-LAT-250', product: 'Matcha Latte Mix 250g', qty: 180, reorder_pt: 300, zone: 'A2-01', lot: 'P-2026-002', expiry: 'Nov 2027', status: '⚠️ Low Stock' },
                  { sku: 'MCH-STR-KIT', product: 'Matcha Starter Kit', qty: 620, reorder_pt: 100, zone: 'B1-02', lot: 'P-2026-001', expiry: 'Jan 2028', status: 'In Stock' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'pie',
                title: 'Inventory Distribution by Product',
                xAxis: 'product',
                yAxis: 'quantity',
                dataSource: 'inventory_breakdown',
                data: [
                  { product: 'Ceremonial 30g', quantity: 1450 },
                  { product: 'Ceremonial 100g', quantity: 820 },
                  { product: 'Latte Mix 250g', quantity: 180 },
                  { product: 'Starter Kit', quantity: 620 },
                ],
              },
            },
            {
              type: 'notification_feed',
              args: {
                categories: ['Low Stock', 'Incoming', 'Expiry Alert', 'Order Spike'],
                dataSource: 'warehouse_alerts',
                data: [
                  { category: 'Low Stock', message: 'MCH-LAT-250 at 180 units (reorder point: 300) — PO auto-generated', priority: 'high', time: '1 hour ago' },
                  { category: 'Incoming', message: 'EXP-2026-041 cleared customs — arriving tomorrow (1,200 units)', priority: 'medium', time: '3 hours ago' },
                  { category: 'Order Spike', message: '+45% order volume detected — TikTok viral post identified', priority: 'high', time: '6 hours ago' },
                  { category: 'Expiry Alert', message: 'Lot P-2025-012 expires in 60 days — 85 units remaining', priority: 'medium', time: '1 day ago' },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'node_9',
        name: 'D2C Fulfillment & Last-Mile (Nationwide)',
        type: 'fulfillment_center',
        description: 'Direct-to-consumer order processing with same-day pick-pack-ship. Multi-carrier shipping (USPS, FedEx, UPS) with branded unboxing experience and handwritten thank-you cards.',
        status: 'active',
        order: 8,
        metadata: {
          location: 'Commerce, Los Angeles, CA',
          coordinates: { lat: 33.9975, lng: -118.1557 },
          lead_time_days: 2,
          shipping_partners: ['USPS Priority', 'FedEx Ground', 'FedEx 2Day', 'UPS Ground'],
        },
        ui_config: {
          icon: 'deployed_code',
          color: '#AD1457',
          page_components: [
            {
              type: 'kpi_card_row',
              args: {
                cards: [
                  { label: 'Orders Today', unit: '', dataKey: 'orders_today', value: 67 },
                  { label: 'Shipped', unit: '', dataKey: 'shipped', value: 52 },
                  { label: 'Avg Ship Time', unit: 'hrs', dataKey: 'avg_ship_time', value: 4.2 },
                  { label: 'Return Rate', unit: '%', dataKey: 'returns', value: 1.8 },
                ],
              },
            },
            {
              type: 'order_list',
              args: {
                columns: ['Order ID', 'Customer', 'Items', 'Total', 'Channel', 'Carrier', 'Status'],
                statusFilters: ['Pending', 'Picking', 'Packing', 'Shipped', 'Delivered', 'Returned'],
                dataSource: 'orders',
                data: [
                  { order_id: 'ORD-8921', customer: 'Sarah M. (NY)', items: '2x MCH-CER-30', total: '$58.00', channel: 'Shopify', carrier: 'USPS Priority', status: 'Shipped' },
                  { order_id: 'ORD-8922', customer: 'James L. (TX)', items: '1x MCH-STR-KIT', total: '$45.00', channel: 'Amazon', carrier: 'FedEx 2Day', status: 'Packing' },
                  { order_id: 'ORD-8923', customer: 'Emily R. (CA)', items: '3x MCH-LAT-250', total: '$72.00', channel: 'Shopify', carrier: '—', status: 'Pending' },
                  { order_id: 'ORD-8924', customer: 'Chen W. (WA)', items: '1x MCH-CER-100, 1x MCH-CER-30', total: '$68.00', channel: 'Website', carrier: 'UPS Ground', status: 'Picking' },
                  { order_id: 'ORD-8925', customer: 'Lisa K. (FL)', items: '5x MCH-CER-30 (Gift)', total: '$140.00', channel: 'Shopify', carrier: 'FedEx 2Day', status: 'Shipped' },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'line',
                title: 'Daily Orders — Last 14 Days',
                xAxis: 'day',
                yAxis: 'orders',
                dataSource: 'order_trend',
                data: [
                  { day: 'Apr 7', orders: 28 },
                  { day: 'Apr 8', orders: 35 },
                  { day: 'Apr 9', orders: 31 },
                  { day: 'Apr 10', orders: 42 },
                  { day: 'Apr 11', orders: 38 },
                  { day: 'Apr 12', orders: 22 },
                  { day: 'Apr 13', orders: 18 },
                  { day: 'Apr 14', orders: 45 },
                  { day: 'Apr 15', orders: 52 },
                  { day: 'Apr 16', orders: 48 },
                  { day: 'Apr 17', orders: 61 },
                  { day: 'Apr 18', orders: 58 },
                  { day: 'Apr 19', orders: 67 },
                  { day: 'Apr 20', orders: 72 },
                ],
              },
            },
            {
              type: 'analytics_chart',
              args: {
                chartType: 'pie',
                title: 'Orders by Sales Channel',
                xAxis: 'channel',
                yAxis: 'orders',
                dataSource: 'channel_mix',
                data: [
                  { channel: 'Shopify DTC', orders: 42 },
                  { channel: 'Amazon', orders: 15 },
                  { channel: 'Wholesale (B2B)', orders: 8 },
                  { channel: 'Website Direct', orders: 2 },
                ],
              },
            },
            {
              type: 'timeline',
              args: {
                dataSource: 'fulfillment_events',
                showDate: true,
                data: [
                  { date: '2026-04-20 07:00', event: 'Morning batch started — 32 orders picked', status: 'success' },
                  { date: '2026-04-20 09:30', event: 'USPS Priority pickup completed (18 parcels)', status: 'success' },
                  { date: '2026-04-20 11:00', event: 'FedEx 2Day pickup completed (8 parcels)', status: 'success' },
                  { date: '2026-04-20 12:30', event: 'Afternoon batch started — 35 orders in queue', status: 'pending' },
                  { date: '2026-04-20 14:00', event: 'UPS Ground pickup scheduled for 16:00', status: 'pending' },
                ],
              },
            },
          ],
        },
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'refrigerated_truck', estimated_days: 1, cost_estimate: '$180/trip' } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'inspects_for', metadata: { transport_mode: 'road', estimated_days: 1, cost_estimate: '$120/trip' } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'processes_for', metadata: { transport_mode: 'road', estimated_days: 1, cost_estimate: '$95/trip' } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'packages_for', metadata: { transport_mode: 'road', estimated_days: 1, cost_estimate: '$250/trip' } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'ships_to', metadata: { transport_mode: 'air_freight', estimated_days: 1, cost_estimate: '$4,200/shipment' } },
      { id: 'edge_6', source_node_id: 'node_6', target_node_id: 'node_7', relationship: 'ships_to', metadata: { transport_mode: 'air_freight', estimated_days: 1, cost_estimate: 'Included' } },
      { id: 'edge_7', source_node_id: 'node_7', target_node_id: 'node_8', relationship: 'inspects_for', metadata: { transport_mode: 'bonded_truck', estimated_days: 1, cost_estimate: '$350/trip' } },
      { id: 'edge_8', source_node_id: 'node_8', target_node_id: 'node_9', relationship: 'stores_for', metadata: { transport_mode: 'internal', estimated_days: 0, cost_estimate: '$0' } },
    ],
  };
}

// ============================================================
// Fashion Chain — 8 nodes, India/Vietnam → EU/US
// ============================================================
function getFashionChain(idea: string): SupplyChain {
  return {
    id: 'sc_fsh_001',
    name: 'Sustainable Fashion Supply Chain',
    business_idea: idea,
    status: 'active',
    created_at: new Date().toISOString(),
    nodes: [
      {
        id: 'node_1', name: 'Organic Cotton Farm (Gujarat, India)', type: 'raw_material_source',
        description: 'GOTS-certified organic cotton farming cooperative in the Surendranagar district. Drip-irrigated fields producing extra-long staple cotton for premium textiles.',
        status: 'active', order: 0,
        metadata: { location: 'Surendranagar, Gujarat, India', coordinates: { lat: 22.7282, lng: 71.6482 }, lead_time_days: 21, capacity: '12,000 meters/month', certifications: ['GOTS', 'Fair Trade', 'BCI'] },
        ui_config: { icon: 'grass', color: '#33691E', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Monthly Output', unit: 'm', dataKey: 'output', value: 11200 }, { label: 'Fiber Quality', unit: 'mm staple', dataKey: 'quality', value: 32 }, { label: 'Water Saved', unit: '%', dataKey: 'water', value: 45 }, { label: 'Farmers Employed', unit: '', dataKey: 'farmers', value: 84 }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Monthly Fabric Output (meters)', xAxis: 'month', yAxis: 'meters', dataSource: 'production', data: [{ month: 'Jan', meters: 9800 }, { month: 'Feb', meters: 10500 }, { month: 'Mar', meters: 11200 }, { month: 'Apr', meters: 11800 }] } },
          { type: 'inventory_table', args: { columns: ['Lot', 'Fiber Type', 'Color', 'Weight (kg)', 'Staple (mm)', 'Grade', 'Status'], dataSource: 'cotton_inventory', sortable: true, filterable: true, data: [{ lot: 'CT-401', fiber_type: 'Extra-Long Staple', color: 'Natural', weight: 450, staple: 32, grade: 'A', status: 'Ginned' }, { lot: 'CT-402', fiber_type: 'Long Staple', color: 'Natural', weight: 380, staple: 28, grade: 'B+', status: 'Spinning' }] } },
          { type: 'notification_feed', args: { categories: ['Weather', 'Harvest', 'Certification'], dataSource: 'farm_alerts', data: [{ category: 'Certification', message: 'GOTS audit scheduled for May 15 — document prep required', priority: 'high', time: '1 day ago' }, { category: 'Harvest', message: 'CT-403 lot ready for ginning — est. 420kg', priority: 'medium', time: '4 hours ago' }] } },
        ]},
      },
      {
        id: 'node_2', name: 'Textile Mill & Dyeing (Tirupur, Tamil Nadu)', type: 'processor',
        description: 'Vertically integrated textile mill with eco-friendly dyeing using OEKO-TEX certified dyes. Zero-liquid-discharge water recycling system.',
        status: 'active', order: 1,
        metadata: { location: 'Tirupur, Tamil Nadu, India', coordinates: { lat: 11.1085, lng: 77.3411 }, lead_time_days: 10, certifications: ['OEKO-TEX', 'ZLD Certified'] },
        ui_config: { icon: 'texture', color: '#1565C0', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Fabric Produced', unit: 'm/day', dataKey: 'daily', value: 850 }, { label: 'Dye Accuracy', unit: '%', dataKey: 'dye_accuracy', value: 98.5 }, { label: 'Water Recycled', unit: '%', dataKey: 'water', value: 95 }, { label: 'Color Options', unit: '', dataKey: 'colors', value: 24 }] } },
          { type: 'status_tracker', args: { stages: ['Spinning', 'Weaving', 'Dyeing', 'Finishing', 'QC Check', 'Roll Packed'], dataKey: 'stage', currentStage: 3 } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Production by Fabric Type', xAxis: 'type', yAxis: 'meters', dataSource: 'fabric_output', data: [{ type: 'Jersey Knit', meters: 3200 }, { type: 'French Terry', meters: 2800 }, { type: 'Poplin', meters: 1500 }, { type: 'Twill', meters: 1100 }] } },
        ]},
      },
      {
        id: 'node_3', name: 'Design Studio (Milan, Italy)', type: 'processor',
        description: 'Fashion design studio using CLO3D virtual prototyping. Tech-pack generation and grading for global manufacturing transfer.',
        status: 'active', order: 2,
        metadata: { location: 'Milan, Italy', coordinates: { lat: 45.4642, lng: 9.1900 }, lead_time_days: 14 },
        ui_config: { icon: 'design_services', color: '#AD1457', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Active Designs', unit: '', dataKey: 'designs', value: 32 }, { label: 'Approved for Production', unit: '', dataKey: 'approved', value: 18 }, { label: 'Virtual Prototypes', unit: '', dataKey: 'virtual', value: 14 }, { label: 'Seasons in Progress', unit: '', dataKey: 'seasons', value: 2 }] } },
          { type: 'approval_form', args: { title: 'Design Sign-Off', fields: [{ name: 'design_id', type: 'text', label: 'Design ID', required: true }, { name: 'season', type: 'select', label: 'Season', required: true, options: ['SS26', 'FW26', 'SS27'] }, { name: 'verdict', type: 'select', label: 'Decision', required: true, options: ['Approve for Sampling', 'Revise & Resubmit', 'Archive'] }, { name: 'notes', type: 'textarea', label: 'Creative Director Notes', required: false }], actions: [{ label: 'Approve', action: 'approve', variant: 'primary' }, { label: 'Request Changes', action: 'revise', variant: 'warning' }] } },
          { type: 'data_grid', args: { columns: ['Design ID', 'Name', 'Season', 'Category', 'Colorways', 'Tech Pack', 'Status'], dataSource: 'designs', editable: false, data: [{ design_id: 'D-SS26-101', name: 'Urban Runner Hoodie', season: 'SS26', category: 'Tops', colorways: 4, tech_pack: '✅ Complete', status: 'Sampling' }, { design_id: 'D-SS26-102', name: 'Coastal Breeze Tee', season: 'SS26', category: 'Tops', colorways: 6, tech_pack: '✅ Complete', status: 'Approved' }, { design_id: 'D-FW26-201', name: 'Alpine Puffer Jacket', season: 'FW26', category: 'Outerwear', colorways: 3, tech_pack: '⏳ In Progress', status: 'Design' }] } },
        ]},
      },
      {
        id: 'node_4', name: 'CMT Factory (Ho Chi Minh City, Vietnam)', type: 'manufacturer',
        description: 'Cut-Make-Trim manufacturing facility with SA8000 ethical labor certification. 12 production lines handling 8,000 units/month with automated cutting.',
        status: 'active', order: 3,
        metadata: { location: 'Ho Chi Minh City, Vietnam', coordinates: { lat: 10.8231, lng: 106.6297 }, lead_time_days: 30, capacity: '8,000 units/month', certifications: ['SA8000', 'WRAP'] },
        ui_config: { icon: 'factory', color: '#E65100', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units This Month', unit: '', dataKey: 'produced', value: 6200 }, { label: 'Defect Rate', unit: '%', dataKey: 'defects', value: 1.4 }, { label: 'Workers Active', unit: '', dataKey: 'workers', value: 145 }, { label: 'Lines Running', unit: '/12', dataKey: 'lines', value: 10 }] } },
          { type: 'status_tracker', args: { stages: ['Fabric Received', 'Cutting', 'Sewing', 'Washing', 'Finishing', 'QC Inspection', 'Packed & Ready'], dataKey: 'stage', currentStage: 3 } },
          { type: 'inventory_table', args: { columns: ['PO #', 'Style', 'Size Run', 'Qty', 'Cut', 'Sewn', 'QC Pass', 'Ship Date'], dataSource: 'production_orders', sortable: true, filterable: true, data: [{ po: 'PO-2026-501', style: 'Urban Runner Hoodie', size_run: 'XS-2XL', qty: 2000, cut: '100%', sewn: '68%', qc_pass: '—', ship_date: 'May 1' }, { po: 'PO-2026-502', style: 'Coastal Breeze Tee', size_run: 'S-XL', qty: 3000, cut: '45%', sewn: '12%', qc_pass: '—', ship_date: 'May 15' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Daily Production Output', xAxis: 'day', yAxis: 'units', dataSource: 'daily_output', data: [{ day: 'Mon', units: 320 }, { day: 'Tue', units: 345 }, { day: 'Wed', units: 310 }, { day: 'Thu', units: 360 }, { day: 'Fri', units: 340 }, { day: 'Sat', units: 180 }] } },
        ]},
      },
      {
        id: 'node_5', name: 'Quality Assurance & Compliance (HCMC)', type: 'quality_control',
        description: 'AQL 2.5 inspection for all outbound shipments. Testing for colorfastness, shrinkage, tensile strength, and regulatory compliance (REACH, CPSIA).',
        status: 'active', order: 4,
        metadata: { location: 'Ho Chi Minh City, Vietnam', coordinates: { lat: 10.8231, lng: 106.6297 }, lead_time_days: 3, certifications: ['ISO 17025'] },
        ui_config: { icon: 'verified', color: '#2E7D32', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Inspected This Week', unit: '', dataKey: 'inspected', value: 2800 }, { label: 'AQL Pass', unit: '%', dataKey: 'aql_pass', value: 97.8 }, { label: 'Color Fastness', unit: '/5', dataKey: 'color_fast', value: 4.5 }, { label: 'Shrinkage', unit: '%', dataKey: 'shrinkage', value: 2.1 }] } },
          { type: 'approval_form', args: { title: 'Shipment QC Release', fields: [{ name: 'po', type: 'text', label: 'PO Number', required: true }, { name: 'aql_result', type: 'select', label: 'AQL Result', required: true, options: ['Pass', 'Conditional Pass', 'Fail — Rework', 'Fail — Reject'] }, { name: 'lab_report', type: 'text', label: 'Lab Report #', required: true }, { name: 'notes', type: 'textarea', label: 'QC Notes', required: false }], actions: [{ label: 'Release for Shipping', action: 'release', variant: 'primary' }, { label: 'Hold for Rework', action: 'hold', variant: 'warning' }, { label: 'Reject Batch', action: 'reject', variant: 'danger' }] } },
          { type: 'data_grid', args: { columns: ['Test', 'PO', 'Standard', 'Result', 'Pass/Fail', 'Lab'], dataSource: 'qc_tests', editable: false, data: [{ test: 'Colorfastness (Wash)', po: 'PO-2026-501', standard: 'ISO 105-C06', result: '4-5', pass_fail: '✅ Pass', lab: 'SGS Vietnam' }, { test: 'Shrinkage', po: 'PO-2026-501', standard: 'AATCC 135', result: '-2.1%', pass_fail: '✅ Pass', lab: 'SGS Vietnam' }, { test: 'Tensile Strength', po: 'PO-2026-501', standard: 'ASTM D5034', result: '42 lbf', pass_fail: '✅ Pass', lab: 'Bureau Veritas' }] } },
        ]},
      },
      {
        id: 'node_6', name: 'Ocean Freight (Vietnam → Rotterdam)', type: 'logistics',
        description: 'FCL container shipping via Maersk from HCMC to Rotterdam. 20-day transit with real-time container tracking and CO2 offset.',
        status: 'active', order: 5,
        metadata: { location: 'Cat Lai Port, HCMC → Port of Rotterdam', coordinates: { lat: 10.7590, lng: 106.7584 }, lead_time_days: 22, transport_mode: 'sea_freight' },
        ui_config: { icon: 'directions_boat', color: '#0D47A1', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Containers at Sea', unit: '', dataKey: 'at_sea', value: 2 }, { label: 'Avg Transit', unit: 'days', dataKey: 'avg_transit', value: 20 }, { label: 'CO2 Offset', unit: 'tons', dataKey: 'co2', value: 3.2 }, { label: 'On-Schedule', unit: '%', dataKey: 'on_sched', value: 91 }] } },
          { type: 'map_view', args: { dataSource: 'containers', showRoute: true, routes: [{ from: { lat: 10.7590, lng: 106.7584 }, to: { lat: 51.9225, lng: 4.4792 }, status: 'in_transit', label: 'Maersk MSKU-7291045' }] } },
          { type: 'order_list', args: { columns: ['Container', 'Vessel', 'POs Inside', 'Departed', 'ETA Rotterdam', 'Status'], statusFilters: ['Loading', 'In Transit', 'At Port', 'Delivered'], dataSource: 'shipments', data: [{ container: 'MSKU-7291045', vessel: 'Maersk Eindhoven', pos: 'PO-501, PO-502', departed: 'Apr 5', eta: 'Apr 25', status: 'In Transit' }] } },
        ]},
      },
      {
        id: 'node_7', name: 'EU Distribution Center (Rotterdam)', type: 'warehouse',
        description: 'European 3PL distribution hub with automated pick-pack for B2B wholesale and D2C e-commerce across EU/UK markets.',
        status: 'active', order: 6,
        metadata: { location: 'Rotterdam, Netherlands', coordinates: { lat: 51.9225, lng: 4.4792 }, capacity: '15,000 sq ft' },
        ui_config: { icon: 'warehouse', color: '#00695C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units Stored', unit: '', dataKey: 'stored', value: 32000 }, { label: 'Orders/Day', unit: '', dataKey: 'orders', value: 280 }, { label: 'Pick Accuracy', unit: '%', dataKey: 'accuracy', value: 99.6 }, { label: 'Returns Pending', unit: '', dataKey: 'returns', value: 45 }] } },
          { type: 'inventory_table', args: { columns: ['SKU', 'Product', 'Color', 'Size', 'Qty', 'Zone', 'Status'], dataSource: 'warehouse', sortable: true, filterable: true, data: [{ sku: 'UR-BLK-M', product: 'Urban Runner Hoodie', color: 'Black', size: 'M', qty: 1200, zone: 'A3-12', status: 'In Stock' }, { sku: 'UR-BLK-L', product: 'Urban Runner Hoodie', color: 'Black', size: 'L', qty: 980, zone: 'A3-13', status: 'In Stock' }, { sku: 'CB-WHT-S', product: 'Coastal Breeze Tee', color: 'White', size: 'S', qty: 150, zone: 'B1-04', status: '⚠️ Low' }] } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Sales by Region (Last 30 Days)', xAxis: 'region', yAxis: 'orders', dataSource: 'regional_sales', data: [{ region: 'Germany', orders: 420 }, { region: 'UK', orders: 380 }, { region: 'France', orders: 290 }, { region: 'Netherlands', orders: 180 }, { region: 'Nordics', orders: 140 }] } },
        ]},
      },
      {
        id: 'node_8', name: 'Returns & Circular Economy Hub', type: 'returns_center',
        description: 'Handles returns, refurbishment, and circular economy initiatives. Damaged items are recycled into new fibers. Returned items are inspected, re-tagged, and restocked.',
        status: 'active', order: 7,
        metadata: { location: 'Rotterdam, Netherlands', coordinates: { lat: 51.9225, lng: 4.4792 } },
        ui_config: { icon: 'recycling', color: '#558B2F', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Returns This Month', unit: '', dataKey: 'returns', value: 342 }, { label: 'Restocked', unit: '%', dataKey: 'restocked', value: 68 }, { label: 'Recycled', unit: '%', dataKey: 'recycled', value: 22 }, { label: 'Waste', unit: '%', dataKey: 'waste', value: 10 }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Return Disposition', xAxis: 'disposition', yAxis: 'count', dataSource: 'disposition', data: [{ disposition: 'Restocked (A-grade)', count: 233 }, { disposition: 'Refurbished', count: 34 }, { disposition: 'Fiber Recycling', count: 55 }, { disposition: 'Donated', count: 15 }, { disposition: 'Waste', count: 5 }] } },
          { type: 'data_grid', args: { columns: ['Return ID', 'Order', 'Reason', 'Condition', 'Disposition', 'Date'], dataSource: 'returns', editable: false, data: [{ return_id: 'RET-1201', order: 'ORD-8412', reason: 'Size exchange', condition: 'Unworn', disposition: 'Restocked', date: 'Apr 18' }, { return_id: 'RET-1202', order: 'ORD-8398', reason: 'Defective zipper', condition: 'Damaged', disposition: 'Recycling', date: 'Apr 17' }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'road', estimated_days: 3, cost_estimate: '$420/lot' } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_4', relationship: 'supplies_to', metadata: { transport_mode: 'sea', estimated_days: 8, cost_estimate: '$1,200/container' } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'supplies_to', metadata: { transport_mode: 'digital', estimated_days: 0, cost_estimate: '$0' } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'ships_to', metadata: { transport_mode: 'road_to_port', estimated_days: 1 } },
      { id: 'edge_6', source_node_id: 'node_6', target_node_id: 'node_7', relationship: 'ships_to', metadata: { transport_mode: 'sea_freight', estimated_days: 20, cost_estimate: '$3,800/container' } },
      { id: 'edge_7', source_node_id: 'node_7', target_node_id: 'node_8', relationship: 'returns_to', metadata: { transport_mode: 'courier', estimated_days: 3 } },
    ],
  };
}

// ============================================================
// Electronics Chain — 8 nodes, Shenzhen → Dallas
// ============================================================
function getElectronicsChain(idea: string): SupplyChain {
  return {
    id: 'sc_elc_001', name: 'Smart Electronics Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Semiconductor Fab (Hsinchu, Taiwan)', type: 'supplier',
        description: 'TSMC partner fab producing custom SoCs on 7nm process. Wafer allocation and die-level testing before packaging.',
        status: 'active', order: 0,
        metadata: { location: 'Hsinchu Science Park, Taiwan', coordinates: { lat: 24.7866, lng: 120.9966 }, lead_time_days: 45, capacity: '50K units/month' },
        ui_config: { icon: 'memory', color: '#37474F', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Wafer Yield', unit: '%', dataKey: 'yield', value: 94.2 }, { label: 'Die per Wafer', unit: '', dataKey: 'dpw', value: 842 }, { label: 'Lead Time', unit: 'weeks', dataKey: 'lead', value: 6 }, { label: 'Cost/Die', unit: '$', dataKey: 'cost', value: 4.80 }] } },
          { type: 'inventory_table', args: { columns: ['Part #', 'Process', 'Wafers Ordered', 'Dies Ready', 'Yield', 'Status'], dataSource: 'wafer_orders', sortable: true, filterable: true, data: [{ part: 'SoC-A12X', process: '7nm FinFET', wafers_ordered: 200, dies_ready: 158400, yield: '94.2%', status: 'Testing' }, { part: 'PMU-3V3', process: '28nm', wafers_ordered: 50, dies_ready: 85000, yield: '97.1%', status: 'Ready' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Wafer Yield Trend (%)', xAxis: 'month', yAxis: 'yield', dataSource: 'yield_trend', data: [{ month: 'Jan', yield: 91.5 }, { month: 'Feb', yield: 92.8 }, { month: 'Mar', yield: 93.6 }, { month: 'Apr', yield: 94.2 }] } },
          { type: 'status_tracker', args: { stages: ['Wafer Fab', 'Photolithography', 'Etching', 'Ion Implant', 'Die Testing', 'Packaging', 'Ship Ready'], dataKey: 'stage', currentStage: 4 } },
        ]},
      },
      { id: 'node_2', name: 'Component Sourcing (Shenzhen, China)', type: 'supplier',
        description: 'BOM sourcing hub for passive components (capacitors, resistors), connectors, displays, and enclosures from vetted Shenzhen suppliers.',
        status: 'active', order: 1,
        metadata: { location: 'Shenzhen, Guangdong, China', coordinates: { lat: 22.5431, lng: 114.0579 }, lead_time_days: 14 },
        ui_config: { icon: 'category', color: '#F57C00', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'BOM Items', unit: '', dataKey: 'bom', value: 127 }, { label: 'Suppliers Active', unit: '', dataKey: 'suppliers', value: 18 }, { label: 'Avg Lead Time', unit: 'days', dataKey: 'lead', value: 14 }, { label: 'Shortage Alerts', unit: '', dataKey: 'shortages', value: 2 }] } },
          { type: 'data_grid', args: { columns: ['Part #', 'Description', 'Supplier', 'MOQ', 'Stock', 'Lead Time', 'Risk'], dataSource: 'bom', editable: false, data: [{ part: 'CAP-100u', description: '100μF MLCC', supplier: 'Yageo', moq: 10000, stock: 45000, lead_time: '7d', risk: '🟢 Low' }, { part: 'DISP-2.8', description: '2.8" TFT LCD', supplier: 'BOE', moq: 500, stock: 1200, lead_time: '21d', risk: '🟡 Medium' }, { part: 'CONN-USB-C', description: 'USB-C Receptacle', supplier: 'JAE', moq: 5000, stock: 2800, lead_time: '10d', risk: '🔴 Shortage' }] } },
          { type: 'notification_feed', args: { categories: ['Shortage', 'Price Change', 'EOL'], dataSource: 'supply_alerts', data: [{ category: 'Shortage', message: 'CONN-USB-C stock below safety threshold — expedite PO required', priority: 'high', time: '2 hours ago' }, { category: 'Price Change', message: 'MLCC prices up 8% from Yageo — evaluate alternatives', priority: 'medium', time: '1 day ago' }] } },
        ]},
      },
      { id: 'node_3', name: 'PCB Assembly (SMT Factory, Dongguan)', type: 'manufacturer',
        description: 'High-speed SMT lines (Fuji NXT III) with AOI, SPI, and X-ray inspection. 6-layer PCB assembly with lead-free reflow soldering.',
        status: 'active', order: 2,
        metadata: { location: 'Dongguan, Guangdong, China', coordinates: { lat: 23.0208, lng: 113.7518 }, lead_time_days: 10, capacity: '30,000 boards/month' },
        ui_config: { icon: 'developer_board', color: '#1B5E20', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Boards/Day', unit: '', dataKey: 'daily', value: 1200 }, { label: 'First Pass Yield', unit: '%', dataKey: 'fpy', value: 98.7 }, { label: 'Solder Defects', unit: 'ppm', dataKey: 'defects', value: 42 }, { label: 'Lines Running', unit: '/4', dataKey: 'lines', value: 3 }] } },
          { type: 'status_tracker', args: { stages: ['Stencil Print', 'Component Place', 'Reflow Solder', 'AOI Inspect', 'X-Ray', 'ICT Test', 'Conformal Coat'], dataKey: 'stage', currentStage: 3 } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Daily First Pass Yield (%)', xAxis: 'day', yAxis: 'fpy', dataSource: 'fpy_trend', data: [{ day: 'Mon', fpy: 98.2 }, { day: 'Tue', fpy: 98.9 }, { day: 'Wed', fpy: 98.5 }, { day: 'Thu', fpy: 99.1 }, { day: 'Fri', fpy: 98.7 }] } },
        ]},
      },
      { id: 'node_4', name: 'Final Assembly & Testing (Shenzhen)', type: 'manufacturer',
        description: 'Product-level assembly: enclosure fitting, display bonding, firmware flashing, and 72-hour burn-in testing.',
        status: 'active', order: 3,
        metadata: { location: 'Shenzhen, China', coordinates: { lat: 22.5431, lng: 114.0579 }, lead_time_days: 5 },
        ui_config: { icon: 'build', color: '#BF360C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units Assembled', unit: '/day', dataKey: 'daily', value: 500 }, { label: 'Burn-in Pass', unit: '%', dataKey: 'burnin', value: 99.2 }, { label: 'FW Version', unit: '', dataKey: 'fw', value: 'v3.1.4' }, { label: 'Rework Rate', unit: '%', dataKey: 'rework', value: 0.8 }] } },
          { type: 'status_tracker', args: { stages: ['Enclosure Assembly', 'Display Bond', 'PCB Install', 'FW Flash', 'Burn-in (72h)', 'Final QC', 'Box Pack'], dataKey: 'stage', currentStage: 4 } },
          { type: 'inventory_table', args: { columns: ['Serial Range', 'Batch', 'Assembled', 'Burn-in', 'Packed', 'Ship Date'], dataSource: 'assembly', sortable: true, filterable: true, data: [{ serial_range: 'SH-240001-241000', batch: 'B-042', assembled: 1000, burnin: '820/1000', packed: 680, ship_date: 'Apr 25' }] } },
        ]},
      },
      { id: 'node_5', name: 'Certification Lab (UL, FCC, CE)', type: 'quality_control',
        description: 'Regulatory certification lab for FCC Part 15, CE marking, UL safety, and RoHS compliance testing.',
        status: 'active', order: 4,
        metadata: { location: 'Shenzhen, China', coordinates: { lat: 22.5431, lng: 114.0579 }, certifications: ['FCC', 'CE', 'UL', 'RoHS'] },
        ui_config: { icon: 'verified_user', color: '#1565C0', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Active Certifications', unit: '', dataKey: 'certs', value: 4 }, { label: 'Tests in Progress', unit: '', dataKey: 'testing', value: 1 }, { label: 'Next Renewal', unit: '', dataKey: 'renewal', value: 'Aug 2026' }] } },
          { type: 'data_grid', args: { columns: ['Certification', 'Standard', 'Status', 'Lab', 'Issued', 'Expiry'], dataSource: 'certifications', editable: false, data: [{ certification: 'FCC', standard: 'Part 15 Class B', status: '✅ Approved', lab: 'UL Shenzhen', issued: 'Jan 2026', expiry: 'Jan 2029' }, { certification: 'CE', standard: 'EN 55032', status: '✅ Approved', lab: 'TÜV SÜD', issued: 'Feb 2026', expiry: 'Feb 2029' }, { certification: 'UL', standard: 'UL 62368-1', status: '⏳ Testing', lab: 'UL Taiwan', issued: '—', expiry: '—' }, { certification: 'RoHS', standard: 'EU 2011/65/EU', status: '✅ Compliant', lab: 'SGS', issued: 'Mar 2026', expiry: 'Mar 2029' }] } },
        ]},
      },
      { id: 'node_6', name: 'Ocean Freight (Shenzhen → Long Beach)', type: 'logistics',
        description: 'FCL shipping from Yantian Port to Port of Long Beach. 14-day Pacific crossing with real-time container tracking.',
        status: 'active', order: 5,
        metadata: { location: 'Yantian Port → Long Beach', coordinates: { lat: 22.5660, lng: 114.2827 }, transport_mode: 'sea_freight', lead_time_days: 16 },
        ui_config: { icon: 'directions_boat', color: '#0D47A1', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Containers at Sea', unit: '', dataKey: 'at_sea', value: 1 }, { label: 'Transit Time', unit: 'days', dataKey: 'transit', value: 14 }, { label: 'Insurance', unit: '', dataKey: 'insurance', value: 'All-Risk' }] } },
          { type: 'map_view', args: { dataSource: 'shipments', showRoute: true, routes: [{ from: { lat: 22.5660, lng: 114.2827 }, to: { lat: 33.7519, lng: -118.1949 }, status: 'in_transit', label: 'COSCO CXDU-9182736' }] } },
          { type: 'timeline', args: { dataSource: 'shipping_events', showDate: true, data: [{ date: 'Apr 10', event: 'Container loaded at Yantian Port', status: 'success' }, { date: 'Apr 12', event: 'Vessel COSCO Shanghai departed', status: 'success' }, { date: 'Apr 18', event: 'Passed Yokohama — on schedule', status: 'info' }, { date: 'Apr 24', event: 'ETA Long Beach', status: 'pending' }] } },
        ]},
      },
      { id: 'node_7', name: 'US Distribution Center (Dallas, TX)', type: 'warehouse',
        description: 'Central US distribution hub with climate-controlled storage. Handles Amazon FBA prep, Shopify D2C, and B2B wholesale orders.',
        status: 'active', order: 6,
        metadata: { location: 'Dallas, TX, USA', coordinates: { lat: 32.7767, lng: -96.7970 }, capacity: '10,000 sq ft' },
        ui_config: { icon: 'warehouse', color: '#4A148C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units in Stock', unit: '', dataKey: 'stock', value: 8500 }, { label: 'Orders Today', unit: '', dataKey: 'orders', value: 89 }, { label: 'Amazon FBA Pending', unit: '', dataKey: 'fba', value: 2400 }, { label: 'Ship Accuracy', unit: '%', dataKey: 'accuracy', value: 99.8 }] } },
          { type: 'order_list', args: { columns: ['Order', 'Channel', 'Customer', 'Product', 'Qty', 'Status'], statusFilters: ['Pending', 'Picking', 'Shipped', 'Delivered'], dataSource: 'orders', data: [{ order: 'E-12891', channel: 'Amazon', customer: 'Mike T.', product: 'Smart Hub v2', qty: 1, status: 'Shipped' }, { order: 'E-12892', channel: 'Shopify', customer: 'Anna P.', product: 'Smart Hub v2 + Sensor Kit', qty: 1, status: 'Picking' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Weekly Sales by Channel', xAxis: 'week', yAxis: 'units', dataSource: 'channel_sales', data: [{ week: 'W14', units: 320 }, { week: 'W15', units: 380 }, { week: 'W16', units: 410 }, { week: 'W17', units: 445 }] } },
        ]},
      },
      { id: 'node_8', name: 'Customer Support & Returns (Austin, TX)', type: 'returns_center',
        description: 'RMA processing, warranty repairs, and customer support operations. Refurbished units are sold through outlet channel.',
        status: 'active', order: 7,
        metadata: { location: 'Austin, TX, USA', coordinates: { lat: 30.2672, lng: -97.7431 } },
        ui_config: { icon: 'support_agent', color: '#00695C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Open RMAs', unit: '', dataKey: 'rmas', value: 34 }, { label: 'Avg Resolution', unit: 'days', dataKey: 'resolution', value: 5.2 }, { label: 'CSAT Score', unit: '/5', dataKey: 'csat', value: 4.6 }, { label: 'Warranty Claims', unit: '/month', dataKey: 'claims', value: 12 }] } },
          { type: 'data_grid', args: { columns: ['RMA #', 'Order', 'Issue', 'Status', 'Resolution', 'Days Open'], dataSource: 'rmas', editable: false, data: [{ rma: 'RMA-2201', order: 'E-11845', issue: 'Display flicker', status: 'Repair Complete', resolution: 'Board replacement', days_open: 4 }, { rma: 'RMA-2202', order: 'E-12001', issue: 'WiFi connectivity', status: 'Diagnosed', resolution: 'FW update', days_open: 2 }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Return Reasons', xAxis: 'reason', yAxis: 'count', dataSource: 'return_reasons', data: [{ reason: 'Hardware Defect', count: 15 }, { reason: 'Software Issue', count: 8 }, { reason: 'Changed Mind', count: 6 }, { reason: 'Shipping Damage', count: 5 }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'air', estimated_days: 2 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'road', estimated_days: 1 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'processes_for', metadata: { transport_mode: 'road', estimated_days: 1 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'ships_to', metadata: { transport_mode: 'road_to_port', estimated_days: 1 } },
      { id: 'edge_6', source_node_id: 'node_6', target_node_id: 'node_7', relationship: 'ships_to', metadata: { transport_mode: 'sea_freight', estimated_days: 14 } },
      { id: 'edge_7', source_node_id: 'node_7', target_node_id: 'node_8', relationship: 'returns_to', metadata: { transport_mode: 'courier', estimated_days: 2 } },
    ],
  };
}

// ============================================================
// Food Chain — 8 nodes, California farm-to-table
// ============================================================
function getFoodChain(idea: string): SupplyChain {
  return {
    id: 'sc_food_001', name: 'Farm-to-Table Organic Food Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Organic Farm Cooperative (Sonoma County, CA)', type: 'raw_material_source',
        description: 'Network of 12 certified organic farms producing seasonal vegetables, herbs, and micro-greens. Regenerative agriculture practices with soil carbon sequestration.',
        status: 'active', order: 0,
        metadata: { location: 'Sonoma County, CA', coordinates: { lat: 38.2919, lng: -122.4580 }, certifications: ['USDA Organic', 'Regenerative Organic Silver'], capacity: '8,000 lbs/week' },
        ui_config: { icon: 'grass', color: '#33691E', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Weekly Harvest', unit: 'lbs', dataKey: 'harvest', value: 7200 }, { label: 'Active Farms', unit: '', dataKey: 'farms', value: 12 }, { label: 'Crop Varieties', unit: '', dataKey: 'varieties', value: 45 }, { label: 'Soil Health Score', unit: '/100', dataKey: 'soil', value: 88 }] } },
          { type: 'status_tracker', args: { stages: ['Soil Prep', 'Seeding', 'Growing', 'Harvesting', 'Field Wash', 'Cooling', 'Ready'], dataKey: 'stage', currentStage: 3 } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Weekly Harvest by Category (lbs)', xAxis: 'category', yAxis: 'lbs', dataSource: 'harvest', data: [{ category: 'Leafy Greens', lbs: 2800 }, { category: 'Root Vegetables', lbs: 1800 }, { category: 'Herbs', lbs: 900 }, { category: 'Tomatoes', lbs: 1200 }, { category: 'Micro-greens', lbs: 500 }] } },
          { type: 'inventory_table', args: { columns: ['Farm', 'Crop', 'Field', 'Planted', 'Est. Harvest', 'Yield (lbs)', 'Status'], dataSource: 'crops', sortable: true, filterable: true, data: [{ farm: 'Green Valley #3', crop: 'Baby Kale', field: 'F-12', planted: 'Mar 15', est_harvest: 'Apr 22', yield: 800, status: 'Harvesting' }, { farm: 'Sunrise Organic', crop: 'Heirloom Tomato', field: 'F-5', planted: 'Feb 20', est_harvest: 'May 10', yield: 1200, status: 'Growing' }, { farm: 'Redwood Hills', crop: 'Basil', field: 'F-8', planted: 'Mar 28', est_harvest: 'Apr 28', yield: 300, status: 'Growing' }] } },
          { type: 'notification_feed', args: { categories: ['Weather', 'Pest', 'Certification'], dataSource: 'farm_alerts', data: [{ category: 'Weather', message: 'Frost advisory tonight — cover tomato fields F-5, F-6', priority: 'high', time: '1 hour ago' }, { category: 'Pest', message: 'Aphid detection on F-12 kale — organic neem spray applied', priority: 'medium', time: '4 hours ago' }, { category: 'Certification', message: 'USDA Organic annual inspection confirmed for May 3', priority: 'low', time: '1 day ago' }] } },
        ]},
      },
      { id: 'node_2', name: 'USDA Organic Inspection Station', type: 'quality_control',
        description: 'On-site USDA food safety inspection. Tests for pesticide residue, E. coli, Salmonella, and verifies organic certification compliance.',
        status: 'active', order: 1,
        metadata: { location: 'Sonoma County, CA', coordinates: { lat: 38.2919, lng: -122.4580 }, certifications: ['USDA', 'GAP Certified'] },
        ui_config: { icon: 'biotech', color: '#F57F17', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Tests This Week', unit: '', dataKey: 'tests', value: 48 }, { label: 'Pass Rate', unit: '%', dataKey: 'pass', value: 99.2 }, { label: 'E.coli Clear', unit: '', dataKey: 'ecoli', value: '48/48' }, { label: 'Salmonella Clear', unit: '', dataKey: 'salmonella', value: '48/48' }] } },
          { type: 'approval_form', args: { title: 'Food Safety Release', fields: [{ name: 'lot', type: 'text', label: 'Lot Number', required: true }, { name: 'farm', type: 'text', label: 'Source Farm', required: true }, { name: 'ecoli', type: 'checkbox', label: 'E.coli Test Clear', required: true }, { name: 'salmonella', type: 'checkbox', label: 'Salmonella Test Clear', required: true }, { name: 'pesticide', type: 'checkbox', label: 'Pesticide Panel Clear', required: true }], actions: [{ label: 'Release for Distribution', action: 'release', variant: 'primary' }, { label: 'Hold — Retest Required', action: 'hold', variant: 'danger' }] } },
          { type: 'data_grid', args: { columns: ['Lot', 'Farm', 'Test', 'Result', 'Method', 'Date'], dataSource: 'food_safety', editable: false, data: [{ lot: 'L-2026-401', farm: 'Green Valley #3', test: 'E.coli O157:H7', result: 'Not Detected', method: 'PCR', date: 'Apr 20' }, { lot: 'L-2026-401', farm: 'Green Valley #3', test: 'Salmonella spp.', result: 'Not Detected', method: 'PCR', date: 'Apr 20' }, { lot: 'L-2026-402', farm: 'Sunrise Organic', test: 'Pesticide Panel (280)', result: 'All Clear', method: 'GC-MS', date: 'Apr 19' }] } },
        ]},
      },
      { id: 'node_3', name: 'Cold Chain Processing (Sacramento)', type: 'cold_storage',
        description: 'HACCP-certified cold chain facility maintaining 34-38°F. Produce washing, trimming, portioning, and vacuum-sealing for extended shelf life.',
        status: 'active', order: 2,
        metadata: { location: 'Sacramento, CA', coordinates: { lat: 38.5816, lng: -121.4944 }, temperature_range: '34-38°F', certifications: ['HACCP', 'SQF Level 3'] },
        ui_config: { icon: 'ac_unit', color: '#00838F', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Facility Temp', unit: '°F', dataKey: 'temp', value: 36.2 }, { label: 'Units in Cold Storage', unit: '', dataKey: 'units', value: 8500 }, { label: 'Shelf Life Remaining', unit: 'days (avg)', dataKey: 'shelf', value: 7.2 }, { label: 'HACCP Compliance', unit: '%', dataKey: 'haccp', value: 100 }] } },
          { type: 'inventory_table', args: { columns: ['Product', 'Lot', 'Weight (lbs)', 'Temp (°F)', 'Packed', 'Expires', 'Zone', 'Status'], dataSource: 'cold_inventory', sortable: true, filterable: true, data: [{ product: 'Baby Kale Mix', lot: 'L-2026-401', weight: 450, temp: 35.8, packed: 'Apr 20', expires: 'Apr 28', zone: 'C-1', status: 'Ready' }, { product: 'Heirloom Tomato', lot: 'L-2026-398', weight: 320, temp: 55, packed: 'Apr 18', expires: 'Apr 26', zone: 'C-3 (cool)', status: 'Ready' }, { product: 'Fresh Basil', lot: 'L-2026-400', weight: 120, temp: 50, packed: 'Apr 19', expires: 'Apr 24', zone: 'C-3 (cool)', status: '⚠️ Ship Today' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Cold Room Temperature Log (24hr)', xAxis: 'hour', yAxis: 'temp_f', dataSource: 'temp_log', data: [{ hour: '00:00', temp_f: 36.0 }, { hour: '04:00', temp_f: 35.8 }, { hour: '08:00', temp_f: 36.2 }, { hour: '12:00', temp_f: 36.5 }, { hour: '16:00', temp_f: 36.1 }, { hour: '20:00', temp_f: 35.9 }] } },
          { type: 'notification_feed', args: { categories: ['Temperature', 'Expiry', 'Equipment'], dataSource: 'cold_alerts', data: [{ category: 'Expiry', message: 'Fresh Basil L-2026-400 expires in 4 days — prioritize for delivery', priority: 'high', time: '30 min ago' }, { category: 'Temperature', message: 'Zone C-1 temp stable at 35.8°F ✅', priority: 'low', time: '1 hour ago' }, { category: 'Equipment', message: 'Compressor #2 scheduled maintenance in 3 days', priority: 'medium', time: '4 hours ago' }] } },
        ]},
      },
      { id: 'node_4', name: 'Meal Kit Assembly (Oakland)', type: 'packaging',
        description: 'Meal kit portioning, recipe card insertion, and insulated box packing. Each kit includes pre-measured ingredients for 2-4 servings.',
        status: 'active', order: 3,
        metadata: { location: 'Oakland, CA', coordinates: { lat: 37.8044, lng: -122.2712 }, capacity: '2,000 kits/day' },
        ui_config: { icon: 'restaurant', color: '#6A1B9A', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Kits Assembled Today', unit: '', dataKey: 'kits', value: 1450 }, { label: 'Recipes Active', unit: '', dataKey: 'recipes', value: 12 }, { label: 'Packaging Waste', unit: '%', dataKey: 'waste', value: 3.2 }, { label: 'Compostable Packaging', unit: '%', dataKey: 'compostable', value: 92 }] } },
          { type: 'status_tracker', args: { stages: ['Ingredients Pulled', 'Portioning', 'Recipe Cards', 'Box Packing', 'Ice Pack Insert', 'Sealed & Labeled', 'Ready for Pickup'], dataKey: 'stage', currentStage: 4 } },
          { type: 'inventory_table', args: { columns: ['Kit Name', 'Recipe', 'Servings', 'Assembled', 'Target', 'Status'], dataSource: 'kits', sortable: true, filterable: true, data: [{ kit_name: 'Mediterranean Bowl', recipe: 'R-042', servings: '2-person', assembled: 340, target: 400, status: 'In Progress' }, { kit_name: 'Farm Fresh Stir Fry', recipe: 'R-038', servings: '4-person', assembled: 280, target: 300, status: 'In Progress' }, { kit_name: 'Heirloom Caprese', recipe: 'R-051', servings: '2-person', assembled: 200, target: 200, status: '✅ Complete' }] } },
        ]},
      },
      { id: 'node_5', name: 'Refrigerated Distribution Hub (San Jose)', type: 'warehouse',
        description: 'Regional cold chain distribution center with zone-controlled temperature storage. Handles both B2B restaurant supply and D2C meal kit distribution.',
        status: 'active', order: 4,
        metadata: { location: 'San Jose, CA', coordinates: { lat: 37.3382, lng: -121.8863 }, capacity: '3,000 sq ft cold storage' },
        ui_config: { icon: 'warehouse', color: '#01579B', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Cold Storage Capacity', unit: '%', dataKey: 'capacity', value: 78 }, { label: 'B2B Orders', unit: '', dataKey: 'b2b', value: 24 }, { label: 'D2C Orders', unit: '', dataKey: 'd2c', value: 680 }, { label: 'Same-Day Routes', unit: '', dataKey: 'routes', value: 8 }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Distribution Mix', xAxis: 'channel', yAxis: 'orders', dataSource: 'dist_mix', data: [{ channel: 'D2C Meal Kits', orders: 680 }, { channel: 'Restaurant B2B', orders: 24 }, { channel: 'Grocery Wholesale', orders: 12 }, { channel: 'Farmers Market', orders: 8 }] } },
          { type: 'notification_feed', args: { categories: ['Route', 'Inventory', 'Temperature'], dataSource: 'dist_alerts', data: [{ category: 'Route', message: 'Route SF-North delayed — traffic on 101 (+25 min)', priority: 'medium', time: '15 min ago' }, { category: 'Inventory', message: 'Basil supply low — contact Redwood Hills for emergency harvest', priority: 'high', time: '1 hour ago' }] } },
        ]},
      },
      { id: 'node_6', name: 'Same-Day Delivery Fleet (Bay Area)', type: 'last_mile_delivery',
        description: 'Electric refrigerated van fleet for same-day delivery across the SF Bay Area. IoT temperature monitoring and live GPS tracking for every delivery.',
        status: 'active', order: 5,
        metadata: { location: 'San Francisco Bay Area, CA', coordinates: { lat: 37.7749, lng: -122.4194 } },
        ui_config: { icon: 'electric_bike', color: '#E65100', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Deliveries Today', unit: '', dataKey: 'deliveries', value: 342 }, { label: 'On Time', unit: '%', dataKey: 'on_time', value: 96.2 }, { label: 'Avg Delivery', unit: 'min', dataKey: 'avg_time', value: 28 }, { label: 'EV Fleet', unit: 'vans', dataKey: 'fleet', value: 8 }] } },
          { type: 'map_view', args: { dataSource: 'delivery_routes', showRoute: true, routes: [{ from: { lat: 37.3382, lng: -121.8863 }, to: { lat: 37.7749, lng: -122.4194 }, status: 'in_transit', label: 'Route SF-Central' }] } },
          { type: 'order_list', args: { columns: ['Order', 'Customer', 'Items', 'Window', 'Driver', 'ETA', 'Status'], statusFilters: ['Pending', 'Loading', 'En Route', 'Delivered'], dataSource: 'deliveries', data: [{ order: 'D-4301', customer: 'Lisa W. (Palo Alto)', items: 'Mediterranean Bowl x2', window: '4-6 PM', driver: 'Carlos M.', eta: '4:45 PM', status: 'En Route' }, { order: 'D-4302', customer: 'Amit K. (San Jose)', items: 'Farm Fresh Stir Fry', window: '5-7 PM', driver: 'Sarah J.', eta: '5:30 PM', status: 'Loading' }, { order: 'D-4303', customer: 'Restaurant Chez Papa', items: 'B2B: 50lb Mixed Greens', window: '6 AM', driver: 'Carlos M.', eta: 'Delivered', status: 'Delivered' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Deliveries per Day (Last 7 Days)', xAxis: 'day', yAxis: 'deliveries', dataSource: 'delivery_trend', data: [{ day: 'Mon', deliveries: 280 }, { day: 'Tue', deliveries: 310 }, { day: 'Wed', deliveries: 295 }, { day: 'Thu', deliveries: 340 }, { day: 'Fri', deliveries: 380 }, { day: 'Sat', deliveries: 420 }, { day: 'Sun', deliveries: 290 }] } },
        ]},
      },
      { id: 'node_7', name: 'B2B Restaurant Accounts', type: 'distributor',
        description: 'Wholesale distribution to 45+ Bay Area restaurants and cafés. Weekly standing orders with custom assortments and chef-direct communication.',
        status: 'active', order: 6,
        metadata: { location: 'San Francisco Bay Area', coordinates: { lat: 37.7749, lng: -122.4194 } },
        ui_config: { icon: 'storefront', color: '#880E4F', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Active Accounts', unit: '', dataKey: 'accounts', value: 47 }, { label: 'Weekly Revenue', unit: '$', dataKey: 'revenue', value: 28500 }, { label: 'Retention Rate', unit: '%', dataKey: 'retention', value: 94 }, { label: 'Avg Order Value', unit: '$', dataKey: 'aov', value: 420 }] } },
          { type: 'order_list', args: { columns: ['Account', 'Restaurant', 'Order Total', 'Delivery Day', 'Status'], statusFilters: ['Pending', 'Confirmed', 'Delivered', 'Invoice Sent'], dataSource: 'b2b_orders', data: [{ account: 'ACC-112', restaurant: 'Chez Papa (SF)', order_total: '$580', delivery_day: 'Mon/Thu', status: 'Confirmed' }, { account: 'ACC-089', restaurant: 'Blue Barn (Mill Valley)', order_total: '$340', delivery_day: 'Tue/Fri', status: 'Delivered' }] } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Top 5 Restaurant Accounts by Revenue', xAxis: 'restaurant', yAxis: 'monthly_revenue', dataSource: 'top_accounts', data: [{ restaurant: 'Chez Papa', monthly_revenue: 4200 }, { restaurant: 'State Bird', monthly_revenue: 3800 }, { restaurant: 'Blue Barn', monthly_revenue: 2900 }, { restaurant: 'Tartine', monthly_revenue: 2600 }, { restaurant: 'Foreign Cinema', monthly_revenue: 2200 }] } },
        ]},
      },
      { id: 'node_8', name: 'Composting & Waste Recovery', type: 'returns_center',
        description: 'Zero-waste initiative: unsold produce composted on partner farms. Packaging returned and recycled. Food waste tracked and reduced through AI demand forecasting.',
        status: 'active', order: 7,
        metadata: { location: 'Sonoma County, CA', coordinates: { lat: 38.2919, lng: -122.4580 } },
        ui_config: { icon: 'compost', color: '#4E342E', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Food Waste', unit: '%', dataKey: 'waste', value: 3.8 }, { label: 'Composted', unit: 'lbs/week', dataKey: 'composted', value: 280 }, { label: 'Packaging Recycled', unit: '%', dataKey: 'recycled', value: 88 }, { label: 'Carbon Offset', unit: 'tons CO2/yr', dataKey: 'carbon', value: 12.4 }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Food Waste Rate Trend (%)', xAxis: 'month', yAxis: 'waste_pct', dataSource: 'waste_trend', data: [{ month: 'Jan', waste_pct: 6.2 }, { month: 'Feb', waste_pct: 5.5 }, { month: 'Mar', waste_pct: 4.8 }, { month: 'Apr', waste_pct: 3.8 }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Waste Disposition', xAxis: 'type', yAxis: 'lbs', dataSource: 'waste_disposition', data: [{ type: 'Composted to Farms', lbs: 280 }, { type: 'Animal Feed', lbs: 45 }, { type: 'Food Bank Donation', lbs: 120 }, { type: 'Landfill (unavoidable)', lbs: 15 }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'inspects_for', metadata: { transport_mode: 'on_site', estimated_days: 0 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'refrigerated_truck', estimated_days: 1 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'processes_for', metadata: { transport_mode: 'refrigerated_truck', estimated_days: 0 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'packages_for', metadata: { transport_mode: 'refrigerated_truck', estimated_days: 0 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'delivers_to', metadata: { transport_mode: 'electric_van', estimated_days: 0 } },
      { id: 'edge_6', source_node_id: 'node_5', target_node_id: 'node_7', relationship: 'distributes_to', metadata: { transport_mode: 'refrigerated_truck', estimated_days: 0 } },
      { id: 'edge_7', source_node_id: 'node_6', target_node_id: 'node_8', relationship: 'returns_to', metadata: { transport_mode: 'return_pickup', estimated_days: 1 } },
    ],
  };
}

// ============================================================
// Pharma Chain — 8 nodes
// ============================================================
function getPharmaChain(idea: string): SupplyChain {
  return {
    id: 'sc_pharma_001', name: 'Pharmaceutical Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'API Manufacturer (Basel, Switzerland)', type: 'raw_material_source',
        description: 'Active Pharmaceutical Ingredient synthesis facility producing high-purity compounds under cGMP conditions. ICH Q7 compliant.',
        status: 'active', order: 0,
        metadata: { location: 'Basel, Switzerland', coordinates: { lat: 47.5596, lng: 7.5886 }, certifications: ['cGMP', 'ICH Q7', 'FDA Registered'], lead_time_days: 30 },
        ui_config: { icon: 'science', color: '#1565C0', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Purity', unit: '%', dataKey: 'purity', value: 99.8 }, { label: 'Batch Yield', unit: 'kg', dataKey: 'yield', value: 85 }, { label: 'Active Batches', unit: '', dataKey: 'batches', value: 4 }, { label: 'Lead Time', unit: 'weeks', dataKey: 'lead', value: 4 }] } },
          { type: 'status_tracker', args: { stages: ['Synthesis', 'Purification', 'Crystallization', 'QC Testing', 'Release', 'Shipped'], dataKey: 'stage', currentStage: 3 } },
          { type: 'data_grid', args: { columns: ['Batch', 'API', 'Purity', 'Yield', 'CoA', 'FDA Status', 'Release Date'], dataSource: 'api_batches', editable: false, data: [{ batch: 'API-2026-089', api: 'Compound XR-42', purity: '99.82%', yield: '85.2kg', coa: '✅ Issued', fda_status: 'Registered', release_date: 'Apr 22' }] } },
        ]},
      },
      { id: 'node_2', name: 'Excipient Supplier (Mumbai, India)', type: 'supplier',
        description: 'Pharmaceutical-grade excipient supplier providing binders, fillers, coatings, and capsule shells. USP/NF grade materials.',
        status: 'active', order: 1,
        metadata: { location: 'Mumbai, India', coordinates: { lat: 19.0760, lng: 72.8777 }, certifications: ['USP/NF', 'WHO GMP'] },
        ui_config: { icon: 'medication', color: '#F57F17', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Excipients in Stock', unit: 'types', dataKey: 'types', value: 28 }, { label: 'Supply Reliability', unit: '%', dataKey: 'reliability', value: 97 }, { label: 'Avg Lead Time', unit: 'days', dataKey: 'lead', value: 18 }] } },
          { type: 'inventory_table', args: { columns: ['Material', 'Grade', 'Lot', 'Qty (kg)', 'Expiry', 'CoA', 'Status'], dataSource: 'excipients', sortable: true, filterable: true, data: [{ material: 'Microcrystalline Cellulose', grade: 'USP/NF', lot: 'EX-4501', qty: 500, expiry: 'Dec 2027', coa: '✅', status: 'In Stock' }, { material: 'HPMC Coating', grade: 'USP/NF', lot: 'EX-4502', qty: 120, expiry: 'Mar 2028', coa: '✅', status: 'In Stock' }] } },
        ]},
      },
      { id: 'node_3', name: 'Formulation & Tableting (Hyderabad)', type: 'manufacturer',
        description: 'cGMP tablet manufacturing: wet granulation, compression, film coating, and serialization. 21 CFR Part 11 electronic batch records.',
        status: 'active', order: 2,
        metadata: { location: 'Hyderabad, India', coordinates: { lat: 17.3850, lng: 78.4867 }, certifications: ['cGMP', 'FDA Inspected', '21 CFR Part 11'], capacity: '5M tablets/month' },
        ui_config: { icon: 'factory', color: '#AD1457', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Tablets/Hour', unit: '', dataKey: 'hourly', value: 250000 }, { label: 'Batch Compliance', unit: '%', dataKey: 'compliance', value: 100 }, { label: 'Compression Force', unit: 'kN', dataKey: 'force', value: 12.5 }, { label: 'Coating Uniformity', unit: '%', dataKey: 'coating', value: 98.5 }] } },
          { type: 'status_tracker', args: { stages: ['Dispensing', 'Granulation', 'Blending', 'Compression', 'Coating', 'Inspection', 'Packaging', 'QC Release'], dataKey: 'stage', currentStage: 4 } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Tablet Weight Variation (mg)', xAxis: 'sample', yAxis: 'weight_mg', dataSource: 'ipc_data', data: [{ sample: 1, weight_mg: 500.2 }, { sample: 2, weight_mg: 499.8 }, { sample: 3, weight_mg: 500.5 }, { sample: 4, weight_mg: 500.1 }, { sample: 5, weight_mg: 499.7 }, { sample: 6, weight_mg: 500.3 }] } },
        ]},
      },
      { id: 'node_4', name: 'QC & Stability Lab (Hyderabad)', type: 'quality_control',
        description: 'Analytical testing lab: dissolution, assay (HPLC), content uniformity, microbial limits, and ICH stability studies.',
        status: 'active', order: 3,
        metadata: { location: 'Hyderabad, India', coordinates: { lat: 17.3850, lng: 78.4867 }, certifications: ['ISO 17025', 'FDA Registered'] },
        ui_config: { icon: 'biotech', color: '#2E7D32', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Assay Range', unit: '%', dataKey: 'assay', value: '98.5-101.2' }, { label: 'Dissolution Pass', unit: '%', dataKey: 'dissolution', value: 99.5 }, { label: 'Stability Studies', unit: 'active', dataKey: 'stability', value: 6 }, { label: 'OOS Events (YTD)', unit: '', dataKey: 'oos', value: 0 }] } },
          { type: 'approval_form', args: { title: 'Batch Release Certificate', fields: [{ name: 'batch', type: 'text', label: 'Batch Number', required: true }, { name: 'assay', type: 'text', label: 'Assay Result (%)', required: true }, { name: 'dissolution', type: 'text', label: 'Dissolution (%)', required: true }, { name: 'micro', type: 'select', label: 'Microbial Status', required: true, options: ['Within Limits', 'Out of Spec'] }, { name: 'qa_officer', type: 'text', label: 'QA Officer', required: true }], actions: [{ label: 'Release Batch', action: 'release', variant: 'primary' }, { label: 'Quarantine', action: 'quarantine', variant: 'danger' }] } },
          { type: 'data_grid', args: { columns: ['Batch', 'Test', 'Specification', 'Result', 'Status', 'Analyst'], dataSource: 'qc_results', editable: false, data: [{ batch: 'TAB-2026-312', test: 'Assay (HPLC)', specification: '95.0-105.0%', result: '99.8%', status: '✅ Pass', analyst: 'Dr. Reddy' }, { batch: 'TAB-2026-312', test: 'Dissolution (30 min)', specification: 'NLT 80%', result: '95.2%', status: '✅ Pass', analyst: 'Dr. Sharma' }] } },
        ]},
      },
      { id: 'node_5', name: 'Cold Chain Air Freight (India → US)', type: 'logistics',
        description: 'GDP-compliant temperature-controlled air freight. 2-8°C validated shipping with continuous data logger monitoring.',
        status: 'active', order: 4,
        metadata: { location: 'Rajiv Gandhi Intl Airport → JFK', coordinates: { lat: 17.2403, lng: 78.4294 }, transport_mode: 'air_freight', lead_time_days: 4 },
        ui_config: { icon: 'flight', color: '#4A148C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Shipments in Transit', unit: '', dataKey: 'transit', value: 1 }, { label: 'Temp Excursions', unit: '', dataKey: 'excursions', value: 0 }, { label: 'GDP Compliance', unit: '%', dataKey: 'gdp', value: 100 }] } },
          { type: 'map_view', args: { dataSource: 'pharma_shipments', showRoute: true, routes: [{ from: { lat: 17.2403, lng: 78.4294 }, to: { lat: 40.6413, lng: -73.7781 }, status: 'in_transit', label: 'Pharma Cargo AI-302' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'In-Transit Temperature Log (°C)', xAxis: 'hour', yAxis: 'temp_c', dataSource: 'temp_log', data: [{ hour: '0h', temp_c: 4.2 }, { hour: '4h', temp_c: 4.5 }, { hour: '8h', temp_c: 4.1 }, { hour: '12h', temp_c: 4.8 }, { hour: '16h', temp_c: 4.3 }] } },
        ]},
      },
      { id: 'node_6', name: 'FDA Import Inspection (JFK, New York)', type: 'customs',
        description: 'FDA import alert screening, prior notice verification, and drug product import clearance under 21 USC 331.',
        status: 'active', order: 5,
        metadata: { location: 'JFK Airport, New York', coordinates: { lat: 40.6413, lng: -73.7781 } },
        ui_config: { icon: 'security', color: '#B71C1C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'FDA Hold', unit: '', dataKey: 'hold', value: 0 }, { label: 'Cleared This Month', unit: '', dataKey: 'cleared', value: 8 }, { label: 'Avg Clearance', unit: 'hrs', dataKey: 'clearance', value: 12 }] } },
          { type: 'data_grid', args: { columns: ['Entry', 'Product', 'FDA Status', 'Import Alert', 'Duty', 'Released'], dataSource: 'fda_imports', editable: false, data: [{ entry: 'IMP-8901', product: 'XR-42 Tablets 500mg', fda_status: '✅ Released', import_alert: 'None', duty: '$0 (HTS exempt)', released: 'Apr 19' }] } },
          { type: 'document_upload', args: { acceptedTypes: ['application/pdf'], maxSizeMB: 20, label: 'Upload Drug Listing / Prior Notice Confirmation' } },
        ]},
      },
      { id: 'node_7', name: 'Pharma Distribution Center (New Jersey)', type: 'warehouse',
        description: 'DEA-licensed, cGMP-compliant pharmaceutical distribution center with serialization verification (DSCSA compliance).',
        status: 'active', order: 6,
        metadata: { location: 'Edison, NJ, USA', coordinates: { lat: 40.5187, lng: -74.4121 }, certifications: ['cGMP', 'DEA Licensed', 'DSCSA Compliant'] },
        ui_config: { icon: 'warehouse', color: '#0D47A1', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units in Stock', unit: '', dataKey: 'stock', value: 450000 }, { label: 'Serialized', unit: '%', dataKey: 'serialized', value: 100 }, { label: 'Temp Compliant', unit: '%', dataKey: 'temp', value: 100 }, { label: 'Orders/Day', unit: '', dataKey: 'orders', value: 120 }] } },
          { type: 'inventory_table', args: { columns: ['NDC', 'Product', 'Lot', 'Qty', 'Expiry', 'Temp Zone', 'Serial Range', 'Status'], dataSource: 'pharma_inventory', sortable: true, filterable: true, data: [{ ndc: '12345-678-90', product: 'XR-42 Tablets 500mg', lot: 'TAB-2026-312', qty: 150000, expiry: 'Apr 2028', temp_zone: 'CRT (20-25°C)', serial_range: 'SN-001 to SN-150000', status: 'Released' }] } },
          { type: 'qr_scanner', args: { outputField: 'serial_verification', label: 'Scan Serialized Unit for DSCSA Verification' } },
        ]},
      },
      { id: 'node_8', name: 'Pharmacy & Hospital Distribution', type: 'last_mile_delivery',
        description: 'Distribution to retail pharmacies (CVS, Walgreens), hospital systems, and specialty pharmacies. Same-day delivery for critical medications.',
        status: 'active', order: 7,
        metadata: { location: 'US Nationwide', coordinates: { lat: 40.7128, lng: -74.0060 } },
        ui_config: { icon: 'local_pharmacy', color: '#00695C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Pharmacies Served', unit: '', dataKey: 'pharmacies', value: 2400 }, { label: 'Weekly Shipments', unit: '', dataKey: 'shipments', value: 850 }, { label: 'Delivery Accuracy', unit: '%', dataKey: 'accuracy', value: 99.9 }, { label: 'Patient Reach', unit: 'K', dataKey: 'patients', value: 180 }] } },
          { type: 'order_list', args: { columns: ['PO', 'Account', 'Type', 'Products', 'Qty', 'Priority', 'Status'], statusFilters: ['Received', 'Picking', 'Shipped', 'Delivered'], dataSource: 'pharmacy_orders', data: [{ po: 'PH-44201', account: 'CVS #12847 (NYC)', type: 'Retail', products: 'XR-42 500mg', qty: 500, priority: 'Standard', status: 'Shipped' }, { po: 'PH-44202', account: 'Mount Sinai Hospital', type: 'Hospital', products: 'XR-42 500mg', qty: 2000, priority: 'Urgent', status: 'Picking' }] } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Monthly Distribution by Channel', xAxis: 'channel', yAxis: 'units', dataSource: 'channel_dist', data: [{ channel: 'Retail Pharmacy', units: 180000 }, { channel: 'Hospital', units: 95000 }, { channel: 'Specialty', units: 42000 }, { channel: 'Mail Order', units: 28000 }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'air_freight', estimated_days: 5 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'supplies_to', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'ships_to', metadata: { transport_mode: 'road_to_airport', estimated_days: 1 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'ships_to', metadata: { transport_mode: 'air_freight', estimated_days: 2 } },
      { id: 'edge_6', source_node_id: 'node_6', target_node_id: 'node_7', relationship: 'inspects_for', metadata: { transport_mode: 'bonded_truck', estimated_days: 1 } },
      { id: 'edge_7', source_node_id: 'node_7', target_node_id: 'node_8', relationship: 'distributes_to', metadata: { transport_mode: 'courier', estimated_days: 1 } },
    ],
  };
}

// ============================================================
// Automotive / EV Chain — 8 nodes
// ============================================================
function getAutomotiveChain(idea: string): SupplyChain {
  return {
    id: 'sc_auto_001', name: 'Electric Vehicle Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Lithium Mine (Atacama, Chile)', type: 'raw_material_source',
        description: 'Lithium carbonate extraction from Salar de Atacama brine pools. Producing battery-grade Li₂CO₃ (99.5% purity) for cathode manufacturing.',
        status: 'active', order: 0,
        metadata: { location: 'Atacama Desert, Chile', coordinates: { lat: -23.5, lng: -68.25 }, capacity: '40,000 tonnes/year', certifications: ['IRMA'] },
        ui_config: { icon: 'landscape', color: '#795548', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Monthly Output', unit: 'tonnes', dataKey: 'output', value: 3200 }, { label: 'Purity', unit: '%', dataKey: 'purity', value: 99.52 }, { label: 'Water Usage', unit: 'L/kg', dataKey: 'water', value: 1.8 }, { label: 'Spot Price', unit: '$/tonne', dataKey: 'price', value: 14500 }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Lithium Carbonate Price Trend ($/tonne)', xAxis: 'month', yAxis: 'price', dataSource: 'price_trend', data: [{ month: 'Jan', price: 16200 }, { month: 'Feb', price: 15800 }, { month: 'Mar', price: 15100 }, { month: 'Apr', price: 14500 }] } },
          { type: 'status_tracker', args: { stages: ['Brine Pumping', 'Evaporation Ponds', 'Chemical Processing', 'Purification', 'Drying', 'Bagged & Ready'], dataKey: 'stage', currentStage: 3 } },
        ]},
      },
      { id: 'node_2', name: 'Battery Cell Gigafactory (Changwon, South Korea)', type: 'manufacturer',
        description: 'LG Energy Solution partner facility producing NMC 811 prismatic cells. 50 GWh annual capacity with dry electrode technology.',
        status: 'active', order: 1,
        metadata: { location: 'Changwon, South Korea', coordinates: { lat: 35.2272, lng: 128.6811 }, capacity: '50 GWh/year', certifications: ['IATF 16949', 'ISO 14001'] },
        ui_config: { icon: 'battery_charging_full', color: '#1B5E20', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Cells/Day', unit: '', dataKey: 'daily', value: 150000 }, { label: 'Energy Density', unit: 'Wh/kg', dataKey: 'density', value: 285 }, { label: 'Defect Rate', unit: 'ppm', dataKey: 'defects', value: 8 }, { label: 'Cycle Life', unit: 'cycles', dataKey: 'cycles', value: 2000 }] } },
          { type: 'status_tracker', args: { stages: ['Electrode Coating', 'Cell Assembly', 'Electrolyte Fill', 'Formation', 'Aging (21 days)', 'EOL Testing', 'Module Pack'], dataKey: 'stage', currentStage: 4 } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Weekly Cell Production (thousands)', xAxis: 'week', yAxis: 'cells_k', dataSource: 'cell_output', data: [{ week: 'W14', cells_k: 980 }, { week: 'W15', cells_k: 1020 }, { week: 'W16', cells_k: 1050 }, { week: 'W17', cells_k: 1080 }] } },
        ]},
      },
      { id: 'node_3', name: 'EV Motor & Drivetrain (Munich, Germany)', type: 'manufacturer',
        description: 'Permanent magnet synchronous motor manufacturing and e-axle integration. 250kW motor with silicon carbide inverter.',
        status: 'active', order: 2,
        metadata: { location: 'Munich, Germany', coordinates: { lat: 48.1351, lng: 11.5820 }, certifications: ['IATF 16949'] },
        ui_config: { icon: 'settings', color: '#37474F', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Motors/Month', unit: '', dataKey: 'monthly', value: 4200 }, { label: 'Peak Power', unit: 'kW', dataKey: 'power', value: 250 }, { label: 'Efficiency', unit: '%', dataKey: 'efficiency', value: 97.2 }, { label: 'Torque', unit: 'Nm', dataKey: 'torque', value: 420 }] } },
          { type: 'inventory_table', args: { columns: ['Motor ID', 'Type', 'Power (kW)', 'Test Result', 'Destination', 'Status'], dataSource: 'motors', sortable: true, filterable: true, data: [{ motor_id: 'MTR-2026-4201', type: 'PMSM 250kW', power: 250, test_result: '✅ Pass', destination: 'Fremont Assembly', status: 'Shipped' }] } },
        ]},
      },
      { id: 'node_4', name: 'Vehicle Assembly Plant (Fremont, CA)', type: 'manufacturer',
        description: 'Final vehicle assembly: body-in-white, paint shop, battery pack integration, interior trim, and end-of-line testing. 2,000 vehicles/week capacity.',
        status: 'active', order: 3,
        metadata: { location: 'Fremont, CA, USA', coordinates: { lat: 37.4945, lng: -121.9424 }, capacity: '2,000 vehicles/week' },
        ui_config: { icon: 'precision_manufacturing', color: '#B71C1C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Vehicles/Day', unit: '', dataKey: 'daily', value: 285 }, { label: 'Line Speed', unit: 'JPH', dataKey: 'jph', value: 42 }, { label: 'First Time Quality', unit: '%', dataKey: 'ftq', value: 94.5 }, { label: 'Downtime', unit: 'min/shift', dataKey: 'downtime', value: 12 }] } },
          { type: 'status_tracker', args: { stages: ['Body-in-White', 'Paint Shop', 'Battery Integration', 'Drivetrain Install', 'Interior Trim', 'Final Assembly', 'EOL Testing', 'Ship Ready'], dataKey: 'stage', currentStage: 5 } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Daily Vehicle Output', xAxis: 'day', yAxis: 'vehicles', dataSource: 'output', data: [{ day: 'Mon', vehicles: 280 }, { day: 'Tue', vehicles: 295 }, { day: 'Wed', vehicles: 278 }, { day: 'Thu', vehicles: 290 }, { day: 'Fri', vehicles: 285 }] } },
        ]},
      },
      { id: 'node_5', name: 'Safety & Crash Testing (Fremont)', type: 'quality_control',
        description: 'NHTSA FMVSS and Euro NCAP crash testing verification. ADAS calibration, water ingress, and high-voltage safety validation.',
        status: 'active', order: 4,
        metadata: { location: 'Fremont, CA', coordinates: { lat: 37.4945, lng: -121.9424 }, certifications: ['NHTSA', 'Euro NCAP', 'SAE J1772'] },
        ui_config: { icon: 'health_and_safety', color: '#E65100', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'NCAP Rating', unit: '⭐', dataKey: 'ncap', value: 5 }, { label: 'Tests This Month', unit: '', dataKey: 'tests', value: 34 }, { label: 'HV Safety Pass', unit: '%', dataKey: 'hv_pass', value: 100 }, { label: 'ADAS Calibration', unit: '%', dataKey: 'adas', value: 99.8 }] } },
          { type: 'data_grid', args: { columns: ['Test', 'Standard', 'VIN', 'Result', 'Score', 'Date'], dataSource: 'safety_tests', editable: false, data: [{ test: 'Frontal Offset Crash', standard: 'FMVSS 208', vin: 'VIN...4201', result: '✅ Pass', score: '96%', date: 'Apr 18' }, { test: 'Side Barrier', standard: 'FMVSS 214', vin: 'VIN...4201', result: '✅ Pass', score: '94%', date: 'Apr 18' }] } },
        ]},
      },
      { id: 'node_6', name: 'Vehicle Logistics (Rail & Truck)', type: 'logistics',
        description: 'Multi-modal vehicle transportation: auto-rack rail cars for long-haul and enclosed car haulers for regional delivery to dealership network.',
        status: 'active', order: 5,
        metadata: { location: 'Fremont, CA → US Nationwide', coordinates: { lat: 37.4945, lng: -121.9424 }, transport_mode: 'rail_and_truck' },
        ui_config: { icon: 'train', color: '#0D47A1', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Vehicles in Transit', unit: '', dataKey: 'transit', value: 1800 }, { label: 'Rail Cars Active', unit: '', dataKey: 'rail', value: 24 }, { label: 'Avg Delivery', unit: 'days', dataKey: 'delivery', value: 8 }, { label: 'Damage Rate', unit: '%', dataKey: 'damage', value: 0.1 }] } },
          { type: 'map_view', args: { dataSource: 'vehicle_shipments', showRoute: true, routes: [{ from: { lat: 37.4945, lng: -121.9424 }, to: { lat: 40.7128, lng: -74.0060 }, status: 'in_transit', label: 'Rail: Fremont → NJ Hub' }, { from: { lat: 37.4945, lng: -121.9424 }, to: { lat: 29.7604, lng: -95.3698 }, status: 'in_transit', label: 'Truck: CA → TX' }] } },
        ]},
      },
      { id: 'node_7', name: 'Regional Delivery Centers (US)', type: 'warehouse',
        description: 'Vehicle delivery hubs in major metros. Pre-delivery inspection (PDI), detailing, accessory installation, and customer handoff.',
        status: 'active', order: 6,
        metadata: { location: 'US Major Metro Areas', coordinates: { lat: 34.0522, lng: -118.2437 } },
        ui_config: { icon: 'store', color: '#4A148C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Vehicles at Centers', unit: '', dataKey: 'inventory', value: 3200 }, { label: 'Deliveries/Week', unit: '', dataKey: 'weekly', value: 1800 }, { label: 'PDI Complete', unit: '%', dataKey: 'pdi', value: 92 }, { label: 'Customer CSAT', unit: '/5', dataKey: 'csat', value: 4.7 }] } },
          { type: 'order_list', args: { columns: ['Order', 'Customer', 'Model', 'Config', 'Center', 'Delivery Date', 'Status'], statusFilters: ['In Transit', 'At Center', 'PDI Done', 'Scheduled', 'Delivered'], dataSource: 'deliveries', data: [{ order: 'VEH-89201', customer: 'Alex K.', model: 'EV-S Long Range', config: 'White / Black Int', center: 'Los Angeles', delivery_date: 'Apr 25', status: 'PDI Done' }, { order: 'VEH-89202', customer: 'Maria S.', model: 'EV-S Performance', config: 'Red / White Int', center: 'New York', delivery_date: 'Apr 28', status: 'In Transit' }] } },
        ]},
      },
      { id: 'node_8', name: 'Service & Parts Network', type: 'returns_center',
        description: 'Nationwide service center network for warranty repairs, OTA update support, and spare parts distribution. Mobile service fleet for at-home repairs.',
        status: 'active', order: 7,
        metadata: { location: 'US Nationwide', coordinates: { lat: 37.7749, lng: -122.4194 } },
        ui_config: { icon: 'build_circle', color: '#00695C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Service Centers', unit: '', dataKey: 'centers', value: 85 }, { label: 'Open Work Orders', unit: '', dataKey: 'work_orders', value: 420 }, { label: 'Parts Fill Rate', unit: '%', dataKey: 'fill', value: 96 }, { label: 'Mobile Repairs/Day', unit: '', dataKey: 'mobile', value: 180 }] } },
          { type: 'data_grid', args: { columns: ['WO #', 'VIN', 'Issue', 'Type', 'Parts Needed', 'ETA Parts', 'Status'], dataSource: 'work_orders', editable: false, data: [{ wo: 'WO-88901', vin: '...4182', issue: 'Door handle alignment', type: 'Warranty', parts_needed: 'Handle Assembly', eta_parts: 'In Stock', status: 'Scheduled' }, { wo: 'WO-88902', vin: '...4095', issue: '12V battery replacement', type: 'Maintenance', parts_needed: '12V LFP Battery', eta_parts: 'In Stock', status: 'In Progress' }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Service Type Distribution', xAxis: 'type', yAxis: 'count', dataSource: 'service_types', data: [{ type: 'Warranty Repair', count: 180 }, { type: 'Scheduled Maintenance', count: 120 }, { type: 'Collision Repair', count: 45 }, { type: 'Software/OTA', count: 75 }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'sea_freight', estimated_days: 21 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_4', relationship: 'supplies_to', metadata: { transport_mode: 'sea_freight', estimated_days: 18 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'supplies_to', metadata: { transport_mode: 'air_freight', estimated_days: 3 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'ships_to', metadata: { transport_mode: 'rail', estimated_days: 1 } },
      { id: 'edge_6', source_node_id: 'node_6', target_node_id: 'node_7', relationship: 'distributes_to', metadata: { transport_mode: 'rail_and_truck', estimated_days: 7 } },
      { id: 'edge_7', source_node_id: 'node_7', target_node_id: 'node_8', relationship: 'returns_to', metadata: { transport_mode: 'customer_drive', estimated_days: 0 } },
    ],
  };
}

// ============================================================
// DTC Consumer Goods — 8 nodes, generic fallback
// ============================================================
function getDTCConsumerGoodsChain(idea: string): SupplyChain {
  return {
    id: 'sc_dtc_001', name: 'D2C Consumer Goods Supply Chain', business_idea: idea, status: 'active', created_at: new Date().toISOString(),
    nodes: [
      { id: 'node_1', name: 'Raw Material Sourcing (Global)', type: 'supplier',
        description: 'Diversified raw material procurement from vetted global suppliers. Dual-source strategy for supply chain resilience.',
        status: 'active', order: 0,
        metadata: { location: 'Multiple Locations', coordinates: { lat: 31.2304, lng: 121.4737 }, lead_time_days: 14 },
        ui_config: { icon: 'inventory_2', color: '#5D4037', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Active Suppliers', unit: '', dataKey: 'suppliers', value: 12 }, { label: 'Avg Lead Time', unit: 'days', dataKey: 'lead', value: 14 }, { label: 'Quality Score', unit: '/100', dataKey: 'quality', value: 92 }, { label: 'Cost Savings YTD', unit: '%', dataKey: 'savings', value: 8 }] } },
          { type: 'data_grid', args: { columns: ['Supplier', 'Material', 'Origin', 'Price/Unit', 'Lead Time', 'Rating', 'Backup'], dataSource: 'suppliers', editable: false, data: [{ supplier: 'GlobalMat Inc.', material: 'Base Material Alpha', origin: 'China', price_unit: '$2.50', lead_time: '12 days', rating: '4.5/5', backup: 'AltSupply Co.' }, { supplier: 'EuroSource GmbH', material: 'Specialty Component B', origin: 'Germany', price_unit: '$8.20', lead_time: '18 days', rating: '4.8/5', backup: 'AsiaComp Ltd.' }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Sourcing by Region', xAxis: 'region', yAxis: 'spend', dataSource: 'sourcing_mix', data: [{ region: 'East Asia', spend: 45 }, { region: 'Europe', spend: 30 }, { region: 'Domestic', spend: 20 }, { region: 'South Asia', spend: 5 }] } },
          { type: 'notification_feed', args: { categories: ['Price Alert', 'Lead Time', 'Quality'], dataSource: 'supplier_alerts', data: [{ category: 'Price Alert', message: 'Base Material Alpha price up 5% — review alternatives', priority: 'medium', time: '2 days ago' }, { category: 'Quality', message: 'EuroSource GmbH passed annual audit — rating maintained at 4.8', priority: 'low', time: '1 week ago' }] } },
        ]},
      },
      { id: 'node_2', name: 'Manufacturing & Assembly (Dongguan, China)', type: 'manufacturer',
        description: 'Contract manufacturing facility with 6 production lines. ISO 9001 certified with automated quality inspection stations.',
        status: 'active', order: 1,
        metadata: { location: 'Dongguan, China', coordinates: { lat: 23.0208, lng: 113.7518 }, capacity: '50,000 units/month', certifications: ['ISO 9001', 'ISO 14001'] },
        ui_config: { icon: 'factory', color: '#C62828', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Daily Output', unit: 'units', dataKey: 'output', value: 1800 }, { label: 'OEE', unit: '%', dataKey: 'oee', value: 84 }, { label: 'Defect Rate', unit: '%', dataKey: 'defects', value: 1.2 }, { label: 'Lines Active', unit: '/6', dataKey: 'lines', value: 5 }] } },
          { type: 'status_tracker', args: { stages: ['Material Prep', 'Molding', 'Assembly', 'QA Inspect', 'Finishing', 'Packaging', 'Palletized'], dataKey: 'stage', currentStage: 3 } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Weekly Production vs Target', xAxis: 'week', yAxis: 'units', dataSource: 'production', data: [{ week: 'W14', units: 11800 }, { week: 'W15', units: 12200 }, { week: 'W16', units: 11500 }, { week: 'W17', units: 12800 }] } },
          { type: 'inventory_table', args: { columns: ['PO #', 'Product', 'Qty Ordered', 'Produced', 'Packed', 'Ship Date', 'Status'], dataSource: 'production_orders', sortable: true, filterable: true, data: [{ po: 'PO-4001', product: 'Premium Widget v2', qty_ordered: 10000, produced: 8200, packed: 7500, ship_date: 'Apr 28', status: 'On Track' }, { po: 'PO-4002', product: 'Accessory Pack', qty_ordered: 5000, produced: 2100, packed: 1800, ship_date: 'May 5', status: 'On Track' }] } },
        ]},
      },
      { id: 'node_3', name: 'Quality Assurance & Testing', type: 'quality_control',
        description: 'In-line and end-of-line automated quality inspection. AQL 1.5 sampling with visual AI defect detection and functional testing.',
        status: 'active', order: 2,
        metadata: { location: 'Dongguan, China', coordinates: { lat: 23.0208, lng: 113.7518 }, certifications: ['ISO 9001'] },
        ui_config: { icon: 'verified', color: '#2E7D32', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Pass Rate', unit: '%', dataKey: 'pass', value: 98.8 }, { label: 'AI Defect Detection', unit: 'accuracy %', dataKey: 'ai_accuracy', value: 99.2 }, { label: 'Units Tested Today', unit: '', dataKey: 'tested', value: 1750 }, { label: 'Rework Queue', unit: '', dataKey: 'rework', value: 22 }] } },
          { type: 'approval_form', args: { title: 'Shipment QA Release', fields: [{ name: 'po', type: 'text', label: 'PO Number', required: true }, { name: 'sample_size', type: 'text', label: 'Sample Size', required: true }, { name: 'defects_found', type: 'text', label: 'Defects Found', required: true }, { name: 'result', type: 'select', label: 'AQL Result', required: true, options: ['Pass', 'Conditional', 'Fail'] }], actions: [{ label: 'Release', action: 'release', variant: 'primary' }, { label: 'Hold', action: 'hold', variant: 'danger' }] } },
          { type: 'analytics_chart', args: { chartType: 'bar', title: 'Defect Categories (Last 30 Days)', xAxis: 'category', yAxis: 'count', dataSource: 'defects', data: [{ category: 'Cosmetic', count: 45 }, { category: 'Functional', count: 12 }, { category: 'Dimensional', count: 8 }, { category: 'Packaging', count: 18 }] } },
        ]},
      },
      { id: 'node_4', name: 'Ocean Freight (China → US)', type: 'logistics',
        description: 'FCL container shipping from Yantian Port to Port of Long Beach. 14-day Pacific crossing with carbon-neutral shipping option.',
        status: 'active', order: 3,
        metadata: { location: 'Yantian → Long Beach', coordinates: { lat: 22.5660, lng: 114.2827 }, transport_mode: 'sea_freight', lead_time_days: 16 },
        ui_config: { icon: 'directions_boat', color: '#0D47A1', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'At Sea', unit: 'containers', dataKey: 'at_sea', value: 2 }, { label: 'Transit Time', unit: 'days', dataKey: 'transit', value: 14 }, { label: 'On Schedule', unit: '%', dataKey: 'schedule', value: 88 }, { label: 'Carbon Offset', unit: '✅', dataKey: 'carbon', value: 'Active' }] } },
          { type: 'map_view', args: { dataSource: 'shipments', showRoute: true, routes: [{ from: { lat: 22.5660, lng: 114.2827 }, to: { lat: 33.7519, lng: -118.1949 }, status: 'in_transit', label: 'COSCO CSLU-4928173' }] } },
          { type: 'order_list', args: { columns: ['Container', 'POs', 'Departed', 'ETA', 'Status'], statusFilters: ['Loading', 'In Transit', 'At Port', 'Cleared'], dataSource: 'containers', data: [{ container: 'CSLU-4928173', pos: 'PO-4001', departed: 'Apr 12', eta: 'Apr 26', status: 'In Transit' }] } },
        ]},
      },
      { id: 'node_5', name: 'US Customs Clearance (Long Beach)', type: 'customs',
        description: 'CBP clearance, duty payment, and regulatory compliance verification at Port of Long Beach.',
        status: 'active', order: 4,
        metadata: { location: 'Long Beach, CA', coordinates: { lat: 33.7519, lng: -118.1949 } },
        ui_config: { icon: 'gavel', color: '#BF360C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Avg Clearance', unit: 'hrs', dataKey: 'clearance', value: 18 }, { label: 'Duty Rate', unit: '%', dataKey: 'duty', value: 4.5 }, { label: 'Cleared MTD', unit: '', dataKey: 'cleared', value: 6 }] } },
          { type: 'document_upload', args: { acceptedTypes: ['application/pdf', 'image/jpeg'], maxSizeMB: 15, label: 'Upload Commercial Invoice & Packing List' } },
          { type: 'timeline', args: { dataSource: 'customs_events', showDate: true, data: [{ date: 'Apr 26 06:00', event: 'Vessel arrived Long Beach', status: 'success' }, { date: 'Apr 26 10:00', event: 'Container offloaded', status: 'success' }, { date: 'Apr 26 14:00', event: 'CBP inspection — Released', status: 'success' }, { date: 'Apr 27 08:00', event: 'Truck pickup to warehouse', status: 'pending' }] } },
        ]},
      },
      { id: 'node_6', name: 'Distribution Warehouse (Dallas, TX)', type: 'warehouse',
        description: 'Central US fulfillment center with WMS integration. Handles Amazon FBA prep, Shopify D2C, and B2B wholesale distribution.',
        status: 'active', order: 5,
        metadata: { location: 'Dallas, TX', coordinates: { lat: 32.7767, lng: -96.7970 }, capacity: '8,000 sq ft' },
        ui_config: { icon: 'warehouse', color: '#4A148C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Units in Stock', unit: '', dataKey: 'stock', value: 18500 }, { label: 'Orders/Day', unit: '', dataKey: 'orders', value: 220 }, { label: 'Pick Accuracy', unit: '%', dataKey: 'accuracy', value: 99.7 }, { label: 'Space Used', unit: '%', dataKey: 'space', value: 68 }] } },
          { type: 'inventory_table', args: { columns: ['SKU', 'Product', 'Qty', 'Reorder Point', 'Zone', 'Days of Supply', 'Status'], dataSource: 'inventory', sortable: true, filterable: true, data: [{ sku: 'PRD-V2-001', product: 'Premium Widget v2', qty: 12500, reorder_point: 3000, zone: 'A-1', days_of_supply: 42, status: 'In Stock' }, { sku: 'ACC-PKG-001', product: 'Accessory Pack', qty: 4200, reorder_point: 1000, zone: 'B-2', days_of_supply: 35, status: 'In Stock' }, { sku: 'PRD-V1-001', product: 'Widget v1 (Legacy)', qty: 180, reorder_point: 0, zone: 'C-1', days_of_supply: 8, status: '🔴 Clearance' }] } },
          { type: 'analytics_chart', args: { chartType: 'line', title: 'Inventory Turnover (Weeks of Supply)', xAxis: 'month', yAxis: 'weeks', dataSource: 'turnover', data: [{ month: 'Jan', weeks: 8.2 }, { month: 'Feb', weeks: 7.5 }, { month: 'Mar', weeks: 6.8 }, { month: 'Apr', weeks: 6.0 }] } },
          { type: 'notification_feed', args: { categories: ['Stock', 'Orders', 'Shipping'], dataSource: 'warehouse_alerts', data: [{ category: 'Orders', message: 'Amazon FBA replenishment due — 2,400 units to ship by Apr 28', priority: 'high', time: '1 hour ago' }, { category: 'Stock', message: 'Legacy Widget v1 at 180 units — mark for clearance pricing', priority: 'medium', time: '3 hours ago' }] } },
        ]},
      },
      { id: 'node_7', name: 'Multi-Channel Fulfillment', type: 'fulfillment_center',
        description: 'Omnichannel order processing: Shopify, Amazon, Walmart, and B2B wholesale. Branded packaging with handwritten notes for DTC orders.',
        status: 'active', order: 6,
        metadata: { location: 'Dallas, TX', coordinates: { lat: 32.7767, lng: -96.7970 }, shipping_partners: ['USPS', 'FedEx', 'UPS', 'Amazon Logistics'] },
        ui_config: { icon: 'deployed_code', color: '#AD1457', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Orders Today', unit: '', dataKey: 'orders', value: 220 }, { label: 'Shipped', unit: '', dataKey: 'shipped', value: 185 }, { label: 'Avg Pick-to-Ship', unit: 'hrs', dataKey: 'pick_ship', value: 3.8 }, { label: 'Return Rate', unit: '%', dataKey: 'returns', value: 3.2 }] } },
          { type: 'order_list', args: { columns: ['Order', 'Channel', 'Customer', 'Items', 'Total', 'Carrier', 'Status'], statusFilters: ['Pending', 'Picking', 'Packed', 'Shipped', 'Delivered'], dataSource: 'orders', data: [{ order: 'ORD-22401', channel: 'Shopify', customer: 'Alex K.', items: '1x Premium Widget v2', total: '$49.99', carrier: 'USPS Priority', status: 'Shipped' }, { order: 'ORD-22402', channel: 'Amazon', customer: 'Prime Customer', items: '2x Accessory Pack', total: '$29.98', carrier: 'Amazon Logistics', status: 'Picking' }, { order: 'WHL-1204', channel: 'B2B Wholesale', customer: 'RetailCo (500 units)', items: '500x Premium Widget v2', total: '$17,500', carrier: 'FedEx Freight', status: 'Packed' }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Revenue by Channel', xAxis: 'channel', yAxis: 'revenue', dataSource: 'channel_revenue', data: [{ channel: 'Shopify DTC', revenue: 42 }, { channel: 'Amazon', revenue: 35 }, { channel: 'B2B Wholesale', revenue: 18 }, { channel: 'Walmart', revenue: 5 }] } },
        ]},
      },
      { id: 'node_8', name: 'Customer Support & Returns', type: 'returns_center',
        description: 'Returns processing, warranty claims, and customer support. Returned items inspected, refurbished, or recycled. 30-day hassle-free return policy.',
        status: 'active', order: 7,
        metadata: { location: 'Dallas, TX', coordinates: { lat: 32.7767, lng: -96.7970 } },
        ui_config: { icon: 'support_agent', color: '#00695C', page_components: [
          { type: 'kpi_card_row', args: { cards: [{ label: 'Returns MTD', unit: '', dataKey: 'returns', value: 142 }, { label: 'Resolution Time', unit: 'hrs', dataKey: 'resolution', value: 18 }, { label: 'CSAT', unit: '/5', dataKey: 'csat', value: 4.4 }, { label: 'Refurb Rate', unit: '%', dataKey: 'refurb', value: 72 }] } },
          { type: 'analytics_chart', args: { chartType: 'pie', title: 'Return Reasons', xAxis: 'reason', yAxis: 'count', dataSource: 'return_reasons', data: [{ reason: 'Changed Mind', count: 52 }, { reason: 'Defective', count: 38 }, { reason: 'Wrong Item', count: 22 }, { reason: 'Shipping Damage', count: 18 }, { reason: 'Not as Described', count: 12 }] } },
          { type: 'data_grid', args: { columns: ['Return ID', 'Order', 'Reason', 'Condition', 'Action', 'Refund', 'Date'], dataSource: 'returns', editable: false, data: [{ return_id: 'RET-3301', order: 'ORD-21890', reason: 'Changed Mind', condition: 'Like New', action: 'Restocked', refund: '$49.99', date: 'Apr 19' }, { return_id: 'RET-3302', order: 'ORD-21745', reason: 'Defective (cosmetic)', condition: 'Minor Scratch', action: 'Refurbished → Outlet', refund: '$49.99', date: 'Apr 18' }] } },
        ]},
      },
    ],
    edges: [
      { id: 'edge_1', source_node_id: 'node_1', target_node_id: 'node_2', relationship: 'supplies_to', metadata: { transport_mode: 'road', estimated_days: 3 } },
      { id: 'edge_2', source_node_id: 'node_2', target_node_id: 'node_3', relationship: 'inspects_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_3', source_node_id: 'node_3', target_node_id: 'node_4', relationship: 'ships_to', metadata: { transport_mode: 'road_to_port', estimated_days: 1 } },
      { id: 'edge_4', source_node_id: 'node_4', target_node_id: 'node_5', relationship: 'ships_to', metadata: { transport_mode: 'sea_freight', estimated_days: 14 } },
      { id: 'edge_5', source_node_id: 'node_5', target_node_id: 'node_6', relationship: 'inspects_for', metadata: { transport_mode: 'truck', estimated_days: 3 } },
      { id: 'edge_6', source_node_id: 'node_6', target_node_id: 'node_7', relationship: 'stores_for', metadata: { transport_mode: 'internal', estimated_days: 0 } },
      { id: 'edge_7', source_node_id: 'node_7', target_node_id: 'node_8', relationship: 'returns_to', metadata: { transport_mode: 'courier', estimated_days: 3 } },
    ],
  };
}
