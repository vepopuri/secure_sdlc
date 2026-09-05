import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const dataCatalogDlpMcpSeed: ConnectorSeed = {
  id: 'data_catalog_dlp_mcp',
  name: 'Data Catalog and DLP MCP',
  category: 'security_identity',
  isPlatformService: false,
  connectedSystems: ['Data catalog', 'DLP scanner'],
  status: 'connected',
  dataTypes: ['Data classifications', 'Sensitive-data flow maps'],
  readPermissions: ['Classify flow', 'Read retention policy'],
  writePermissions: [],
  environmentAccess: NON_PROD_ENVS,
  description: 'Sensitive-data classification and flow mapping for privacy and governance review.',
};
