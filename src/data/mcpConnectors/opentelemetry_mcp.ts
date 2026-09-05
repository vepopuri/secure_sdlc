import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const opentelemetryMcpSeed: ConnectorSeed = {
  id: 'opentelemetry_mcp',
  name: 'OpenTelemetry MCP',
  category: 'observability',
  isPlatformService: false,
  connectedSystems: ['OpenTelemetry Collector'],
  status: 'connected',
  dataTypes: ['Traces', 'Spans', 'Logs'],
  readPermissions: ['Query traces', 'Query logs'],
  writePermissions: [],
  environmentAccess: NON_PROD_ENVS,
  description: 'Distributed tracing access used to correlate deployments with anomalies.',
};
