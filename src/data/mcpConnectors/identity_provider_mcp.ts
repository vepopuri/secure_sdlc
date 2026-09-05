import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const identityProviderMcpSeed: ConnectorSeed = {
  id: 'identity_provider_mcp',
  name: 'Identity Provider MCP',
  category: 'security_identity',
  isPlatformService: false,
  connectedSystems: ['Okta', 'Azure AD'],
  status: 'connected',
  dataTypes: ['Users', 'Groups', 'Access grants'],
  readPermissions: ['List grants', 'Read group membership'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Identity and access review context for IAM security agents.',
};
