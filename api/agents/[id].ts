// GET /api/agents/:id — fetch one
// PATCH /api/agents/:id  { enabled: boolean } — agentService.setEnabled
// POST /api/agents/:id   { projectId, environment } — agentService.run (demo run, writes audit row)
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { agents } from '../../db/schema.js';
import { appendAuditEvent } from '../_lib/audit.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';
import type { AgentExecutionRecord, Environment } from '../../src/types/domain.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'PATCH', 'POST'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing agent id.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const [agent] = await db.select().from(agents).where(eq(agents.id, id));
      if (!agent) {
        res.status(404).json({ ok: false, error: 'Agent not found.' });
        return;
      }
      res.status(200).json({ ok: true, data: agent });
      return;
    }

    if (req.method === 'PATCH') {
      const { enabled } = parseBody(req.body);
      if (typeof enabled !== 'boolean') {
        res.status(400).json({ ok: false, error: 'Body must include `enabled: boolean`.' });
        return;
      }
      const [updated] = await db
        .update(agents)
        .set({ status: enabled ? 'enabled' : 'disabled' })
        .where(eq(agents.id, id))
        .returning();
      if (!updated) {
        res.status(404).json({ ok: false, error: 'Agent not found.' });
        return;
      }
      res.status(200).json({ ok: true, data: updated });
      return;
    }

    // POST: demo-mode run. Appends a synthetic execution record; does not call a real agent.
    const { projectId, environment } = parseBody(req.body);
    if (typeof projectId !== 'string' || typeof environment !== 'string') {
      res.status(400).json({ ok: false, error: 'Body must include `projectId` and `environment`.' });
      return;
    }
    const [existing] = await db.select().from(agents).where(eq(agents.id, id));
    if (!existing) {
      res.status(404).json({ ok: false, error: 'Agent not found.' });
      return;
    }
    const record: AgentExecutionRecord = {
      id: `${id}-run-${randomUUID()}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      summary: 'Demo run completed. No real MCP connectors or systems were called.',
      durationSeconds: 12,
      confidenceScore: 0.91,
    };
    const [updated] = await db
      .update(agents)
      .set({ lastExecution: record, executionHistory: [record, ...existing.executionHistory] })
      .where(eq(agents.id, id))
      .returning();

    await appendAuditEvent({
      action: `Ran ${updated.name} (demo mode)`,
      user: updated.name,
      agentId: updated.id,
      projectId,
      environment: environment as Environment,
      riskLevel: updated.riskLevel,
      policyDecision: 'allowed',
      result: 'success',
      correlationId: `corr-run-${record.id}`,
    });

    res.status(200).json({ ok: true, data: updated });
  } catch (err) {
    handleError(res, err);
  }
}
