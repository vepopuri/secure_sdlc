import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const cloudContainerRuntimeSecurityAgentSeed: AgentSeed = {
  id: 'cloud_container_runtime_security_agent',
  name: 'Cloud, Container and Runtime Security Agent',
  category: CROSS,
  phaseIds: ['deployment_operations'],
  shortDescription: 'Monitors cloud posture, container images, and runtime behavior for exposure.',
  purpose: 'Catch cloud and runtime misconfiguration before it becomes an incident.',
  responsibilities: [
    'Evaluate cloud configuration against security posture baselines',
    'Scan container images for known vulnerabilities',
    'Flag anomalous runtime behavior in clusters',
  ],
  inputs: ['Cloud configuration', 'Container images', 'Runtime telemetry'],
  outputs: ['Runtime exposure reports'],
  requiredMcpConnectorIds: ['cloud_security_posture_mcp', 'kubernetes_container_mcp', 'runtime_security_mcp'],
  allowedMcpTools: ['cloudSecurityPosture.evaluateBaseline', 'runtimeSecurity.readAnomalies'],
  kgEntitiesRead: ['cloud_runtime', 'security_compliance'],
  kgEntitiesWritten: ['cloud_runtime'],
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
  relatedAgentIds: ['iac_agent', 'detection_engineering_agent'],
  capabilities: ['Posture evaluation', 'Image scanning', 'Runtime anomaly detection'],
};
