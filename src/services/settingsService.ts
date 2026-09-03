import type { Environment, Role, RoleId } from '../types/domain';
import { roles as seedRoles } from '../data/roles';
import { withLatency } from './simulate';
import { initStore, savePersisted } from './persist';

const STORE_KEY = 'settings';
const ROLES_STORE_KEY = 'roles';

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

const seedSettings: PlatformSettings = {
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

let settings: PlatformSettings = initStore(STORE_KEY, seedSettings);

// Roles editing is scoped to the permission fields of the 7 seeded roles — RoleId
// is a closed union, so this never creates or deletes a role, only edits one in place.
let rolesStore: Role[] = initStore(ROLES_STORE_KEY, seedRoles.map((r) => ({ ...r, visibleTabs: [...r.visibleTabs], canApprove: [...r.canApprove], environmentAccess: [...r.environmentAccess] })));

export const settingsService = {
  get(): Promise<PlatformSettings> {
    return withLatency(settings, 150);
  },
  update(patch: Partial<PlatformSettings>): Promise<PlatformSettings> {
    settings = { ...settings, ...patch };
    savePersisted(STORE_KEY, settings);
    return withLatency(settings, 300);
  },
  listRoles(): Promise<Role[]> {
    return withLatency(rolesStore, 150);
  },
  updateRole(id: RoleId, patch: Partial<Omit<Role, 'id'>>): Promise<Role | undefined> {
    rolesStore = rolesStore.map((r) => (r.id === id ? { ...r, ...patch } : r));
    savePersisted(ROLES_STORE_KEY, rolesStore);
    return withLatency(rolesStore.find((r) => r.id === id), 250);
  },
};
