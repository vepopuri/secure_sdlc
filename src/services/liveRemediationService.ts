// Real, non-mock integration: calls the api/remediate serverless function,
// which opens (or reuses) an actual draft pull request on GitHub. Unlike
// everything in services/*Service.ts, this performs a genuine external
// write and is wired to exactly one agent (Remediation Agent) in the UI.

export const LIVE_REMEDIATION_FINDING_ID = 'cve_auth_2024_1111';

export interface LiveRemediationResult {
  ok: boolean;
  reused?: boolean;
  prUrl?: string;
  prNumber?: number;
  branch?: string;
  error?: string;
}

export async function createLiveRemediationPR(): Promise<LiveRemediationResult> {
  try {
    const clientSecret = import.meta.env.VITE_DEMO_TRIGGER_SECRET as string | undefined;
    const res = await fetch('/api/remediate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientSecret ? { 'x-demo-secret': clientSecret } : {}),
      },
      body: JSON.stringify({ findingId: LIVE_REMEDIATION_FINDING_ID }),
    });
    const data: LiveRemediationResult = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error ?? `Request failed with status ${res.status}` };
    }
    return data;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error contacting the live integration.' };
  }
}
