import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const secretsCryptographyAgentSeed: AgentSeed = {
  id: 'secrets_cryptography_agent',
  name: 'Secrets and Cryptography Agent',
  category: CROSS,
  phaseIds: ['development', 'deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Detects exposed secrets and flags weak or expiring cryptographic material.',
  purpose: 'Catch secret exposure and crypto hygiene issues before they are exploited.',
  responsibilities: [
    'Scan for exposed secrets in code, configuration, and logs',
    'Flag weak, expiring, or improperly rotated cryptographic material',
    'Recommend rotation without displaying secret values',
  ],
  inputs: ['Source code', 'Configuration files', 'Certificate inventories'],
  outputs: ['Secret exposure reports', 'Rotation recommendations'],
  requiredMcpConnectorIds: ['secrets_keys_certs_mcp'],
  allowedMcpTools: ['secretsManager.scanForExposure', 'secretsManager.readExpiryStatus'],
  kgEntitiesRead: ['secrets_keys_certs'],
  kgEntitiesWritten: ['secrets_keys_certs'],
  riskLevel: 'critical',
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
  capabilities: ['Secret scanning', 'Crypto material aging analysis'],
};
