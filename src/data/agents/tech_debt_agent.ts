import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const techDebtAgentSeed: AgentSeed = {
  id: 'tech_debt_agent',
  name: 'Tech Debt Agent',
  category: CORE,
  phaseIds: phase('maintenance_feedback'),
  shortDescription: 'Maintains the technical debt registry and priority heatmaps.',
  purpose: 'Make technical debt visible, quantified, and prioritized instead of tribal knowledge.',
  responsibilities: [
    'Maintain a registry of known technical debt items',
    'Score and rank debt items into a priority heatmap',
    'Link debt items to related incidents and bug reports',
  ],
  inputs: ['Code review findings', 'Refactor history', 'Incident data'],
  outputs: ['Debt registries', 'Priority heatmaps'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'sonarqube_codeclimate_mcp'],
  allowedMcpTools: ['sonarqube.getIssues'],
  kgEntitiesRead: ['technical_debt', 'codebase', 'incidents_bugs'],
  kgEntitiesWritten: ['technical_debt'],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: false,
  approvalLevel: 0,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['refactor_agent'],
  capabilities: ['Debt registry maintenance', 'Priority scoring'],
};
