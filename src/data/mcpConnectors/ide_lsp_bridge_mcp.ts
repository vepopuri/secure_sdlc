import type { ConnectorSeed } from './connectorSeed';

export const ideLspBridgeMcpSeed: ConnectorSeed = {
  id: 'ide_lsp_bridge_mcp',
  name: 'IDE LSP Bridge MCP',
  category: 'code_development',
  isPlatformService: false,
  connectedSystems: ['Language Server Protocol bridge'],
  status: 'connected',
  dataTypes: ['Symbol references', 'Type information', 'Diagnostics'],
  readPermissions: ['Read symbols', 'Read diagnostics'],
  writePermissions: [],
  environmentAccess: ['demo', 'development'],
  description: 'Gives code generation agents accurate, live type and symbol context from the workspace.',
};
