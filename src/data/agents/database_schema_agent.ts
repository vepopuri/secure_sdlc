import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const databaseSchemaAgentSeed: AgentSeed = {
  id: 'database_schema_agent',
  name: 'Database Schema Agent',
  category: CORE,
  phaseIds: phase('design'),
  shortDescription: 'Proposes entity-relationship models and reversible migration plans.',
  purpose: 'Reduce schema-change risk with reviewed, reversible migration plans.',
  responsibilities: [
    'Draft entity-relationship diagrams from data requirements',
    'Propose forward and rollback migration plans',
    'Highlight destructive or irreversible schema changes',
  ],
  inputs: ['Data requirements', 'Current schema state'],
  outputs: ['ERDs', 'Migration plans'],
  requiredMcpConnectorIds: ['github_gitlab_mcp'],
  allowedMcpTools: ['github.readRepoStructure', 'github.createDraftBranch'],
  kgEntitiesRead: ['architecture', 'codebase'],
  kgEntitiesWritten: ['architecture'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 2,
  securityRelated: false,
  canCreatePullRequests: true,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['api_design_agent'],
  capabilities: ['ERD generation', 'Migration planning', 'Rollback validation'],
};
