import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const githubGitlabMcpSeed: ConnectorSeed = {
  id: 'github_gitlab_mcp',
  name: 'GitHub / GitLab MCP',
  category: 'code_development',
  isPlatformService: false,
  connectedSystems: ['GitHub Enterprise', 'GitLab'],
  status: 'connected',
  dataTypes: ['Repositories', 'Pull requests', 'Branches', 'Commits'],
  readPermissions: ['Read repo structure', 'Read pull requests', 'Read commit history'],
  writePermissions: ['Create draft branch', 'Open draft pull request', 'Create review comment'],
  environmentAccess: NON_PROD_ENVS,
  description: 'The primary source-control connector used across planning, design, and development agents.',
};
