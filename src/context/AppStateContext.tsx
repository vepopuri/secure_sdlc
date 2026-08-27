import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Environment, RoleId } from '../types/domain';
import { roles, defaultRoleId } from '../data/roles';
import { projects, workspace } from '../data/orgs';

interface AppState {
  roleId: RoleId;
  setRoleId: (id: RoleId) => void;
  role: (typeof roles)[number];
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  workspaceName: string;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleId] = useState<RoleId>(defaultRoleId);
  const [environment, setEnvironment] = useState<Environment>('demo');
  const [projectId, setProjectId] = useState<string>(projects[0].id);

  const role = useMemo(() => roles.find((r) => r.id === roleId) ?? roles[0], [roleId]);

  const value = useMemo<AppState>(
    () => ({ roleId, setRoleId, role, environment, setEnvironment, projectId, setProjectId, workspaceName: workspace.name }),
    [roleId, role, environment, projectId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
