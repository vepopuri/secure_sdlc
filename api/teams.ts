// GET /api/teams — orgService.listTeams
// POST /api/teams  { name, memberCount, projectIds } — orgService.createTeam
import { randomUUID } from 'node:crypto';
import { db } from './_lib/db.js';
import { teams } from '../db/schema.js';
import { rejectMethod, parseBody, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';
import type { Team } from '../src/types/domain.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  try {
    if (req.method === 'GET') {
      res.status(200).json({ ok: true, data: await db.select().from(teams) });
      return;
    }
    const input = parseBody(req.body) as Omit<Team, 'id'>;
    const [team] = await db
      .insert(teams)
      .values({ ...input, id: `team_${randomUUID()}` })
      .returning();
    res.status(200).json({ ok: true, data: team });
  } catch (err) {
    handleError(res, err);
  }
}
