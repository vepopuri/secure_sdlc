import type { KgDomain, KgEntity, KgRelationship } from '../types/domain';
import { KG_DOMAINS } from '../data/knowledgeGraph';
import { apiFetch, apiFetchOptional, toQueryString } from './apiClient';

export interface KgSearchFilters {
  search?: string;
  domains?: KgDomain[];
  projectId?: string;
}

export const knowledgeGraphService = {
  // Static taxonomy, never mutated anywhere in the app — stays as bundled
  // data rather than a DB table (see db/schema.ts's header comment).
  listDomains() {
    return Promise.resolve(KG_DOMAINS);
  },

  search(filters: KgSearchFilters = {}): Promise<KgEntity[]> {
    const qs = toQueryString({
      search: filters.search,
      projectId: filters.projectId,
      domains: filters.domains && filters.domains.length > 0 ? filters.domains.join(',') : undefined,
    });
    return apiFetch<KgEntity[]>(`/api/kg-entities${qs}`);
  },

  getById(id: string): Promise<KgEntity | undefined> {
    return apiFetchOptional<KgEntity>(`/api/kg-entities/${id}`);
  },

  /** Returns the entity plus its directly related entities, for a simple relationship view. */
  getNeighborhood(id: string): Promise<{ center: KgEntity; neighbors: KgEntity[] } | undefined> {
    return apiFetchOptional<{ center: KgEntity; neighbors: KgEntity[] }>(`/api/kg-entities/${id}?neighborhood=1`);
  },

  createEntity(input: Omit<KgEntity, 'id' | 'lastUpdated'>): Promise<KgEntity> {
    return apiFetch<KgEntity>('/api/kg-entities', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateEntity(id: string, patch: Partial<Omit<KgEntity, 'id'>>): Promise<KgEntity | undefined> {
    return apiFetchOptional<KgEntity>(`/api/kg-entities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  /**
   * Adds a relationship from `entityId` to its target. The server also
   * appends the reciprocal relationship on the target entity pointing back,
   * so the graph reads consistently from either end.
   */
  addRelationship(entityId: string, relationship: Omit<KgRelationship, 'id'>): Promise<KgEntity | undefined> {
    return apiFetchOptional<KgEntity>(`/api/kg-entities/${entityId}`, {
      method: 'POST',
      body: JSON.stringify({ relationship }),
    });
  },
};
