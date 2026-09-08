import type { Agent, AgentCategory, EnabledStatus, Environment, RiskLevel, SdlcPhaseId } from '../types/domain';
import { apiFetch, apiFetchOptional, toQueryString } from './apiClient';

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

export const agentService = {
  list(filters: AgentFilters = {}): Promise<Agent[]> {
    return apiFetch<Agent[]>(`/api/agents${toQueryString(filters)}`);
  },

  getById(id: string): Promise<Agent | undefined> {
    return apiFetchOptional<Agent>(`/api/agents/${id}`);
  },

  setEnabled(id: string, enabled: boolean): Promise<Agent | undefined> {
    return apiFetchOptional<Agent>(`/api/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  },

  /** Triggers a demo-mode run. Appends a synthetic execution record; does not call a real agent. */
  run(id: string, context: { projectId: string; environment: Environment }): Promise<Agent | undefined> {
    return apiFetchOptional<Agent>(`/api/agents/${id}`, {
      method: 'POST',
      body: JSON.stringify(context),
    });
  },
};
