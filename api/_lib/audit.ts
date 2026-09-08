// Server-side audit-event writer, called from inside each mutating
// endpoint's own handler (in the same request) rather than by the client
// making a second fetch after its own in-memory mutation, the way the old
// mock auditService.append() worked. This closes the soft trust boundary
// the mock layer had: a client can no longer mutate state without the
// audit trail being written, because the write now happens here, next to
// the mutation itself, inside one handler.
import { randomUUID } from 'node:crypto';
import { db } from './db.js';
import { auditEvents } from '../../db/schema.js';
import type { AuditEvent, Environment, RiskLevel } from '../../src/types/domain.js';

// Single-tenant demo app (see src/data/orgs.ts's own "one tenant" comment) —
// duplicated here as a literal rather than imported, since src/data/** is
// authored for the app's Vite/bundler build and importing it here would
// pull it into this api/ program's stricter Node module resolution.
const TENANT_NAME = 'Northwind Platform Engineering';

export interface AppendAuditEventInput {
  action: string;
  user: string;
  projectId: string;
  environment: Environment;
  policyDecision: AuditEvent['policyDecision'];
  result: AuditEvent['result'];
  agentId?: string | null;
  riskLevel?: RiskLevel;
  mcpServer?: string | null;
  tool?: string | null;
  correlationId?: string;
  relatedWorkflowId?: string;
  relatedGraphEntityIds?: string[];
  inputClassification?: string;
  outputClassification?: string;
}

export async function appendAuditEvent(input: AppendAuditEventInput): Promise<void> {
  const event = {
    id: `audit_${randomUUID()}`,
    timestamp: new Date().toISOString(),
    tenant: TENANT_NAME,
    agentId: null,
    mcpServer: null,
    tool: null,
    riskLevel: 'low' as RiskLevel,
    correlationId: `corr-${randomUUID().slice(0, 8)}`,
    ...input,
  };
  await db.insert(auditEvents).values(event);
}
