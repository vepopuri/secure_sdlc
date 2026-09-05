import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const uxWireframeAgentSeed: AgentSeed = {
  id: 'ux_wireframe_agent',
  name: 'UX Wireframe Agent',
  category: CORE,
  phaseIds: phase('design'),
  shortDescription: 'Generates low-fidelity wireframe specifications from product requirements.',
  purpose: 'Give design and engineering a shared starting point for interface intent.',
  responsibilities: [
    'Draft wireframe specifications aligned to user stories',
    'Reference existing component patterns where available',
    'Flag accessibility considerations for review',
  ],
  inputs: ['User stories', 'Existing design system references'],
  outputs: ['Wireframe specifications'],
  requiredMcpConnectorIds: ['figma_mcp'],
  allowedMcpTools: ['figma.readComponents', 'figma.createDraftFrame'],
  kgEntitiesRead: ['requirements'],
  kgEntitiesWritten: [],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['requirements_agent'],
  capabilities: ['Wireframe drafting', 'Design-system lookup'],
};
