// PATCH /api/teams/:id  { ...partial Team fields except id } — orgService.updateTeam
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { teams } from '../../db/schema.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['PATCH'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing team id.' });
    return;
  }
  try {
    const patch = parseBody(req.body);
    const [updated] = await db.update(teams).set(patch).where(eq(teams.id, id)).returning();
    if (!updated) {
      res.status(404).json({ ok: false, error: 'Team not found.' });
      return;
    }
    res.status(200).json({ ok: true, data: updated });
  } catch (err) {
    handleError(res, err);
  }
}
