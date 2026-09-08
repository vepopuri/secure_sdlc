import type { ApprovalItem } from '../types/domain';
import { apiFetch, apiFetchOptional, toQueryString } from './apiClient';

export interface ApprovalFilters {
  status?: ApprovalItem['status'];
  actionLevel?: ApprovalItem['actionLevel'];
  environment?: ApprovalItem['environment'];
}

export const approvalService = {
  list(filters: ApprovalFilters = {}): Promise<ApprovalItem[]> {
    return apiFetch<ApprovalItem[]>(`/api/approvals${toQueryString(filters)}`);
  },

  getById(id: string): Promise<ApprovalItem | undefined> {
    return apiFetchOptional<ApprovalItem>(`/api/approvals/${id}`);
  },

  decide(
    id: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    decidedBy: string,
  ): Promise<ApprovalItem | undefined> {
    return apiFetchOptional<ApprovalItem>(`/api/approvals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ decision, decidedBy }),
    });
  },
};
