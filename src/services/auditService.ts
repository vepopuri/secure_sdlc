import type { AuditEvent, Environment, RiskLevel } from '../types/domain';
import { apiFetch, apiFetchOptional, toQueryString } from './apiClient';

export interface AuditFilters {
  search?: string;
  user?: string;
  agentId?: string;
  projectId?: string;
  mcpServer?: string;
  riskLevel?: RiskLevel;
  result?: AuditEvent['result'];
  environment?: Environment;
}

// Audit rows are now written server-side, inside the mutating api/*.ts
// endpoint that needs one (see api/_lib/audit.ts) — in the same request as
// the mutation, so a client can no longer mutate state without the audit
// trail being written. There is deliberately no client-side append() here
// any more.
export const auditService = {
  list(filters: AuditFilters = {}): Promise<AuditEvent[]> {
    return apiFetch<AuditEvent[]>(`/api/audit${toQueryString(filters)}`);
  },

  getById(id: string): Promise<AuditEvent | undefined> {
    return apiFetchOptional<AuditEvent>(`/api/audit/${id}`);
  },
};
