import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const snykSemgrepMcpSeed: ConnectorSeed = {
  id: 'snyk_semgrep_mcp',
  name: 'Snyk / Semgrep MCP',
  category: 'testing_quality',
  isPlatformService: false,
  connectedSystems: ['Snyk', 'Semgrep'],
  status: 'connected',
  dataTypes: ['Vulnerability findings', 'SAST findings'],
  readPermissions: ['Read findings'],
  writePermissions: ['Trigger scan'],
  environmentAccess: NON_PROD_ENVS,
  description: 'Runs dependency and static application security scans for the testing phase.',
};
