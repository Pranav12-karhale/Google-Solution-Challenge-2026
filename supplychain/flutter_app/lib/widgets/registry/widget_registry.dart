import 'package:flutter/material.dart';
import '../components/kpi_card_row.dart';
import '../components/inventory_table.dart';
import '../components/status_tracker.dart';
import '../components/analytics_chart.dart';
import '../components/approval_form.dart';
import '../components/order_list.dart';
import '../components/data_grid.dart';
import '../components/timeline_widget.dart';
import '../components/notification_feed.dart';
import '../components/map_view_widget.dart';
import '../components/document_upload.dart';
import '../components/qr_scanner_widget.dart';

/// The Widget Registry maps component type strings from JSON
/// to actual Flutter widgets. This is a factory pattern.
class WidgetRegistry {
  static Widget build(String type, Map<String, dynamic> args, {Color? accentColor}) {
    switch (type) {
      case 'kpi_card_row':
        return KpiCardRow(args: args, accentColor: accentColor);
      case 'inventory_table':
        return InventoryTable(args: args, accentColor: accentColor);
      case 'status_tracker':
        return StatusTracker(args: args, accentColor: accentColor);
      case 'analytics_chart':
        return AnalyticsChart(args: args, accentColor: accentColor);
      case 'approval_form':
        return ApprovalForm(args: args, accentColor: accentColor);
      case 'order_list':
        return OrderList(args: args, accentColor: accentColor);
      case 'data_grid':
        return DataGridWidget(args: args, accentColor: accentColor);
      case 'timeline':
        return TimelineWidget(args: args, accentColor: accentColor);
      case 'notification_feed':
        return NotificationFeed(args: args, accentColor: accentColor);
      case 'map_view':
        return MapViewWidget(args: args, accentColor: accentColor);
      case 'document_upload':
        return DocumentUpload(args: args, accentColor: accentColor);
      case 'qr_scanner':
        return QrScannerWidget(args: args, accentColor: accentColor);
      default:
        return _UnknownComponent(type: type);
    }
  }
}

class _UnknownComponent extends StatelessWidget {
  final String type;
  const _UnknownComponent({required this.type});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.withAlpha(26),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange.withAlpha(77)),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: Colors.orange),
          const SizedBox(width: 12),
          Text('Unknown component: $type',
              style: const TextStyle(color: Colors.orange)),
        ],
      ),
    );
  }
}
