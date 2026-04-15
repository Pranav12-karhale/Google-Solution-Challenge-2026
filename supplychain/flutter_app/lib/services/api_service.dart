import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/supply_chain.dart';

class ApiService {
  // Use localhost for web, 10.0.2.2 for Android emulator
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3001/api';
    }
    return 'http://10.0.2.2:3001/api';
  }

  /// Generate a new supply chain from a business idea
  static Future<SupplyChain> generateSupplyChain(String businessIdea) async {
    final response = await http.post(
      Uri.parse('$baseUrl/generate'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'businessIdea': businessIdea}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return SupplyChain.fromJson(data['supply_chain']);
    } else {
      final err = jsonDecode(response.body);
      throw Exception(err['error'] ?? 'Failed to generate supply chain');
    }
  }

  /// Get list of all supply chains
  static Future<List<Map<String, dynamic>>> listChains() async {
    final response = await http.get(Uri.parse('$baseUrl/chains'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['chains']);
    }
    throw Exception('Failed to fetch chains');
  }

  /// Get a specific supply chain by ID
  static Future<SupplyChain> getChain(String chainId) async {
    final response = await http.get(Uri.parse('$baseUrl/chains/$chainId'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return SupplyChain.fromJson(data['supply_chain']);
    }
    throw Exception('Chain not found');
  }

  /// Add a crisis node to an existing chain
  static Future<Map<String, dynamic>> addCrisisNode(String chainId, String reason) async {
    final response = await http.post(
      Uri.parse('$baseUrl/chains/$chainId/add-node'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'reason': reason}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to add node');
  }

  /// Health check
  static Future<Map<String, dynamic>> healthCheck() async {
    final response = await http.get(Uri.parse('$baseUrl/health'));
    return jsonDecode(response.body);
  }
}
