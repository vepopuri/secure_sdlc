import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const iamAccessSecurityAgentSeed: AgentSeed = {
  id: 'iam_access_security_agent',
  name: 'IAM and Access Security Agent',
  category: CROSS,
  phaseIds: ['deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Reviews identity and access patterns for excessive or stale privilege.',
  purpose: 'Keep human, service, and agent access aligned to least privilege.',
  responsibilities: [
    'Review access grants for excessive or unused privilege',
    'Flag stale service accounts and unrotated credentials',
    'Recommend access scope reductions with supporting evidence',
  ],
  inputs: ['Identity provider records', 'Access logs', 'Role definitions'],
  outputs: ['Excessive-privilege reports'],
  requiredMcpConnectorIds: ['identity_provider_mcp', 'cloud_iam_session_broker_mcp'],
  allowedMcpTools: ['identityProvider.listGrants', 'cloudIam.readSessionHistory'],
  kgEntitiesRead: ['identities', 'tools_permissions_actions'],
  kgEntitiesWritten: ['identities'],
  riskLevel: 'high',
  status: 'enabled',
  readOrWrite: 'read_only',
  approvalRequired: false,
  approvalLevel: 0,
  securityRelated: true,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['agent_governance_safety_agent', 'secrets_cryptography_agent'],
  capabilities: ['Access review', 'Least-privilege analysis'],
};
