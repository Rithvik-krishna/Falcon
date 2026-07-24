import 'package:flutter_test/flutter_test.dart';
import '../lib/core/utils/gesture_encoder.dart';

void main() {
  test('Touch Gesture Framing Header Serialization', () {
    final payload = GestureEncoder.encodeTouchGesture(
      type: GestureType.leftClick,
      xNormalized: 0.5,
      yNormalized: 0.5,
    );

    // Total length = 8 (Header) + 8 (Payload) = 16 bytes
    expect(payload.length, equals(16));
    expect(payload[0], equals(1)); // Protocol Version 1
  });
}
