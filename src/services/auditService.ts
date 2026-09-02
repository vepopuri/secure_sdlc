import type { AuditEvent, Environment, RiskLevel } from '../types/domain';
import { auditEvents } from '../data/audit';
import { workspace } from '../data/orgs';
import { withLatency } from './simulate';
import { initStore, savePersisted } from './persist';

// In-memory copy so approvals/agent runs/workflow completions can append real
// events without a backend. Replace this module with real HTTP calls against
// your Audit API; keep the exported function signatures the same.
const STORE_KEY = 'audit';
let store: AuditEvent[] = initStore(STORE_KEY, auditEvents.map((e) => ({ ...e })));

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

function append(input: AppendAuditEventInput): AuditEvent {
  const event: AuditEvent = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    tenant: workspace.name,
    agentId: null,
    mcpServer: null,
    tool: null,
    riskLevel: 'low',
    correlationId: `corr-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
  };
  store = [event, ...store];
  savePersisted(STORE_KEY, store);
  return event;
}

export const auditService = {
  list(filters: AuditFilters = {}): Promise<AuditEvent[]> {
    let results = store;
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
    return withLatency(store.find((e) => e.id === id));
  },

  append,
};
