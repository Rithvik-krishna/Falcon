import 'dart:typed_data';

enum GestureType {
  move,
  leftClick,
  rightClick,
  doubleClick,
  scroll,
  keyPress,
}

class GestureEncoder {
  static Uint8List encodeTouchGesture({
    required GestureType type,
    required double xNormalized,
    required double yNormalized,
  }) {
    // Write 8-byte binary framing header: [Version: 1B][Type: 2B][Length: 4B][Flags: 1B]
    final buffer = ByteData(8 + 8);
    buffer.setUint8(0, 1); // Protocol Version 1
    buffer.setUint16(1, _gestureTypeId(type), Endian.big); // Message Type ID
    buffer.setUint32(3, 8, Endian.big); // Payload length (8 bytes for X,Y floats)
    buffer.setUint8(7, 0); // Flags

    // Payload: Float32 X, Float32 Y
    buffer.setFloat32(8, xNormalized, Endian.big);
    buffer.setFloat32(12, yNormalized, Endian.big);

    return buffer.buffer.asUint8List();
  }

  static int _gestureTypeId(GestureType type) {
    switch (type) {
      case GestureType.move:
        return 0x0101;
      case GestureType.leftClick:
        return 0x0102;
      case GestureType.rightClick:
        return 0x0103;
      case GestureType.doubleClick:
        return 0x0104;
      case GestureType.scroll:
        return 0x0105;
      case GestureType.keyPress:
        return 0x0106;
    }
  }
}
