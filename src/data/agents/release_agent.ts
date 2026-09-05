import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const releaseAgentSeed: AgentSeed = {
  id: 'release_agent',
  name: 'Release Agent',
  category: CORE,
  phaseIds: phase('deployment_operations'),
  shortDescription: 'Prepares release notes, rollback plans, and staged rollout guidance.',
  purpose: 'Make every release reviewable and reversible before it ships.',
  responsibilities: [
    'Draft release notes summarizing included changes',
    'Prepare rollback plans for each release candidate',
    'Recommend staged rollout percentages based on risk',
  ],
  inputs: ['Merged pull requests', 'Pipeline run results'],
  outputs: ['Release notes', 'Rollback plans'],
  requiredMcpConnectorIds: ['cicd_platform_mcp', 'feature_flag_mcp'],
  allowedMcpTools: ['cicd.readPipelineRuns', 'featureFlags.readFlagState'],
  kgEntitiesRead: ['deployments', 'codebase'],
  kgEntitiesWritten: ['deployments'],
  riskLevel: 'high',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 3,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: true,
  canAffectProduction: true,
  relatedAgentIds: ['cicd_agent', 'observability_agent'],
  capabilities: ['Release note drafting', 'Rollback planning', 'Staged rollout guidance'],
};
