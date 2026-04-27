import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'theme_mode';
  
  // Static global access for the theme configuration colors
  static bool isDark = true;

  ThemeMode _themeMode = ThemeMode.dark;
  ThemeMode get themeMode => _themeMode;

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final savedMode = prefs.getString(_themeKey);
    
    if (savedMode == 'light') {
      _themeMode = ThemeMode.light;
      isDark = false;
    } else if (savedMode == 'system') {
      _themeMode = ThemeMode.system;
      // Note: isDark will be derived from system dynamically in UI, but we default to true 
      // or we can rely on WidgetsBinding.instance.platformDispatcher.platformBrightness
      isDark = WidgetsBinding.instance.platformDispatcher.platformBrightness == Brightness.dark;
    } else {
      _themeMode = ThemeMode.dark;
      isDark = true;
    }
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    if (_themeMode == mode) return;

    _themeMode = mode;
    final prefs = await SharedPreferences.getInstance();
    
    if (mode == ThemeMode.light) {
      await prefs.setString(_themeKey, 'light');
      isDark = false;
    } else if (mode == ThemeMode.dark) {
      await prefs.setString(_themeKey, 'dark');
      isDark = true;
    } else {
      await prefs.setString(_themeKey, 'system');
      isDark = WidgetsBinding.instance.platformDispatcher.platformBrightness == Brightness.dark;
    }
    
    notifyListeners();
  }
}
