import test from 'node:test';
import assert from 'node:assert';
import { EnterpriseSsoService } from './sso_service.js';
import { ScimProvisioningService } from './scim_service.js';

test('Enterprise SAML 2.0 Assertion Verification', () => {
  const sso = new EnterpriseSsoService();
  const res = sso.parseSamlAssertion('<saml:Assertion>Verified</saml:Assertion>');
  assert.strictEqual(res.email, 'enterprise.user@company.com');
});

test('SCIM 2.0 Provisioning and Deprovisioning Lifecycle', () => {
  const scim = new ScimProvisioningService();
  const user = scim.createUser({ userName: 'employee@corp.com' });
  assert.strictEqual(user.active, true);

  const ok = scim.deprovisionUser(user.id);
  assert.strictEqual(ok, true);
  assert.strictEqual(scim.getUser(user.id)?.active, false);
});
