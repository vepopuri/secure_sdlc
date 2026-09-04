// Real, non-mock integration: calls the api/scan-dependencies serverless
// function, which queries the public OSV.dev vulnerability database for
// this deployment's own actual npm dependencies. Unlike everything in
// services/*Service.ts, this performs a genuine external read against a
// real third-party API and is wired to exactly one agent (Security Scan
// Agent) in the UI — the second live integration in this app, after the
// Remediation Agent's real GitHub write path.

export interface LiveScanFinding {
  id: string;
  summary: string;
  severity: string;
  package: string;
  version: string;
  references: string[];
}

export interface LiveScanResult {
  ok: boolean;
  scannedAt?: string;
  packagesScanned?: number;
  findings?: LiveScanFinding[];
  error?: string;
}

export async function runLiveDependencyScan(): Promise<LiveScanResult> {
  try {
    const clientSecret = import.meta.env.VITE_DEMO_TRIGGER_SECRET as string | undefined;
    const res = await fetch('/api/scan-dependencies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientSecret ? { 'x-demo-secret': clientSecret } : {}),
      },
    });
    const data: LiveScanResult = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error ?? `Request failed with status ${res.status}` };
    }
    return data;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error contacting the live integration.' };
  }
}
