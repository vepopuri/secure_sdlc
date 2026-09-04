// Vercel serverless function backing the live Security Scan Agent action.
//
// This is the second deliberately "real" integration in an otherwise
// all-mock application (the first is api/remediate.ts): it queries the
// public OSV.dev vulnerability database for this deployment's own actual
// npm production dependencies. Unlike the Remediation Agent, this needs no
// credentials — OSV.dev's query API is public and unauthenticated.
//
// Versions checked are package.json's *declared* ranges with the leading
// range operator (^, ~, >=, ...) stripped — not necessarily
// package-lock.json's exact resolved versions. An honest simplification:
// reading and walking a lockfile reliably from a serverless function is far
// more fragile than reading the one JSON file every Node project already
// guarantees exists at its own root.
//
// Optional env var: DEMO_TRIGGER_SECRET (if set, requests must send it as
// x-demo-secret) — same gate api/remediate.ts uses, reused here rather than
// inventing a second convention.

import { readFileSync } from 'node:fs';
import path from 'node:path';

export const config = { maxDuration: 30 };

interface MinimalRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface MinimalResponse {
  status(code: number): MinimalResponse;
  json(body: unknown): void;
}

interface OsvReference {
  url: string;
}

interface OsvVuln {
  id: string;
  summary?: string;
  details?: string;
  database_specific?: { severity?: string };
  references?: OsvReference[];
}

interface OsvQueryResponse {
  vulns?: OsvVuln[];
}

export interface ScanFinding {
  id: string;
  summary: string;
  severity: string;
  package: string;
  version: string;
  references: string[];
}

function readSecretHeader(req: MinimalRequest): string | undefined {
  const value = req.headers['x-demo-secret'];
  return Array.isArray(value) ? value[0] : value;
}

/** Strips a leading semver range operator (^, ~, >=, <=, >, <, =) to get a nominal version. */
function nominalVersion(range: string): string {
  return range.replace(/^[\^~>=<]+/, '').trim();
}

async function queryOsv(name: string, version: string): Promise<OsvVuln[]> {
  const res = await fetch('https://api.osv.dev/v1/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version, package: { name, ecosystem: 'npm' } }),
  });
  if (!res.ok) {
    throw new Error(`OSV.dev query for ${name}@${version} failed with status ${res.status}`);
  }
  const data = (await res.json()) as OsvQueryResponse;
  return data.vulns ?? [];
}

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Use GET or POST.' });
    return;
  }

  const expectedSecret = process.env.DEMO_TRIGGER_SECRET;
  if (expectedSecret && readSecretHeader(req) !== expectedSecret) {
    res.status(401).json({ ok: false, error: 'Missing or invalid demo trigger secret.' });
    return;
  }

  try {
    const pkgRaw = readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgRaw) as { dependencies?: Record<string, string> };
    const dependencies = Object.entries(pkg.dependencies ?? {});

    const results = await Promise.all(
      dependencies.map(async ([name, range]) => {
        const version = nominalVersion(range);
        const vulns = await queryOsv(name, version);
        return { name, version, vulns };
      }),
    );

    const findings: ScanFinding[] = results.flatMap(({ name, version, vulns }) =>
      vulns.map((v) => ({
        id: v.id,
        summary: v.summary || v.details || 'No summary provided by OSV.dev.',
        severity: v.database_specific?.severity ?? 'UNKNOWN',
        package: name,
        version,
        references: (v.references ?? []).map((r) => r.url),
      })),
    );

    res.status(200).json({
      ok: true,
      scannedAt: new Date().toISOString(),
      packagesScanned: dependencies.length,
      findings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ ok: false, error: message });
  }
}
