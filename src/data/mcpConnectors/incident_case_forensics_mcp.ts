import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const incidentCaseForensicsMcpSeed: ConnectorSeed = {
  id: 'incident_case_forensics_mcp',
  name: 'Incident, Case Management, and Forensics MCP',
  category: 'resilience_compliance_comms',
  isPlatformService: false,
  connectedSystems: ['Incident and case management platform'],
  status: 'connected',
  dataTypes: ['Incident records', 'Case evidence'],
  readPermissions: ['Read timeline'],
  writePermissions: ['Attach evidence'],
  environmentAccess: ALL_ENVS,
  description: 'Central case record for incident timelines and attached forensic evidence.',
};
