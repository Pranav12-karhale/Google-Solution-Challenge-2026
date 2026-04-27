import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/theme.dart';
import '../models/risk_models.dart';
import 'risk_badge.dart';

/// Dashboard widget shown on the Chain Overview page displaying
/// AI-detected risks with startup-friendly explanations.
class RiskDashboard extends StatelessWidget {
  final RiskReport report;
  final void Function(RiskScanResult risk)? onFixRisk;

  const RiskDashboard({
    super.key,
    required this.report,
    this.onFixRisk,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: AppTheme.cardDecoration(
        accentColor: _overallColor,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Icon(Icons.shield_outlined, color: _overallColor, size: 22),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Risk Intelligence Report',
                  style: GoogleFonts.outfit(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ),
              RiskBadge(riskScore: report.overallChainRisk, showLabel: true, size: 8),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'AI-analyzed risks based on real-world location data',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 20),

          // Overall Health Gauge
          _buildHealthGauge(),

          const SizedBox(height: 24),

          // Node Risk Grid
          Text(
            'NODE RISK MAP',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppTheme.textMuted,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 12),
          _buildNodeRiskGrid(),

          // Top Threats
          if (report.sortedByRisk.any((r) => r.overallRisk >= 3)) ...[
            const SizedBox(height: 24),
            Text(
              'DETECTED THREATS',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppTheme.textMuted,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 12),
            ...report.sortedByRisk
                .where((r) => r.overallRisk >= 3)
                .take(5)
                .map((r) => _buildThreatCard(r)),
          ],
        ],
      ),
    );
  }

  Color get _overallColor {
    if (report.overallChainRisk >= 7) return const Color(0xFFEF4444);
    if (report.overallChainRisk >= 4) return const Color(0xFFF59E0B);
    return const Color(0xFF22C55E);
  }

  Widget _buildHealthGauge() {
    final risk = report.overallChainRisk;
    final healthLabel = risk >= 7
        ? 'High Risk'
        : risk >= 4
            ? 'Moderate Risk'
            : 'Healthy';
    final healthDesc = risk >= 7
        ? 'Your supply chain has critical vulnerabilities that need immediate attention.'
        : risk >= 4
            ? 'Some nodes face moderate risks. Review the threats below to stay prepared.'
            : 'Your supply chain is in good shape. Keep monitoring for changes.';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _overallColor.withAlpha(15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _overallColor.withAlpha(40)),
      ),
      child: Row(
        children: [
          // Score circle
          SizedBox(
            width: 64,
            height: 64,
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 64,
                  height: 64,
                  child: CircularProgressIndicator(
                    value: risk / 10,
                    strokeWidth: 6,
                    backgroundColor: AppTheme.bgSurface,
                    valueColor: AlwaysStoppedAnimation(_overallColor),
                  ),
                ),
                Text(
                  risk.toStringAsFixed(1),
                  style: GoogleFonts.outfit(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: _overallColor,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  healthLabel,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: _overallColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  healthDesc,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNodeRiskGrid() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: report.results.map((r) {
        final color = r.overallRisk >= 7
            ? const Color(0xFFEF4444)
            : r.overallRisk >= 4
                ? const Color(0xFFF59E0B)
                : const Color(0xFF22C55E);

        return Tooltip(
          message: '${r.nodeName}: ${r.overallRisk.toStringAsFixed(1)}/10',
          child: Container(
            width: 100,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withAlpha(15),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: color.withAlpha(50)),
            ),
            child: Column(
              children: [
                RiskBadge(riskScore: r.overallRisk, size: 10),
                const SizedBox(height: 6),
                Text(
                  r.nodeName,
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    color: AppTheme.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildThreatCard(RiskScanResult nodeRisk) {
    final topRisk = nodeRisk.topRisk;
    if (topRisk == null) return const SizedBox.shrink();

    final color = nodeRisk.overallRisk >= 7
        ? const Color(0xFFEF4444)
        : nodeRisk.overallRisk >= 4
            ? const Color(0xFFF59E0B)
            : const Color(0xFF22C55E);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: color.withAlpha(20),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Icon(_categoryIcon(topRisk.category), color: color, size: 16),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      topRisk.headline,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      '${nodeRisk.nodeName} · ${nodeRisk.location}',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: AppTheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              RiskBadge(riskScore: nodeRisk.overallRisk, showLabel: true),
            ],
          ),
          const SizedBox(height: 12),

          // Plain-language explanation (startup-friendly)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.bgCard,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.lightbulb_outline, size: 14, color: AppTheme.accentOrange),
                    const SizedBox(width: 6),
                    Text(
                      'What this means',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.accentOrange,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  topRisk.explanation,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Recommended action
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF22C55E).withAlpha(10),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF22C55E).withAlpha(30)),
            ),
            child: Row(
              children: [
                Icon(Icons.tips_and_updates, size: 14, color: Color(0xFF22C55E)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    topRisk.recommendedAction,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: const Color(0xFF22C55E),
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Fix button
          if (onFixRisk != null) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: () => onFixRisk!(nodeRisk),
                icon: Icon(Icons.auto_fix_high, size: 16),
                label: Text('Fix This'),
                style: TextButton.styleFrom(
                  foregroundColor: AppTheme.accentBlue,
                  textStyle: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 12),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  IconData _categoryIcon(String category) {
    switch (category) {
      case 'geopolitical':
        return Icons.public;
      case 'climate':
        return Icons.thunderstorm;
      case 'transport':
        return Icons.local_shipping;
      case 'cyber':
        return Icons.security;
      case 'economic':
        return Icons.trending_down;
      case 'labor':
        return Icons.groups;
      case 'regulatory':
        return Icons.gavel;
      default:
        return Icons.warning;
    }
  }
}
