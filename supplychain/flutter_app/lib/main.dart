import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'providers/supply_chain_provider.dart';
import 'screens/home_screen.dart';
import 'screens/chain_screen.dart';
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AdaptiveSupplyChainApp());
}

class AdaptiveSupplyChainApp extends StatelessWidget {
  const AdaptiveSupplyChainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => SupplyChainProvider(),
      child: MaterialApp(
        title: 'Adaptive Supply Chain',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        initialRoute: '/',
        routes: {
          '/': (context) => const HomeScreen(),
          '/chain': (context) => const ChainScreen(),
        },
      ),
    );
  }
}
