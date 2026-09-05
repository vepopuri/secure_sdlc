import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const observabilityAgentSeed: AgentSeed = {
  id: 'observability_agent',
  name: 'Observability Agent',
  category: CORE,
  phaseIds: phase('deployment_operations'),
  shortDescription: 'Configures alerts and summarizes incidents from telemetry data.',
  purpose: 'Turn raw telemetry into actionable alerting and incident summaries.',
  responsibilities: [
    'Recommend alert configurations based on service-level objectives',
    'Summarize active incidents from telemetry and logs',
    'Correlate anomalies with recent deployments',
  ],
  inputs: ['Telemetry data', 'Service-level objectives', 'Deployment history'],
  outputs: ['Alert configurations', 'Incident summaries'],
  requiredMcpConnectorIds: ['observability_platform_mcp', 'opentelemetry_mcp'],
  allowedMcpTools: ['observability.queryMetrics', 'observability.proposeAlertRule'],
  kgEntitiesRead: ['observability', 'deployments'],
  kgEntitiesWritten: ['observability', 'incidents_bugs'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['release_agent', 'incident_response_forensics_agent'],
  capabilities: ['Alert tuning', 'Anomaly correlation', 'Incident summarization'],
};
