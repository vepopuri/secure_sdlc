import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const secretsKeysCertsMcpSeed: ConnectorSeed = {
  id: 'secrets_keys_certs_mcp',
  name: 'Secrets, Keys, and Certificates MCP',
  category: 'security_identity',
  isPlatformService: false,
  connectedSystems: ['Secrets manager', 'Certificate authority'],
  status: 'connected',
  dataTypes: ['Secret metadata', 'Key expiry', 'Certificate expiry'],
  readPermissions: ['Read expiry status', 'Scan for exposure'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Exposes only metadata and expiry status; secret values are never returned to agents.',
};
