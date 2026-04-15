import 'package:flutter/material.dart';
import '../models/supply_chain.dart';
import '../services/api_service.dart';

class SupplyChainProvider extends ChangeNotifier {
  SupplyChain? _currentChain;
  List<Map<String, dynamic>> _chainList = [];
  bool _isGenerating = false;
  String? _error;
  String? _selectedNodeId;

  SupplyChain? get currentChain => _currentChain;
  List<Map<String, dynamic>> get chainList => _chainList;
  bool get isGenerating => _isGenerating;
  String? get error => _error;
  String? get selectedNodeId => _selectedNodeId;

  SupplyChainNode? get selectedNode {
    if (_currentChain == null || _selectedNodeId == null) return null;
    try {
      return _currentChain!.nodes.firstWhere((n) => n.id == _selectedNodeId);
    } catch (_) {
      return null;
    }
  }

  /// Generate a new supply chain from a business idea
  Future<void> generateChain(String businessIdea) async {
    _isGenerating = true;
    _error = null;
    notifyListeners();

    try {
      final chain = await ApiService.generateSupplyChain(businessIdea);
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

  /// Clear the current chain
  void clearChain() {
    _currentChain = null;
    _selectedNodeId = null;
    _error = null;
    notifyListeners();
  }
}
