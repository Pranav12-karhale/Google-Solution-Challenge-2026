import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';
import '../models/supply_chain.dart';
import '../models/risk_models.dart';
import '../providers/supply_chain_provider.dart';
import '../widgets/registry/widget_registry.dart';
import '../widgets/disruption_alert_dialog.dart';
import '../widgets/risk_badge.dart';
import '../widgets/risk_dashboard.dart';
import '../widgets/settings_dialog.dart';

class ChainScreen extends StatefulWidget {
  const ChainScreen({super.key});

  @override
  State<ChainScreen> createState() => _ChainScreenState();
}

class _ChainScreenState extends State<ChainScreen> with TickerProviderStateMixin {
  late AnimationController _sidebarController;
  late AnimationController _contentController;
  final Map<int, String> _selectedOptionByStage = {};

  @override
  void initState() {
    super.initState();
    _sidebarController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    )..forward();
    _contentController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    )..forward();
  }

  @override
  void dispose() {
    _sidebarController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SupplyChainProvider>();
    final chain = provider.currentChain;
    final selectedNode = provider.selectedNode;
    final isWide = MediaQuery.of(context).size.width > 900;

    if (chain == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    // Sync selected option per stage
    if (provider.selectedNodeId != null) {
      try {
        final node = chain.nodes.firstWhere((n) => n.id == provider.selectedNodeId);
        _selectedOptionByStage[node.order] = node.id;
      } catch (_) {}
    }

    return Scaffold(
      body: Row(
        children: [
          // Sidebar navigation (dynamic from nodes)
          SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(-1, 0),
              end: Offset.zero,
            ).animate(CurvedAnimation(
              parent: _sidebarController,
              curve: Curves.easeOutCubic,
            )),
            child: _buildSidebar(chain, provider, selectedNode, isWide),
          ),

          // Divider
          Container(width: 1, color: AppTheme.borderColor),

          // Main content
          Expanded(
            child: selectedNode != null
                ? _buildNodeDetail(selectedNode, provider)
                : _buildChainOverview(chain),
          ),
        ],
      ),

      // FAB — two actions: Scan for Risks (auto) + Simulate Disruption (manual)
      floatingActionButton: chain.nodes.isNotEmpty
          ? Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                // Auto-detect scan button
                FloatingActionButton.extended(
                  heroTag: 'scan',
                  onPressed: provider.isScanning
                      ? null
                      : () async {
                          await provider.scanForRisks();
                          if (provider.error != null && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Scan failed: ${provider.error}')),
                            );
                          }
                        },
                  backgroundColor: AppTheme.accentTeal,
                  icon: provider.isScanning
                      ? const SizedBox(
                          width: 18, height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Icon(Icons.radar),
                  label: Text(provider.isScanning ? 'Scanning...' : 'Scan for Risks'),
                ),
                const SizedBox(height: 12),
                // Manual simulation button
                FloatingActionButton.extended(
                  heroTag: 'simulate',
                  onPressed: () => _showDisruptionTriggerDialog(context, provider, chain),
                  backgroundColor: AppTheme.error,
                  icon: Icon(Icons.bolt),
                  label: Text('Simulate Disruption'),
                ),
              ],
            )
          : null,
    );
  }

  Widget _buildSidebar(SupplyChain chain, SupplyChainProvider provider,
      SupplyChainNode? selectedNode, bool isWide) {
    return Container(
      width: isWide ? 280 : 240,
      color: AppTheme.bgCard,
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: AppTheme.glassGradient,
              border: Border(bottom: BorderSide(color: AppTheme.borderColor)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.of(context).pushReplacementNamed('/'),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          gradient: AppTheme.primaryGradient,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(Icons.hub, color: Colors.white, size: 20),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            chain.name,
                            style: GoogleFonts.outfit(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            '${chain.nodes.length} nodes • ${chain.edges.length} connections',
                            style: TextStyle(
                              color: AppTheme.textMuted,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Status badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.statusColor(chain.status).withAlpha(26),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppTheme.statusColor(chain.status),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        chain.status.toUpperCase(),
                        style: TextStyle(
                          color: AppTheme.statusColor(chain.status),
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Overview button
          _SidebarItem(
            icon: Icons.account_tree_outlined,
            label: 'Chain Overview',
            isSelected: selectedNode == null,
            color: AppTheme.accentBlue,
            onTap: () {
              provider.selectNode('');
              _contentController.reset();
              _contentController.forward();
            },
          ),

          Expanded(
            child: Builder(
              builder: (context) {
                // Group nodes by order to show only one node per stage in sidebar
                final Map<int, List<SupplyChainNode>> groupedNodes = {};
                for (var node in chain.nodes) {
                  groupedNodes.putIfAbsent(node.order, () => []).add(node);
                }
                
                final List<SupplyChainNode> sidebarNodes = [];
                final sortedOrders = groupedNodes.keys.toList()..sort();
                
                for (var order in sortedOrders) {
                  final nodesInStage = groupedNodes[order]!;
                  final primaryId = _selectedOptionByStage[order];
                  SupplyChainNode? primaryNode;
                  
                  if (primaryId != null) {
                    try {
                      primaryNode = nodesInStage.firstWhere((n) => n.id == primaryId);
                    } catch (_) {}
                  }
                  
                  primaryNode ??= nodesInStage.first;
                  sidebarNodes.add(primaryNode);
                }

                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Row(
                        children: [
                          Text(
                            'SUPPLY CHAIN NODES',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textMuted,
                              letterSpacing: 1,
                            ),
                          ),
                          const Spacer(),
                          Text(
                            '${sidebarNodes.length}',
                            style: TextStyle(color: AppTheme.textMuted, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    // Node list
                    Expanded(
                      child: ListView.builder(
                        itemCount: sidebarNodes.length,
                        padding: const EdgeInsets.only(bottom: 80),
                        itemBuilder: (context, index) {
                          final node = sidebarNodes[index];
                          final isSelected = node.id == provider.selectedNodeId;
                          final nodeRisk = provider.riskForNode(node.id);

                          return _SidebarNodeItem(
                            node: node,
                            isSelected: isSelected,
                            index: index,
                            riskScore: nodeRisk?.overallRisk,
                            animationController: _sidebarController,
                            onTap: () {
                              provider.selectNode(node.id);
                              _contentController.reset();
                              _contentController.forward();
                            },
                          );
                        },
                      ),
                    ),
                  ],
                );
              }
            ),
          ),

          // Bottom Actions
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: AppTheme.borderColor)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextButton.icon(
                    onPressed: () {
                      provider.clearChain();
                      Navigator.of(context).pushReplacementNamed('/');
                    },
                    icon: Icon(Icons.arrow_back, size: 18),
                    label: Text('New Supply Chain'),
                    style: TextButton.styleFrom(
                      foregroundColor: AppTheme.textMuted,
                      alignment: Alignment.centerLeft,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => const SettingsDialog(),
                    );
                  },
                  icon: Icon(Icons.settings, size: 18),
                  tooltip: 'Settings',
                  style: IconButton.styleFrom(
                    foregroundColor: AppTheme.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChainOverview(SupplyChain chain) {
    return FadeTransition(
      opacity: CurvedAnimation(parent: _contentController, curve: Curves.easeOut),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Supply Chain Overview',
              style: GoogleFonts.outfit(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              chain.businessIdea,
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 15),
            ),
            const SizedBox(height: 32),

            // Chain flow visualization
            _buildChainFlow(chain),

            const SizedBox(height: 32),

            // Risk Dashboard (if scan data exists)
            Builder(
              builder: (context) {
                final provider = context.watch<SupplyChainProvider>();
                if (provider.hasRiskData) {
                  return Column(
                    children: [
                      RiskDashboard(
                        report: provider.riskReport!,
                        onFixRisk: (riskResult) {
                          // Auto-create a disruption event from the risk
                          final topRisk = riskResult.topRisk;
                          if (topRisk == null) return;
                          final event = DisruptionEvent(
                            id: 'auto_${DateTime.now().millisecondsSinceEpoch}',
                            type: topRisk.category,
                            severity: riskResult.overallRisk >= 7 ? 'critical' : 'high',
                            description: '${topRisk.headline}: ${topRisk.explanation}',
                            affectedNodeIds: [riskResult.nodeId],
                            affectedEdgeIds: [],
                          );
                          _showAutoDisruptionDialog(context, provider, event, topRisk.recommendedAction);
                        },
                      ),
                      const SizedBox(height: 32),
                    ],
                  );
                }
                return const SizedBox.shrink();
              },
            ),

            // Summary cards
            LayoutBuilder(
              builder: (context, constraints) {
                final cols = constraints.maxWidth > 700 ? 3 : 2;
                return GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: cols,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 2.2,
                  children: [
                    _SummaryCard(
                      icon: Icons.hub,
                      label: 'Total Nodes',
                      value: '${chain.nodes.length}',
                      color: AppTheme.accentBlue,
                    ),
                    _SummaryCard(
                      icon: Icons.swap_calls,
                      label: 'Connections',
                      value: '${chain.edges.length}',
                      color: AppTheme.accentTeal,
                    ),
                    _SummaryCard(
                      icon: Icons.check_circle_outline,
                      label: 'Active Nodes',
                      value: '${chain.nodes.where((n) => n.status == "active").length}',
                      color: AppTheme.success,
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChainFlow(SupplyChain chain) {
    final provider = context.read<SupplyChainProvider>();
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: AppTheme.cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.account_tree, color: AppTheme.accentTeal, size: 20),
              const SizedBox(width: 8),
              Text(
                'Supply Chain Flow',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Builder(builder: (context) {
              final Map<int, List<SupplyChainNode>> groupedNodes = {};
              for (var node in chain.nodes) {
                groupedNodes.putIfAbsent(node.order, () => []).add(node);
              }
              final sortedOrders = groupedNodes.keys.toList()..sort();

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: sortedOrders.asMap().entries.map((entry) {
                  final order = entry.value;
                  final nodesInStage = groupedNodes[order]!;
                  final isLast = entry.key == sortedOrders.length - 1;
                  
                  String primaryNodeId = _selectedOptionByStage[order] ?? nodesInStage.first.id;
                  if (!nodesInStage.any((n) => n.id == primaryNodeId)) {
                    primaryNodeId = nodesInStage.first.id;
                  }

                  return Row(
                    children: [
                      // Stage Column (for multiple options via hover)
                      _HoverDropdownNode(
                        nodes: nodesInStage,
                        provider: provider,
                        getIconData: _getIconData,
                        primaryNodeId: primaryNodeId,
                      ),
                      // Arrow
                      if (!isLast)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Icon(
                            Icons.arrow_forward,
                            color: AppTheme.textMuted,
                            size: 24,
                          ),
                        ),
                    ],
                  );
                }).toList(),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildNodeDetail(SupplyChainNode node, SupplyChainProvider provider) {
    final nodeColor = node.uiConfig.colorValue;

    return FadeTransition(
      opacity: CurvedAnimation(parent: _contentController, curve: Curves.easeOut),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Node header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: nodeColor.withAlpha(26),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: nodeColor.withAlpha(51)),
                  ),
                  child: Icon(
                    _getIconData(node.uiConfig.icon),
                    color: nodeColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        node.name,
                        style: GoogleFonts.outfit(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: nodeColor.withAlpha(26),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              node.type.replaceAll('_', ' ').toUpperCase(),
                              style: TextStyle(
                                color: nodeColor,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.statusColor(node.status).withAlpha(26),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AppTheme.statusColor(node.status),
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  node.status.toUpperCase(),
                                  style: TextStyle(
                                    color: AppTheme.statusColor(node.status),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 8),
            Text(
              node.description,
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
            ),

            // Metadata chips
            if (node.metadata.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: node.metadata.entries
                    .where((e) => e.value is String || e.value is num)
                    .take(5)
                    .map((e) => Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: AppTheme.bgSurface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppTheme.borderColor),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                '${_formatKey(e.key)}: ',
                                style: TextStyle(
                                  color: AppTheme.textMuted,
                                  fontSize: 11,
                                ),
                              ),
                              Text(
                                e.value.toString(),
                                style: TextStyle(
                                  color: nodeColor,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ))
                    .toList(),
              ),
            ],

            if (node.metadata['coordinates'] != null &&
                !(node.metadata['location']?.toString().contains('In Transit') ?? false) &&
                !node.name.contains('In Transit') &&
                !(node.metadata['coordinates']['lat'] == 0 && node.metadata['coordinates']['lng'] == 0)) ...[
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => _launchMap(context, provider.currentChain!, node),
                icon: const Icon(Icons.map, size: 18),
                label: const Text('View Map on Google Maps'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: nodeColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],

            const SizedBox(height: 24),

            // Risk Assessment (if available)
            Builder(
              builder: (context) {
                final prov = context.watch<SupplyChainProvider>();
                final nodeRisk = prov.riskForNode(node.id);
                if (nodeRisk == null) return const SizedBox.shrink();
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildNodeRiskSection(nodeRisk),
                    const SizedBox(height: 24),
                  ],
                );
              },
            ),

            Divider(color: AppTheme.borderColor),
            const SizedBox(height: 24),

            // ── Dynamic page components rendered from JSON ──
            ...node.uiConfig.pageComponents.map((component) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: WidgetRegistry.build(
                  component.type,
                  component.args,
                  accentColor: nodeColor,
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Future<void> _launchMap(BuildContext context, SupplyChain chain, SupplyChainNode node) async {
    final uniqueOrders = chain.nodes.map((n) => n.order).toSet().length;
    final bool isAllOptions = chain.nodes.length > uniqueOrders;
    
    if (isAllOptions) {
      // For all options: plot entire chain
      final validNodes = chain.nodes.where((n) {
        final loc = n.metadata['location']?.toString() ?? '';
        final name = n.name;
        if (loc.contains('In Transit') || name.contains('In Transit')) return false;
        
        final coords = n.metadata['coordinates'];
        if (coords == null || coords['lat'] == null || coords['lng'] == null) return false;
        if (coords['lat'] == 0 && coords['lng'] == 0) return false;
        
        return true;
      }).toList();
      
      validNodes.sort((a, b) => a.order.compareTo(b.order));
      
      if (validNodes.length >= 2) {
        final origin = validNodes.first.metadata['coordinates'];
        final destination = validNodes.last.metadata['coordinates'];
        
        final waypoints = validNodes.sublist(1, validNodes.length - 1).map((n) {
          final c = n.metadata['coordinates'];
          return '${c['lat']},${c['lng']}';
        }).join('|');
        
        String url = 'https://www.google.com/maps/dir/?api=1&origin=${origin['lat']},${origin['lng']}&destination=${destination['lat']},${destination['lng']}';
        if (waypoints.isNotEmpty) {
          url += '&waypoints=$waypoints';
        }
        
        final uri = Uri.parse(url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri);
        }
      } else if (validNodes.isNotEmpty) {
        final c = validNodes.first.metadata['coordinates'];
        final url = 'https://www.google.com/maps/search/?api=1&query=${c['lat']},${c['lng']}';
        final uri = Uri.parse(url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri);
        }
      }
    } else {
      // Best route: show specific node
      final coords = node.metadata['coordinates'];
      if (coords != null) {
        final url = 'https://www.google.com/maps/search/?api=1&query=${coords['lat']},${coords['lng']}';
        final uri = Uri.parse(url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri);
        }
      }
    }
  }

  void _showDisruptionTriggerDialog(BuildContext context, SupplyChainProvider provider, SupplyChain chain) {
    String selectedType = 'climate';
    String? selectedNodeId = chain.nodes.isNotEmpty ? chain.nodes.first.id : null;
    final descriptionController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: AppTheme.bgCard,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Row(
                children: [
                  Icon(Icons.bolt, color: AppTheme.error),
                  const SizedBox(width: 8),
                  Text('Simulate Disruption', style: TextStyle(color: AppTheme.textPrimary)),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Select a disruption category and target node.',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: selectedType,
                    dropdownColor: AppTheme.bgCard,
                    decoration: InputDecoration(labelText: 'Disruption Type', filled: true),
                    items: const [
                      DropdownMenuItem(value: 'geopolitical', child: Text('Geopolitical (War, Tariffs)')),
                      DropdownMenuItem(value: 'climate', child: Text('Climate (Hurricane, Flood)')),
                      DropdownMenuItem(value: 'transport', child: Text('Logistics (Port Congestion)')),
                      DropdownMenuItem(value: 'cyber', child: Text('Cyber (Ransomware)')),
                    ],
                    onChanged: (val) => setState(() => selectedType = val!),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedNodeId,
                    dropdownColor: AppTheme.bgCard,
                    decoration: InputDecoration(labelText: 'Target Node', filled: true),
                    items: chain.nodes.map((n) => DropdownMenuItem(value: n.id, child: Text(n.name))).toList(),
                    onChanged: (val) => setState(() => selectedNodeId = val),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: descriptionController,
                    maxLines: 2,
                    decoration: InputDecoration(hintText: 'Describe the event...'),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    if (selectedNodeId == null || descriptionController.text.isEmpty) return;
                    Navigator.pop(context);
                    
                    final event = DisruptionEvent(
                      id: 'event_${DateTime.now().millisecondsSinceEpoch}',
                      type: selectedType,
                      severity: 'critical',
                      description: descriptionController.text,
                      affectedNodeIds: [selectedNodeId!],
                      affectedEdgeIds: [],
                    );
                    
                    try {
                      await provider.triggerDisruption(event);
                      _showActiveDisruptionDialog(context, provider, event);
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.error),
                  child: Text('Trigger'),
                ),
              ],
            );
          }
        );
      },
    );
  }

  void _showActiveDisruptionDialog(BuildContext context, SupplyChainProvider provider, DisruptionEvent event) {
    MitigationAction? mitigation;
    bool isLoading = false;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return DisruptionAlertDialog(
              disruption: event,
              mitigation: mitigation,
              isLoadingMitigation: isLoading,
              onResolve: () async {
                setState(() => isLoading = true);
                try {
                  mitigation = await provider.resolveDisruption(event);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to resolve: $e')));
                } finally {
                  setState(() => isLoading = false);
                }
              },
              onExecute: () async {
                if (mitigation == null) return;
                try {
                  await provider.executeMitigation(mitigation!);
                  Navigator.pop(context); // Close dialog
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mitigation executed successfully.')));
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to execute: $e')));
                }
              },
              onDismiss: () => Navigator.pop(context),
            );
          }
        );
      }
    );
  }

  /// Dialog for auto-detected risks (from "Fix This" button)
  void _showAutoDisruptionDialog(BuildContext context, SupplyChainProvider provider, DisruptionEvent event, String recommendation) {
    MitigationAction? mitigation;
    bool isLoading = false;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return DisruptionAlertDialog(
              disruption: event,
              mitigation: mitigation,
              isLoadingMitigation: isLoading,
              onResolve: () async {
                setState(() => isLoading = true);
                try {
                  await provider.triggerDisruption(event);
                  mitigation = await provider.resolveDisruption(event);
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                  }
                } finally {
                  setState(() => isLoading = false);
                }
              },
              onExecute: () async {
                if (mitigation == null) return;
                try {
                  await provider.executeMitigation(mitigation!);
                  if (context.mounted) {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Mitigation executed successfully.')),
                    );
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                  }
                }
              },
              onDismiss: () => Navigator.pop(context),
            );
          },
        );
      },
    );
  }

  /// Risk section displayed in node detail view
  Widget _buildNodeRiskSection(RiskScanResult nodeRisk) {
    final color = nodeRisk.overallRisk >= 7
        ? const Color(0xFFEF4444)
        : nodeRisk.overallRisk >= 4
            ? const Color(0xFFF59E0B)
            : const Color(0xFF22C55E);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withAlpha(40)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.shield_outlined, color: color, size: 18),
              const SizedBox(width: 8),
              Text(
                'Risk Assessment',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
              const Spacer(),
              RiskBadge(riskScore: nodeRisk.overallRisk, showLabel: true),
            ],
          ),
          if (nodeRisk.risks.isNotEmpty) ...[
            const SizedBox(height: 12),
            ...nodeRisk.risks.map((risk) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RiskBadge(riskScore: risk.score, size: 6),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${risk.headline} (${risk.score.toStringAsFixed(1)})',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          risk.explanation,
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: AppTheme.textSecondary,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            )),
          ],
        ],
      ),
    );
  }

  String _formatKey(String key) {
    return key.replaceAll('_', ' ').split(' ').map((w) =>
        w.isNotEmpty ? '${w[0].toUpperCase()}${w.substring(1)}' : '').join(' ');
  }

  IconData _getIconData(String iconName) {
    final iconMap = {
      'agriculture': Icons.agriculture,
      'science': Icons.science,
      'precision_manufacturing': Icons.precision_manufacturing,
      'local_shipping': Icons.local_shipping,
      'warehouse': Icons.warehouse,
      'deployed_code': Icons.inventory,
      'factory': Icons.factory,
      'memory': Icons.memory,
      'build': Icons.build,
      'verified': Icons.verified,
      'verified_user': Icons.verified_user,
      'design_services': Icons.design_services,
      'texture': Icons.texture,
      'grass': Icons.grass,
      'ac_unit': Icons.ac_unit,
      'electric_bike': Icons.electric_bike,
      'inventory_2': Icons.inventory_2,
      'emergency': Icons.emergency,
      'hub': Icons.hub,
      'table_chart': Icons.table_chart,
      'timeline': Icons.timeline,
      'map': Icons.map,
      'upload_file': Icons.upload_file,
      'qr_code_scanner': Icons.qr_code_scanner,
      'grid_view': Icons.grid_view,
      'notifications': Icons.notifications,
      'receipt_long': Icons.receipt_long,
      'show_chart': Icons.show_chart,
      'pie_chart': Icons.pie_chart,
      'assignment': Icons.assignment,
      // New icons for expanded chains
      'flight': Icons.flight,
      'gavel': Icons.gavel,
      'security': Icons.security,
      'recycling': Icons.recycling,
      'directions_boat': Icons.directions_boat,
      'support_agent': Icons.support_agent,
      'storefront': Icons.storefront,
      'compost': Icons.compost,
      'restaurant': Icons.restaurant,
      'biotech': Icons.biotech,
      'local_pharmacy': Icons.local_pharmacy,
      'medication': Icons.medication,
      'category': Icons.category,
      'developer_board': Icons.developer_board,
      'build_circle': Icons.build_circle,
      'landscape': Icons.landscape,
      'battery_charging_full': Icons.battery_charging_full,
      'settings': Icons.settings,
      'health_and_safety': Icons.health_and_safety,
      'train': Icons.train,
      'store': Icons.store,
    };
    return iconMap[iconName] ?? Icons.circle_outlined;
  }
}

