import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const cicdAgentSeed: AgentSeed = {
  id: 'cicd_agent',
  name: 'CI/CD Agent',
  category: CORE,
  phaseIds: phase('deployment_operations'),
  shortDescription: 'Maintains pipeline definitions and analyzes build failures.',
  purpose: 'Keep pipelines healthy and explain failures without a manual log dive.',
  responsibilities: [
    'Propose pipeline definition changes for new services or stages',
    'Analyze pipeline failures and summarize likely root cause',
    'Recommend retry or rollback actions for failed stages',
  ],
  inputs: ['Pipeline configurations', 'Build and test logs'],
  outputs: ['Pipeline definitions', 'Failure analysis'],
  requiredMcpConnectorIds: ['cicd_platform_mcp'],
  allowedMcpTools: ['cicd.readPipelineRuns', 'cicd.proposeConfigChange'],
  kgEntitiesRead: ['deployments', 'codebase'],
  kgEntitiesWritten: ['deployments'],
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
  relatedAgentIds: ['release_agent', 'iac_agent'],
  capabilities: ['Pipeline authoring', 'Failure root-cause analysis'],
};
