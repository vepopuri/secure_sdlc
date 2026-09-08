// GET /api/projects — orgService.listProjects
// POST /api/projects  { name, repository, teamId, environment } — orgService.createProject
import { randomUUID } from 'node:crypto';
import { db } from './_lib/db.js';
import { projects } from '../db/schema.js';
import { rejectMethod, parseBody, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';
import type { Project } from '../src/types/domain.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  try {
    if (req.method === 'GET') {
      res.status(200).json({ ok: true, data: await db.select().from(projects) });
      return;
    }
    const input = parseBody(req.body) as Omit<Project, 'id'>;
    const [project] = await db
      .insert(projects)
      .values({ ...input, id: `proj_${randomUUID()}` })
      .returning();
    res.status(200).json({ ok: true, data: project });
  } catch (err) {
    handleError(res, err);
  }
}
