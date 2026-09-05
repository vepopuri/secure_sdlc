import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const runtimeSecurityMcpSeed: ConnectorSeed = {
  id: 'runtime_security_mcp',
  name: 'Runtime Security MCP',
  category: 'observability',
  isPlatformService: false,
  connectedSystems: ['Runtime security sensor'],
  status: 'connected',
  dataTypes: ['Runtime anomalies', 'Process telemetry'],
  readPermissions: ['Read anomalies'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Runtime behavior telemetry for cloud and container security monitoring.',
};
