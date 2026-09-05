import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const securityScanAgentSeed: AgentSeed = {
  id: 'security_scan_agent',
  name: 'Security Scan Agent',
  category: CORE,
  phaseIds: phase('testing_qa'),
  shortDescription: 'Scans dependencies and code for known vulnerabilities.',
  purpose: 'Catch vulnerable dependencies and insecure patterns before release.',
  responsibilities: [
    'Run static and dependency vulnerability scans against changed code',
    'Correlate findings with the Knowledge Graph for existing exceptions',
    'Produce a prioritized vulnerability report',
  ],
  inputs: ['Source code', 'Dependency manifests'],
  outputs: ['Vulnerability reports'],
  requiredMcpConnectorIds: ['snyk_semgrep_mcp'],
  allowedMcpTools: ['snyk.scanDependencies', 'semgrep.scanCode'],
  kgEntitiesRead: ['codebase', 'security_compliance', 'threat_intel'],
  kgEntitiesWritten: ['security_compliance'],
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
  relatedAgentIds: ['remediation_agent', 'threat_intel_vuln_prioritization_agent'],
  capabilities: ['SAST', 'Dependency scanning', 'Exception correlation'],
};
