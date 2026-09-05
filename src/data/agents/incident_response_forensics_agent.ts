import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const incidentResponseForensicsAgentSeed: AgentSeed = {
  id: 'incident_response_forensics_agent',
  name: 'Incident Response and Forensics Agent',
  category: CROSS,
  phaseIds: ['deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Assembles incident timelines and root-cause evidence for responders.',
  purpose: 'Give responders a fast, evidence-backed starting point during an incident.',
  responsibilities: [
    'Assemble a timeline of events leading to an incident',
    'Correlate logs, deployments, and changes to propose root cause',
    'Attach evidence to the incident record for forensics review',
  ],
  inputs: ['Incident alerts', 'Logs', 'Deployment history'],
  outputs: ['Incident timelines', 'Root-cause evidence packages'],
  requiredMcpConnectorIds: ['incident_case_forensics_mcp', 'pagerduty_opsgenie_mcp'],
  allowedMcpTools: ['incidentCase.readTimeline', 'incidentCase.attachEvidence'],
  kgEntitiesRead: ['incidents_bugs', 'deployments', 'observability'],
  kgEntitiesWritten: ['incidents_bugs'],
  riskLevel: 'high',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: true,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['observability_agent', 'detection_engineering_agent'],
  capabilities: ['Timeline assembly', 'Root-cause correlation'],
};
