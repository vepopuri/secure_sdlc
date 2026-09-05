import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const codeReviewAgentSeed: AgentSeed = {
  id: 'code_review_agent',
  name: 'Code Review Agent',
  category: CORE,
  phaseIds: phase('development'),
  shortDescription: 'Reviews pull requests for correctness, style, and risk hotspots.',
  purpose: 'Give every pull request a fast, consistent first pass before human review.',
  responsibilities: [
    'Review pull request diffs against coding standards and known bug patterns',
    'Post structured review comments with severity labels',
    'Flag changes that touch historically high-bug-recurrence modules',
  ],
  inputs: ['Pull request diffs', 'Static analysis results', 'Historical bug data'],
  outputs: ['Review comments', 'Risk flags'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'sonarqube_codeclimate_mcp'],
  allowedMcpTools: ['github.readPullRequest', 'github.createReviewComment', 'sonarqube.getIssues'],
  kgEntitiesRead: ['codebase', 'tests_quality', 'technical_debt'],
  kgEntitiesWritten: ['technical_debt'],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: false,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['code_generation_agent', 'refactor_agent'],
  capabilities: ['Diff review', 'Bug-pattern matching', 'Risk flagging'],
};
