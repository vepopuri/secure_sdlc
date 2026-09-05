import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const codeGenerationAgentSeed: AgentSeed = {
  id: 'code_generation_agent',
  name: 'Code Generation Agent',
  category: CORE,
  phaseIds: phase('development'),
  shortDescription: 'Generates source code and pull request drafts from approved designs.',
  purpose: 'Turn reviewed specs into a working draft implementation for a developer to refine.',
  responsibilities: [
    'Generate source code scaffolding from API and schema designs',
    'Open draft pull requests with generated changes for review',
    'Explain generated code with inline rationale comments',
  ],
  inputs: ['OpenAPI specifications', 'ERDs', 'Coding standards'],
  outputs: ['Source code', 'Pull request drafts'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'ide_lsp_bridge_mcp'],
  allowedMcpTools: ['github.createDraftBranch', 'github.openDraftPullRequest'],
  kgEntitiesRead: ['architecture', 'codebase'],
  kgEntitiesWritten: ['codebase'],
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
  relatedAgentIds: ['code_review_agent', 'documentation_agent'],
  capabilities: ['Code scaffolding', 'Draft PR creation', 'Inline rationale generation'],
};
