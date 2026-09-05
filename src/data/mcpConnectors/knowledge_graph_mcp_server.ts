import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const knowledgeGraphMcpServerSeed: ConnectorSeed = {
  id: 'knowledge_graph_mcp_server',
  name: 'Knowledge Graph MCP Server',
  category: 'platform',
  isPlatformService: true,
  connectedSystems: ['Knowledge Graph'],
  status: 'connected',
  dataTypes: ['Entities', 'Relationships', 'Evidence', 'Provenance'],
  readPermissions: ['Entity retrieval', 'Relationship traversal', 'Impact analysis'],
  writePermissions: ['Propose relationship', 'Submit validated observation'],
  environmentAccess: ALL_ENVS,
  description:
    'The only path to graph context. Agents must not write directly to the graph database; all writes are validated and approved.',
  capabilities: [
    'Entity retrieval',
    'Relationship traversal',
    'Cross-phase impact analysis',
    'Similar incident search',
    'Evidence attachment',
    'Provenance retrieval',
    'Proposed relationship creation',
    'Validated observation submission',
    'Approved graph updates',
  ],
};
