// GET /api/approvals?status=&actionLevel=&environment=
import { db } from './_lib/db.js';
import { approvals } from '../db/schema.js';
import { rejectMethod, queryParam, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  try {
    const status = queryParam(req, 'status');
    const actionLevel = queryParam(req, 'actionLevel');
    const environment = queryParam(req, 'environment');

    let results = await db.select().from(approvals);
    if (status) results = results.filter((a) => a.status === status);
    if (actionLevel !== undefined) results = results.filter((a) => a.actionLevel === Number(actionLevel));
    if (environment) results = results.filter((a) => a.environment === environment);
    res.status(200).json({ ok: true, data: results });
  } catch (err) {
    handleError(res, err);
  }
}
