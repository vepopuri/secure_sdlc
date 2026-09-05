import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const cloudIamSessionBrokerMcpSeed: ConnectorSeed = {
  id: 'cloud_iam_session_broker_mcp',
  name: 'Cloud IAM and Session Broker MCP',
  category: 'security_identity',
  isPlatformService: false,
  connectedSystems: ['Cloud IAM', 'Session broker'],
  status: 'connected',
  dataTypes: ['Session history', 'Role assumptions'],
  readPermissions: ['Read session history'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Read-only cloud session and role-assumption history for access review.',
};
