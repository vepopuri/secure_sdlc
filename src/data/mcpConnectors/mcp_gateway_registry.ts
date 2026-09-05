import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const mcpGatewayRegistrySeed: ConnectorSeed = {
  id: 'mcp_gateway_registry',
  name: 'MCP Gateway and Registry',
  category: 'platform',
  isPlatformService: true,
  connectedSystems: ['All 35 source MCP connectors'],
  status: 'connected',
  dataTypes: ['Capability catalog', 'Routing policy', 'Audit events'],
  readPermissions: ['Discover capabilities', 'Read routing policy'],
  writePermissions: ['Enforce approval gates', 'Redact output'],
  environmentAccess: ALL_ENVS,
  description:
    'Every agent-to-tool call is routed through the Gateway. Agents never connect directly to source systems.',
  capabilities: [
    'Capability discovery',
    'Tenant-aware routing',
    'Agent-to-tool allowlists',
    'RBAC and attribute-based authorization',
    'Rate limiting',
    'Approval gates',
    'Input validation',
    'Output redaction',
    'Session management',
    'Retry and timeout handling',
    'Circuit breakers',
    'Dry-run mode',
    'Centralized audit logging',
  ],
};
