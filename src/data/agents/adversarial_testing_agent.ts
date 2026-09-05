import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const adversarialTestingAgentSeed: AgentSeed = {
  id: 'adversarial_testing_agent',
  name: 'Adversarial Testing Agent',
  category: CROSS,
  phaseIds: ['testing_qa'],
  shortDescription: 'Runs controlled adversarial and fuzz testing against non-production targets.',
  purpose: 'Find what a real attacker would find, safely, before they do.',
  responsibilities: [
    'Run controlled fuzz and adversarial test campaigns against non-production endpoints',
    'Report exploitable weaknesses with reproduction steps',
    'Coordinate scope with security leads before execution',
  ],
  inputs: ['API specifications', 'Non-production environment access'],
  outputs: ['Adversarial test reports'],
  requiredMcpConnectorIds: ['fuzzing_api_security_mcp'],
  allowedMcpTools: ['fuzzing.runCampaign'],
  kgEntitiesRead: ['security_compliance', 'codebase'],
  kgEntitiesWritten: ['security_compliance'],
  riskLevel: 'high',
  status: 'disabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 2,
  securityRelated: true,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['threat_intel_vuln_prioritization_agent'],
  capabilities: ['Fuzz testing', 'Adversarial scenario execution'],
};
