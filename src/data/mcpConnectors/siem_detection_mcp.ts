import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const siemDetectionMcpSeed: ConnectorSeed = {
  id: 'siem_detection_mcp',
  name: 'SIEM and Detection Engineering MCP',
  category: 'observability',
  isPlatformService: false,
  connectedSystems: ['SIEM platform'],
  status: 'needs_attention',
  dataTypes: ['Alert history', 'Detection rules'],
  readPermissions: ['Read alert history'],
  writePermissions: ['Propose detection rule'],
  environmentAccess: ALL_ENVS,
  description: 'Feeds detection engineering with alert history; sync token expiring soon.',
};
