import 'package:flutter/material.dart';
import '../../config/theme.dart';

class InventoryTable extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const InventoryTable({super.key, required this.args, this.accentColor});

  @override
  State<InventoryTable> createState() => _InventoryTableState();
}

class _InventoryTableState extends State<InventoryTable> {
  String _filterText = '';

  @override
  Widget build(BuildContext context) {
    final columns = (widget.args['columns'] as List? ?? []).cast<String>();
    final rawData = (widget.args['data'] as List? ?? []).cast<Map<String, dynamic>>();
    final sortable = widget.args['sortable'] == true;
    final filterable = widget.args['filterable'] == true;
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    // Filter data
    var data = rawData;
    if (_filterText.isNotEmpty) {
      data = data.where((row) {
        return row.values.any((v) =>
            v.toString().toLowerCase().contains(_filterText.toLowerCase()));
      }).toList();
    }

    return Container(
      decoration: AppTheme.cardDecoration(accentColor: accent),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.table_chart_outlined, color: accent, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Inventory',
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                if (filterable)
                  SizedBox(
                    width: 200,
                    height: 36,
                    child: TextField(
                      onChanged: (v) => setState(() => _filterText = v),
                      style: const TextStyle(fontSize: 13),
                      decoration: InputDecoration(
                        hintText: 'Filter...',
                        prefixIcon: const Icon(Icons.search, size: 18),
                        contentPadding: EdgeInsets.zero,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: AppTheme.borderColor),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // Table
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: WidgetStateProperty.all(AppTheme.bgSurface),
              dataRowColor: WidgetStateProperty.resolveWith((states) {
                if (states.contains(WidgetState.hovered)) {
                  return accent.withAlpha(13);
                }
                return Colors.transparent;
              }),
              columns: columns.map((col) {
                return DataColumn(
                  label: Text(
                    col,
                    style: const TextStyle(
                      color: AppTheme.textMuted,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                  onSort: sortable
                      ? (columnIndex, ascending) {
                          // Sort functionality placeholder
                        }
                      : null,
                );
              }).toList(),
              rows: data.map((row) {
                return DataRow(
                  cells: _buildCells(row, columns, accent),
                );
              }).toList(),
            ),
          ),

          // Footer
          Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              '${data.length} ${data.length == 1 ? 'record' : 'records'}',
              style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  List<DataCell> _buildCells(Map<String, dynamic> row, List<String> columns, Color accent) {
    // Map column names to row keys
    final values = row.values.toList();
    final cells = <DataCell>[];

    for (var i = 0; i < columns.length; i++) {
      final value = i < values.length ? values[i].toString() : '—';

      // Special styling for status-like values
      Widget child;
      if (_isStatusValue(value)) {
        child = Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppTheme.statusColor(value).withAlpha(26),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            value,
            style: TextStyle(
              color: AppTheme.statusColor(value),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        );
      } else {
        child = Text(
          value,
          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
        );
      }

      cells.add(DataCell(child));
    }

    return cells;
  }

  bool _isStatusValue(String value) {
    final statusWords = [
      'active', 'shipped', 'processing', 'ready', 'growing',
      'complete', 'grinding', 'pass', 'fail', 'approved',
      'pending', 'in stock', 'low stock', 'out of stock',
      'in transit', 'delivered', 'packing', 'returned',
    ];
    return statusWords.contains(value.toLowerCase());
  }
}
