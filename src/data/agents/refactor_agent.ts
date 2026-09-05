import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const refactorAgentSeed: AgentSeed = {
  id: 'refactor_agent',
  name: 'Refactor Agent',
  category: CORE,
  phaseIds: phase('development'),
  shortDescription: 'Proposes scoped refactors with diff summaries for reviewer clarity.',
  purpose: 'Reduce technical debt incrementally without destabilizing working code.',
  responsibilities: [
    'Propose scoped refactors targeting flagged technical debt',
    'Summarize behavioral-equivalence reasoning for each diff',
    'Open draft pull requests for reviewer approval',
  ],
  inputs: ['Technical debt registry', 'Source code', 'Test coverage reports'],
  outputs: ['Refactored code', 'Diff summaries'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'sonarqube_codeclimate_mcp'],
  allowedMcpTools: ['github.createDraftBranch', 'github.openDraftPullRequest'],
  kgEntitiesRead: ['codebase', 'technical_debt'],
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
  relatedAgentIds: ['code_review_agent', 'tech_debt_agent'],
  capabilities: ['Scoped refactor drafting', 'Behavioral-equivalence checks'],
};
