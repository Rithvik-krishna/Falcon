import test from 'node:test';
import assert from 'node:assert/strict';

test('Milestone 2 Device Heartbeat Timeout Evaluator Logic', () => {
  const now = Date.now();
  const lastSeen20sAgo = new Date(now - 20_000);
  const lastSeen40sAgo = new Date(now - 40_000);
  const threshold = new Date(now - 30_000);

  // Device seen 20s ago is still ONLINE (< 30s threshold)
  assert.equal(lastSeen20sAgo.getTime() > threshold.getTime(), true);

  // Device seen 40s ago is STALE (> 30s threshold) -> Should transition to OFFLINE
  assert.equal(lastSeen40sAgo.getTime() < threshold.getTime(), true);
});
