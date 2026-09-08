// GET /api/audit?search=&user=&agentId=&projectId=&mcpServer=&riskLevel=&result=&environment=
// Read-only from the client's perspective — audit rows are written server-side
// by appendAuditEvent() from inside the mutating endpoints that need one,
// never appended directly by a client request.
import { db } from './_lib/db.js';
import { auditEvents } from '../db/schema.js';
import { rejectMethod, queryParam, handleError } from './_lib/http.js';
import type { MinimalRequest, MinimalResponse } from './_lib/http.js';

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (rejectMethod(req, res, ['GET'])) return;
  try {
    const search = queryParam(req, 'search');
    const user = queryParam(req, 'user');
    const agentId = queryParam(req, 'agentId');
    const projectId = queryParam(req, 'projectId');
    const mcpServer = queryParam(req, 'mcpServer');
    const riskLevel = queryParam(req, 'riskLevel');
    const result = queryParam(req, 'result');
    const environment = queryParam(req, 'environment');

    let results = await db.select().from(auditEvents);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((e) => `${e.action} ${e.user} ${e.correlationId}`.toLowerCase().includes(q));
    }
    if (user) results = results.filter((e) => e.user === user);
    if (agentId) results = results.filter((e) => e.agentId === agentId);
    if (projectId) results = results.filter((e) => e.projectId === projectId);
    if (mcpServer) results = results.filter((e) => e.mcpServer === mcpServer);
    if (riskLevel) results = results.filter((e) => e.riskLevel === riskLevel);
    if (result) results = results.filter((e) => e.result === result);
    if (environment) results = results.filter((e) => e.environment === environment);

    results = [...results].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    res.status(200).json({ ok: true, data: results });
  } catch (err) {
    handleError(res, err);
  }
}
