import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const sonarqubeCodeclimateMcpSeed: ConnectorSeed = {
  id: 'sonarqube_codeclimate_mcp',
  name: 'SonarQube / CodeClimate MCP',
  category: 'code_development',
  isPlatformService: false,
  connectedSystems: ['SonarQube', 'CodeClimate'],
  status: 'connected',
  dataTypes: ['Static analysis issues', 'Code quality metrics', 'Maintainability ratings'],
  readPermissions: ['Read issues', 'Read quality gates'],
  writePermissions: [],
  environmentAccess: NON_PROD_ENVS,
  description: 'Supplies code-quality signal used for review, refactor, and technical-debt scoring.',
};
