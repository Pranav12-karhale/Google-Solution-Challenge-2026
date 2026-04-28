import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../providers/auth_provider.dart';
import '../providers/theme_provider.dart';
import '../providers/supply_chain_provider.dart';
import '../config/theme.dart';

class SettingsDialog extends StatefulWidget {
  const SettingsDialog({super.key});

  @override
  State<SettingsDialog> createState() => _SettingsDialogState();
}

class _SettingsDialogState extends State<SettingsDialog> {
  @override
  void initState() {
    super.initState();
    // Fetch the latest history when the dialog opens
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SupplyChainProvider>().refreshChainList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final authProvider = context.watch<AuthProvider>();
    final supplyChainProvider = context.watch<SupplyChainProvider>();

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: Container(
        width: 450,
        constraints: const BoxConstraints(maxHeight: 600),
        decoration: AppTheme.cardDecoration(),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: AppTheme.borderColor)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.accentBlue.withAlpha(26),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(Icons.settings, color: AppTheme.accentBlue, size: 20),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    'Settings',
                    style: GoogleFonts.outfit(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.close, color: AppTheme.textSecondary),
                    splashRadius: 24,
                  ),
                ],
              ),
            ),

            // Body
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionTitle('Appearance'),
                    const SizedBox(height: 16),
                    _buildThemeToggle(context, themeProvider),
                    
                    const SizedBox(height: 32),
                    _buildSectionTitle('Preferences'),
                    const SizedBox(height: 16),
                    _buildSwitchTile(
                      title: 'Enable Notifications',
                      subtitle: 'Receive alerts for supply chain disruptions',
                      value: true,
                      onChanged: (v) {},
                    ),
                    _buildSwitchTile(
                      title: 'Compact Mode',
                      subtitle: 'Show denser information on dashboard',
                      value: false,
                      onChanged: (v) {},
                    ),
                    _buildSwitchTile(
                      title: 'Data Analytics Opt-in',
                      subtitle: 'Share anonymized usage data to improve AI models',
                      value: true,
                      onChanged: (v) {},
                    ),

                    const SizedBox(height: 32),
                    _buildSectionTitle('Account'),
                    const SizedBox(height: 16),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: CircleAvatar(
                        backgroundColor: AppTheme.accentPurple.withAlpha(26),
                        child: Text(
                          authProvider.user?.email?.substring(0, 1).toUpperCase() ?? 'U',
                          style: TextStyle(color: AppTheme.accentPurple, fontWeight: FontWeight.bold),
                        ),
                      ),
                      title: Text(
                        authProvider.user?.email ?? 'Guest User',
                        style: TextStyle(color: AppTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w500),
                      ),
                      subtitle: Text(
                        'Pro Plan',
                        style: TextStyle(color: AppTheme.accentTeal, fontSize: 12),
                      ),
                      trailing: OutlinedButton(
                        onPressed: () async {
                          Navigator.pop(context);
                          await authProvider.signOut();
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.error,
                          side: BorderSide(color: AppTheme.error.withAlpha(51)),
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        child: Text('Sign Out'),
                      ),
                    ),

                    const SizedBox(height: 32),
                    _buildSectionTitle('History'),
                    const SizedBox(height: 16),
                    _buildHistorySection(context, supplyChainProvider),

                    const SizedBox(height: 32),
                    _buildSectionTitle('About'),
                    const SizedBox(height: 16),
                    Center(
                      child: Text(
                        'Adaptive Supply Chain v1.0.0\nPowered by Google Gemini 2.5',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 12, height: 1.5),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: AppTheme.textMuted,
        letterSpacing: 1.2,
      ),
    );
  }

  Widget _buildThemeToggle(BuildContext context, ThemeProvider themeProvider) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.bgSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Row(
        children: [
          _buildThemeOption(
            context, 
            themeProvider, 
            ThemeMode.light, 
            Icons.light_mode_outlined, 
            'Light'
          ),
          Container(width: 1, height: 40, color: AppTheme.borderColor),
          _buildThemeOption(
            context, 
            themeProvider, 
            ThemeMode.dark, 
            Icons.dark_mode_outlined, 
            'Dark'
          ),
          Container(width: 1, height: 40, color: AppTheme.borderColor),
          _buildThemeOption(
            context, 
            themeProvider, 
            ThemeMode.system, 
            Icons.settings_system_daydream_outlined, 
            'System'
          ),
        ],
      ),
    );
  }

  Widget _buildThemeOption(
    BuildContext context, 
    ThemeProvider provider, 
    ThemeMode mode, 
    IconData icon, 
    String label
  ) {
    final isSelected = provider.themeMode == mode;
    return Expanded(
      child: GestureDetector(
        onTap: () => provider.setThemeMode(mode),
        behavior: HitTestBehavior.opaque,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.accentBlue.withAlpha(26) : Colors.transparent,
            borderRadius: BorderRadius.horizontal(
              left: mode == ThemeMode.light ? const Radius.circular(12) : Radius.zero,
              right: mode == ThemeMode.system ? const Radius.circular(12) : Radius.zero,
            ),
          ),
          child: Column(
            children: [
              Icon(
                icon, 
                size: 20, 
                color: isSelected ? AppTheme.accentBlue : AppTheme.textSecondary
              ),
              const SizedBox(height: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected ? AppTheme.textPrimary : AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppTheme.accentBlue,
            activeTrackColor: AppTheme.accentBlue.withAlpha(77),
            inactiveThumbColor: AppTheme.textSecondary,
            inactiveTrackColor: AppTheme.bgSurface,
          ),
        ],
      ),
    );
  }

  Widget _buildHistorySection(BuildContext context, SupplyChainProvider provider) {
    if (provider.chainList.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          child: Text(
            'No history available.',
            style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
          ),
        ),
      );
    }

    return Column(
      children: provider.chainList.map((chain) {
        final createdAt = DateTime.tryParse(chain['created_at'] ?? '');
        final formattedDate = createdAt != null 
            ? DateFormat('MMM d, yyyy, h:mm a').format(createdAt) 
            : 'Unknown Date';
        
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: AppTheme.bgSurface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.borderColor),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            title: Text(
              chain['name'] ?? 'Unnamed Chain',
              style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w500, fontSize: 14),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(
                  chain['business_idea'] ?? '',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Created: $formattedDate',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                    Text(
                      'Nodes: ${chain['node_count'] ?? 0}',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                  ],
                ),
              ],
            ),
            trailing: Icon(Icons.chevron_right, color: AppTheme.textMuted),
            onTap: () {
              provider.loadChain(chain['id']);
              Navigator.pop(context); // Close dialog
            },
          ),
        );
      }).toList(),
    );
  }
}
