// Shared request/response shapes and helpers for the DB-backed api/*.ts
// endpoints. Mirrors the MinimalRequest/MinimalResponse pattern each of
// api/remediate.ts and api/scan-dependencies.ts already hand-rolled
// independently — factored out here since this migration adds many more
// endpoint files that would otherwise each redeclare the same few lines.
export interface MinimalRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface MinimalResponse {
  status(code: number): MinimalResponse;
  json(body: unknown): void;
}

export function parseBody(body: unknown): Record<string, unknown> {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
}

/** Reads a single-value query/route param, taking the first entry if Vercel parsed it as an array. */
export function queryParam(req: MinimalRequest, key: string): string | undefined {
  const value = req.query?.[key];
  return Array.isArray(value) ? value[0] : value;
}

/** Sends a 405 for any method not in `allowed` and returns whether the request should stop here. */
export function rejectMethod(req: MinimalRequest, res: MinimalResponse, allowed: string[]): boolean {
  if (!req.method || !allowed.includes(req.method)) {
    res.status(405).json({ ok: false, error: `Use ${allowed.join(' or ')}.` });
    return true;
  }
  return false;
}

export function handleError(res: MinimalResponse, err: unknown): void {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ ok: false, error: message });
}
