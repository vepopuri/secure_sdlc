import type { ActionLevel, Role } from '../types/domain';

const ALL_TABS = [
  'overview', 'get-started', 'phases', 'agents', 'mcp', 'knowledge-graph',
  'components', 'workflows', 'approvals', 'security', 'audit', 'settings',
];

const NO_SETTINGS_TABS = ALL_TABS.filter((t) => t !== 'settings');

export const roles: Role[] = [
  {
    id: 'platform_administrator',
    name: 'Platform Administrator',
    description: 'Full access to configuration, subscriptions, and tenant-wide settings.',
    visibleTabs: ALL_TABS,
    canApprove: [0, 1, 2, 3] as ActionLevel[],
    canConfigureIntegrations: true,
    canRunAgents: true,
    environmentAccess: ['demo', 'development', 'staging', 'production'],
    auditVisibility: 'full',
  },
  {
    id: 'engineering_manager',
    name: 'Engineering Manager',
    description: 'Oversees delivery across teams; approves controlled changes, not production actions.',
    visibleTabs: ALL_TABS,
    canApprove: [0, 1, 2] as ActionLevel[],
    canConfigureIntegrations: true,
    canRunAgents: true,
    environmentAccess: ['demo', 'development', 'staging'],
    auditVisibility: 'team',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Runs agents and works approvals for their own projects in non-production environments.',
    visibleTabs: NO_SETTINGS_TABS,
    canApprove: [0, 1] as ActionLevel[],
    canConfigureIntegrations: false,
    canRunAgents: true,
    environmentAccess: ['demo', 'development'],
    auditVisibility: 'own',
  },
  {
    id: 'security_lead',
    name: 'Security Lead',
    description: 'Owns security posture; approves security and production-impacting actions.',
    visibleTabs: ALL_TABS,
    canApprove: [0, 1, 2, 3] as ActionLevel[],
    canConfigureIntegrations: true,
    canRunAgents: true,
    environmentAccess: ['demo', 'development', 'staging', 'production'],
    auditVisibility: 'full',
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Focused on design and cross-phase impact; can approve non-production changes.',
    visibleTabs: NO_SETTINGS_TABS,
    canApprove: [0, 1, 2] as ActionLevel[],
    canConfigureIntegrations: false,
    canRunAgents: true,
    environmentAccess: ['demo', 'development', 'staging'],
    auditVisibility: 'team',
  },
  {
    id: 'compliance_officer',
    name: 'Compliance Officer',
    description: 'Reviews audit trails, policy evidence, and compliance gaps across the tenant.',
    visibleTabs: ['overview', 'phases', 'agents', 'mcp', 'knowledge-graph', 'security', 'audit', 'settings'],
    canApprove: [0] as ActionLevel[],
    canConfigureIntegrations: false,
    canRunAgents: false,
    environmentAccess: ['demo', 'development', 'staging', 'production'],
    auditVisibility: 'full',
  },
  {
    id: 'read_only_user',
    name: 'Read-only User',
    description: 'Can explore the platform and inspect data with no execution or approval rights.',
    visibleTabs: ALL_TABS.filter((t) => t !== 'settings' && t !== 'get-started'),
    canApprove: [] as ActionLevel[],
    canConfigureIntegrations: false,
    canRunAgents: false,
    environmentAccess: ['demo'],
    auditVisibility: 'own',
  },
];

export const defaultRoleId = 'platform_administrator';
