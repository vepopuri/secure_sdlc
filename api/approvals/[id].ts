// GET /api/approvals/:id — fetch one
// PATCH /api/approvals/:id  { decision: 'approved'|'rejected'|'changes_requested', decidedBy } — approvalService.decide
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { approvals } from '../../db/schema.js';
import { appendAuditEvent } from '../_lib/audit.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';

const VALID_DECISIONS = ['approved', 'rejected', 'changes_requested'] as const;

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'PATCH'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing approval id.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const [approval] = await db.select().from(approvals).where(eq(approvals.id, id));
      if (!approval) {
        res.status(404).json({ ok: false, error: 'Approval not found.' });
        return;
      }
      res.status(200).json({ ok: true, data: approval });
      return;
    }

    const { decision, decidedBy } = parseBody(req.body);
    if (typeof decidedBy !== 'string' || !VALID_DECISIONS.includes(decision as (typeof VALID_DECISIONS)[number])) {
      res.status(400).json({ ok: false, error: `Body must include \`decidedBy\` and \`decision\` (one of ${VALID_DECISIONS.join(', ')}).` });
      return;
    }

    const [before] = await db.select().from(approvals).where(eq(approvals.id, id));
    if (!before) {
      res.status(404).json({ ok: false, error: 'Approval not found.' });
      return;
    }

    const [updated] = await db
      .update(approvals)
      .set({ status: decision as (typeof VALID_DECISIONS)[number], decidedBy, decidedAt: new Date().toISOString() })
      .where(eq(approvals.id, id))
      .returning();

    const verb = decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : 'Requested changes on';
    await appendAuditEvent({
      action: `${verb} approval: ${before.requestedAction}`,
      user: decidedBy,
      agentId: before.initiatingAgentId,
      projectId: before.projectId,
      environment: before.environment,
      riskLevel: before.riskLevel,
      policyDecision: decision === 'approved' ? 'allowed' : decision === 'rejected' ? 'denied' : 'approval_required',
      result: 'success',
      correlationId: `corr-appr-${before.id}`,
    });

    res.status(200).json({ ok: true, data: updated });
  } catch (err) {
    handleError(res, err);
  }
}
