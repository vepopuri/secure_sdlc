// GET /api/workflows?status=&search=
import { asc, eq } from 'drizzle-orm';
import { db } from './_lib/db.js';
import { workflows, workflowSteps } from '../db/schema.js';
import { rejectMethod, queryParam, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';
import type { Workflow, WorkflowStepEvent } from '../src/types/domain.js';

export async function loadWorkflowWithSteps(id: string): Promise<Workflow | undefined> {
  const [wf] = await db.select().from(workflows).where(eq(workflows.id, id));
  if (!wf) return undefined;
  const steps = await db
    .select()
    .from(workflowSteps)
    .where(eq(workflowSteps.workflowId, id))
    .orderBy(asc(workflowSteps.stepIndex));
  return { ...wf, steps: steps.map(stripStepRowFields) } as Workflow;
}

function stripStepRowFields(row: typeof workflowSteps.$inferSelect): WorkflowStepEvent {
  const { workflowId: _workflowId, stepIndex: _stepIndex, agentId, mcpConnectorId, ...rest } = row;
  return { ...rest, agentId: agentId ?? undefined, mcpConnectorId: mcpConnectorId ?? undefined };
}

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  try {
    const status = queryParam(req, 'status');
    const search = queryParam(req, 'search');

    const allWorkflows = await db.select().from(workflows);
    const allSteps = await db.select().from(workflowSteps).orderBy(asc(workflowSteps.stepIndex));
    const stepsByWorkflow = new Map<string, WorkflowStepEvent[]>();
    for (const step of allSteps) {
      const list = stepsByWorkflow.get(step.workflowId) ?? [];
      list.push(stripStepRowFields(step));
      stepsByWorkflow.set(step.workflowId, list);
    }

    let results: Workflow[] = allWorkflows.map((w) => ({ ...w, steps: stepsByWorkflow.get(w.id) ?? [] })) as Workflow[];
    if (status) results = results.filter((w) => w.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((w) => `${w.name} ${w.description}`.toLowerCase().includes(q));
    }
    res.status(200).json({ ok: true, data: results });
  } catch (err) {
    handleError(res, err);
  }
}
