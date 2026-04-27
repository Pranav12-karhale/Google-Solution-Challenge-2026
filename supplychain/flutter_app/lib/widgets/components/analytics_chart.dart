import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../config/theme.dart';

class AnalyticsChart extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const AnalyticsChart({super.key, required this.args, this.accentColor});

  @override
  State<AnalyticsChart> createState() => _AnalyticsChartState();
}

class _AnalyticsChartState extends State<AnalyticsChart>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  int? _touchedIndex;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
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
    final chartType = widget.args['chartType'] ?? 'line';
    final title = widget.args['title'] ?? 'Chart';
    final data = (widget.args['data'] as List? ?? []).cast<Map<String, dynamic>>();
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: AppTheme.cardDecoration(accentColor: accent),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                chartType == 'pie' ? Icons.pie_chart : Icons.show_chart,
                color: accent,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 220,
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                switch (chartType) {
                  case 'line':
                    return _buildLineChart(data, accent);
                  case 'bar':
                    return _buildBarChart(data, accent);
                  case 'pie':
                    return _buildPieChart(data, accent);
                  default:
                    return _buildLineChart(data, accent);
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLineChart(List<Map<String, dynamic>> data, Color accent) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final xKey = data.first.keys.first;
    final yKey = data.first.keys.last;

    final spots = data.asMap().entries.map((e) {
      final yVal = (e.value[yKey] is num ? e.value[yKey] : 0).toDouble();
      return FlSpot(e.key.toDouble(), yVal * _controller.value);
    }).toList();

    final maxY = data.map((d) => (d[yKey] is num ? d[yKey] : 0).toDouble()).reduce((a, b) => a > b ? a : b);

    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: maxY / 4,
          getDrawingHorizontalLine: (value) => FlLine(
            color: AppTheme.borderColor,
            strokeWidth: 1,
          ),
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 42,
              getTitlesWidget: (value, meta) => Text(
                value.toInt().toString(),
                style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
              ),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                final idx = value.toInt();
                if (idx >= 0 && idx < data.length) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      data[idx][xKey].toString(),
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                  );
                }
                return const SizedBox();
              },
            ),
          ),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: accent,
            barWidth: 3,
            dotData: FlDotData(
              show: true,
              getDotPainter: (spot, percent, barData, index) =>
                  FlDotCirclePainter(
                radius: 4,
                color: accent,
                strokeWidth: 2,
                strokeColor: AppTheme.bgCard,
              ),
            ),
            belowBarData: BarAreaData(
              show: true,
              gradient: LinearGradient(
                colors: [accent.withAlpha(51), accent.withAlpha(0)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
        ],
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            getTooltipColor: (spot) => AppTheme.bgCard,
            tooltipRoundedRadius: 8,
            getTooltipItems: (spots) => spots.map((s) {
              return LineTooltipItem(
                '${s.y.toInt()}',
                TextStyle(color: accent, fontWeight: FontWeight.w600),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildBarChart(List<Map<String, dynamic>> data, Color accent) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final xKey = data.first.keys.first;
    final yKey = data.first.keys.last;
    final maxY = data.map((d) => (d[yKey] is num ? d[yKey] : 0).toDouble()).reduce((a, b) => a > b ? a : b);

    return BarChart(
      BarChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: maxY / 4,
          getDrawingHorizontalLine: (value) => FlLine(
            color: AppTheme.borderColor,
            strokeWidth: 1,
          ),
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 42,
              getTitlesWidget: (value, meta) => Text(
                value.toInt().toString(),
                style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
              ),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                final idx = value.toInt();
                if (idx >= 0 && idx < data.length) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      data[idx][xKey].toString(),
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                    ),
                  );
                }
                return const SizedBox();
              },
            ),
          ),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        borderData: FlBorderData(show: false),
        barGroups: data.asMap().entries.map((e) {
          final yVal = (e.value[yKey] is num ? e.value[yKey] : 0).toDouble();
          return BarChartGroupData(
            x: e.key,
            barRods: [
              BarChartRodData(
                toY: yVal * _controller.value,
                color: accent,
                width: 20,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                backDrawRodData: BackgroundBarChartRodData(
                  show: true,
                  toY: maxY * 1.1,
                  color: accent.withAlpha(13),
                ),
              ),
            ],
          );
        }).toList(),
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            getTooltipColor: (group) => AppTheme.bgCard,
            tooltipRoundedRadius: 8,
            getTooltipItem: (group, groupIndex, rod, rodIndex) {
              return BarTooltipItem(
                '${rod.toY.toInt()}',
                TextStyle(color: accent, fontWeight: FontWeight.w600),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildPieChart(List<Map<String, dynamic>> data, Color accent) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final colors = [
      accent,
      AppTheme.accentTeal,
      AppTheme.accentPurple,
      AppTheme.accentPink,
      AppTheme.accentOrange,
      AppTheme.success,
      const Color(0xFF64748B),
      const Color(0xFF06B6D4),
    ];

    final labelKey = data.first.keys.first;
    final valueKey = data.first.keys.last;

    return Row(
      children: [
        Expanded(
          flex: 3,
          child: PieChart(
            PieChartData(
              pieTouchData: PieTouchData(
                touchCallback: (event, response) {
                  setState(() {
                    if (!event.isInterestedForInteractions ||
                        response == null ||
                        response.touchedSection == null) {
                      _touchedIndex = -1;
                      return;
                    }
                    _touchedIndex = response.touchedSection!.touchedSectionIndex;
                  });
                },
              ),
              sections: data.asMap().entries.map((e) {
                final isTouched = _touchedIndex == e.key;
                final val = (e.value[valueKey] is num ? e.value[valueKey] : 0).toDouble();
                return PieChartSectionData(
                  value: val * _controller.value,
                  color: colors[e.key % colors.length],
                  radius: isTouched ? 85 : 75,
                  title: isTouched ? '${val.toInt()}' : '',
                  titleStyle: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                );
              }).toList(),
              centerSpaceRadius: 40,
              sectionsSpace: 2,
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          flex: 2,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: data.asMap().entries.map((e) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 3),
                child: Row(
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: colors[e.key % colors.length],
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        e.value[labelKey].toString(),
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
