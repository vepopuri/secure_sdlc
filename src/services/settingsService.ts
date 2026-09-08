import type { Environment, Role, RoleId } from '../types/domain';
import { apiFetch, apiFetchOptional } from './apiClient';

export interface ApprovalPolicySetting {
  actionLevel: 0 | 1 | 2 | 3;
  label: string;
  requiresApproval: boolean;
  approverRoles: string[];
}

export interface PlatformSettings {
  workspaceName: string;
  organizationName: string;
  dataRetentionDays: number;
  auditRetentionDays: number;
  notificationChannel: string;
  notifyOnApprovalRequest: boolean;
  notifyOnSecurityFinding: boolean;
  notifyOnWorkflowFailure: boolean;
  environmentRestrictions: Record<Environment, boolean>;
  approvalPolicies: ApprovalPolicySetting[];
  modelConfig: { provider: string; reasoningEffort: 'low' | 'medium' | 'high'; maxAutonomousSteps: number };
  featureFlags: { knowledgeGraphExpandedView: boolean; adversarialTestingAgent: boolean; costEstimatesOnIac: boolean };
  tenantIsolation: { enforced: boolean; lastVerified: string };
}

export const settingsService = {
  get(): Promise<PlatformSettings> {
    return apiFetch<PlatformSettings>('/api/settings');
  },

  update(patch: Partial<PlatformSettings>): Promise<PlatformSettings> {
    return apiFetch<PlatformSettings>('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  listRoles(): Promise<Role[]> {
    return apiFetch<Role[]>('/api/roles');
  },

  // Roles editing is scoped to the permission fields of the 7 seeded roles — RoleId
  // is a closed union, so this never creates or deletes a role, only edits one in place.
  updateRole(id: RoleId, patch: Partial<Omit<Role, 'id'>>): Promise<Role | undefined> {
    return apiFetchOptional<Role>(`/api/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },
};
