import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const bugTriageAgentSeed: AgentSeed = {
  id: 'bug_triage_agent',
  name: 'Bug Triage Agent',
  category: CORE,
  phaseIds: phase('testing_qa'),
  shortDescription: 'Classifies and prioritizes incoming bug reports using historical context.',
  purpose: 'Route bugs to the right owner with the right priority, faster.',
  responsibilities: [
    'Classify incoming bug reports by severity and affected module',
    'Match new reports against similar historical incidents',
    'Recommend an owning team based on prior ownership data',
  ],
  inputs: ['Bug reports', 'Historical incident data'],
  outputs: ['Bug triage reports'],
  requiredMcpConnectorIds: ['jira_linear_mcp'],
  allowedMcpTools: ['jira.searchIssues', 'jira.createDraftIssue'],
  kgEntitiesRead: ['incidents_bugs', 'team_people'],
  kgEntitiesWritten: ['incidents_bugs'],
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
  relatedAgentIds: ['remediation_agent'],
  capabilities: ['Severity classification', 'Similar-incident matching'],
};
