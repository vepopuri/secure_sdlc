import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const cloudProviderMcpSeed: ConnectorSeed = {
  id: 'cloud_provider_mcp',
  name: 'AWS / GCP / Azure MCP',
  category: 'deployment',
  isPlatformService: false,
  connectedSystems: ['AWS', 'GCP', 'Azure'],
  status: 'connected',
  dataTypes: ['Resource inventory', 'Configuration', 'Cost data'],
  readPermissions: ['Read resource state', 'Read cost data'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Read-only cloud resource inventory feeding infrastructure and cost-estimation agents.',
};
