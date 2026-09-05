import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const policyEngineMcpSeed: ConnectorSeed = {
  id: 'policy_engine_mcp',
  name: 'Policy Engine MCP (OPA)',
  category: 'security_identity',
  isPlatformService: false,
  connectedSystems: ['Open Policy Agent'],
  status: 'connected',
  dataTypes: ['Policy definitions', 'Evaluation decisions'],
  readPermissions: ['Read policy', 'Evaluate action'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Evaluates every controlled agent action against workspace policy before execution.',
};
