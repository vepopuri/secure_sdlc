import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const confluenceNotionMcpSeed: ConnectorSeed = {
  id: 'confluence_notion_mcp',
  name: 'Confluence / Notion MCP',
  category: 'project_planning',
  isPlatformService: false,
  connectedSystems: ['Confluence', 'Notion'],
  status: 'connected',
  dataTypes: ['Pages', 'Requirements docs', 'ADRs'],
  readPermissions: ['Read pages', 'Read page history'],
  writePermissions: ['Create draft page'],
  environmentAccess: NON_PROD_ENVS,
  description: 'Provides governed access to documentation spaces for requirements and design context.',
};
