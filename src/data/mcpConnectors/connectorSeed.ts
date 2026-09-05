import type { Environment, McpConnector } from '../../types/domain';

/** What each per-connector file provides — everything except the fields index.ts computes (using agents, sync time, health). */
export type ConnectorSeed = Omit<McpConnector, 'agentIdsUsing' | 'lastSynchronization' | 'healthCheck'>;

export const ALL_ENVS: Environment[] = ['demo', 'development', 'staging', 'production'];
export const NON_PROD_ENVS: Environment[] = ['demo', 'development', 'staging'];
