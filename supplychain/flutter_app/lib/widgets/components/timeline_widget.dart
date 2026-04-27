import 'package:flutter/material.dart';
import '../../config/theme.dart';

class TimelineWidget extends StatelessWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const TimelineWidget({super.key, required this.args, this.accentColor});

  @override
  Widget build(BuildContext context) {
    final data = (args['data'] as List? ?? []).cast<Map<String, dynamic>>();
    final showDate = args['showDate'] == true;
    final accent = accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.history, color: accent, size: 20),
              const SizedBox(width: 8),
              Text('Timeline', style: TextStyle(
                color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600,
              )),
            ],
          ),
          const SizedBox(height: 16),
          ...data.asMap().entries.map((entry) {
            final item = entry.value;
            final isLast = entry.key == data.length - 1;
            final status = item['status'] ?? 'info';
            final statusColor = AppTheme.statusColor(status);

            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Timeline line + dot
                  SizedBox(
                    width: 24,
                    child: Column(
                      children: [
                        Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: statusColor.withAlpha(51),
                            border: Border.all(color: statusColor, width: 2),
                          ),
                        ),
                        if (!isLast)
                          Expanded(
                            child: Container(
                              width: 2,
                              color: AppTheme.borderColor,
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Content
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item['event'] ?? '',
                            style: TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          if (showDate && item['date'] != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              item['date'].toString(),
                              style: TextStyle(
                                color: AppTheme.textMuted,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
