import type { AuditEvent, Environment, RiskLevel } from '../types/domain';
import { auditEvents } from '../data/audit';
import { withLatency } from './simulate';

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

export const auditService = {
  list(filters: AuditFilters = {}): Promise<AuditEvent[]> {
    let results = auditEvents;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((e) => `${e.action} ${e.user} ${e.correlationId}`.toLowerCase().includes(q));
    }
    if (filters.user) results = results.filter((e) => e.user === filters.user);
    if (filters.agentId) results = results.filter((e) => e.agentId === filters.agentId);
    if (filters.projectId) results = results.filter((e) => e.projectId === filters.projectId);
    if (filters.mcpServer) results = results.filter((e) => e.mcpServer === filters.mcpServer);
    if (filters.riskLevel) results = results.filter((e) => e.riskLevel === filters.riskLevel);
    if (filters.result) results = results.filter((e) => e.result === filters.result);
    if (filters.environment) results = results.filter((e) => e.environment === filters.environment);
    return withLatency([...results].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)));
  },

  getById(id: string): Promise<AuditEvent | undefined> {
    return withLatency(auditEvents.find((e) => e.id === id));
  },
};
