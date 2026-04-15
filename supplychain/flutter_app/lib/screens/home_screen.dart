import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/supply_chain_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  final _ideaController = TextEditingController();
  late AnimationController _bgAnimController;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnim;

  final _exampleIdeas = [
    {'icon': Icons.local_cafe, 'title': 'Direct-to-Consumer Matcha', 'desc': 'Premium Japanese matcha tea sold online with farm-to-cup traceability'},
    {'icon': Icons.checkroom, 'title': 'Sustainable Sneaker Brand', 'desc': 'Custom eco-friendly sneakers manufactured ethically and shipped globally'},
    {'icon': Icons.devices, 'title': 'Smart Home Electronics', 'desc': 'IoT-connected smart home devices assembled in Taiwan, sold in the US'},
    {'icon': Icons.eco, 'title': 'Organic Farm-to-Table', 'desc': 'Local organic produce delivered same-day from farm to consumer doorstep'},
  ];

  @override
  void initState() {
    super.initState();
    _bgAnimController = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat(reverse: true);
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnim = CurvedAnimation(parent: _fadeController, curve: Curves.easeOut);
    _fadeController.forward();
  }

  @override
  void dispose() {
    _bgAnimController.dispose();
    _fadeController.dispose();
    _ideaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SupplyChainProvider>();

    return Scaffold(
      body: Stack(
        children: [
          // Animated gradient background
          AnimatedBuilder(
            animation: _bgAnimController,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.bgDark,
                      Color.lerp(const Color(0xFF0A0E1A), const Color(0xFF0F1B3D), _bgAnimController.value)!,
                      AppTheme.bgDark,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              );
            },
          ),

          // Subtle grid overlay
          CustomPaint(
            painter: _GridPainter(),
            size: Size.infinite,
          ),

          // Content
          FadeTransition(
            opacity: _fadeAnim,
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 720),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Logo/Brand
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: AppTheme.primaryGradient,
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.accentBlue.withAlpha(51),
                              blurRadius: 30,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.hub, color: Colors.white, size: 36),
                      ),
                      const SizedBox(height: 24),

                      // Title
                      ShaderMask(
                        shaderCallback: (bounds) => AppTheme.primaryGradient.createShader(bounds),
                        child: Text(
                          'Adaptive Supply Chain',
                          style: GoogleFonts.outfit(
                            fontSize: 36,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Describe your business idea and AI will design your entire\nsupply chain with dynamic, interactive dashboards.',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: AppTheme.textSecondary,
                          height: 1.5,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 40),

                      // Input area
                      Container(
                        decoration: BoxDecoration(
                          gradient: AppTheme.glassGradient,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderLight),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.accentBlue.withAlpha(13),
                              blurRadius: 40,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '💡 Your Business Idea',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _ideaController,
                              maxLines: 4,
                              style: GoogleFonts.inter(
                                color: AppTheme.textPrimary,
                                fontSize: 15,
                              ),
                              decoration: InputDecoration(
                                hintText: 'e.g., "Premium Japanese matcha tea sold direct-to-consumer with farm-to-cup traceability and international shipping"',
                                hintMaxLines: 3,
                                filled: true,
                                fillColor: AppTheme.bgDark,
                              ),
                              onChanged: (_) => setState(() {}),
                            ),
                            const SizedBox(height: 16),

                            // Generate button
                            SizedBox(
                              width: double.infinity,
                              height: 52,
                              child: ElevatedButton(
                                onPressed: provider.isGenerating || _ideaController.text.trim().isEmpty
                                    ? null
                                    : () => _generate(provider),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.accentBlue,
                                  disabledBackgroundColor: AppTheme.accentBlue.withAlpha(77),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                ),
                                child: provider.isGenerating
                                    ? Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              valueColor: AlwaysStoppedAnimation(Colors.white.withAlpha(179)),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Text(
                                            'AI is designing your supply chain...',
                                            style: GoogleFonts.inter(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.white.withAlpha(179),
                                            ),
                                          ),
                                        ],
                                      )
                                    : Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          const Icon(Icons.auto_awesome, size: 20),
                                          const SizedBox(width: 8),
                                          Text(
                                            'Generate Supply Chain',
                                            style: GoogleFonts.inter(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                        ],
                                      ),
                              ),
                            ),

                            // Error display
                            if (provider.error != null) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppTheme.error.withAlpha(26),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppTheme.error.withAlpha(77)),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.error_outline, color: AppTheme.error, size: 18),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        provider.error!,
                                        style: const TextStyle(color: AppTheme.error, fontSize: 13),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Example ideas
                      Text(
                        'Try an example',
                        style: GoogleFonts.inter(
                          color: AppTheme.textMuted,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        alignment: WrapAlignment.center,
                        children: _exampleIdeas.map((example) {
                          return _ExampleChip(
                            icon: example['icon'] as IconData,
                            title: example['title'] as String,
                            desc: example['desc'] as String,
                            onTap: () {
                              _ideaController.text = example['desc'] as String;
                              setState(() {});
                            },
                          );
                        }).toList(),
                      ),

                      const SizedBox(height: 40),

                      // Features
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _FeatureBadge(icon: Icons.psychology, label: 'Agentic AI'),
                          const SizedBox(width: 24),
                          _FeatureBadge(icon: Icons.dynamic_feed, label: 'Dynamic UI'),
                          const SizedBox(width: 24),
                          _FeatureBadge(icon: Icons.sync, label: 'Real-Time'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _generate(SupplyChainProvider provider) async {
    await provider.generateChain(_ideaController.text.trim());
    if (provider.currentChain != null && mounted) {
      Navigator.of(context).pushReplacementNamed('/chain');
    }
  }
}

class _ExampleChip extends StatefulWidget {
  final IconData icon;
  final String title;
  final String desc;
  final VoidCallback onTap;

  const _ExampleChip({
    required this.icon,
    required this.title,
    required this.desc,
    required this.onTap,
  });

  @override
  State<_ExampleChip> createState() => _ExampleChipState();
}

class _ExampleChipState extends State<_ExampleChip> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: _isHovered ? AppTheme.accentBlue.withAlpha(26) : AppTheme.bgCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: _isHovered ? AppTheme.accentBlue.withAlpha(77) : AppTheme.borderColor,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(widget.icon,
                  color: _isHovered ? AppTheme.accentBlue : AppTheme.textMuted,
                  size: 18),
              const SizedBox(width: 8),
              Text(widget.title, style: TextStyle(
                color: _isHovered ? AppTheme.textPrimary : AppTheme.textSecondary,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              )),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeatureBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  const _FeatureBadge({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: AppTheme.textMuted, size: 16),
        const SizedBox(width: 6),
        Text(label, style: GoogleFonts.inter(
          color: AppTheme.textMuted,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        )),
      ],
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.accentBlue.withAlpha(8)
      ..strokeWidth = 0.5;

    for (var i = 0.0; i < size.width; i += 60) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (var i = 0.0; i < size.height; i += 60) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
