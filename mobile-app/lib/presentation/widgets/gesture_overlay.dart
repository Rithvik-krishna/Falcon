import 'package:flutter/material.dart';
import '../../core/utils/gesture_encoder.dart';

class GestureOverlay extends StatelessWidget {
  final Widget child;
  final Function(GestureType type, double x, double y) onGestureDetected;

  const GestureOverlay({
    super.key,
    required this.child,
    required this.onGestureDetected,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) {
        final box = context.findRenderObject() as RenderBox;
        final local = details.localPosition;
        final xNorm = local.dx / box.size.width;
        final yNorm = local.dy / box.size.height;
        onGestureDetected(GestureType.leftClick, xNorm, yNorm);
      },
      onLongPressStart: (details) {
        final box = context.findRenderObject() as RenderBox;
        final local = details.localPosition;
        final xNorm = local.dx / box.size.width;
        final yNorm = local.dy / box.size.height;
        onGestureDetected(GestureType.rightClick, xNorm, yNorm);
      },
      onDoubleTapDown: (details) {
        final box = context.findRenderObject() as RenderBox;
        final local = details.localPosition;
        final xNorm = local.dx / box.size.width;
        final yNorm = local.dy / box.size.height;
        onGestureDetected(GestureType.doubleClick, xNorm, yNorm);
      },
      child: child,
    );
  }
}
