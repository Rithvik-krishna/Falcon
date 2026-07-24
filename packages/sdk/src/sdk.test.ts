import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeHeader, deserializeHeader, wrapFrame, unwrapFrame, PROTOCOL_VERSION } from './header.js';
import { encryptAESGCM, decryptAESGCM } from './crypto.js';

test('Protocol Header Serialization Roundtrip', () => {
  const header = {
    version: PROTOCOL_VERSION,
    type: 0x0102,
    length: 256,
    flags: 0x01,
  };

  const serialized = serializeHeader(header);
  assert.equal(serialized.length, 8);

  const deserialized = deserializeHeader(serialized);
  assert.deepEqual(deserialized, header);
});

test('Frame Wrap and Unwrap', () => {
  const payload = Buffer.from('Hello Falcon WebRTC DataChannel');
  const frame = wrapFrame(0x0201, payload, 0x01);

  const { header, payload: unwrappedPayload } = unwrapFrame(frame);
  assert.equal(header.type, 0x0201);
  assert.equal(header.flags, 0x01);
  assert.equal(unwrappedPayload.toString(), 'Hello Falcon WebRTC DataChannel');
});

test('AES-256-GCM Encryption/Decryption Roundtrip', () => {
  const key = Buffer.alloc(32, 7); // 32-byte test key
  const plaintext = Buffer.from('Confidential Falcon Session Key Payload');

  const encrypted = encryptAESGCM(plaintext, key);
  const decrypted = decryptAESGCM(encrypted, key);

  assert.equal(decrypted.toString(), plaintext.toString());
});
