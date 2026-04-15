import 'package:flutter/material.dart';
import '../../config/theme.dart';

class DocumentUpload extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const DocumentUpload({super.key, required this.args, this.accentColor});

  @override
  State<DocumentUpload> createState() => _DocumentUploadState();
}

class _DocumentUploadState extends State<DocumentUpload> {
  bool _isDragOver = false;

  @override
  Widget build(BuildContext context) {
    final label = widget.args['label'] ?? 'Upload Documents';
    final maxSize = widget.args['maxSizeMB'] ?? 10;
    final accepted = (widget.args['acceptedTypes'] as List? ?? []).cast<String>();
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.upload_file, color: accent, size: 20),
              const SizedBox(width: 8),
              Text(label, style: const TextStyle(
                color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600,
              )),
            ],
          ),
          const SizedBox(height: 16),
          MouseRegion(
            onEnter: (_) => setState(() => _isDragOver = true),
            onExit: (_) => setState(() => _isDragOver = false),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: _isDragOver ? accent.withAlpha(13) : AppTheme.bgSurface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _isDragOver ? accent : AppTheme.borderColor,
                  width: _isDragOver ? 2 : 1,
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.cloud_upload_outlined,
                    color: _isDragOver ? accent : AppTheme.textMuted,
                    size: 40,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Drag & drop files here',
                    style: TextStyle(
                      color: _isDragOver ? accent : AppTheme.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'or click to browse • Max ${maxSize}MB',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  ),
                  if (accepted.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      children: accepted.map((type) {
                        final ext = type.split('/').last.toUpperCase();
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.bgCard,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(ext, style: const TextStyle(
                            color: AppTheme.textMuted, fontSize: 10,
                          )),
                        );
                      }).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
