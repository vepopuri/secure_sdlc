import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const privacyDataGovernanceAgentSeed: AgentSeed = {
  id: 'privacy_data_governance_agent',
  name: 'Privacy and Data Governance Agent',
  category: CROSS,
  phaseIds: ['design', 'development', 'maintenance_feedback'],
  shortDescription: 'Tracks sensitive-data flows and flags data governance gaps.',
  purpose: 'Keep sensitive data flows classified, consented, and governed.',
  responsibilities: [
    'Classify data flows touching sensitive or regulated data',
    'Flag processing that lacks a documented lawful basis or retention policy',
    'Report data governance gaps to compliance stakeholders',
  ],
  inputs: ['Data flow diagrams', 'Data classification labels', 'Retention policies'],
  outputs: ['Data governance gap reports'],
  requiredMcpConnectorIds: ['data_catalog_dlp_mcp'],
  allowedMcpTools: ['dataCatalog.classifyFlow', 'dataCatalog.readRetentionPolicy'],
  kgEntitiesRead: ['data_classification'],
  kgEntitiesWritten: ['data_classification'],
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
  relatedAgentIds: ['compliance_agent'],
  capabilities: ['Data flow classification', 'Retention gap analysis'],
};
