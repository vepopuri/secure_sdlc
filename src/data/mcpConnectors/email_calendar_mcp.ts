import type { ConnectorSeed } from './connectorSeed';

export const emailCalendarMcpSeed: ConnectorSeed = {
  id: 'email_calendar_mcp',
  name: 'Email and Calendar MCP',
  category: 'resilience_compliance_comms',
  isPlatformService: false,
  connectedSystems: ['Email', 'Calendar'],
  status: 'not_configured',
  dataTypes: ['Meeting notes', 'Scheduling data'],
  readPermissions: ['Read meeting notes'],
  writePermissions: [],
  environmentAccess: ['demo'],
  description: 'Optional connector for scheduling context. Not yet configured for this workspace.',
};
