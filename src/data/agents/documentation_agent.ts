import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const documentationAgentSeed: AgentSeed = {
  id: 'documentation_agent',
  name: 'Documentation Agent',
  category: CORE,
  phaseIds: phase('development'),
  shortDescription: 'Keeps documentation and changelogs in sync with shipped code.',
  purpose: 'Prevent documentation drift as code changes land.',
  responsibilities: [
    'Draft or update documentation from merged pull requests',
    'Generate human-readable changelog entries',
    'Flag undocumented public interfaces',
  ],
  inputs: ['Merged pull requests', 'Existing documentation'],
  outputs: ['Documentation', 'Changelogs'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'confluence_notion_mcp'],
  allowedMcpTools: ['github.readPullRequest', 'confluence.createDraftPage'],
  kgEntitiesRead: ['codebase'],
  kgEntitiesWritten: [],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['code_generation_agent'],
  capabilities: ['Changelog generation', 'Doc drift detection'],
};
