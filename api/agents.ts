// GET /api/agents?search=&phaseId=&category=&riskLevel=&status=&requiredMcpConnectorId=&readOrWrite=&approvalRequired=&securityRelated=
//
// Filtering happens in-process after a full-table fetch (mirrors the old
// mock agentService's matches() predicate exactly) rather than as SQL —
// the whole table is a few dozen rows, so this stays simple and correct
// rather than fighting jsonb containment operators for little benefit.
import { db } from './_lib/db.js';
import { agents } from '../db/schema.js';
import { rejectMethod, queryParam, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';
import type { Agent } from '../src/types/domain.js';

function matches(agent: Agent, req: MinimalRequest): boolean {
  const search = queryParam(req, 'search');
  const phaseId = queryParam(req, 'phaseId');
  const category = queryParam(req, 'category');
  const riskLevel = queryParam(req, 'riskLevel');
  const status = queryParam(req, 'status');
  const requiredMcpConnectorId = queryParam(req, 'requiredMcpConnectorId');
  const readOrWrite = queryParam(req, 'readOrWrite');
  const approvalRequired = queryParam(req, 'approvalRequired');
  const securityRelated = queryParam(req, 'securityRelated');

  if (search) {
    const q = search.toLowerCase();
    const haystack = `${agent.name} ${agent.shortDescription} ${agent.capabilities.join(' ')}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (phaseId && !agent.phaseIds.includes(phaseId as Agent['phaseIds'][number])) return false;
  if (category && agent.category !== category) return false;
  if (riskLevel && agent.riskLevel !== riskLevel) return false;
  if (status && agent.status !== status) return false;
  if (requiredMcpConnectorId && !agent.requiredMcpConnectorIds.includes(requiredMcpConnectorId)) return false;
  if (readOrWrite && agent.readOrWrite !== readOrWrite) return false;
  if (approvalRequired !== undefined && agent.approvalRequired !== (approvalRequired === 'true')) return false;
  if (securityRelated !== undefined && agent.securityRelated !== (securityRelated === 'true')) return false;
  return true;
}

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  try {
    const rows = await db.select().from(agents);
    res.status(200).json({ ok: true, data: rows.filter((a) => matches(a as unknown as Agent, req)) });
  } catch (err) {
    handleError(res, err);
  }
}
