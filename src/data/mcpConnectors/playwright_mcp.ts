import type { ConnectorSeed } from './connectorSeed';

export const playwrightMcpSeed: ConnectorSeed = {
  id: 'playwright_mcp',
  name: 'Playwright MCP',
  category: 'testing_quality',
  isPlatformService: false,
  connectedSystems: ['Playwright'],
  status: 'connected',
  dataTypes: ['E2E test specs', 'Test run results'],
  readPermissions: ['Read test results'],
  writePermissions: ['Generate test spec', 'Run test suite'],
  environmentAccess: ['demo', 'development', 'staging'],
  description: 'Generates and executes end-to-end browser test specifications.',
};
