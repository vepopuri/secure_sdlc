import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const apiDesignAgentSeed: AgentSeed = {
  id: 'api_design_agent',
  name: 'API Design Agent',
  category: CORE,
  phaseIds: phase('design'),
  shortDescription: 'Drafts and evolves OpenAPI specifications with changelog tracking.',
  purpose: 'Keep API contracts consistent, versioned, and reviewable before implementation begins.',
  responsibilities: [
    'Draft OpenAPI specifications from architecture and requirements context',
    'Track and summarize contract changelogs across revisions',
    'Flag breaking changes against existing consumers',
  ],
  inputs: ['Architecture Decision Records', 'Existing API specifications'],
  outputs: ['OpenAPI specifications', 'Changelogs'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'confluence_notion_mcp'],
  allowedMcpTools: ['github.readRepoStructure', 'github.createDraftBranch'],
  kgEntitiesRead: ['architecture', 'codebase'],
  kgEntitiesWritten: ['architecture'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['architecture_agent', 'database_schema_agent'],
  capabilities: ['OpenAPI drafting', 'Breaking-change detection'],
};
