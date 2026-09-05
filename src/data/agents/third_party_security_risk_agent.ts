import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const thirdPartySecurityRiskAgentSeed: AgentSeed = {
  id: 'third_party_security_risk_agent',
  name: 'Third-Party Security Risk Agent',
  category: CROSS,
  phaseIds: ['planning_requirements', 'maintenance_feedback'],
  shortDescription: 'Assesses vendor and third-party service risk against governance policy.',
  purpose: 'Keep third-party exposure visible and reviewed, not assumed safe.',
  responsibilities: [
    'Assess vendor security posture against governance requirements',
    'Track third-party findings and remediation status',
    'Flag vendors with expired assessments or elevated risk',
  ],
  inputs: ['Vendor questionnaires', 'Third-party risk assessments'],
  outputs: ['Vendor risk reports'],
  requiredMcpConnectorIds: ['third_party_risk_grc_mcp'],
  allowedMcpTools: ['grc.readVendorAssessment'],
  kgEntitiesRead: ['vendors_third_party'],
  kgEntitiesWritten: ['vendors_third_party'],
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
  relatedAgentIds: ['software_supply_chain_agent', 'compliance_agent'],
  capabilities: ['Vendor risk assessment', 'Assessment expiry tracking'],
};
