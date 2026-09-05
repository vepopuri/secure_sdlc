import type { ConnectorSeed } from './connectorSeed';
import { NON_PROD_ENVS } from './connectorSeed';

export const kubernetesContainerMcpSeed: ConnectorSeed = {
  id: 'kubernetes_container_mcp',
  name: 'Kubernetes and Container MCP',
  category: 'deployment',
  isPlatformService: false,
  connectedSystems: ['Kubernetes', 'container registries'],
  status: 'connected',
  dataTypes: ['Cluster state', 'Workload manifests', 'Image metadata'],
  readPermissions: ['Read cluster state', 'Read image metadata'],
  writePermissions: [],
  environmentAccess: NON_PROD_ENVS,
  description: 'Read-only cluster and image visibility for runtime security posture checks.',
};
