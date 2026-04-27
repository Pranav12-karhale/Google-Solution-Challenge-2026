/// Risk models for automatic disruption detection

class NodeRiskDetail {
  final String category;
  final double score;
  final String headline;
  final String explanation;
  final String recommendedAction;

  NodeRiskDetail({
    required this.category,
    required this.score,
    required this.headline,
    required this.explanation,
    required this.recommendedAction,
  });

  factory NodeRiskDetail.fromJson(Map<String, dynamic> json) {
    return NodeRiskDetail(
      category: json['category'] ?? '',
      score: (json['score'] ?? 0).toDouble(),
      headline: json['headline'] ?? '',
      explanation: json['explanation'] ?? '',
      recommendedAction: json['recommended_action'] ?? '',
    );
  }
}

class RiskScanResult {
  final String nodeId;
  final String nodeName;
  final String location;
  final double overallRisk;
  final List<NodeRiskDetail> risks;

  RiskScanResult({
    required this.nodeId,
    required this.nodeName,
    required this.location,
    required this.overallRisk,
    required this.risks,
  });

  factory RiskScanResult.fromJson(Map<String, dynamic> json) {
    return RiskScanResult(
      nodeId: json['node_id'] ?? '',
      nodeName: json['node_name'] ?? '',
      location: json['location'] ?? '',
      overallRisk: (json['overall_risk'] ?? 0).toDouble(),
      risks: (json['risks'] as List? ?? [])
          .map((r) => NodeRiskDetail.fromJson(r as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Highest-severity risk for quick display
  NodeRiskDetail? get topRisk =>
      risks.isNotEmpty ? (risks..sort((a, b) => b.score.compareTo(a.score))).first : null;
}

class RiskReport {
  final String chainId;
  final String scannedAt;
  final double overallChainRisk;
  final List<RiskScanResult> results;

  RiskReport({
    required this.chainId,
    required this.scannedAt,
    required this.overallChainRisk,
    required this.results,
  });

  factory RiskReport.fromJson(Map<String, dynamic> json) {
    return RiskReport(
      chainId: json['chain_id'] ?? '',
      scannedAt: json['scanned_at'] ?? '',
      overallChainRisk: (json['overall_chain_risk'] ?? 0).toDouble(),
      results: (json['results'] as List? ?? [])
          .map((r) => RiskScanResult.fromJson(r as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Get risk result for a specific node
  RiskScanResult? forNode(String nodeId) {
    try {
      return results.firstWhere((r) => r.nodeId == nodeId);
    } catch (_) {
      return null;
    }
  }

  /// Nodes sorted by risk (highest first)
  List<RiskScanResult> get sortedByRisk =>
      List.from(results)..sort((a, b) => b.overallRisk.compareTo(a.overallRisk));

  /// Only high-risk nodes (score >= 6)
  List<RiskScanResult> get highRiskNodes =>
      results.where((r) => r.overallRisk >= 6).toList();
}
