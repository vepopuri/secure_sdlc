// PATCH /api/roles/:id  { ...partial Role fields except id } — settingsService.updateRole
// RoleId is a closed 7-value union — this never creates or deletes a role, only edits one in place.
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { roles } from '../../db/schema.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';
import type { RoleId } from '../../src/types/domain.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['PATCH'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing role id.' });
    return;
  }
  try {
    const patch = parseBody(req.body);
    const [updated] = await db.update(roles).set(patch).where(eq(roles.id, id as RoleId)).returning();
    if (!updated) {
      res.status(404).json({ ok: false, error: 'Role not found.' });
      return;
    }
    res.status(200).json({ ok: true, data: updated });
  } catch (err) {
    handleError(res, err);
  }
}
