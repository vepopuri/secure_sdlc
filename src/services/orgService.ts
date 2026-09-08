import type { Project, Team } from '../types/domain';
import { apiFetch, apiFetchOptional } from './apiClient';

export const orgService = {
  listTeams(): Promise<Team[]> {
    return apiFetch<Team[]>('/api/teams');
  },

  listProjects(): Promise<Project[]> {
    return apiFetch<Project[]>('/api/projects');
  },

  createTeam(input: Omit<Team, 'id'>): Promise<Team> {
    return apiFetch<Team>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateTeam(id: string, patch: Partial<Omit<Team, 'id'>>): Promise<Team | undefined> {
    return apiFetchOptional<Team>(`/api/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  createProject(input: Omit<Project, 'id'>): Promise<Project> {
    return apiFetch<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateProject(id: string, patch: Partial<Omit<Project, 'id'>>): Promise<Project | undefined> {
    return apiFetchOptional<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },
};
