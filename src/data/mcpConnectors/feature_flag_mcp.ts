import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const featureFlagMcpSeed: ConnectorSeed = {
  id: 'feature_flag_mcp',
  name: 'LaunchDarkly MCP',
  category: 'deployment',
  isPlatformService: false,
  connectedSystems: ['LaunchDarkly'],
  status: 'connected',
  dataTypes: ['Flag definitions', 'Flag state', 'Rollout rules'],
  readPermissions: ['Read flag state'],
  writePermissions: ['Propose flag change'],
  environmentAccess: ALL_ENVS,
  description: 'Feature flag visibility for release planning. Production flag changes always require approval.',
};
