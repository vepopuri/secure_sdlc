// GET /api/roles — settingsService.listRoles
import { db } from './_lib/db.js';
import { roles } from '../db/schema.js';
import { rejectMethod, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  try {
    const rows = await db.select().from(roles);
    res.status(200).json({ ok: true, data: rows });
  } catch (err) {
    handleError(res, err);
  }
}
