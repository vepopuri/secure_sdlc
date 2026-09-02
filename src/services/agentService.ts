import type { Agent, AgentCategory, EnabledStatus, Environment, RiskLevel, SdlcPhaseId } from '../types/domain';
import { agents as seedAgents } from '../data/agents';
import { daysAgo } from '../data/mockHelpers';
import { withLatency } from './simulate';
import { auditService } from './auditService';
import { initStore, savePersisted } from './persist';

// In-memory copy so the demo can toggle agent enablement without a backend.
// Replace this module with real HTTP calls against your Agent API; keep the
// exported function signatures the same and callers do not need to change.
const STORE_KEY = 'agents';
let store: Agent[] = initStore(STORE_KEY, seedAgents.map((a) => ({ ...a })));

export interface AgentFilters {
  search?: string;
  phaseId?: SdlcPhaseId;
  category?: AgentCategory;
  riskLevel?: RiskLevel;
  status?: EnabledStatus;
  requiredMcpConnectorId?: string;
  readOrWrite?: Agent['readOrWrite'];
  approvalRequired?: boolean;
  securityRelated?: boolean;
}

function matches(agent: Agent, filters: AgentFilters): boolean {
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = `${agent.name} ${agent.shortDescription} ${agent.capabilities.join(' ')}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.phaseId && !agent.phaseIds.includes(filters.phaseId)) return false;
  if (filters.category && agent.category !== filters.category) return false;
  if (filters.riskLevel && agent.riskLevel !== filters.riskLevel) return false;
  if (filters.status && agent.status !== filters.status) return false;
  if (filters.requiredMcpConnectorId && !agent.requiredMcpConnectorIds.includes(filters.requiredMcpConnectorId)) return false;
  if (filters.readOrWrite && agent.readOrWrite !== filters.readOrWrite) return false;
  if (filters.approvalRequired !== undefined && agent.approvalRequired !== filters.approvalRequired) return false;
  if (filters.securityRelated !== undefined && agent.securityRelated !== filters.securityRelated) return false;
  return true;
}

export const agentService = {
  list(filters: AgentFilters = {}): Promise<Agent[]> {
    return withLatency(store.filter((a) => matches(a, filters)));
  },

  getById(id: string): Promise<Agent | undefined> {
    return withLatency(store.find((a) => a.id === id));
  },

  setEnabled(id: string, enabled: boolean): Promise<Agent | undefined> {
    store = store.map((a) => (a.id === id ? { ...a, status: enabled ? 'enabled' : 'disabled' } : a));
    savePersisted(STORE_KEY, store);
    return withLatency(store.find((a) => a.id === id));
  },

  /** Simulates a demo-mode run. Appends a synthetic execution record; does not call a real agent. */
  run(id: string, context: { projectId: string; environment: Environment }): Promise<Agent | undefined> {
    store = store.map((a) => {
      if (a.id !== id) return a;
      const record = {
        id: `${id}-run-manual-${Date.now()}`,
        timestamp: daysAgo(0),
        status: 'completed' as const,
        summary: 'Demo run completed. No real MCP connectors or systems were called.',
        durationSeconds: 12,
        confidenceScore: 0.91,
      };
      return { ...a, lastExecution: record, executionHistory: [record, ...a.executionHistory] };
    });
    savePersisted(STORE_KEY, store);
    const agent = store.find((a) => a.id === id);
    if (agent) {
      auditService.append({
        action: `Ran ${agent.name} (demo mode)`,
        user: agent.name,
        agentId: agent.id,
        projectId: context.projectId,
        environment: context.environment,
        riskLevel: agent.riskLevel,
        policyDecision: 'allowed',
        result: 'success',
        correlationId: `corr-run-${agent.lastExecution?.id ?? id}`,
      });
    }
    return withLatency(agent, 900);
  },
};