class _SidebarItem extends StatefulWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final Color color;
  final VoidCallback onTap;

  const _SidebarItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.color,
    required this.onTap,
  });

  @override
  State<_SidebarItem> createState() => _SidebarItemState();
}

class _SidebarItemState extends State<_SidebarItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: widget.isSelected
                ? widget.color.withAlpha(26)
                : _isHovered
                    ? AppTheme.bgCardHover
                    : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: widget.isSelected
                ? Border.all(color: widget.color.withAlpha(51))
                : null,
          ),
          child: Row(
            children: [
              Icon(widget.icon,
                  color: widget.isSelected ? widget.color : AppTheme.textMuted,
                  size: 18),
              const SizedBox(width: 10),
              Text(widget.label, style: TextStyle(
                color: widget.isSelected ? AppTheme.textPrimary : AppTheme.textSecondary,
                fontSize: 13,
                fontWeight: widget.isSelected ? FontWeight.w600 : FontWeight.w400,
              )),
            ],
          ),
        ),
      ),
    );
  }
}

class _SidebarNodeItem extends StatefulWidget {
  final SupplyChainNode node;
  final bool isSelected;
  final int index;
  final double? riskScore;
  final AnimationController animationController;
  final VoidCallback onTap;

  const _SidebarNodeItem({
    required this.node,
    required this.isSelected,
    required this.index,
    this.riskScore,
    required this.animationController,
    required this.onTap,
  });

