import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const pagerdutyOpsgenieMcpSeed: ConnectorSeed = {
  id: 'pagerduty_opsgenie_mcp',
  name: 'PagerDuty / Opsgenie MCP',
  category: 'observability',
  isPlatformService: false,
  connectedSystems: ['PagerDuty', 'Opsgenie'],
  status: 'connected',
  dataTypes: ['Incidents', 'On-call schedules'],
  readPermissions: ['Read incidents', 'Read on-call schedule'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Incident and on-call context for the Incident Response and Forensics Agent.',
};
