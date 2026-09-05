import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const securityDesignAgentSeed: AgentSeed = {
  id: 'security_design_agent',
  name: 'Security Design Agent',
  category: CORE,
  phaseIds: phase('design'),
  shortDescription: 'Produces threat models and security requirements ahead of implementation.',
  purpose: 'Catch design-stage security gaps before they become code-stage vulnerabilities.',
  responsibilities: [
    'Generate a threat model for proposed designs using STRIDE-style analysis',
    'Translate identified threats into concrete security requirements',
    'Cross-reference known vulnerability patterns for similar components',
  ],
  inputs: ['Architecture Decision Records', 'API specifications', 'Data classification'],
  outputs: ['Threat models', 'Security requirements'],
  requiredMcpConnectorIds: ['confluence_notion_mcp', 'threat_intelligence_mcp'],
  allowedMcpTools: ['confluence.createDraftPage', 'threatIntel.searchPatterns'],
  kgEntitiesRead: ['architecture', 'security_compliance', 'threat_intel'],
  kgEntitiesWritten: ['security_compliance'],
  riskLevel: 'medium',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: true,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['architecture_agent', 'threat_intel_vuln_prioritization_agent'],
  capabilities: ['Threat modeling', 'Security requirement drafting'],
};
