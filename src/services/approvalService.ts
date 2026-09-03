import type { ApprovalItem } from '../types/domain';
import { approvals as seedApprovals } from '../data/approvals';
import { daysAgo } from '../data/mockHelpers';
import { withLatency } from './simulate';
import { auditService } from './auditService';
import { initStore, savePersisted } from './persist';

const STORE_KEY = 'approvals';
let store: ApprovalItem[] = initStore(STORE_KEY, seedApprovals.map((a) => ({ ...a })));

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
    const before = store.find((a) => a.id === id);
    store = store.map((a) =>
      a.id === id ? { ...a, status: decision, decidedBy, decidedAt: daysAgo(0) } : a,
    );
    savePersisted(STORE_KEY, store);
    if (before) {
      const verb = decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : 'Requested changes on';
      auditService.append({
        action: `${verb} approval: ${before.requestedAction}`,
        user: decidedBy,
        agentId: before.initiatingAgentId,
        projectId: before.projectId,
        environment: before.environment,
        riskLevel: before.riskLevel,
        policyDecision: decision === 'approved' ? 'allowed' : decision === 'rejected' ? 'denied' : 'approval_required',
        result: 'success',
        correlationId: `corr-appr-${before.id}`,
      });
    }
    return withLatency(store.find((a) => a.id === id), 500);
  },
};
