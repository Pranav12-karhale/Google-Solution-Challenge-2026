import 'package:flutter/material.dart';
import '../../config/theme.dart';

class ApprovalForm extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const ApprovalForm({super.key, required this.args, this.accentColor});

  @override
  State<ApprovalForm> createState() => _ApprovalFormState();
}

class _ApprovalFormState extends State<ApprovalForm> {
  final _formKey = GlobalKey<FormState>();
  final _formData = <String, dynamic>{};
  bool _submitted = false;

  @override
  Widget build(BuildContext context) {
    final title = widget.args['title'] ?? 'Form';
    final fields = (widget.args['fields'] as List? ?? []).cast<Map<String, dynamic>>();
    final actions = (widget.args['actions'] as List? ?? []).cast<Map<String, dynamic>>();
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.assignment_outlined, color: accent, size: 20),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            if (_submitted) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.success.withAlpha(26),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.success.withAlpha(77)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.check_circle, color: AppTheme.success),
                    const SizedBox(width: 12),
                    const Text(
                      'Form submitted successfully!',
                      style: TextStyle(color: AppTheme.success),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () => setState(() => _submitted = false),
                      child: const Text('Reset'),
                    ),
                  ],
                ),
              ),
            ] else ...[
              // Form fields
              ...fields.map((field) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _buildField(field, accent),
              )),

              const SizedBox(height: 8),

              // Action buttons
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: actions.map((action) {
                  return _buildActionButton(action, accent);
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildField(Map<String, dynamic> field, Color accent) {
    final name = field['name'] ?? '';
    final type = field['type'] ?? 'text';
    final label = field['label'] ?? name;
    final required_ = field['required'] == true;

    switch (type) {
      case 'select':
        final options = (field['options'] as List? ?? []).cast<String>();
        return DropdownButtonFormField<String>(
          decoration: InputDecoration(
            labelText: label,
            labelStyle: const TextStyle(color: AppTheme.textMuted),
          ),
          dropdownColor: AppTheme.bgCard,
          items: options.map((o) => DropdownMenuItem(value: o, child: Text(o))).toList(),
          onChanged: (v) => _formData[name] = v,
          validator: required_ ? (v) => v == null ? 'Required' : null : null,
        );

      case 'textarea':
        return TextFormField(
          maxLines: 3,
          decoration: InputDecoration(
            labelText: label,
            labelStyle: const TextStyle(color: AppTheme.textMuted),
            alignLabelWithHint: true,
          ),
          onChanged: (v) => _formData[name] = v,
          validator: required_ ? (v) => v?.isEmpty == true ? 'Required' : null : null,
        );

      case 'checkbox':
        return CheckboxListTile(
          title: Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14)),
          value: _formData[name] == true,
          activeColor: accent,
          onChanged: (v) => setState(() => _formData[name] = v),
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        );

      default:
        return TextFormField(
          decoration: InputDecoration(
            labelText: label,
            labelStyle: const TextStyle(color: AppTheme.textMuted),
          ),
          onChanged: (v) => _formData[name] = v,
          validator: required_ ? (v) => v?.isEmpty == true ? 'Required' : null : null,
        );
    }
  }

  Widget _buildActionButton(Map<String, dynamic> action, Color accent) {
    final label = action['label'] ?? 'Submit';
    final variant = action['variant'] ?? 'primary';

    Color bgColor;
    Color fgColor;
    switch (variant) {
      case 'primary':
        bgColor = accent;
        fgColor = Colors.white;
        break;
      case 'warning':
        bgColor = AppTheme.warning;
        fgColor = Colors.white;
        break;
      case 'danger':
        bgColor = AppTheme.error;
        fgColor = Colors.white;
        break;
      default:
        bgColor = AppTheme.bgSurface;
        fgColor = AppTheme.textPrimary;
    }

    return ElevatedButton(
      onPressed: () {
        if (_formKey.currentState?.validate() ?? false) {
          setState(() => _submitted = true);
        }
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: bgColor,
        foregroundColor: fgColor,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
      child: Text(label),
    );
  }
}
