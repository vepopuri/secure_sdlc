import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const packageRegistryMcpSeed: ConnectorSeed = {
  id: 'package_registry_mcp',
  name: 'Package Registry MCP',
  category: 'code_development',
  isPlatformService: false,
  connectedSystems: ['npm', 'PyPI', 'Maven Central'],
  status: 'connected',
  dataTypes: ['Package metadata', 'Dependency trees', 'SBOM fragments'],
  readPermissions: ['Read package metadata', 'Read SBOM'],
  writePermissions: [],
  environmentAccess: NON_PROD_ENVS,
  description: 'Read-only access to package metadata used for dependency mapping and supply-chain checks.',
};
