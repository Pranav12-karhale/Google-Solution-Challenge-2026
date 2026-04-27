import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'config/firebase_options.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/supply_chain_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/auth_screen.dart';
import 'screens/home_screen.dart';
import 'screens/generating_screen.dart';
import 'screens/chain_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const AdaptiveSupplyChainApp());
}

class AdaptiveSupplyChainApp extends StatelessWidget {
  const AdaptiveSupplyChainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SupplyChainProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'Adaptive Supply Chain',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            home: const _AuthGate(),
            routes: {
              '/auth': (context) => const AuthScreen(),
              '/home': (context) => const HomeScreen(),
              '/generating': (context) => const GeneratingScreen(),
              '/chain': (context) => const ChainScreen(),
            },
          );
        },
      ),
    );
  }
}

/// Auth gate: shows a loading spinner while Firebase checks for an existing
/// session, then routes to AuthScreen or HomeScreen.
class _AuthGate extends StatelessWidget {
  const _AuthGate();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    // Still checking for existing session (IndexedDB / SharedPreferences)
    if (auth.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // Authenticated → home screen
    if (auth.isAuthenticated) {
      return const HomeScreen();
    }

    // Not authenticated → auth screen
    return const AuthScreen();
  }
}
