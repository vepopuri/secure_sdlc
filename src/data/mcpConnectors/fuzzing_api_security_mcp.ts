import type { ConnectorSeed } from './connectorSeed';

export const fuzzingApiSecurityMcpSeed: ConnectorSeed = {
  id: 'fuzzing_api_security_mcp',
  name: 'Fuzzing and API Security MCP',
  category: 'testing_quality',
  isPlatformService: false,
  connectedSystems: ['API fuzzing engine'],
  status: 'not_configured',
  dataTypes: ['Fuzz campaign results', 'API abuse findings'],
  readPermissions: ['Read campaign results'],
  writePermissions: ['Run fuzz campaign'],
  environmentAccess: ['demo', 'development'],
  description: 'Runs controlled adversarial and fuzz campaigns against non-production API endpoints.',
};
