import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const estimationAgentSeed: AgentSeed = {
  id: 'estimation_agent',
  name: 'Estimation Agent',
  category: CORE,
  phaseIds: phase('planning_requirements'),
  shortDescription: 'Estimates story effort using historical velocity and complexity signals.',
  purpose: 'Provide consistent, defensible effort estimates informed by prior delivery history.',
  responsibilities: [
    'Analyze historical cycle time for comparable stories',
    'Propose story point or t-shirt size estimates with rationale',
    'Highlight estimation outliers for team review',
  ],
  inputs: ['Backlog items', 'Historical velocity data', 'Team capacity'],
  outputs: ['Estimates', 'Estimation rationale notes'],
  requiredMcpConnectorIds: ['jira_linear_mcp'],
  allowedMcpTools: ['jira.searchIssues', 'jira.readVelocityReport'],
  kgEntitiesRead: ['requirements', 'team_people'],
  kgEntitiesWritten: [],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'read_only',
  approvalRequired: false,
  approvalLevel: 0,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['requirements_agent'],
  capabilities: ['Velocity analysis', 'Comparable-story matching'],
};
