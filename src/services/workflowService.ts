import type { Environment, Workflow, WorkflowStatus } from '../types/domain';
import { workflows as seedWorkflows } from '../data/workflows';
import { withLatency } from './simulate';
import { auditService } from './auditService';
import { initStore, savePersisted } from './persist';

const STORE_KEY = 'workflows';
let store: Workflow[] = initStore(STORE_KEY, seedWorkflows.map((w) => ({ ...w })));

export interface WorkflowFilters {
  status?: WorkflowStatus;
  search?: string;
}

export const workflowService = {
  list(filters: WorkflowFilters = {}): Promise<Workflow[]> {
    let results = store;
    if (filters.status) results = results.filter((w) => w.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((w) => `${w.name} ${w.description}`.toLowerCase().includes(q));
    }
    return withLatency(results);
  },

  getById(id: string): Promise<Workflow | undefined> {
    return withLatency(store.find((w) => w.id === id));
  },

  /** Demo-only: resets a workflow to a fresh active run, first step marked running. */
  startRun(id: string): Promise<Workflow | undefined> {
    const current = store.find((w) => w.id === id);
    if (!current) return withLatency(undefined);
    const steps = current.steps.map((s, i) => (i === 0 ? { ...s, status: 'running' as const } : s));
    const refreshed: Workflow = { ...current, status: 'active', finalResult: null, currentStep: steps[0]?.label ?? current.currentStep, steps };
    store = store.map((w) => (w.id === id ? refreshed : w));
    savePersisted(STORE_KEY, store);
    return withLatency(refreshed, 400);
  },

  /**
   * Marks steps before `stepIndex` completed and `stepIndex` itself running
   * (or completed, if it's the last step) — called once per tick by a
   * client-side step runner. On the last step, completes the workflow and
   * appends a single audit event for the whole run (not one per step).
   */
  advanceStep(id: string, stepIndex: number, context: { projectId: string; environment: Environment }): Promise<Workflow | undefined> {
    const current = store.find((w) => w.id === id);
    if (!current) return withLatency(undefined);
    const isLast = stepIndex >= current.steps.length - 1;
    const steps = current.steps.map((s, i) => {
      if (i < stepIndex) return { ...s, status: 'completed' as const };
      if (i === stepIndex) return { ...s, status: isLast ? ('completed' as const) : ('running' as const) };
      return s;
    });
    const updated: Workflow = {
      ...current,
      steps,
      currentStep: steps[stepIndex]?.label ?? current.currentStep,
      status: isLast ? 'completed' : 'active',
      finalResult: isLast ? (current.finalResult ?? 'Live demo run completed. No real systems were called.') : current.finalResult,
    };
    store = store.map((w) => (w.id === id ? updated : w));
    savePersisted(STORE_KEY, store);
    if (isLast) {
      auditService.append({
        action: `Completed workflow run: ${updated.name}`,
        user: updated.initiatingUser,
        agentId: null,
        projectId: context.projectId,
        environment: context.environment,
        policyDecision: 'allowed',
        result: 'success',
        relatedWorkflowId: updated.id,
        correlationId: `corr-wf-${updated.id}-${Date.now()}`,
      });
    }
    return withLatency(updated, 250);
  },
};
