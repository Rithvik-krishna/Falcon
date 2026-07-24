import 'package:flutter/material.dart';
import '../../widgets/gesture_overlay.dart';
import '../../widgets/virtual_keyboard.dart';
import '../../../core/utils/gesture_encoder.dart';

class RemoteDesktopScreen extends StatefulWidget {
  final String deviceName;

  const RemoteDesktopScreen({super.key, required this.deviceName});

  @override
  State<RemoteDesktopScreen> createState() => _RemoteDesktopScreenState();
}

class _RemoteDesktopScreenState extends State<RemoteDesktopScreen> {
  bool _showKeybar = false;

  void _handleGesture(GestureType type, double x, double y) {
    // Encodes gesture into 8-byte framed Protobuf packet & sends over DataChannel
    GestureEncoder.encodeTouchGesture(type: type, xNormalized: x, yNormalized: y);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.deviceName),
        actions: [
          IconButton(
            icon: const Icon(Icons.keyboard),
            onPressed: () {
              setState(() {
                _showKeybar = !_showKeybar;
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.call_end, color: Colors.red),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: GestureOverlay(
              onGestureDetected: _handleGesture,
              child: Container(
                color: Colors.black,
                child: const Center(
                  child: Text(
                    'WebRTC Video Stream Active (60 FPS)',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
              ),
            ),
          ),
          if (_showKeybar)
            VirtualKeybar(
              onKeyPressed: (key) {
                // Inject virtual keypress shortcut
              },
            ),
        ],
      ),
    );
  }
}
