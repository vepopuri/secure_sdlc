import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const observabilityPlatformMcpSeed: ConnectorSeed = {
  id: 'observability_platform_mcp',
  name: 'Datadog / Grafana MCP',
  category: 'observability',
  isPlatformService: false,
  connectedSystems: ['Datadog', 'Grafana'],
  status: 'connected',
  dataTypes: ['Metrics', 'Dashboards', 'SLOs'],
  readPermissions: ['Query metrics', 'Read dashboards'],
  writePermissions: ['Propose alert rule'],
  environmentAccess: ALL_ENVS,
  description: 'Primary telemetry connector for alerting recommendations and incident summaries.',
};
