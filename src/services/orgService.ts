import type { Project, Team } from '../types/domain';
import { teams as seedTeams, projects as seedProjects } from '../data/orgs';
import { withLatency } from './simulate';
import { initStore, savePersisted } from './persist';

const TEAMS_STORE_KEY = 'teams';
const PROJECTS_STORE_KEY = 'projects';

let teamsStore: Team[] = initStore(TEAMS_STORE_KEY, seedTeams.map((t) => ({ ...t, projectIds: [...t.projectIds] })));
let projectsStore: Project[] = initStore(PROJECTS_STORE_KEY, seedProjects.map((p) => ({ ...p, environment: [...p.environment] })));

export const orgService = {
  listTeams(): Promise<Team[]> {
    return withLatency(teamsStore, 150);
  },

  listProjects(): Promise<Project[]> {
    return withLatency(projectsStore, 150);
  },

  createTeam(input: Omit<Team, 'id'>): Promise<Team> {
    const team: Team = { ...input, id: `team_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    teamsStore = [...teamsStore, team];
    savePersisted(TEAMS_STORE_KEY, teamsStore);
    return withLatency(team, 250);
  },

  updateTeam(id: string, patch: Partial<Omit<Team, 'id'>>): Promise<Team | undefined> {
    teamsStore = teamsStore.map((t) => (t.id === id ? { ...t, ...patch } : t));
    savePersisted(TEAMS_STORE_KEY, teamsStore);
    return withLatency(teamsStore.find((t) => t.id === id), 250);
  },

  createProject(input: Omit<Project, 'id'>): Promise<Project> {
    const project: Project = { ...input, id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    projectsStore = [...projectsStore, project];
    savePersisted(PROJECTS_STORE_KEY, projectsStore);
    return withLatency(project, 250);
  },

  updateProject(id: string, patch: Partial<Omit<Project, 'id'>>): Promise<Project | undefined> {
    projectsStore = projectsStore.map((p) => (p.id === id ? { ...p, ...patch } : p));
    savePersisted(PROJECTS_STORE_KEY, projectsStore);
    return withLatency(projectsStore.find((p) => p.id === id), 250);
  },
};
