import type { ConnectionStatus, McpCategory, McpConnector } from '../types/domain';
import { apiFetch, apiFetchOptional, toQueryString } from './apiClient';

export interface McpFilters {
  search?: string;
  category?: McpCategory;
  status?: ConnectionStatus;
}

export const mcpService = {
  list(filters: McpFilters = {}): Promise<McpConnector[]> {
    return apiFetch<McpConnector[]>(`/api/mcp-connectors${toQueryString(filters)}`);
  },

  getById(id: string): Promise<McpConnector | undefined> {
    return apiFetchOptional<McpConnector>(`/api/mcp-connectors/${id}`);
  },

  /** Demo-mode connection test. Never calls a real system. */
  async testConnection(id: string): Promise<{ ok: boolean; message: string }> {
    const res = await fetch(`/api/mcp-connectors/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test' }),
    });
    return res.json();
  },

  setStatus(id: string, status: ConnectionStatus): Promise<McpConnector | undefined> {
    return apiFetchOptional<McpConnector>(`/api/mcp-connectors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
