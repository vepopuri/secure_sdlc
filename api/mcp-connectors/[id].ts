// GET /api/mcp-connectors/:id — fetch one
// POST /api/mcp-connectors/:id  { action: 'test' } — mcpService.testConnection (demo-mode, never calls a real system)
// PATCH /api/mcp-connectors/:id { status } — mcpService.setStatus
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { mcpConnectors } from '../../db/schema.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'PATCH', 'POST'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing connector id.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const [connector] = await db.select().from(mcpConnectors).where(eq(mcpConnectors.id, id));
      if (!connector) {
        res.status(404).json({ ok: false, error: 'Connector not found.' });
        return;
      }
      res.status(200).json({ ok: true, data: connector });
      return;
    }

    if (req.method === 'POST') {
      // Demo-mode connection test. Never calls a real system.
      const failed = Math.random() < 0.15;
      if (failed) {
        res.status(200).json({ ok: false, message: 'Demo mode: simulated connector timeout. This did not call a real system.' });
        return;
      }
      res.status(200).json({ ok: true, message: `Demo mode: connection check for ${id} succeeded (simulated).` });
      return;
    }

    const { status } = parseBody(req.body);
    if (typeof status !== 'string') {
      res.status(400).json({ ok: false, error: 'Body must include `status`.' });
      return;
    }
    const [updated] = await db
      .update(mcpConnectors)
      .set({ status: status as (typeof mcpConnectors.$inferSelect)['status'] })
      .where(eq(mcpConnectors.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ ok: false, error: 'Connector not found.' });
      return;
    }
    res.status(200).json({ ok: true, data: updated });
  } catch (err) {
    handleError(res, err);
  }
}
