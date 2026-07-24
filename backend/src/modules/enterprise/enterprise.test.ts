import test from 'node:test';
import assert from 'node:assert';
import { EnterpriseSsoService } from './sso_service.js';
import { ScimProvisioningService } from './scim_service.js';
import { ImmutableAuditLogger } from './audit_logger.js';
import { MultiTenantService } from './tenant_service.js';

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

test('Immutable Audit Logger Cryptographic Tamper-Proof Chain', () => {
  const logger = new ImmutableAuditLogger();
  logger.logEvent('user-101', 'SESSION_STARTED', 'dev-001');
  logger.logEvent('user-101', 'FILE_TRANSFERRED', 'dev-001', { file: 'doc.pdf' });

  assert.strictEqual(logger.verifyChainIntegrity(), true);
  assert.strictEqual(logger.getLogs().length, 2);
});

test('Multi-Tenant Hierarchy Resource Isolation', () => {
  const tenantService = new MultiTenantService();
  const parentOrg = tenantService.createOrganization('Parent Corp');
  const childOrg = tenantService.createOrganization('Child Division', parentOrg.id);

  // Parent has access to child resources
  assert.strictEqual(tenantService.validateTenantIsolation(parentOrg.id, childOrg.id), true);

  // Child does NOT have access to parent resources
  assert.strictEqual(tenantService.validateTenantIsolation(childOrg.id, parentOrg.id), false);
});
