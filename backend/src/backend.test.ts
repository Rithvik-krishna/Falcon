import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from './utils/crypto.js';

test('Argon2id Password Hashing & Verification', async () => {
  const password = 'SuperSecurePassword2026!';
  const hash = await hashPassword(password);

  assert.ok(hash.startsWith('$argon2id$'));

  const isValid = await verifyPassword(hash, password);
  assert.equal(isValid, true);

  const isInvalid = await verifyPassword(hash, 'WrongPassword');
  assert.equal(isInvalid, false);
});
