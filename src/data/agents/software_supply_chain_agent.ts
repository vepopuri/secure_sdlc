import type { AgentSeed } from './agentSeed';
import { CROSS } from './agentSeed';

export const softwareSupplyChainAgentSeed: AgentSeed = {
  id: 'software_supply_chain_agent',
  name: 'Software Supply Chain Agent',
  category: CROSS,
  phaseIds: ['development', 'testing_qa', 'deployment_operations'],
  shortDescription: 'Verifies build provenance, SBOMs, and artifact signing.',
  purpose: 'Ensure what gets deployed is what was actually built and reviewed.',
  responsibilities: [
    'Verify SBOM completeness for build artifacts',
    'Confirm artifact signatures and build provenance attestations',
    'Flag artifacts deployed without verified provenance',
  ],
  inputs: ['Build artifacts', 'SBOM data', 'Signing records'],
  outputs: ['Provenance verification reports'],
  requiredMcpConnectorIds: ['artifact_registry_mcp', 'package_registry_mcp'],
  allowedMcpTools: ['artifactRegistry.readProvenance', 'packageRegistry.readSbom'],
  kgEntitiesRead: ['sboms_provenance', 'deployments'],
  kgEntitiesWritten: ['sboms_provenance'],
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
  relatedAgentIds: ['third_party_security_risk_agent'],
  capabilities: ['SBOM verification', 'Provenance attestation checks'],
};
