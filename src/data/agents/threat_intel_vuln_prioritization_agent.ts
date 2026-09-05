import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const threatIntelVulnPrioritizationAgentSeed: AgentSeed = {
  id: 'threat_intel_vuln_prioritization_agent',
  name: 'Threat Intelligence and Vulnerability Prioritization Agent',
  category: CROSS,
  phaseIds: ['testing_qa', 'deployment_operations', 'maintenance_feedback'],
  shortDescription: 'Prioritizes vulnerabilities using live exploitability and threat context.',
  purpose: 'Rank findings by real-world exploitability, not just CVSS score.',
  responsibilities: [
    'Enrich vulnerability findings with threat intelligence context',
    'Re-prioritize the vulnerability backlog by exploitability signal',
    'Flag findings with known active exploitation',
  ],
  inputs: ['Vulnerability reports', 'Threat intelligence feeds'],
  outputs: ['Prioritized vulnerability backlogs'],
  requiredMcpConnectorIds: ['threat_intelligence_mcp'],
  allowedMcpTools: ['threatIntel.searchPatterns', 'threatIntel.readExploitabilitySignal'],
  kgEntitiesRead: ['threat_intel', 'security_compliance'],
  kgEntitiesWritten: ['threat_intel'],
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
  relatedAgentIds: ['security_scan_agent', 'adversarial_testing_agent'],
  capabilities: ['Exploitability enrichment', 'Backlog re-prioritization'],
};
