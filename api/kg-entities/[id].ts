// GET /api/kg-entities/:id             — knowledgeGraphService.getById
// GET /api/kg-entities/:id?neighborhood=1 — knowledgeGraphService.getNeighborhood
// PATCH /api/kg-entities/:id  { ...partial entity fields } — knowledgeGraphService.updateEntity
// POST /api/kg-entities/:id   { relationship: {...} } — knowledgeGraphService.addRelationship (writes the reciprocal edge too)
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { kgEntities, kgRelationships } from '../../db/schema.js';
import { loadEntityWithRelationships } from '../kg-entities.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';
import type { KgRelationship } from '../../src/types/domain.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'PATCH', 'POST'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing entity id.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const center = await loadEntityWithRelationships(id);
      if (!center) {
        res.status(404).json({ ok: false, error: 'Entity not found.' });
        return;
      }
      if (queryParam(req, 'neighborhood')) {
        const neighbors = (
          await Promise.all(center.relationships.map((r) => loadEntityWithRelationships(r.targetEntityId)))
        ).filter((e): e is NonNullable<typeof e> => Boolean(e));
        res.status(200).json({ ok: true, data: { center, neighbors } });
        return;
      }
      res.status(200).json({ ok: true, data: center });
      return;
    }

    if (req.method === 'PATCH') {
      const patch = parseBody(req.body);
      const [updated] = await db
        .update(kgEntities)
        .set({ ...patch, lastUpdated: new Date().toISOString() })
        .where(eq(kgEntities.id, id))
        .returning();
      if (!updated) {
        res.status(404).json({ ok: false, error: 'Entity not found.' });
        return;
      }
      res.status(200).json({ ok: true, data: await loadEntityWithRelationships(id) });
      return;
    }

    // POST: add relationship (+ reciprocal edge on the target, if it exists)
    const { relationship } = parseBody(req.body) as { relationship?: Omit<KgRelationship, 'id'> };
    const [source] = await db.select().from(kgEntities).where(eq(kgEntities.id, id));
    if (!source || !relationship) {
      res.status(404).json({ ok: false, error: 'Entity not found, or missing `relationship` in body.' });
      return;
    }
    await db.insert(kgRelationships).values({ ...relationship, id: `rel_${randomUUID()}`, sourceEntityId: id });

    const [target] = await db.select().from(kgEntities).where(eq(kgEntities.id, relationship.targetEntityId));
    if (target) {
      await db.insert(kgRelationships).values({
        id: `rel_${randomUUID()}`,
        sourceEntityId: target.id,
        type: relationship.type,
        targetEntityId: source.id,
        targetEntityName: source.name,
        targetDomain: source.domain,
      });
    }
    await db.update(kgEntities).set({ lastUpdated: new Date().toISOString() }).where(eq(kgEntities.id, id));
    if (target) await db.update(kgEntities).set({ lastUpdated: new Date().toISOString() }).where(eq(kgEntities.id, target.id));

    res.status(200).json({ ok: true, data: await loadEntityWithRelationships(id) });
  } catch (err) {
    handleError(res, err);
  }
}
