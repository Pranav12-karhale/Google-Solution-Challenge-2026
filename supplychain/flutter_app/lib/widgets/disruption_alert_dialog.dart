import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/supply_chain.dart';

class DisruptionAlertDialog extends StatelessWidget {
  final DisruptionEvent disruption;
  final MitigationAction? mitigation;
  final bool isLoadingMitigation;
  final VoidCallback onResolve;
  final VoidCallback onExecute;
  final VoidCallback onDismiss;

  const DisruptionAlertDialog({
    Key? key,
    required this.disruption,
    this.mitigation,
    required this.isLoadingMitigation,
    required this.onResolve,
    required this.onExecute,
    required this.onDismiss,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500),
        decoration: BoxDecoration(
          color: const Color(0xFF1E1E1E),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.redAccent.withOpacity(0.5), width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.redAccent.withOpacity(0.2),
              blurRadius: 20,
              spreadRadius: 5,
            ),
          ],
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 32),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'CRITICAL DISRUPTION DETECTED',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.redAccent,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white54),
                  onPressed: onDismiss,
                )
              ],
            ),
            const SizedBox(height: 20),
            _buildInfoRow('Type', disruption.type.toUpperCase(), Colors.orangeAccent),
            const SizedBox(height: 8),
            _buildInfoRow('Severity', disruption.severity.toUpperCase(), Colors.redAccent),
            const SizedBox(height: 16),
            Text(
              disruption.description,
              style: GoogleFonts.inter(color: Colors.white70, fontSize: 14, height: 1.5),
            ),
            const SizedBox(height: 24),
            const Divider(color: Colors.white12),
            const SizedBox(height: 16),
            
            if (isLoadingMitigation)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(20.0),
                  child: CircularProgressIndicator(color: Colors.blueAccent),
                ),
              )
            else if (mitigation == null)
              Center(
                child: ElevatedButton.icon(
                  onPressed: onResolve,
                  icon: const Icon(Icons.auto_awesome),
                  label: const Text('Generate AI Mitigation Plan'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                ),
              )
            else
              _buildMitigationPlan(mitigation!),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, Color valueColor) {
    return Row(
      children: [
        Text(
          '$label: ',
          style: GoogleFonts.inter(
            color: Colors.white54,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: GoogleFonts.inter(
            color: valueColor,
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  Widget _buildMitigationPlan(MitigationAction mitigation) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.shield, color: Colors.greenAccent, size: 20),
            const SizedBox(width: 8),
            Text(
              'AI MITIGATION PLAN',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.greenAccent,
                letterSpacing: 1.0,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.white12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInfoRow('Action', mitigation.actionType.toUpperCase(), Colors.white),
              const SizedBox(height: 8),
              Text(
                mitigation.description,
                style: GoogleFonts.inter(color: Colors.white70, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildImpactMetric('Cost Impact', '+\$${mitigation.costImpact}', Colors.orangeAccent),
                  _buildImpactMetric('Time Impact', '${mitigation.timeImpactDays} Days', 
                    mitigation.timeImpactDays < 0 ? Colors.greenAccent : Colors.orangeAccent),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            TextButton(
              onPressed: onDismiss,
              child: const Text('Reject', style: TextStyle(color: Colors.white54)),
            ),
            const SizedBox(width: 12),
            ElevatedButton(
              onPressed: onExecute,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.greenAccent.shade700,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              child: const Text('Execute Mitigation'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildImpactMetric(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(color: Colors.white54, fontSize: 12),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.inter(color: color, fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ],
    );
  }
}
