import type { ConnectorSeed } from './connectorSeed';

export const loadTestingMcpSeed: ConnectorSeed = {
  id: 'load_testing_mcp',
  name: 'k6 / Gatling MCP',
  category: 'testing_quality',
  isPlatformService: false,
  connectedSystems: ['k6', 'Gatling'],
  status: 'not_configured',
  dataTypes: ['Load test results', 'Latency percentiles'],
  readPermissions: ['Read test results'],
  writePermissions: ['Run load test'],
  environmentAccess: ['demo', 'staging'],
  description: 'Runs load and latency benchmarks against staging environments. Not yet configured for this workspace.',
};
