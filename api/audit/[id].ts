// GET /api/audit/:id — auditService.getById
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { auditEvents } from '../../db/schema.js';
import { rejectMethod, queryParam, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing audit event id.' });
    return;
  }
  try {
    const [event] = await db.select().from(auditEvents).where(eq(auditEvents.id, id));
    if (!event) {
      res.status(404).json({ ok: false, error: 'Audit event not found.' });
      return;
    }
    res.status(200).json({ ok: true, data: event });
  } catch (err) {
    handleError(res, err);
  }
}
