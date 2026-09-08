// GET /api/mcp-connectors?search=&category=&status=
import { db } from './_lib/db.js';
import { mcpConnectors } from '../db/schema.js';
import { rejectMethod, queryParam, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  try {
    const search = queryParam(req, 'search');
    const category = queryParam(req, 'category');
    const status = queryParam(req, 'status');

    let results = await db.select().from(mcpConnectors);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(q));
    }
    if (category) results = results.filter((c) => c.category === category);
    if (status) results = results.filter((c) => c.status === status);
    res.status(200).json({ ok: true, data: results });
  } catch (err) {
    handleError(res, err);
  }
}
