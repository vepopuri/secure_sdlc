import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const iacAgentSeed: AgentSeed = {
  id: 'iac_agent',
  name: 'Infrastructure-as-Code Agent',
  category: CORE,
  phaseIds: phase('deployment_operations'),
  shortDescription: 'Drafts infrastructure code and reports configuration drift and cost.',
  purpose: 'Keep declared infrastructure and actual infrastructure in sync, with cost visibility.',
  responsibilities: [
    'Draft infrastructure-as-code changes for approved architecture decisions',
    'Detect and report drift between declared and live infrastructure',
    'Estimate cost impact of proposed infrastructure changes',
  ],
  inputs: ['Architecture Decision Records', 'Current infrastructure state'],
  outputs: ['Infrastructure code', 'Drift reports', 'Cost estimates'],
  requiredMcpConnectorIds: ['iac_mcp', 'cloud_provider_mcp'],
  allowedMcpTools: ['terraform.plan', 'cloudProvider.readResourceState'],
  kgEntitiesRead: ['cloud_runtime', 'architecture'],
  kgEntitiesWritten: ['cloud_runtime'],
  riskLevel: 'high',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 3,
  securityRelated: false,
  canCreatePullRequests: true,
  canModifyInfrastructure: true,
  canChangeFeatureFlags: false,
  canAffectProduction: true,
  relatedAgentIds: ['cicd_agent', 'cloud_container_runtime_security_agent'],
  capabilities: ['IaC drafting', 'Drift detection', 'Cost estimation'],
};
