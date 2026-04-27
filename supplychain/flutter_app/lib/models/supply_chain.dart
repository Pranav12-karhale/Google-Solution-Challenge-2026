import 'dart:ui' show Color;

// ============================================================
// Supply Chain Model
// ============================================================
class SupplyChain {
  final String id;
  final String name;
  final String businessIdea;
  final String status;
  final String createdAt;
  final List<SupplyChainNode> nodes;
  final List<SupplyChainEdge> edges;

  SupplyChain({
    required this.id,
    required this.name,
    required this.businessIdea,
    required this.status,
    required this.createdAt,
    required this.nodes,
    required this.edges,
  });

  factory SupplyChain.fromJson(Map<String, dynamic> json) {
    return SupplyChain(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      businessIdea: json['business_idea'] ?? '',
      status: json['status'] ?? 'active',
      createdAt: json['created_at'] ?? '',
      nodes: (json['nodes'] as List? ?? [])
          .map((n) => SupplyChainNode.fromJson(n as Map<String, dynamic>))
          .toList(),
      edges: (json['edges'] as List? ?? [])
          .map((e) => SupplyChainEdge.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'business_idea': businessIdea,
    'status': status,
    'created_at': createdAt,
    'nodes': nodes.map((n) => n.toJson()).toList(),
    'edges': edges.map((e) => e.toJson()).toList(),
  };
}

// ============================================================
// Supply Chain Node Model
// ============================================================
class SupplyChainNode {
  final String id;
  final String name;
  final String type;
  final String description;
  final String status;
  final int order;
  final Map<String, dynamic> metadata;
  final NodeUIConfig uiConfig;

  SupplyChainNode({
    required this.id,
    required this.name,
    required this.type,
    required this.description,
    required this.status,
    required this.order,
    required this.metadata,
    required this.uiConfig,
  });

  factory SupplyChainNode.fromJson(Map<String, dynamic> json) {
    return SupplyChainNode(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? 'supplier',
      description: json['description'] ?? '',
      status: json['status'] ?? 'active',
      order: json['order'] ?? 0,
      metadata: Map<String, dynamic>.from(json['metadata'] ?? {}),
      uiConfig: NodeUIConfig.fromJson(json['ui_config'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'type': type,
    'description': description,
    'status': status,
    'order': order,
    'metadata': metadata,
    'ui_config': uiConfig.toJson(),
  };
}

// ============================================================
// Node UI Configuration
// ============================================================
class NodeUIConfig {
  final String icon;
  final String color;
  final List<PageComponent> pageComponents;

  NodeUIConfig({
    required this.icon,
    required this.color,
    required this.pageComponents,
  });

  factory NodeUIConfig.fromJson(Map<String, dynamic> json) {
    return NodeUIConfig(
      icon: json['icon'] ?? 'inventory_2',
      color: json['color'] ?? '#3B82F6',
      pageComponents: (json['page_components'] as List? ?? [])
          .map((c) => PageComponent.fromJson(c as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'icon': icon,
    'color': color,
    'page_components': pageComponents.map((c) => c.toJson()).toList(),
  };

  Color get colorValue {
    try {
      final hex = color.replaceFirst('#', '');
      return Color(int.parse('FF$hex', radix: 16));
    } catch (_) {
      return const Color(0xFF3B82F6);
    }
  }
}

// ============================================================
// Page Component - Single UI widget config
// ============================================================
class PageComponent {
  final String type;
  final Map<String, dynamic> args;

  PageComponent({
    required this.type,
    required this.args,
  });

  factory PageComponent.fromJson(Map<String, dynamic> json) {
    return PageComponent(
      type: json['type'] ?? 'data_grid',
      args: Map<String, dynamic>.from(json['args'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() => {
    'type': type,
    'args': args,
  };
}

// ============================================================
// Supply Chain Edge
// ============================================================
class SupplyChainEdge {
  final String id;
  final String sourceNodeId;
  final String targetNodeId;
  final String relationship;
  final Map<String, dynamic> metadata;

  SupplyChainEdge({
    required this.id,
    required this.sourceNodeId,
    required this.targetNodeId,
    required this.relationship,
    required this.metadata,
  });

  factory SupplyChainEdge.fromJson(Map<String, dynamic> json) {
    return SupplyChainEdge(
      id: json['id'] ?? '',
      sourceNodeId: json['source_node_id'] ?? '',
      targetNodeId: json['target_node_id'] ?? '',
      relationship: json['relationship'] ?? '',
      metadata: Map<String, dynamic>.from(json['metadata'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'source_node_id': sourceNodeId,
    'target_node_id': targetNodeId,
    'relationship': relationship,
    'metadata': metadata,
  };
}

// ============================================================
// Disruption Models
// ============================================================
class DisruptionEvent {
  final String id;
  final String type;
  final String severity;
  final String description;
  final List<String> affectedNodeIds;
  final List<String> affectedEdgeIds;

  DisruptionEvent({
    required this.id,
    required this.type,
    required this.severity,
    required this.description,
    required this.affectedNodeIds,
    required this.affectedEdgeIds,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'severity': severity,
    'description': description,
    'affected_node_ids': affectedNodeIds,
    'affected_edge_ids': affectedEdgeIds,
    'timestamp': DateTime.now().toIso8601String(),
  };
}

class MitigationAction {
  final String id;
  final String actionType;
  final String description;
  final num costImpact;
  final num timeImpactDays;

  MitigationAction({
    required this.id,
    required this.actionType,
    required this.description,
    required this.costImpact,
    required this.timeImpactDays,
  });

  factory MitigationAction.fromJson(Map<String, dynamic> json) {
    return MitigationAction(
      id: json['id'] ?? '',
      actionType: json['action_type'] ?? '',
      description: json['description'] ?? '',
      costImpact: json['cost_impact'] ?? 0,
      timeImpactDays: json['time_impact_days'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'action_type': actionType,
    'description': description,
    'cost_impact': costImpact,
    'time_impact_days': timeImpactDays,
  };
}

