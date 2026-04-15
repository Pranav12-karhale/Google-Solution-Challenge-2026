import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ============================================================
  // Color Palette — Deep navy → Electric blue → Teal gradient
  // ============================================================
  static const Color bgDark = Color(0xFF0A0E1A);
  static const Color bgCard = Color(0xFF111827);
  static const Color bgCardHover = Color(0xFF1A2332);
  static const Color bgSurface = Color(0xFF151B2B);
  static const Color bgGlass = Color(0x1AFFFFFF);

  static const Color accentBlue = Color(0xFF3B82F6);
  static const Color accentTeal = Color(0xFF14B8A6);
  static const Color accentPurple = Color(0xFF8B5CF6);
  static const Color accentPink = Color(0xFFEC4899);
  static const Color accentOrange = Color(0xFFF59E0B);

  static const Color textPrimary = Color(0xFFF1F5F9);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  static const Color borderColor = Color(0xFF1E293B);
  static const Color borderLight = Color(0x1AFFFFFF);

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

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF1A2332), Color(0xFF111827)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [Color(0x15FFFFFF), Color(0x08FFFFFF)],
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
        color: (accentColor ?? Colors.black).withAlpha(26),
        blurRadius: 20,
        offset: const Offset(0, 4),
      ),
    ],
  );

  // ============================================================
  // Theme Data
  // ============================================================
  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: bgDark,
    colorScheme: const ColorScheme.dark(
      primary: accentBlue,
      secondary: accentTeal,
      surface: bgCard,
      error: error,
    ),
    textTheme: GoogleFonts.interTextTheme(
      ThemeData.dark().textTheme,
    ).copyWith(
      headlineLarge: GoogleFonts.outfit(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: textPrimary,
        letterSpacing: -0.5,
      ),
      headlineMedium: GoogleFonts.outfit(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: -0.3,
      ),
      headlineSmall: GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      titleLarge: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: textPrimary,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: textSecondary,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textSecondary,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: textMuted,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: bgDark,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      iconTheme: const IconThemeData(color: textSecondary),
    ),
    drawerTheme: const DrawerThemeData(
      backgroundColor: bgCard,
    ),
    cardTheme: CardThemeData(
      color: bgCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: borderColor, width: 1),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: accentBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: textPrimary,
        side: const BorderSide(color: borderColor),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: bgSurface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: borderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: borderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: accentBlue, width: 2),
      ),
      hintStyle: GoogleFonts.inter(color: textMuted),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    dividerTheme: const DividerThemeData(
      color: borderColor,
      thickness: 1,
    ),
    chipTheme: ChipThemeData(
      backgroundColor: bgSurface,
      labelStyle: GoogleFonts.inter(fontSize: 12, color: textSecondary),
      side: const BorderSide(color: borderColor),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  );
}
