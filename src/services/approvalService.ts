import type { ApprovalItem } from '../types/domain';
import { approvals as seedApprovals } from '../data/approvals';
import { daysAgo } from '../data/mockHelpers';
import { withLatency } from './simulate';

let store: ApprovalItem[] = seedApprovals.map((a) => ({ ...a }));

export interface ApprovalFilters {
  status?: ApprovalItem['status'];
  actionLevel?: ApprovalItem['actionLevel'];
  environment?: ApprovalItem['environment'];
}

export const approvalService = {
  list(filters: ApprovalFilters = {}): Promise<ApprovalItem[]> {
    let results = store;
    if (filters.status) results = results.filter((a) => a.status === filters.status);
    if (filters.actionLevel !== undefined) results = results.filter((a) => a.actionLevel === filters.actionLevel);
    if (filters.environment) results = results.filter((a) => a.environment === filters.environment);
    return withLatency(results);
  },

  getById(id: string): Promise<ApprovalItem | undefined> {
    return withLatency(store.find((a) => a.id === id));
  },

  decide(
    id: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    decidedBy: string,
  ): Promise<ApprovalItem | undefined> {
    store = store.map((a) =>
      a.id === id ? { ...a, status: decision, decidedBy, decidedAt: daysAgo(0) } : a,
    );
    return withLatency(store.find((a) => a.id === id), 500);
  },
};
