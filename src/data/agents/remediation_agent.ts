import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const remediationAgentSeed: AgentSeed = {
  id: 'remediation_agent',
  name: 'Remediation Agent',
  category: CORE,
  phaseIds: phase('testing_qa'),
  shortDescription: 'Drafts patch pull requests for confirmed vulnerabilities and defects.',
  purpose: 'Turn a confirmed finding into a reviewable fix, quickly.',
  responsibilities: [
    'Draft patch pull requests addressing confirmed vulnerabilities or bugs',
    'Include test updates that verify the fix',
    'Link the patch back to the originating finding for traceability',
  ],
  inputs: ['Vulnerability reports', 'Bug triage reports', 'Source code'],
  outputs: ['Patch pull requests'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'snyk_semgrep_mcp'],
  allowedMcpTools: ['github.createDraftBranch', 'github.openDraftPullRequest'],
  kgEntitiesRead: ['security_compliance', 'incidents_bugs', 'codebase'],
  kgEntitiesWritten: ['codebase'],
  riskLevel: 'high',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 2,
  securityRelated: true,
  canCreatePullRequests: true,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['security_scan_agent', 'bug_triage_agent'],
  capabilities: ['Patch drafting', 'Fix verification'],
};
