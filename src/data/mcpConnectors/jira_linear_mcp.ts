import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const jiraLinearMcpSeed: ConnectorSeed = {
  id: 'jira_linear_mcp',
  name: 'Jira / Linear MCP',
  category: 'project_planning',
  isPlatformService: false,
  connectedSystems: ['Jira Cloud', 'Linear'],
  status: 'connected',
  dataTypes: ['Epics', 'Stories', 'Sprints', 'Velocity reports'],
  readPermissions: ['Read issues', 'Read sprint data', 'Read velocity reports'],
  writePermissions: ['Create draft issue', 'Comment on issue'],
  environmentAccess: NON_PROD_ENVS,
  description: 'Connects planning and requirements agents to your issue tracker for backlog context.',
};
