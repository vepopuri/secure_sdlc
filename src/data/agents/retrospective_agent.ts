import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const retrospectiveAgentSeed: AgentSeed = {
  id: 'retrospective_agent',
  name: 'Retrospective Agent',
  category: CORE,
  phaseIds: phase('maintenance_feedback'),
  shortDescription: 'Synthesizes sprint retrospectives and velocity trends.',
  purpose: 'Give teams an evidence-based starting point for retrospective conversations.',
  responsibilities: [
    'Summarize sprint outcomes across delivery, quality, and incident data',
    'Surface velocity trends across recent sprints',
    'Draft a retrospective report with discussion prompts',
  ],
  inputs: ['Sprint delivery data', 'Incident summaries', 'Team feedback'],
  outputs: ['Retrospective reports', 'Velocity trends'],
  requiredMcpConnectorIds: ['jira_linear_mcp', 'slack_teams_mcp'],
  allowedMcpTools: ['jira.readVelocityReport', 'slack.postDraftSummary'],
  kgEntitiesRead: ['team_people', 'incidents_bugs'],
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
  relatedAgentIds: ['tech_debt_agent'],
  capabilities: ['Sprint synthesis', 'Velocity trend analysis'],
};
