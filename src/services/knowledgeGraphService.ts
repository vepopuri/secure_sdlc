import type { KgDomain, KgEntity } from '../types/domain';
import { kgEntities, KG_DOMAINS } from '../data/knowledgeGraph';
import { withLatency } from './simulate';

export interface KgSearchFilters {
  search?: string;
  domains?: KgDomain[];
  projectId?: string;
}

export const knowledgeGraphService = {
  listDomains() {
    return withLatency(KG_DOMAINS, 80);
  },

  search(filters: KgSearchFilters = {}): Promise<KgEntity[]> {
    let results = kgEntities;
    if (filters.domains && filters.domains.length > 0) {
      results = results.filter((e) => filters.domains!.includes(e.domain));
    }
    if (filters.projectId) {
      results = results.filter((e) => e.projectId === filters.projectId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((e) => `${e.name} ${e.summary} ${e.entityType}`.toLowerCase().includes(q));
    }
    return withLatency(results, 260);
  },

  getById(id: string): Promise<KgEntity | undefined> {
    return withLatency(kgEntities.find((e) => e.id === id), 180);
  },

  /** Returns the entity plus its directly related entities, for a simple relationship view. */
  getNeighborhood(id: string): Promise<{ center: KgEntity; neighbors: KgEntity[] } | undefined> {
    const center = kgEntities.find((e) => e.id === id);
    if (!center) return withLatency(undefined);
    const neighbors = center.relationships
      .map((r) => kgEntities.find((e) => e.id === r.targetEntityId))
      .filter((e): e is KgEntity => Boolean(e));
    return withLatency({ center, neighbors }, 260);
  },
};
