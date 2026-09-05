import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const requirementsAgentSeed: AgentSeed = {
  id: 'requirements_agent',
  name: 'Requirements Agent',
  category: CORE,
  phaseIds: phase('planning_requirements'),
  shortDescription: 'Turns raw requests into structured epics, stories, and acceptance criteria.',
  purpose: 'Convert stakeholder input and discovery notes into well-formed, traceable backlog items.',
  responsibilities: [
    'Draft epics and user stories from intake notes and meeting summaries',
    'Propose acceptance criteria aligned to existing product conventions',
    'Flag ambiguous or conflicting requirements for human clarification',
  ],
  inputs: ['Product intake notes', 'Stakeholder interview transcripts', 'Existing backlog context'],
  outputs: ['Epics', 'User stories', 'Acceptance criteria'],
  requiredMcpConnectorIds: ['jira_linear_mcp', 'confluence_notion_mcp'],
  allowedMcpTools: ['jira.createDraftIssue', 'jira.searchIssues', 'confluence.readPage'],
  kgEntitiesRead: ['requirements', 'team_people'],
  kgEntitiesWritten: ['requirements'],
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
  relatedAgentIds: ['estimation_agent', 'architecture_agent'],
  capabilities: ['Backlog drafting', 'Ambiguity detection', 'Traceability linking'],
};
