import { createHash } from 'node:crypto';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: 'SESSION_STARTED' | 'SESSION_TERMINATED' | 'FILE_TRANSFERRED' | 'SETTINGS_CHANGED' | 'PERMISSION_GRANTED';
  resourceId: string;
  details: Record<string, any>;
  previousHash: string;
  signature: string;
}

export class ImmutableAuditLogger {
  private logChain: AuditLogEntry[] = [];
  private lastHash: string = '0000000000000000000000000000000000000000000000000000000000000000';

  public logEvent(
    actorId: string,
    action: AuditLogEntry['action'],
    resourceId: string,
    details: Record<string, any> = {}
  ): AuditLogEntry {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const dataToHash = `${id}|${timestamp}|${actorId}|${action}|${resourceId}|${JSON.stringify(details)}|${this.lastHash}`;
    const signature = createHash('sha256').update(dataToHash).digest('hex');

    const entry: AuditLogEntry = {
      id,
      timestamp,
      actorId,
      action,
      resourceId,
      details,
      previousHash: this.lastHash,
      signature,
    };

    this.lastHash = signature;
    this.logChain.push(entry);
    return entry;
  }

  public verifyChainIntegrity(): boolean {
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    for (const entry of this.logChain) {
      if (entry.previousHash !== prevHash) {
        return false;
      }
      const dataToHash = `${entry.id}|${entry.timestamp}|${entry.actorId}|${entry.action}|${entry.resourceId}|${JSON.stringify(entry.details)}|${prevHash}`;
      const expectedSignature = createHash('sha256').update(dataToHash).digest('hex');
      if (entry.signature !== expectedSignature) {
        return false;
      }
      prevHash = entry.signature;
    }
    return true;
  }

  public getLogs(): AuditLogEntry[] {
    return [...this.logChain];
  }
}
