import 'package:flutter/material.dart';
import '../../config/theme.dart';

class QrScannerWidget extends StatelessWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const QrScannerWidget({super.key, required this.args, this.accentColor});

  @override
  Widget build(BuildContext context) {
    final label = args['label'] ?? 'Scan QR Code';
    final accent = accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.qr_code_scanner, color: accent, size: 20),
              const SizedBox(width: 8),
              Text(label, style: const TextStyle(
                color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600,
              )),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: AppTheme.bgSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: accent.withAlpha(77), width: 2),
            ),
            child: Stack(
              children: [
                Center(
                  child: Icon(Icons.qr_code_2, color: accent.withAlpha(51), size: 100),
                ),
                // Corner markers
                ..._buildCornerMarkers(accent),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('QR Scanner would open on mobile devices'),
                  backgroundColor: AppTheme.bgCard,
                ),
              );
            },
            icon: const Icon(Icons.camera_alt, size: 18),
            label: const Text('Open Scanner'),
            style: ElevatedButton.styleFrom(backgroundColor: accent),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildCornerMarkers(Color color) {
    return [
      // Top-left
      Positioned(top: 0, left: 0, child: _Corner(color: color, rotation: 0)),
      // Top-right
      Positioned(top: 0, right: 0, child: _Corner(color: color, rotation: 1)),
      // Bottom-left
      Positioned(bottom: 0, left: 0, child: _Corner(color: color, rotation: 3)),
      // Bottom-right
      Positioned(bottom: 0, right: 0, child: _Corner(color: color, rotation: 2)),
    ];
  }
}

class _Corner extends StatelessWidget {
  final Color color;
  final int rotation;

  const _Corner({required this.color, required this.rotation});

  @override
  Widget build(BuildContext context) {
    return RotatedBox(
      quarterTurns: rotation,
      child: Container(
        width: 24,
        height: 24,
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(color: color, width: 3),
            left: BorderSide(color: color, width: 3),
          ),
        ),
      ),
    );
  }
}
