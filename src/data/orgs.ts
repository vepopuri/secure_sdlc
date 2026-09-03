import type { Project, Team, Workspace } from '../types/domain';

// Demo data: one tenant, three teams, two projects, one workspace.
export const workspace: Workspace = {
  id: 'ws_northwind_platform',
  name: 'Northwind Platform Engineering',
  organizationName: 'Northwind Retail Group',
  primaryTeam: 'Checkout Platform Team',
  defaultEnvironment: 'development',
  notificationChannel: '#platform-agent-activity',
};

export const teams: Team[] = [
  { id: 'team_checkout', name: 'Checkout Platform Team', memberCount: 9, projectIds: ['proj_checkout_service'] },
  { id: 'team_identity', name: 'Identity and Access Team', memberCount: 6, projectIds: ['proj_customer_portal'] },
  { id: 'team_platform', name: 'Developer Platform Team', memberCount: 5, projectIds: ['proj_checkout_service', 'proj_customer_portal'] },
];

export const projects: Project[] = [
  {
    id: 'proj_checkout_service',
    name: 'Checkout Service',
    repository: 'northwind/checkout-service',
    teamId: 'team_checkout',
    environment: ['demo', 'development', 'staging', 'production'],
  },
  {
    id: 'proj_customer_portal',
    name: 'Customer Portal',
    repository: 'northwind/customer-portal',
    teamId: 'team_identity',
    environment: ['demo', 'development', 'staging', 'production'],
  },
];
