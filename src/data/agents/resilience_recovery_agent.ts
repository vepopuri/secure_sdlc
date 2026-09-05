import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const resilienceRecoveryAgentSeed: AgentSeed = {
  id: 'resilience_recovery_agent',
  name: 'Resilience and Recovery Agent',
  category: CROSS,
  phaseIds: ['deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Validates backup integrity and recommends chaos and DR testing.',
  purpose: 'Prove recovery works before you need it, not during an outage.',
  responsibilities: [
    'Validate backup completeness and restore testing cadence',
    'Recommend chaos engineering scenarios for critical services',
    'Report on disaster-recovery readiness gaps',
  ],
  inputs: ['Backup records', 'DR runbooks', 'Service criticality data'],
  outputs: ['Resilience readiness reports'],
  requiredMcpConnectorIds: ['backup_dr_chaos_mcp'],
  allowedMcpTools: ['backupDr.readBackupStatus', 'backupDr.proposeChaosScenario'],
  kgEntitiesRead: ['cloud_runtime', 'deployments'],
  kgEntitiesWritten: [],
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
  relatedAgentIds: ['incident_response_forensics_agent'],
  capabilities: ['Backup validation', 'Chaos scenario recommendation'],
};
