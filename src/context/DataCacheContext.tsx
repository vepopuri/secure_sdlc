import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Agent, McpConnector, Workflow, ApprovalItem, Project, Team, KgEntity, AuditEvent } from '../types/domain';
import { agentService, mcpService, workflowService, approvalService, orgService, knowledgeGraphService, auditService } from '../services';

/**
 * Now that these collections live in a real database instead of static
 * `src/data/**` arrays, any page/component that used to import one of those
 * arrays directly for a cross-reference lookup (e.g. resolving an approval's
 * `projectId` into a project name) would silently go stale — it would never
 * see a mutation made through the API. This context fetches each mutable
 * collection once, so lookups by id read the live data instead.
 *
 * Pages that own a collection as their PRIMARY listing (AgentsPage,
 * WorkflowsPage, ApprovalsPage, McpConnectionsPage, KnowledgeGraphPage) keep
 * calling their service directly with their own filters/loading state —
 * this cache is only for secondary "what's the name behind this id" lookups
 * elsewhere, where a single one-time fetch per session is an acceptable
 * trade-off for a demo app.
 */
interface DataCache {
  agents: Agent[];
  mcpConnectors: McpConnector[];
  workflows: Workflow[];
  approvals: ApprovalItem[];
  projects: Project[];
  teams: Team[];
  kgEntities: KgEntity[];
  auditEvents: AuditEvent[];
  loading: boolean;
}

const DataCacheContext = createContext<DataCache | undefined>(undefined);

const EMPTY: DataCache = { agents: [], mcpConnectors: [], workflows: [], approvals: [], projects: [], teams: [], kgEntities: [], auditEvents: [], loading: true };

export function DataCacheProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataCache>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      agentService.list(),
      mcpService.list(),
      workflowService.list(),
      approvalService.list(),
      orgService.listProjects(),
      orgService.listTeams(),
      knowledgeGraphService.search(),
      auditService.list(),
    ]).then(([agents, mcpConnectors, workflows, approvals, projects, teams, kgEntities, auditEvents]) => {
      if (!cancelled) setState({ agents, mcpConnectors, workflows, approvals, projects, teams, kgEntities, auditEvents, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <DataCacheContext.Provider value={state}>{children}</DataCacheContext.Provider>;
}

export function useDataCache(): DataCache {
  const ctx = useContext(DataCacheContext);
  if (!ctx) throw new Error('useDataCache must be used within DataCacheProvider');
  return ctx;
}
