import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Environment, Role, RoleId } from '../types/domain';
import { defaultRoleId } from '../data/roles';
import { workspace } from '../data/orgs';
import { loadPersisted, savePersisted } from '../services/persist';
import { settingsService } from '../services';

// Fallback used only until the real project list loads (see DataCacheContext)
// — matches this demo's first seeded project. Not authoritative, just avoids
// an empty initial selection before the async fetch resolves.
const FALLBACK_PROJECT_ID = 'proj_checkout_service';

// Shown only for the brief window before settingsService.listRoles() resolves,
// so `role` below is never undefined and pages don't crash reading
// role.canApprove/role.visibleTabs/etc. before the real roles arrive.
const LOADING_ROLE: Role = {
  id: 'read_only_user',
  name: 'Loading…',
  description: '',
  visibleTabs: [],
  canApprove: [],
  canConfigureIntegrations: false,
  canRunAgents: false,
  environmentAccess: ['demo'],
  auditVisibility: 'own',
};

interface AppState {
  roleId: RoleId;
  setRoleId: (id: RoleId) => void;
  role: Role;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  workspaceName: string;
  /** All roles (for the role-switcher menu), not just the currently active one. */
  roles: Role[];
  /** Re-reads the roles store — call after editing a role's permissions in Settings. */
  refreshRoles: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleIdState] = useState<RoleId>(() => loadPersisted<RoleId>('roleId') ?? defaultRoleId);
  const [environment, setEnvironmentState] = useState<Environment>(() => loadPersisted<Environment>('environment') ?? 'demo');
  const [projectId, setProjectIdState] = useState<string>(() => loadPersisted<string>('projectId') ?? FALLBACK_PROJECT_ID);
  const [rolesList, setRolesList] = useState<Role[]>([LOADING_ROLE]);

  useEffect(() => {
    let cancelled = false;
    settingsService.listRoles().then((roles) => {
      if (!cancelled) setRolesList(roles);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setRoleId = (id: RoleId) => {
    setRoleIdState(id);
    savePersisted('roleId', id);
  };
  const setEnvironment = (env: Environment) => {
    setEnvironmentState(env);
    savePersisted('environment', env);
  };
  const setProjectId = (id: string) => {
    setProjectIdState(id);
    savePersisted('projectId', id);
  };
  const refreshRoles = () => {
    settingsService.listRoles().then(setRolesList);
  };

  const role = useMemo(() => rolesList.find((r) => r.id === roleId) ?? rolesList[0], [roleId, rolesList]);

  const value = useMemo<AppState>(
    () => ({ roleId, setRoleId, role, environment, setEnvironment, projectId, setProjectId, workspaceName: workspace.name, roles: rolesList, refreshRoles }),
    [roleId, role, environment, projectId, rolesList],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
