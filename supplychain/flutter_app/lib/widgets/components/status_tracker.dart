import 'package:flutter/material.dart';
import '../../config/theme.dart';

class StatusTracker extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const StatusTracker({super.key, required this.args, this.accentColor});

  @override
  State<StatusTracker> createState() => _StatusTrackerState();
}

class _StatusTrackerState extends State<StatusTracker>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final stages = (widget.args['stages'] as List? ?? []).cast<String>();
    final currentStage = widget.args['currentStage'] as int? ?? 0;
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.timeline, color: accent, size: 20),
              const SizedBox(width: 8),
              const Text(
                'Progress Tracker',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: accent.withAlpha(26),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${currentStage + 1}/${stages.length}',
                  style: TextStyle(
                    color: accent,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Progress bar
          AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _controller.value * ((currentStage + 1) / stages.length),
                  backgroundColor: AppTheme.bgSurface,
                  valueColor: AlwaysStoppedAnimation(accent),
                  minHeight: 6,
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          // Stages
          ...List.generate(stages.length, (index) {
            final isCompleted = index < currentStage;
            final isCurrent = index == currentStage;

            return AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                final staggerDelay = index / stages.length;
                final progress = (_controller.value - staggerDelay).clamp(0.0, 1.0) * 2;
                final opacity = progress.clamp(0.0, 1.0);

                return Opacity(
                  opacity: opacity,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        // Stage indicator
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isCompleted
                                ? accent
                                : isCurrent
                                    ? accent.withAlpha(51)
                                    : AppTheme.bgSurface,
                            border: Border.all(
                              color: isCurrent ? accent : AppTheme.borderColor,
                              width: isCurrent ? 2 : 1,
                            ),
                          ),
                          child: Center(
                            child: isCompleted
                                ? const Icon(Icons.check, size: 16, color: Colors.white)
                                : isCurrent
                                    ? Container(
                                        width: 8,
                                        height: 8,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: accent,
                                        ),
                                      )
                                    : Text(
                                        '${index + 1}',
                                        style: const TextStyle(
                                          color: AppTheme.textMuted,
                                          fontSize: 11,
                                        ),
                                      ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Stage label
                        Expanded(
                          child: Text(
                            stages[index],
                            style: TextStyle(
                              color: isCompleted || isCurrent
                                  ? AppTheme.textPrimary
                                  : AppTheme.textMuted,
                              fontSize: 14,
                              fontWeight: isCurrent
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                            ),
                          ),
                        ),
                        // Status chip
                        if (isCompleted)
                          _StatusChip(label: 'Done', color: AppTheme.success)
                        else if (isCurrent)
                          _StatusChip(label: 'In Progress', color: accent)
                        else
                          _StatusChip(label: 'Pending', color: AppTheme.textMuted),
                      ],
                    ),
                  ),
                );
              },
            );
          }),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  final Color color;

  const _StatusChip({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withAlpha(26),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
