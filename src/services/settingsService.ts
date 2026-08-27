import type { Environment } from '../types/domain';
import { withLatency } from './simulate';

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

let settings: PlatformSettings = {
  workspaceName: 'Northwind Platform Engineering',
  organizationName: 'Northwind Retail Group',
  dataRetentionDays: 90,
  auditRetentionDays: 365,
  notificationChannel: '#platform-agent-activity',
  notifyOnApprovalRequest: true,
  notifyOnSecurityFinding: true,
  notifyOnWorkflowFailure: true,
  environmentRestrictions: { demo: false, development: false, staging: false, production: true },
  approvalPolicies: [
    { actionLevel: 0, label: 'Read-only', requiresApproval: false, approverRoles: [] },
    { actionLevel: 1, label: 'Reversible non-production write', requiresApproval: true, approverRoles: ['Developer', 'Engineering Manager'] },
    { actionLevel: 2, label: 'Controlled change', requiresApproval: true, approverRoles: ['Engineering Manager', 'Security Lead'] },
    { actionLevel: 3, label: 'High-impact or production action', requiresApproval: true, approverRoles: ['Security Lead', 'Platform Administrator'] },
  ],
  modelConfig: { provider: 'Anthropic Claude', reasoningEffort: 'medium', maxAutonomousSteps: 12 },
  featureFlags: { knowledgeGraphExpandedView: false, adversarialTestingAgent: false, costEstimatesOnIac: true },
  tenantIsolation: { enforced: true, lastVerified: '2026-08-26T09:00:00Z' },
};

export const settingsService = {
  get(): Promise<PlatformSettings> {
    return withLatency(settings, 150);
  },
  update(patch: Partial<PlatformSettings>): Promise<PlatformSettings> {
    settings = { ...settings, ...patch };
    return withLatency(settings, 300);
  },
};
