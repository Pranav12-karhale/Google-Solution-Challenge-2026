import 'package:flutter/material.dart';
import '../models/supply_chain.dart';
import '../models/risk_models.dart';
import '../services/api_service.dart';

class SupplyChainProvider extends ChangeNotifier {
  SupplyChain? _currentChain;
  List<Map<String, dynamic>> _chainList = [];
  bool _isGenerating = false;
  String? _error;
  String? _selectedNodeId;
  RiskReport? _riskReport;
  bool _isScanning = false;

  SupplyChain? get currentChain => _currentChain;
  List<Map<String, dynamic>> get chainList => _chainList;
  bool get isGenerating => _isGenerating;
  String? get error => _error;
  String? get selectedNodeId => _selectedNodeId;
  RiskReport? get riskReport => _riskReport;
  bool get isScanning => _isScanning;
  bool get hasRiskData => _riskReport != null;
  double get overallChainRisk => _riskReport?.overallChainRisk ?? 0;
  List<RiskScanResult> get highRiskNodes => _riskReport?.highRiskNodes ?? [];

  SupplyChainNode? get selectedNode {
    if (_currentChain == null || _selectedNodeId == null) return null;
    try {
      return _currentChain!.nodes.firstWhere((n) => n.id == _selectedNodeId);
    } catch (_) {
      return null;
    }
  }

  /// Generate a new supply chain from a business idea
  Future<void> generateChain(
    String businessIdea, {
    Map<String, dynamic>? clientLocation,
    bool strictLocal = false,
    String chainScope = 'auto',
    String? destination,
    String displayStrategy = 'best_route',
  }) async {
    _isGenerating = true;
    _error = null;
    notifyListeners();

    try {
      final chain = await ApiService.generateSupplyChain(
        businessIdea,
        clientLocation: clientLocation,
        strictLocal: strictLocal,
        chainScope: chainScope,
        destination: destination,
        displayStrategy: displayStrategy,
      );
      _currentChain = chain;
      _selectedNodeId = chain.nodes.isNotEmpty ? chain.nodes.first.id : null;
      _error = null;
      await refreshChainList();
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isGenerating = false;
      notifyListeners();
    }
  }

  /// Load an existing chain
  Future<void> loadChain(String chainId) async {
    try {
      final chain = await ApiService.getChain(chainId);
      _currentChain = chain;
      _selectedNodeId = chain.nodes.isNotEmpty ? chain.nodes.first.id : null;
      _error = null;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Select a node to display
  void selectNode(String nodeId) {
    _selectedNodeId = nodeId;
    notifyListeners();
  }

  /// Refresh chain list
  Future<void> refreshChainList() async {
    try {
      _chainList = await ApiService.listChains();
      notifyListeners();
    } catch (_) {
      // Silently fail — non-critical
    }
  }

  /// Add a crisis node
  Future<void> addCrisisNode(String reason) async {
    if (_currentChain == null) return;

    try {
      final result = await ApiService.addCrisisNode(_currentChain!.id, reason);

      // Reload the chain to get the updated node list
      await loadChain(_currentChain!.id);

      // Select the new node
      if (result['node'] != null) {
        _selectedNodeId = result['node']['id'];
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Trigger a disruption
  Future<void> triggerDisruption(DisruptionEvent event) async {
    if (_currentChain == null) return;
    try {
      final chain = await ApiService.triggerDisruption(_currentChain!.id, event);
      _currentChain = chain;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  /// Resolve a disruption (get mitigation plan)
  Future<MitigationAction> resolveDisruption(DisruptionEvent event) async {
    if (_currentChain == null) throw Exception("No active chain");
    try {
      return await ApiService.resolveDisruption(_currentChain!.id, event);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  /// Execute a mitigation action
  Future<void> executeMitigation(MitigationAction action) async {
    if (_currentChain == null) return;
    try {
      final chain = await ApiService.executeMitigation(_currentChain!.id, action);
      _currentChain = chain;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  /// Scan supply chain for risks (auto-detection)
  Future<void> scanForRisks() async {
    if (_currentChain == null) return;
    _isScanning = true;
    _error = null;
    notifyListeners();

    try {
      _riskReport = await ApiService.scanRisks(_currentChain!.id);
      // Reload chain to get updated risk metadata on nodes
      await loadChain(_currentChain!.id);
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isScanning = false;
      notifyListeners();
    }
  }

  /// Get risk for a specific node
  RiskScanResult? riskForNode(String nodeId) {
    return _riskReport?.forNode(nodeId);
  }

  /// Clear the current chain
  void clearChain() {
    _currentChain = null;
    _selectedNodeId = null;
    _riskReport = null;
    _error = null;
    notifyListeners();
  }
}
