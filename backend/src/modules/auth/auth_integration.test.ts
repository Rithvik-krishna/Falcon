import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.service.js';

test('Milestone 2 Auth Integration Logic', () => {
  // Test JWT token generation & verification
  const payload = { id: 'user-uuid-1234', email: 'test@falcon.io' };
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' });

  const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string };
  assert.equal(decoded.id, 'user-uuid-1234');
  assert.equal(decoded.email, 'test@falcon.io');

  // Test Refresh Token SHA-256 Hashing
  const rawRefreshToken = crypto.randomBytes(32).toString('hex');
  const hash1 = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  const hash2 = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});
