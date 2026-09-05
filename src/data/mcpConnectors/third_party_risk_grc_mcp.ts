import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const thirdPartyRiskGrcMcpSeed: ConnectorSeed = {
  id: 'third_party_risk_grc_mcp',
  name: 'Third-Party Risk and GRC MCP',
  category: 'resilience_compliance_comms',
  isPlatformService: false,
  connectedSystems: ['GRC platform'],
  status: 'connected',
  dataTypes: ['Vendor assessments', 'Compliance control status'],
  readPermissions: ['Read vendor assessment', 'Read control status'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Governance, risk, and compliance system of record for vendor and control status.',
};
