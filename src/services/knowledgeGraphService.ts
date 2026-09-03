import type { KgDomain, KgEntity, KgRelationship } from '../types/domain';
import { kgEntities as seedKgEntities, KG_DOMAINS } from '../data/knowledgeGraph';
import { withLatency } from './simulate';
import { initStore, savePersisted } from './persist';

// In-memory copy so entities/relationships can be created and edited without
// a backend. Replace this module with real HTTP calls against your Knowledge
// Graph API; keep the exported function signatures the same.
const STORE_KEY = 'kgEntities';
let store: KgEntity[] = initStore(STORE_KEY, seedKgEntities.map((e) => ({ ...e, relationships: e.relationships.map((r) => ({ ...r })) })));

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
    let results = store;
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
    return withLatency(store.find((e) => e.id === id), 180);
  },

  /** Returns the entity plus its directly related entities, for a simple relationship view. */
  getNeighborhood(id: string): Promise<{ center: KgEntity; neighbors: KgEntity[] } | undefined> {
    const center = store.find((e) => e.id === id);
    if (!center) return withLatency(undefined);
    const neighbors = center.relationships
      .map((r) => store.find((e) => e.id === r.targetEntityId))
      .filter((e): e is KgEntity => Boolean(e));
    return withLatency({ center, neighbors }, 260);
  },

  createEntity(input: Omit<KgEntity, 'id' | 'lastUpdated'>): Promise<KgEntity> {
    const entity: KgEntity = {
      ...input,
      id: `kg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      lastUpdated: new Date().toISOString(),
    };
    store = [entity, ...store];
    savePersisted(STORE_KEY, store);
    return withLatency(entity, 300);
  },

  updateEntity(id: string, patch: Partial<Omit<KgEntity, 'id'>>): Promise<KgEntity | undefined> {
    store = store.map((e) => (e.id === id ? { ...e, ...patch, lastUpdated: new Date().toISOString() } : e));
    savePersisted(STORE_KEY, store);
    return withLatency(store.find((e) => e.id === id), 300);
  },

  /**
   * Adds a relationship from `entityId` to its target, and — since this is a
   * demo of a graph that should read consistently from either end — also
   * appends the reciprocal relationship on the target entity pointing back.
   */
  addRelationship(entityId: string, relationship: Omit<KgRelationship, 'id'>): Promise<KgEntity | undefined> {
    const source = store.find((e) => e.id === entityId);
    if (!source) return withLatency(undefined);
    const forward: KgRelationship = { ...relationship, id: `rel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    const target = store.find((e) => e.id === relationship.targetEntityId);
    const reciprocal: KgRelationship | undefined = target
      ? {
          id: `rel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}_r`,
          type: relationship.type,
          targetEntityId: source.id,
          targetEntityName: source.name,
          targetDomain: source.domain,
        }
      : undefined;
    store = store.map((e) => {
      if (e.id === entityId) return { ...e, relationships: [...e.relationships, forward], lastUpdated: new Date().toISOString() };
      if (reciprocal && e.id === relationship.targetEntityId) {
        return { ...e, relationships: [...e.relationships, reciprocal], lastUpdated: new Date().toISOString() };
      }
      return e;
    });
    savePersisted(STORE_KEY, store);
    return withLatency(store.find((e) => e.id === entityId), 300);
  },
};
