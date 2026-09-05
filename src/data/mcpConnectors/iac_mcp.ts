import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const iacMcpSeed: ConnectorSeed = {
  id: 'iac_mcp',
  name: 'Terraform / Pulumi MCP',
  category: 'deployment',
  isPlatformService: false,
  connectedSystems: ['Terraform Cloud', 'Pulumi'],
  status: 'connected',
  dataTypes: ['IaC state', 'Plan output', 'Drift reports'],
  readPermissions: ['Read state', 'Read plan output'],
  writePermissions: ['Propose plan'],
  environmentAccess: ALL_ENVS,
  description: 'Provides infrastructure state and plan visibility; write actions always route through approval.',
};
