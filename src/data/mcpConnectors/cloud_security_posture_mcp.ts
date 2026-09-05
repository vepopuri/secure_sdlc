import type { ConnectorSeed } from './connectorSeed';
import { ALL_ENVS } from './connectorSeed';

export const cloudSecurityPostureMcpSeed: ConnectorSeed = {
  id: 'cloud_security_posture_mcp',
  name: 'Cloud Security Posture MCP',
  category: 'deployment',
  isPlatformService: false,
  connectedSystems: ['Cloud Security Posture Management tool'],
  status: 'connected',
  dataTypes: ['Posture findings', 'Baseline evaluations'],
  readPermissions: ['Read posture findings'],
  writePermissions: [],
  environmentAccess: ALL_ENVS,
  description: 'Evaluates cloud configuration against security posture baselines.',
};
