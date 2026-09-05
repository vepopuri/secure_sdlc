import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const artifactRegistryMcpSeed: ConnectorSeed = {
  id: 'artifact_registry_mcp',
  name: 'Artifact Registry MCP',
  category: 'code_development',
  isPlatformService: false,
  connectedSystems: ['JFrog Artifactory', 'GitHub Packages'],
  status: 'connected',
  dataTypes: ['Build artifacts', 'Provenance attestations', 'Signatures'],
  readPermissions: ['Read artifact metadata', 'Read provenance'],
  writePermissions: [],
  environmentAccess: NON_PROD_ENVS,
  description: 'Verifies artifact provenance and signing for the software supply chain agent.',
};
