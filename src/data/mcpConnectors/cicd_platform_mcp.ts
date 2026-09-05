import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const cicdPlatformMcpSeed: ConnectorSeed = {
  id: 'cicd_platform_mcp',
  name: 'GitHub Actions / CircleCI MCP',
  category: 'deployment',
  isPlatformService: false,
  connectedSystems: ['GitHub Actions', 'CircleCI'],
  status: 'connected',
  dataTypes: ['Pipeline runs', 'Build logs', 'Deployment status'],
  readPermissions: ['Read pipeline runs', 'Read build logs'],
  writePermissions: ['Propose config change'],
  environmentAccess: ALL_ENVS,
  description: 'Central CI/CD connector for pipeline visibility and failure analysis.',
};
