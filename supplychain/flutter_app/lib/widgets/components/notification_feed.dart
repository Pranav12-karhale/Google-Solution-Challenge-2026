import 'package:flutter/material.dart';
import '../../config/theme.dart';

class NotificationFeed extends StatelessWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const NotificationFeed({super.key, required this.args, this.accentColor});

  @override
  Widget build(BuildContext context) {
    final data = (args['data'] as List? ?? []).cast<Map<String, dynamic>>();
    final accent = accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.notifications_outlined, color: accent, size: 20),
              const SizedBox(width: 8),
              const Text('Alerts', style: TextStyle(
                color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600,
              )),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: accent.withAlpha(26),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text('${data.length}', style: TextStyle(
                  color: accent, fontSize: 12, fontWeight: FontWeight.w600,
                )),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...data.map((item) {
            final priority = item['priority'] ?? 'medium';
            final priorityColor = priority == 'high'
                ? AppTheme.error
                : priority == 'low'
                    ? AppTheme.textMuted
                    : AppTheme.warning;

            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: priorityColor.withAlpha(10),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: priorityColor.withAlpha(38)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: priorityColor.withAlpha(26),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        _getCategoryIcon(item['category'] ?? ''),
                        color: priorityColor,
                        size: 16,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item['category'] ?? '',
                            style: TextStyle(
                              color: priorityColor,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item['message'] ?? '',
                            style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 13,
                            ),
                          ),
                          if (item['time'] != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              item['time'].toString(),
                              style: const TextStyle(
                                color: AppTheme.textMuted,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    final lower = category.toLowerCase();
    if (lower.contains('stock')) return Icons.inventory_2_outlined;
    if (lower.contains('shipment')) return Icons.local_shipping_outlined;
    if (lower.contains('order')) return Icons.receipt_outlined;
    if (lower.contains('alert')) return Icons.warning_amber_rounded;
    return Icons.notification_important_outlined;
  }
}
