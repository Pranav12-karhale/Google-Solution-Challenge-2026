import 'package:flutter/material.dart';
import '../../config/theme.dart';

class DataGridWidget extends StatelessWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const DataGridWidget({super.key, required this.args, this.accentColor});

  @override
  Widget build(BuildContext context) {
    final columns = (args['columns'] as List? ?? []).cast<String>();
    final data = (args['data'] as List? ?? []).cast<Map<String, dynamic>>();
    final accent = accentColor ?? AppTheme.accentBlue;

    return Container(
      decoration: AppTheme.cardDecoration(accentColor: accent),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.grid_view, color: accent, size: 20),
                const SizedBox(width: 8),
                Text('Data', style: TextStyle(
                  color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600,
                )),
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
              rows: data.map((row) {
                final values = row.values.toList();
                return DataRow(
                  cells: List.generate(columns.length, (i) {
                    final val = i < values.length ? values[i].toString() : '—';
                    return DataCell(Text(val, style: TextStyle(
                      color: AppTheme.textSecondary, fontSize: 13,
                    )));
                  }),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
