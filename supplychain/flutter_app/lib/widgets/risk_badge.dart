import 'package:flutter/material.dart';

/// Small colored dot/badge indicating risk level for a supply chain node
class RiskBadge extends StatelessWidget {
  final double riskScore;
  final bool showLabel;
  final double size;

  const RiskBadge({
    super.key,
    required this.riskScore,
    this.showLabel = false,
    this.size = 8,
  });

  Color get _color {
    if (riskScore >= 7) return const Color(0xFFEF4444); // red
    if (riskScore >= 4) return const Color(0xFFF59E0B); // amber
    return const Color(0xFF22C55E); // green
  }

  String get _label {
    if (riskScore >= 7) return 'High';
    if (riskScore >= 4) return 'Medium';
    return 'Low';
  }

  @override
  Widget build(BuildContext context) {
    if (showLabel) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        decoration: BoxDecoration(
          color: _color.withAlpha(30),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: _color.withAlpha(80)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _color,
                boxShadow: [
                  BoxShadow(color: _color.withAlpha(100), blurRadius: 4),
                ],
              ),
            ),
            const SizedBox(width: 4),
            Text(
              '${riskScore.toStringAsFixed(1)} $_label',
              style: TextStyle(
                color: _color,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      );
    }

    return Tooltip(
      message: 'Risk: ${riskScore.toStringAsFixed(1)}/10 ($_label)',
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: _color,
          boxShadow: [
            BoxShadow(color: _color.withAlpha(120), blurRadius: 4),
          ],
        ),
      ),
    );
  }
}
