import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Environment, Role, RoleId } from '../types/domain';
import { roles as seedRoles, defaultRoleId } from '../data/roles';
import { projects, workspace } from '../data/orgs';
import { loadPersisted, savePersisted } from '../services/persist';

interface AppState {
  roleId: RoleId;
  setRoleId: (id: RoleId) => void;
  role: Role;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  workspaceName: string;
  /** Re-reads the persisted roles store — call after editing a role's permissions in Settings. */
  refreshRoles: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleIdState] = useState<RoleId>(() => loadPersisted<RoleId>('roleId') ?? defaultRoleId);
  const [environment, setEnvironmentState] = useState<Environment>(() => loadPersisted<Environment>('environment') ?? 'demo');
  const [projectId, setProjectIdState] = useState<string>(() => loadPersisted<string>('projectId') ?? projects[0].id);
  const [rolesList, setRolesList] = useState<Role[]>(() => loadPersisted<Role[]>('roles') ?? seedRoles);

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
    setRolesList(loadPersisted<Role[]>('roles') ?? seedRoles);
  };

  const role = useMemo(() => rolesList.find((r) => r.id === roleId) ?? rolesList[0], [roleId, rolesList]);

  const value = useMemo<AppState>(
    () => ({ roleId, setRoleId, role, environment, setEnvironment, projectId, setProjectId, workspaceName: workspace.name, refreshRoles }),
    [roleId, role, environment, projectId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
