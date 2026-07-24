/**
 * Falcon Binary Protocol Framing Header (8 bytes):
 * -------------------------------------------------------------
 * Field    | Size    | Description
 * -------------------------------------------------------------
 * Version  | 1 byte  | Protocol version (default: 0x01)
 * Type     | 2 bytes | Message type identifier (UInt16 BE)
 * Length   | 4 bytes | Length of following payload (UInt32 BE)
 * Flags    | 1 byte  | Message flags (e.g. 0x01 = Encrypted, 0x02 = Compressed)
 * -------------------------------------------------------------
 */

export const HEADER_SIZE = 8;
export const PROTOCOL_VERSION = 1;

export interface ProtocolHeader {
  version: number;
  type: number;
  length: number;
  flags: number;
}

export function serializeHeader(header: ProtocolHeader): Buffer {
  const buf = Buffer.alloc(HEADER_SIZE);
  buf.writeUInt8(header.version, 0);
  buf.writeUInt16BE(header.type, 1);
  buf.writeUInt32BE(header.length, 3);
  buf.writeUInt8(header.flags, 7);
  return buf;
}

export function deserializeHeader(buf: Buffer): ProtocolHeader {
  if (buf.length < HEADER_SIZE) {
    throw new Error(`Buffer underflow: expected at least ${HEADER_SIZE} bytes, got ${buf.length}`);
  }
  return {
    version: buf.readUInt8(0),
    type: buf.readUInt16BE(1),
    length: buf.readUInt32BE(3),
    flags: buf.readUInt8(7),
  };
}

export function wrapFrame(type: number, payload: Buffer, flags = 0): Buffer {
  const headerBuf = serializeHeader({
    version: PROTOCOL_VERSION,
    type,
    length: payload.length,
    flags,
  });
  return Buffer.concat([headerBuf, payload]);
}

export function unwrapFrame(frameBuf: Buffer): { header: ProtocolHeader; payload: Buffer } {
  const header = deserializeHeader(frameBuf);
  const payload = frameBuf.subarray(HEADER_SIZE, HEADER_SIZE + header.length);
  return { header, payload };
}
