import type { Workflow, WorkflowStatus } from '../types/domain';
import { workflows as seedWorkflows } from '../data/workflows';
import { withLatency } from './simulate';

let store: Workflow[] = seedWorkflows.map((w) => ({ ...w }));

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

  /** Demo-only: resets the sample "requirement to architecture" workflow to a fresh active run. */
  runSample(id: string): Promise<Workflow | undefined> {
    const template = seedWorkflows.find((w) => w.id === id);
    if (!template) return withLatency(undefined);
    const refreshed: Workflow = { ...template, status: 'active', currentStep: template.steps[0]?.label ?? 'Started' };
    store = store.map((w) => (w.id === id ? refreshed : w));
    return withLatency(refreshed, 700);
  },
};
