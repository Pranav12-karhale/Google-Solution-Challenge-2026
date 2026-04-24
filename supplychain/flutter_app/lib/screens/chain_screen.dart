import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/supply_chain.dart';
import '../providers/supply_chain_provider.dart';
import '../widgets/registry/widget_registry.dart';

class ChainScreen extends StatefulWidget {
  const ChainScreen({super.key});

  @override
  State<ChainScreen> createState() => _ChainScreenState();
}

class _ChainScreenState extends State<ChainScreen> with TickerProviderStateMixin {
  late AnimationController _sidebarController;
  late AnimationController _contentController;

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

      // FAB for adding crisis node
      floatingActionButton: chain.nodes.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () => _showCrisisDialog(context, provider),
              backgroundColor: AppTheme.error,
              icon: const Icon(Icons.add_alert),
              label: const Text('Add Crisis Node'),
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
                        child: const Icon(Icons.hub, color: Colors.white, size: 20),
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
                            style: const TextStyle(
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
                  '${chain.nodes.length}',
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 10),
                ),
              ],
            ),
          ),

          // Node list (dynamically generated from data)
          Expanded(
            child: ListView.builder(
              itemCount: chain.nodes.length,
              padding: const EdgeInsets.only(bottom: 80),
              itemBuilder: (context, index) {
                final node = chain.nodes[index];
                final isSelected = node.id == provider.selectedNodeId;

                return _SidebarNodeItem(
                  node: node,
                  isSelected: isSelected,
                  index: index,
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

          // Back button
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: AppTheme.borderColor)),
            ),
            child: TextButton.icon(
              onPressed: () {
                provider.clearChain();
                Navigator.of(context).pushReplacementNamed('/');
              },
              icon: const Icon(Icons.arrow_back, size: 18),
              label: const Text('New Supply Chain'),
              style: TextButton.styleFrom(foregroundColor: AppTheme.textMuted),
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
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 15),
            ),
            const SizedBox(height: 32),

            // Chain flow visualization
            _buildChainFlow(chain),

            const SizedBox(height: 32),

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
            child: Row(
              children: chain.nodes.asMap().entries.map((entry) {
                final node = entry.value;
                final isLast = entry.key == chain.nodes.length - 1;
                final nodeColor = node.uiConfig.colorValue;

                return Row(
                  children: [
                    // Node card
                    Container(
                      width: 150,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: nodeColor.withAlpha(13),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: nodeColor.withAlpha(51)),
                      ),
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: nodeColor.withAlpha(26),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              _getIconData(node.uiConfig.icon),
                              color: nodeColor,
                              size: 22,
                            ),
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
                    // Arrow
                    if (!isLast)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Icon(
                          Icons.arrow_forward,
                          color: AppTheme.textMuted,
                          size: 20,
                        ),
                      ),
                  ],
                );
              }).toList(),
            ),
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
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14),
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
                                style: const TextStyle(
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

            const SizedBox(height: 24),
            const Divider(color: AppTheme.borderColor),
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

  void _showCrisisDialog(BuildContext context, SupplyChainProvider provider) {
    final controller = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.bgCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: AppTheme.error),
            const SizedBox(width: 8),
            const Text('Add Crisis Response Node',
                style: TextStyle(color: AppTheme.textPrimary)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Describe the supply chain disruption. AI will generate a crisis resolution node with appropriate dashboards.',
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'e.g., "Shipping port closure in Shanghai"',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (controller.text.trim().isNotEmpty) {
                provider.addCrisisNode(controller.text.trim());
                Navigator.pop(context);
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.error),
            child: const Text('Generate Crisis Node'),
          ),
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
  final AnimationController animationController;
  final VoidCallback onTap;

  const _SidebarNodeItem({
    required this.node,
    required this.isSelected,
    required this.index,
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
                  // Component count
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.bgSurface,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      '${widget.node.uiConfig.pageComponents.length}',
                      style: const TextStyle(
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
                child: Text(label, style: const TextStyle(
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
