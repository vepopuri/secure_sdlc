import type { ConnectorSeed } from './connectorSeed';

export const figmaMcpSeed: ConnectorSeed = {
  id: 'figma_mcp',
  name: 'Figma MCP',
  category: 'project_planning',
  isPlatformService: false,
  connectedSystems: ['Figma'],
  status: 'needs_attention',
  dataTypes: ['Design files', 'Components', 'Wireframes'],
  readPermissions: ['Read components', 'Read frames'],
  writePermissions: ['Create draft frame'],
  environmentAccess: ['demo', 'development'],
  description: 'Gives the UX Wireframe Agent read access to shared design system components.',
};
