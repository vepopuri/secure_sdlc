import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const architectureAgentSeed: AgentSeed = {
  id: 'architecture_agent',
  name: 'Architecture Agent',
  category: CORE,
  phaseIds: phase('planning_requirements'),
  shortDescription: 'Drafts Architecture Decision Records and evaluates design trade-offs.',
  purpose: 'Give teams a structured, evidence-backed starting point for architecture decisions.',
  responsibilities: [
    'Draft Architecture Decision Records (ADRs) from proposed changes',
    'Summarize trade-offs across candidate approaches',
    'Cross-reference existing architecture in the Knowledge Graph',
  ],
  inputs: ['Epics', 'Existing architecture entities', 'Technical constraints'],
  outputs: ['Architecture Decision Records'],
  requiredMcpConnectorIds: ['confluence_notion_mcp', 'github_gitlab_mcp'],
  allowedMcpTools: ['confluence.createDraftPage', 'github.readRepoStructure'],
  kgEntitiesRead: ['architecture', 'codebase'],
  kgEntitiesWritten: ['architecture'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['requirements_agent', 'dependency_agent', 'api_design_agent'],
  capabilities: ['ADR drafting', 'Trade-off analysis', 'Cross-phase context lookup'],
};
