import type { Environment, Workflow, WorkflowStatus } from '../types/domain';
import { apiFetch, apiFetchOptional, toQueryString } from './apiClient';

export interface WorkflowFilters {
  status?: WorkflowStatus;
  search?: string;
}

export const workflowService = {
  list(filters: WorkflowFilters = {}): Promise<Workflow[]> {
    return apiFetch<Workflow[]>(`/api/workflows${toQueryString(filters)}`);
  },

  getById(id: string): Promise<Workflow | undefined> {
    return apiFetchOptional<Workflow>(`/api/workflows/${id}`);
  },

  /** Demo-only: resets a workflow to a fresh active run, first step marked running. */
  startRun(id: string): Promise<Workflow | undefined> {
    return apiFetchOptional<Workflow>(`/api/workflows/${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'start' }),
    });
  },

  /**
   * Marks steps before `stepIndex` completed and `stepIndex` itself running
   * (or completed, if it's the last step) — called once per tick by a
   * client-side step runner. On the last step, the server completes the
   * workflow and appends a single audit event for the whole run.
   */
  advanceStep(id: string, stepIndex: number, context: { projectId: string; environment: Environment }): Promise<Workflow | undefined> {
    return apiFetchOptional<Workflow>(`/api/workflows/${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'advance', stepIndex, ...context }),
    });
  },
};
