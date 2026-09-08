// GET /api/kg-entities?search=&domains=a,b,c&projectId=  — knowledgeGraphService.search
// POST /api/kg-entities  { ...entity fields except id/lastUpdated } — knowledgeGraphService.createEntity
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from './_lib/db.js';
import { kgEntities, kgRelationships } from '../db/schema.js';
import { rejectMethod, queryParam, parseBody, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';
import type { KgEntity } from '../src/types/domain.js';

export async function loadEntityWithRelationships(id: string): Promise<KgEntity | undefined> {
  const [entity] = await db.select().from(kgEntities).where(eq(kgEntities.id, id));
  if (!entity) return undefined;
  const relationships = await db.select().from(kgRelationships).where(eq(kgRelationships.sourceEntityId, id));
  return { ...entity, relationships: relationships.map(({ sourceEntityId: _s, ...r }) => r) } as KgEntity;
}

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  try {
    if (req.method === 'GET') {
      const search = queryParam(req, 'search');
      const domains = queryParam(req, 'domains');
      const projectId = queryParam(req, 'projectId');

      const allEntities = await db.select().from(kgEntities);
      const allRelationships = await db.select().from(kgRelationships);
      const relsBySource = new Map<string, typeof allRelationships>();
      for (const r of allRelationships) {
        const list = relsBySource.get(r.sourceEntityId) ?? [];
        list.push(r);
        relsBySource.set(r.sourceEntityId, list);
      }

      let results = allEntities.map((e) => ({
        ...e,
        relationships: (relsBySource.get(e.id) ?? []).map(({ sourceEntityId: _s, ...r }) => r),
      })) as KgEntity[];

      if (domains) {
        const domainList = domains.split(',');
        results = results.filter((e) => domainList.includes(e.domain));
      }
      if (projectId) results = results.filter((e) => e.projectId === projectId);
      if (search) {
        const q = search.toLowerCase();
        results = results.filter((e) => `${e.name} ${e.summary} ${e.entityType}`.toLowerCase().includes(q));
      }
      res.status(200).json({ ok: true, data: results });
      return;
    }

    // POST: create entity
    const input = parseBody(req.body) as Omit<KgEntity, 'id' | 'lastUpdated'>;
    const entity = {
      ...input,
      id: `kg_${randomUUID()}`,
      lastUpdated: new Date().toISOString(),
    };
    const { relationships, ...entityRow } = entity;
    await db.insert(kgEntities).values(entityRow);
    if (relationships && relationships.length > 0) {
      await db.insert(kgRelationships).values(relationships.map((r) => ({ ...r, sourceEntityId: entity.id })));
    }
    res.status(200).json({ ok: true, data: await loadEntityWithRelationships(entity.id) });
  } catch (err) {
    handleError(res, err);
  }
}
