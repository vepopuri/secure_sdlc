import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const threatIntelligenceMcpSeed: ConnectorSeed = {
  id: 'threat_intelligence_mcp',
  name: 'Threat Intelligence MCP',
  category: 'security_identity',
  isPlatformService: false,
  connectedSystems: ['Threat intel feed'],
  status: 'connected',
  dataTypes: ['CVE feeds', 'Exploitability signals', 'Threat actor patterns'],
  readPermissions: ['Search patterns', 'Read exploitability signal'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'External threat intelligence used to prioritize and design against real-world risk.',
};