  @override
  State<_SidebarNodeItem> createState() => _SidebarNodeItemState();
}

class _SidebarNodeItemState extends State<_SidebarNodeItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final nodeColor = widget.node.uiConfig.colorValue;

    final staggerDelay = (widget.index * 0.08).clamp(0.0, 0.5);
    final itemProgress = ((widget.animationController.value - staggerDelay) / (1 - staggerDelay)).clamp(0.0, 1.0);

    return Transform.translate(
      offset: Offset(-30 * (1 - itemProgress), 0),
      child: Opacity(
        opacity: itemProgress,
        child: MouseRegion(
          onEnter: (_) => setState(() => _isHovered = true),
          onExit: (_) => setState(() => _isHovered = false),
          child: GestureDetector(
            onTap: widget.onTap,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: widget.isSelected
                    ? nodeColor.withAlpha(20)
                    : _isHovered
                        ? AppTheme.bgCardHover
                        : Colors.transparent,
                borderRadius: BorderRadius.circular(10),
                border: widget.isSelected
                    ? Border.all(color: nodeColor.withAlpha(64))
                    : null,
              ),
              child: Row(
                children: [
                  // Color dot
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: nodeColor,
                      boxShadow: widget.isSelected
                          ? [BoxShadow(color: nodeColor.withAlpha(77), blurRadius: 6)]
                          : [],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.node.name,
                          style: TextStyle(
                            color: widget.isSelected
                                ? AppTheme.textPrimary
                                : AppTheme.textSecondary,
                            fontSize: 13,
                            fontWeight: widget.isSelected
                                ? FontWeight.w600
                                : FontWeight.w400,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          widget.node.type.replaceAll('_', ' '),
                          style: TextStyle(
                            color: AppTheme.textMuted,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Risk badge or component count
                  if (widget.riskScore != null)
                    RiskBadge(riskScore: widget.riskScore!, size: 8)
                  else
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppTheme.bgSurface,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '${widget.node.uiConfig.pageComponents.length}',
                        style: TextStyle(
                          color: AppTheme.textMuted,
                          fontSize: 10,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _SummaryCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: color),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: 22),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(value, style: GoogleFonts.outfit(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              )),
              const SizedBox(width: 8),
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(label, style: TextStyle(
                  color: AppTheme.textMuted, fontSize: 12,
                )),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _HoverDropdownNode extends StatefulWidget {
  final List<SupplyChainNode> nodes;
  final SupplyChainProvider provider;
  final IconData Function(String) getIconData;
  final String primaryNodeId;

  const _HoverDropdownNode({
    required this.nodes,
    required this.provider,
    required this.getIconData,
    required this.primaryNodeId,
  });

  @override
  State<_HoverDropdownNode> createState() => _HoverDropdownNodeState();
}

class _HoverDropdownNodeState extends State<_HoverDropdownNode> {
  final LayerLink _link = LayerLink();
  OverlayEntry? _entry;
  bool _isHovered = false;

  void _showOverlay() {
    if (_entry != null || widget.nodes.length <= 1) return;
    _entry = OverlayEntry(
      builder: (context) {
        return Positioned(
          width: 220,
          child: CompositedTransformFollower(
            link: _link,
            showWhenUnlinked: false,
            offset: const Offset(0, 120), // Below the node card
            child: MouseRegion(
              onEnter: (_) => _isHovered = true,
              onExit: (_) {
                _isHovered = false;
                _hideOverlayDelayed();
              },
              child: Material(
                elevation: 12,
                color: AppTheme.bgCard,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: AppTheme.borderColor),
                ),
                child: Container(
                  constraints: const BoxConstraints(maxHeight: 250),
                  child: ListView.builder(
                    shrinkWrap: true,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: widget.nodes.length,
                    itemBuilder: (context, index) {
                      final node = widget.nodes[index];
                      if (node.id == widget.primaryNodeId) return const SizedBox.shrink(); // hide primary
                      final color = node.uiConfig.colorValue;
                      return ListTile(
                        leading: Icon(widget.getIconData(node.uiConfig.icon), color: color, size: 20),
                        title: Text(node.name, style: TextStyle(color: AppTheme.textPrimary, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
                        subtitle: Text(node.type.replaceAll('_', ' '), style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                        onTap: () {
                          widget.provider.selectNode(node.id);
                          _hideOverlay();
                        },
                      );
                    },
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
    Overlay.of(context).insert(_entry!);
  }

  void _hideOverlay() {
    _entry?.remove();
    _entry = null;
  }

  void _hideOverlayDelayed() {
    Future.delayed(const Duration(milliseconds: 150), () {
      if (!_isHovered && mounted) _hideOverlay();
    });
  }

  @override
  void dispose() {
    _hideOverlay();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.nodes.isEmpty) return const SizedBox.shrink();
    
    int primaryIndex = widget.nodes.indexWhere((n) => n.id == widget.primaryNodeId);
    if (primaryIndex == -1) primaryIndex = 0;

    final node = widget.nodes[primaryIndex];
    final nodeColor = node.uiConfig.colorValue;

    return CompositedTransformTarget(
      link: _link,
      child: MouseRegion(
        onEnter: (_) {
          _isHovered = true;
          _showOverlay();
        },
        onExit: (_) {
          _isHovered = false;
          _hideOverlayDelayed();
        },
        child: Container(
          width: 150,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: nodeColor.withAlpha(13),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: nodeColor.withAlpha(51)),
          ),
          child: Column(
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: nodeColor.withAlpha(26),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      widget.getIconData(node.uiConfig.icon),
                      color: nodeColor,
                      size: 22,
                    ),
                  ),
                  if (widget.nodes.length > 1)
                    Positioned(
                      right: -6,
                      top: -6,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppTheme.accentBlue,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          '+${widget.nodes.length - 1}',
                          style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                node.name,
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: nodeColor.withAlpha(26),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  node.type.replaceAll('_', ' '),
                  style: TextStyle(
                    color: nodeColor,
                    fontSize: 9,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
