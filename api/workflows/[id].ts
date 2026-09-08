// GET /api/workflows/:id — fetch one (with its steps)
// POST /api/workflows/:id  { action: 'start' } — workflowService.startRun
// POST /api/workflows/:id  { action: 'advance', stepIndex, projectId, environment } — workflowService.advanceStep
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db.js';
import { workflows, workflowSteps } from '../../db/schema.js';
import { loadWorkflowWithSteps } from '../workflows.js';
import { appendAuditEvent } from '../_lib/audit.js';
import { rejectMethod, queryParam, parseBody, handleError } from '../_lib/http.js';
import type { MinimalRequest, MinimalResponse } from '../_lib/http.js';
import type { Environment } from '../../src/types/domain.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  const id = queryParam(req, 'id');
  if (!id) {
    res.status(400).json({ ok: false, error: 'Missing workflow id.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const workflow = await loadWorkflowWithSteps(id);
      if (!workflow) {
        res.status(404).json({ ok: false, error: 'Workflow not found.' });
        return;
      }
      res.status(200).json({ ok: true, data: workflow });
      return;
    }

    const body = parseBody(req.body);
    const action = body.action;

    if (action === 'start') {
      // Demo-only: resets a workflow to a fresh active run, first step marked running.
      const [firstStep] = await db
        .select()
        .from(workflowSteps)
        .where(eq(workflowSteps.workflowId, id))
        .orderBy(workflowSteps.stepIndex)
        .limit(1);
      if (!firstStep) {
        res.status(404).json({ ok: false, error: 'Workflow not found.' });
        return;
      }
      await db.update(workflowSteps).set({ status: 'running' }).where(eq(workflowSteps.id, firstStep.id));
      await db
        .update(workflows)
        .set({ status: 'active', finalResult: null, currentStep: firstStep.label })
        .where(eq(workflows.id, id));
      res.status(200).json({ ok: true, data: await loadWorkflowWithSteps(id) });
      return;
    }

    if (action === 'advance') {
      const { stepIndex, projectId, environment } = body;
      if (typeof stepIndex !== 'number' || typeof projectId !== 'string' || typeof environment !== 'string') {
        res.status(400).json({ ok: false, error: 'Body must include `stepIndex`, `projectId`, `environment`.' });
        return;
      }
      const allSteps = await db
        .select()
        .from(workflowSteps)
        .where(eq(workflowSteps.workflowId, id))
        .orderBy(workflowSteps.stepIndex);
      if (allSteps.length === 0) {
        res.status(404).json({ ok: false, error: 'Workflow not found.' });
        return;
      }
      const isLast = stepIndex >= allSteps.length - 1;
      for (const step of allSteps) {
        if (step.stepIndex < stepIndex) {
          await db.update(workflowSteps).set({ status: 'completed' }).where(eq(workflowSteps.id, step.id));
        } else if (step.stepIndex === stepIndex) {
          await db
            .update(workflowSteps)
            .set({ status: isLast ? 'completed' : 'running' })
            .where(eq(workflowSteps.id, step.id));
        }
      }
      const currentLabel = allSteps.find((s) => s.stepIndex === stepIndex)?.label;
      const [existing] = await db.select().from(workflows).where(eq(workflows.id, id));
      const [updated] = await db
        .update(workflows)
        .set({
          currentStep: currentLabel ?? existing.currentStep,
          status: isLast ? 'completed' : 'active',
          finalResult: isLast ? (existing.finalResult ?? 'Live demo run completed. No real systems were called.') : existing.finalResult,
        })
        .where(eq(workflows.id, id))
        .returning();

      if (isLast) {
        await appendAuditEvent({
          action: `Completed workflow run: ${updated.name}`,
          user: updated.initiatingUser,
          agentId: null,
          projectId,
          environment: environment as Environment,
          policyDecision: 'allowed',
          result: 'success',
          relatedWorkflowId: updated.id,
          correlationId: `corr-wf-${updated.id}-${Date.now()}`,
        });
      }

      res.status(200).json({ ok: true, data: await loadWorkflowWithSteps(id) });
      return;
    }

    res.status(400).json({ ok: false, error: "Body `action` must be 'start' or 'advance'." });
  } catch (err) {
    handleError(res, err);
  }
}
