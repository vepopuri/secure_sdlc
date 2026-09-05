import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const detectionEngineeringAgentSeed: AgentSeed = {
  id: 'detection_engineering_agent',
  name: 'Detection Engineering Agent',
  category: CROSS,
  phaseIds: ['deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Builds and tunes detection rules from incident and threat patterns.',
  purpose: 'Turn confirmed threats and incidents into durable detection coverage.',
  responsibilities: [
    'Draft detection rules from confirmed incidents and threat intelligence',
    'Tune existing rules to reduce false-positive rates',
    'Map detection coverage against known attack patterns',
  ],
  inputs: ['SIEM data', 'Incident reports', 'Threat intelligence'],
  outputs: ['Detection rule drafts', 'Coverage maps'],
  requiredMcpConnectorIds: ['siem_detection_mcp'],
  allowedMcpTools: ['siem.readAlertHistory', 'siem.proposeDetectionRule'],
  kgEntitiesRead: ['threat_intel', 'incidents_bugs'],
  kgEntitiesWritten: ['threat_intel'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 2,
  securityRelated: true,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['cloud_container_runtime_security_agent', 'incident_response_forensics_agent'],
  capabilities: ['Detection rule authoring', 'False-positive tuning'],
};
