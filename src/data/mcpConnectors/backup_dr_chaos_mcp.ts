import type { ConnectorSeed } from './connectorSeed';

export const backupDrChaosMcpSeed: ConnectorSeed = {
  id: 'backup_dr_chaos_mcp',
  name: 'Backup, Disaster Recovery, and Chaos MCP',
  category: 'resilience_compliance_comms',
  isPlatformService: false,
  connectedSystems: ['Backup platform', 'Chaos engineering tool'],
  status: 'needs_attention',
  dataTypes: ['Backup status', 'DR runbooks', 'Chaos scenario results'],
  readPermissions: ['Read backup status'],
  writePermissions: ['Propose chaos scenario'],
  environmentAccess: ['demo', 'staging'],
  description: 'Backup and DR readiness data; last verification run is overdue.',
};
