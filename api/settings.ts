// GET /api/settings — settingsService.get
// PATCH /api/settings  { ...partial PlatformSettings } — settingsService.update
import { eq } from 'drizzle-orm';
import { db } from './_lib/db.js';
import { platformSettings } from '../db/schema.js';
import { rejectMethod, parseBody, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';

const SINGLETON_ID = 'singleton';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'PATCH'])) return;
  try {
    if (req.method === 'GET') {
      const [row] = await db.select().from(platformSettings).where(eq(platformSettings.id, SINGLETON_ID));
      if (!row) {
        res.status(404).json({ ok: false, error: 'Settings have not been seeded yet.' });
        return;
      }
      res.status(200).json({ ok: true, data: row.data });
      return;
    }

    const patch = parseBody(req.body);
    const [existing] = await db.select().from(platformSettings).where(eq(platformSettings.id, SINGLETON_ID));
    const merged = { ...(existing?.data as Record<string, unknown> | undefined), ...patch };
    await db
      .insert(platformSettings)
      .values({ id: SINGLETON_ID, data: merged })
      .onConflictDoUpdate({ target: platformSettings.id, set: { data: merged } });
    res.status(200).json({ ok: true, data: merged });
  } catch (err) {
    handleError(res, err);
  }
}
