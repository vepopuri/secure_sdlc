import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const complianceAgentSeed: AgentSeed = {
  id: 'compliance_agent',
  name: 'Compliance Agent',
  category: CORE,
  phaseIds: phase('maintenance_feedback'),
  shortDescription: 'Tracks audit trails and reports compliance gaps against frameworks.',
  purpose: 'Keep evidence of compliance current instead of scrambling before an audit.',
  responsibilities: [
    'Maintain audit trail summaries for controlled actions',
    'Compare current posture against selected compliance frameworks',
    'Report compliance gaps with owning team and remediation status',
  ],
  inputs: ['Audit events', 'Policy definitions', 'Compliance frameworks'],
  outputs: ['Audit trails', 'Compliance gap reports'],
  requiredMcpConnectorIds: ['third_party_risk_grc_mcp'],
  allowedMcpTools: ['grc.readControlStatus'],
  kgEntitiesRead: ['policies_approvals_evidence', 'security_compliance'],
  kgEntitiesWritten: ['policies_approvals_evidence'],
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
  relatedAgentIds: ['privacy_data_governance_agent'],
  capabilities: ['Framework gap analysis', 'Audit trail reporting'],
};
