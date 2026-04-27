import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/theme_provider.dart';

class AppTheme {
  // ============================================================
  // Color Palette
  // ============================================================
  static Color get bgDark => ThemeProvider.isDark ? const Color(0xFF0A0E1A) : const Color(0xFFFAFAFA);
  static Color get bgCard => ThemeProvider.isDark ? const Color(0xFF111827) : const Color(0xFFFFFFFF);
  static Color get bgCardHover => ThemeProvider.isDark ? const Color(0xFF1A2332) : const Color(0xFFF1F5F9);
  static Color get bgSurface => ThemeProvider.isDark ? const Color(0xFF151B2B) : const Color(0xFFF3F4F6);
  static Color get bgGlass => ThemeProvider.isDark ? const Color(0x1AFFFFFF) : const Color(0x0C000000);

  static const Color accentBlue = Color(0xFF3B82F6);
  static const Color accentTeal = Color(0xFF14B8A6);
  static const Color accentPurple = Color(0xFF8B5CF6);
  static const Color accentPink = Color(0xFFEC4899);
  static const Color accentOrange = Color(0xFFF59E0B);

  static Color get textPrimary => ThemeProvider.isDark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A);
  static Color get textSecondary => ThemeProvider.isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569);
  static Color get textMuted => ThemeProvider.isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8);

  static Color get borderColor => ThemeProvider.isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);
  static Color get borderLight => ThemeProvider.isDark ? const Color(0x1AFFFFFF) : const Color(0x1A000000);

  static const Color success = Color(0xFF22C55E);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // Status colors
  static Color statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return success;
      case 'warning':
        return warning;
      case 'critical':
      case 'error':
        return error;
      case 'offline':
        return textMuted;
      case 'pending':
        return accentOrange;
      case 'info':
        return info;
      case 'success':
        return success;
      default:
        return textSecondary;
    }
  }

  // Node type color mapping
  static Color nodeTypeColor(String type) {
    switch (type) {
      case 'supplier':
      case 'raw_material_source':
        return const Color(0xFF4CAF50);
      case 'manufacturer':
      case 'processor':
        return const Color(0xFF2196F3);
      case 'warehouse':
      case 'cold_storage':
        return const Color(0xFF00BCD4);
      case 'distributor':
      case 'logistics':
        return const Color(0xFF9C27B0);
      case 'quality_control':
        return const Color(0xFFFF9800);
      case 'customs':
        return const Color(0xFF795548);
      case 'fulfillment_center':
      case 'last_mile_delivery':
        return const Color(0xFFE91E63);
      case 'retailer':
        return const Color(0xFF3F51B5);
      case 'packaging':
        return const Color(0xFF009688);
      case 'returns_center':
        return const Color(0xFFF44336);
      default:
        return accentBlue;
    }
  }

  // ============================================================
  // Gradients
  // ============================================================
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [accentBlue, accentTeal],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get cardGradient => LinearGradient(
    colors: ThemeProvider.isDark 
        ? [const Color(0xFF1A2332), const Color(0xFF111827)]
        : [const Color(0xFFFFFFFF), const Color(0xFFF8FAFC)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get glassGradient => LinearGradient(
    colors: ThemeProvider.isDark
        ? [const Color(0x15FFFFFF), const Color(0x08FFFFFF)]
        : [const Color(0x05000000), const Color(0x02000000)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ============================================================
  // Decorations
  // ============================================================
  static BoxDecoration get glassDecoration => BoxDecoration(
    gradient: glassGradient,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: borderLight, width: 1),
  );

  static BoxDecoration cardDecoration({Color? accentColor}) => BoxDecoration(
    gradient: cardGradient,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(
      color: accentColor?.withAlpha(51) ?? borderColor,
      width: 1,
    ),
    boxShadow: [
      BoxShadow(
        color: (accentColor ?? Colors.black).withAlpha(ThemeProvider.isDark ? 26 : 10),
        blurRadius: 20,
        offset: const Offset(0, 4),
      ),
    ],
  );

  // ============================================================
  // Theme Data (Dark)
  // ============================================================
  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF0A0E1A),
    colorScheme: const ColorScheme.dark(
      primary: accentBlue,
      secondary: accentTeal,
      surface: Color(0xFF111827),
      error: error,
    ),
    textTheme: _textTheme(Brightness.dark),
    appBarTheme: _appBarTheme(Brightness.dark),
    drawerTheme: const DrawerThemeData(backgroundColor: Color(0xFF111827)),
    cardTheme: _cardTheme(Brightness.dark),
    elevatedButtonTheme: _elevatedButtonTheme(),
    outlinedButtonTheme: _outlinedButtonTheme(Brightness.dark),
    inputDecorationTheme: _inputDecorationTheme(Brightness.dark),
    dividerTheme: _dividerTheme(Brightness.dark),
    chipTheme: _chipTheme(Brightness.dark),
  );

  // ============================================================
  // Theme Data (Light)
  // ============================================================
  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: const Color(0xFFFAFAFA),
    colorScheme: const ColorScheme.light(
      primary: accentBlue,
      secondary: accentTeal,
      surface: Color(0xFFFFFFFF),
      error: error,
    ),
    textTheme: _textTheme(Brightness.light),
    appBarTheme: _appBarTheme(Brightness.light),
    drawerTheme: const DrawerThemeData(backgroundColor: Color(0xFFFFFFFF)),
    cardTheme: _cardTheme(Brightness.light),
    elevatedButtonTheme: _elevatedButtonTheme(),
    outlinedButtonTheme: _outlinedButtonTheme(Brightness.light),
    inputDecorationTheme: _inputDecorationTheme(Brightness.light),
    dividerTheme: _dividerTheme(Brightness.light),
    chipTheme: _chipTheme(Brightness.light),
  );

  // Helpers for Theme config
  static TextTheme _textTheme(Brightness brightness) {
    final tPrimary = brightness == Brightness.dark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A);
    final tSecondary = brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF475569);
    final tMuted = brightness == Brightness.dark ? const Color(0xFF64748B) : const Color(0xFF94A3B8);

    return GoogleFonts.interTextTheme(
      brightness == Brightness.dark ? ThemeData.dark().textTheme : ThemeData.light().textTheme,
    ).copyWith(
      headlineLarge: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w700, color: tPrimary, letterSpacing: -0.5),
      headlineMedium: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w600, color: tPrimary, letterSpacing: -0.3),
      headlineSmall: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w600, color: tPrimary),
      titleLarge: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: tPrimary),
      titleMedium: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: tPrimary),
      bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, color: tSecondary),
      bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: tSecondary),
      bodySmall: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: tMuted),
      labelLarge: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: tPrimary),
    );
  }

  static AppBarTheme _appBarTheme(Brightness brightness) {
    return AppBarTheme(
      backgroundColor: brightness == Brightness.dark ? const Color(0xFF0A0E1A) : const Color(0xFFFAFAFA),
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: brightness == Brightness.dark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
      ),
      iconTheme: IconThemeData(color: brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF475569)),
    );
  }

  static CardThemeData _cardTheme(Brightness brightness) {
    return CardThemeData(
      color: brightness == Brightness.dark ? const Color(0xFF111827) : const Color(0xFFFFFFFF),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: brightness == Brightness.dark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0), width: 1),
      ),
    );
  }

  static ElevatedButtonThemeData _elevatedButtonTheme() {
    return ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: accentBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600),
      ),
    );
  }

  static OutlinedButtonThemeData _outlinedButtonTheme(Brightness brightness) {
    return OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: brightness == Brightness.dark ? const Color(0xFFF1F5F9) : const Color(0xFF0F172A),
        side: BorderSide(color: brightness == Brightness.dark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0)),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  static InputDecorationTheme _inputDecorationTheme(Brightness brightness) {
    final bColor = brightness == Brightness.dark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);
    final fillC = brightness == Brightness.dark ? const Color(0xFF151B2B) : const Color(0xFFF3F4F6);
    return InputDecorationTheme(
      filled: true,
      fillColor: fillC,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: bColor)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: bColor)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: accentBlue, width: 2)),
      hintStyle: GoogleFonts.inter(color: const Color(0xFF64748B)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    );
  }

  static DividerThemeData _dividerTheme(Brightness brightness) {
    return DividerThemeData(
      color: brightness == Brightness.dark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
      thickness: 1,
    );
  }

  static ChipThemeData _chipTheme(Brightness brightness) {
    return ChipThemeData(
      backgroundColor: brightness == Brightness.dark ? const Color(0xFF151B2B) : const Color(0xFFF3F4F6),
      labelStyle: GoogleFonts.inter(fontSize: 12, color: brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF334155)),
      side: BorderSide(color: brightness == Brightness.dark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );
  }
}
