import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const dependencyAgentSeed: AgentSeed = {
  id: 'dependency_agent',
  name: 'Dependency Agent',
  category: CORE,
  phaseIds: phase('planning_requirements'),
  shortDescription: 'Maps upstream/downstream dependencies across teams, services, and modules.',
  purpose: 'Surface hidden coupling before it becomes a delivery risk.',
  responsibilities: [
    'Trace service and module dependencies relevant to a proposed change',
    'Identify owning teams for dependent components',
    'Produce a dependency report highlighting delivery risk',
  ],
  inputs: ['Architecture entities', 'Repository manifests', 'Team ownership data'],
  outputs: ['Dependency reports'],
  requiredMcpConnectorIds: ['github_gitlab_mcp', 'artifact_registry_mcp'],
  allowedMcpTools: ['github.readRepoStructure', 'artifactRegistry.listDependencies'],
  kgEntitiesRead: ['architecture', 'codebase', 'team_people'],
  kgEntitiesWritten: [],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'read_only',
  approvalRequired: false,
  approvalLevel: 0,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['architecture_agent'],
  capabilities: ['Dependency graph traversal', 'Ownership mapping'],
};
