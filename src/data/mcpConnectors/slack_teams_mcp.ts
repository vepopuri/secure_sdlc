import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const slackTeamsMcpSeed: ConnectorSeed = {
  id: 'slack_teams_mcp',
  name: 'Slack / Microsoft Teams MCP',
  category: 'resilience_compliance_comms',
  isPlatformService: false,
  connectedSystems: ['Slack', 'Microsoft Teams'],
  status: 'connected',
  dataTypes: ['Channel messages', 'Draft summaries'],
  readPermissions: [],
  writePermissions: ['Post draft summary'],
  environmentAccess: NON_PROD_ENVS,
  description: 'Delivers agent summaries and notifications into team channels.',
};
