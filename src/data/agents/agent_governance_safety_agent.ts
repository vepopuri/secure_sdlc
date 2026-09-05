import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const agentGovernanceSafetyAgentSeed: AgentSeed = {
  id: 'agent_governance_safety_agent',
  name: 'Agent Governance and Safety Agent',
  category: CROSS,
  phaseIds: ['planning_requirements', 'development', 'deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Monitors agent behavior against policy and flags governance violations.',
  purpose: 'Keep every other agent operating inside its declared permissions and policy.',
  responsibilities: [
    'Monitor agent tool calls for policy or scope violations',
    'Flag agents whose behavior deviates from their declared capabilities',
    'Recommend permission tightening for over-privileged agents',
  ],
  inputs: ['Agent execution logs', 'Policy definitions', 'Agent capability declarations'],
  outputs: ['Governance violation reports', 'Permission recommendations'],
  requiredMcpConnectorIds: ['policy_engine_mcp'],
  allowedMcpTools: ['policyEngine.evaluateAction', 'policyEngine.readPolicy'],
  kgEntitiesRead: ['tools_permissions_actions', 'identities'],
  kgEntitiesWritten: ['tools_permissions_actions'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'read_only',
  approvalRequired: false,
  approvalLevel: 0,
  securityRelated: true,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['iam_access_security_agent'],
  capabilities: ['Policy conformance monitoring', 'Privilege review'],
};
