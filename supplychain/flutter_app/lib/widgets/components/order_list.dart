import 'package:flutter/material.dart';
import '../../config/theme.dart';

class OrderList extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const OrderList({super.key, required this.args, this.accentColor});

  @override
  State<OrderList> createState() => _OrderListState();
}

class _OrderListState extends State<OrderList> {
  String _selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final columns = (widget.args['columns'] as List? ?? []).cast<String>();
    final statusFilters = (widget.args['statusFilters'] as List? ?? []).cast<String>();
    final data = (widget.args['data'] as List? ?? []).cast<Map<String, dynamic>>();
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    final filteredData = _selectedFilter == 'All'
        ? data
        : data.where((row) {
            return row.values.any((v) =>
                v.toString().toLowerCase() == _selectedFilter.toLowerCase());
          }).toList();

    return Container(
      decoration: AppTheme.cardDecoration(accentColor: accent),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.receipt_long, color: accent, size: 20),
                    const SizedBox(width: 8),
                    Text('Orders', style: TextStyle(
                      color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600,
                    )),
                    const Spacer(),
                    Text('${filteredData.length} items',
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                  ],
                ),
                if (statusFilters.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _FilterChip(
                          label: 'All',
                          isSelected: _selectedFilter == 'All',
                          color: accent,
                          onTap: () => setState(() => _selectedFilter = 'All'),
                        ),
                        ...statusFilters.map((f) => Padding(
                          padding: const EdgeInsets.only(left: 8),
                          child: _FilterChip(
                            label: f,
                            isSelected: _selectedFilter == f,
                            color: accent,
                            onTap: () => setState(() => _selectedFilter = f),
                          ),
                        )),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: WidgetStateProperty.all(AppTheme.bgSurface),
              columns: columns.map((col) => DataColumn(
                label: Text(col, style: TextStyle(
                  color: AppTheme.textMuted, fontWeight: FontWeight.w600, fontSize: 12,
                )),
              )).toList(),
              rows: filteredData.map((row) {
                final values = row.values.toList();
                return DataRow(
                  cells: List.generate(columns.length, (i) {
                    final val = i < values.length ? values[i].toString() : '—';
                    return DataCell(_buildCellContent(val));
                  }),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCellContent(String value) {
    final statusColors = {
      'pending': AppTheme.warning,
      'shipped': AppTheme.info,
      'delivered': AppTheme.success,
      'packing': AppTheme.accentPurple,
      'returned': AppTheme.error,
      'in transit': AppTheme.accentTeal,
      'en route': AppTheme.accentTeal,
    };

    final lowerVal = value.toLowerCase();
    if (statusColors.containsKey(lowerVal)) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: statusColors[lowerVal]!.withAlpha(26),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(value, style: TextStyle(
          color: statusColors[lowerVal], fontSize: 12, fontWeight: FontWeight.w600,
        )),
      );
    }
    return Text(value, style: TextStyle(color: AppTheme.textSecondary, fontSize: 13));
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final Color color;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? color.withAlpha(26) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color.withAlpha(77) : AppTheme.borderColor,
          ),
        ),
        child: Text(label, style: TextStyle(
          color: isSelected ? color : AppTheme.textMuted,
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
        )),
      ),
    );
  }
}
