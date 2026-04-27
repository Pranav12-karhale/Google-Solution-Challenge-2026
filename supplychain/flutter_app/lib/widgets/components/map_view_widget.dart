import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../config/theme.dart';

class MapViewWidget extends StatefulWidget {
  final Map<String, dynamic> args;
  final Color? accentColor;

  const MapViewWidget({super.key, required this.args, this.accentColor});

  @override
  State<MapViewWidget> createState() => _MapViewWidgetState();
}

class _MapViewWidgetState extends State<MapViewWidget> with SingleTickerProviderStateMixin {
  late AnimationController _animController;

  late LatLng _origin;
  late LatLng _destination;
  late LatLng _currentPos;

  // Helper to safely parse LatLng from dynamic AI maps
  LatLng _parseLatLng(dynamic mapArgs, LatLng fallback) {
    if (mapArgs == null || mapArgs is! Map) return fallback;
    final lat = double.tryParse(mapArgs['lat']?.toString() ?? '');
    final lng = double.tryParse(mapArgs['lng']?.toString() ?? '');
    if (lat != null && lng != null) {
      return LatLng(lat, lng);
    }
    return fallback;
  }

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    // Parse from AI schema, fallback to Shanghai/LA
    _origin = _parseLatLng(widget.args['origin'], const LatLng(31.2304, 121.4737));
    _destination = _parseLatLng(widget.args['destination'], const LatLng(34.0522, -118.2437));
    
    // Calculate simple midpoint for current position animation
    _currentPos = LatLng(
      (_origin.latitude + _destination.latitude) / 2,
      (_origin.longitude + _destination.longitude) / 2,
    );
  }

  @override
  void didUpdateWidget(MapViewWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Update if node reloads
    _origin = _parseLatLng(widget.args['origin'], _origin);
    _destination = _parseLatLng(widget.args['destination'], _destination);
    _currentPos = LatLng(
      (_origin.latitude + _destination.latitude) / 2,
      (_origin.longitude + _destination.longitude) / 2,
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accentColor ?? AppTheme.accentBlue;

    return Container(
      height: 300,
      decoration: AppTheme.cardDecoration(accentColor: accent),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Flutter Map
          FlutterMap(
            options: MapOptions(
              initialCameraFit: CameraFit.bounds(
                bounds: LatLngBounds.fromPoints([_origin, _destination]),
                padding: const EdgeInsets.all(40.0),
              ),
              interactionOptions: const InteractionOptions(
                flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
              ),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                subdomains: const ['a', 'b', 'c', 'd'],
                userAgentPackageName: 'com.supplychain.adaptive',
              ),
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: [_origin, _destination],
                    color: accent.withAlpha(128),
                    strokeWidth: 2.0,
                    pattern: const StrokePattern.dotted(),
                  ),
                ],
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _origin,
                    width: 30,
                    height: 30,
                    child: Icon(Icons.location_on, color: AppTheme.success, size: 24),
                  ),
                  Marker(
                    point: _destination,
                    width: 30,
                    height: 30,
                    child: Icon(Icons.location_on, color: AppTheme.accentPurple, size: 24),
                  ),
                  Marker(
                    point: _currentPos,
                    width: 40,
                    height: 40,
                    child: AnimatedBuilder(
                      animation: _animController,
                      builder: (context, child) {
                        return Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: accent.withAlpha((150 + 105 * _animController.value).toInt()),
                            boxShadow: [
                              BoxShadow(
                                color: accent.withAlpha(100),
                                blurRadius: 10 * _animController.value,
                                spreadRadius: 2 * _animController.value,
                              ),
                            ],
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          child: Icon(Icons.directions_boat, color: Colors.white, size: 16),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Header Overlay
          Positioned(
            top: 12,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.bgDark.withAlpha(200),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: Row(
                children: [
                  Icon(Icons.map_outlined, color: accent, size: 16),
                  const SizedBox(width: 8),
                  Text('Live GIS Tracking', style: TextStyle(
                    color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w600,
                  )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
