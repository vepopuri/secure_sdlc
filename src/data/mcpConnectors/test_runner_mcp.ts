import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const testRunnerMcpSeed: ConnectorSeed = {
  id: 'test_runner_mcp',
  name: 'Jest / Pytest Test MCP',
  category: 'testing_quality',
  isPlatformService: false,
  connectedSystems: ['Jest', 'Pytest'],
  status: 'connected',
  dataTypes: ['Test results', 'Coverage data'],
  readPermissions: ['Read test results', 'Read coverage'],
  writePermissions: ['Run test suite'],
  environmentAccess: NON_PROD_ENVS,
  description: 'Executes unit and integration test suites and returns coverage data.',
};
