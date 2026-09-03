import type { ConnectionStatus, McpCategory, McpConnector } from '../types/domain';
import { mcpConnectors as seedConnectors } from '../data/mcpConnectors';
import { withLatency, simulateOutcome } from './simulate';

let store: McpConnector[] = seedConnectors.map((c) => ({ ...c }));

export interface McpFilters {
  search?: string;
  category?: McpCategory;
  status?: ConnectionStatus;
}

function matches(c: McpConnector, filters: McpFilters): boolean {
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!`${c.name} ${c.description}`.toLowerCase().includes(q)) return false;
  }
  if (filters.category && c.category !== filters.category) return false;
  if (filters.status && c.status !== filters.status) return false;
  return true;
}

export const mcpService = {
  list(filters: McpFilters = {}): Promise<McpConnector[]> {
    return withLatency(store.filter((c) => matches(c, filters)));
  },

  getById(id: string): Promise<McpConnector | undefined> {
    return withLatency(store.find((c) => c.id === id));
  },

  /** Demo-mode connection test. Never calls a real system. */
  testConnection(id: string): Promise<{ ok: boolean; message: string }> {
    return simulateOutcome(
      { ok: true, message: `Demo mode: connection check for ${id} succeeded (simulated).` },
      0.15,
      900,
    ).catch((err: Error) => ({ ok: false, message: err.message }));
  },

  setStatus(id: string, status: ConnectionStatus): Promise<McpConnector | undefined> {
    store = store.map((c) => (c.id === id ? { ...c, status } : c));
    return withLatency(store.find((c) => c.id === id));
  },
};
