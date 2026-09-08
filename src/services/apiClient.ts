// Shared fetch wrapper for every service now that they call the real
// api/*.ts backend instead of an in-memory mock store. Every endpoint
// responds with the same { ok, data } / { ok: false, error } envelope
// (see api/_lib/http.ts), so this is the one place that unwraps it.
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  let json: { ok: boolean; data?: T; error?: string };
  try {
    json = await res.json();
  } catch {
    throw new Error(`Request to ${path} failed with status ${res.status}.`);
  }
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? `Request to ${path} failed with status ${res.status}.`);
  }
  return json.data as T;
}

/** Same envelope, but for endpoints (like getById) where a 404 is a normal "not found", not an error. */
export async function apiFetchOptional<T>(path: string, init?: RequestInit): Promise<T | undefined> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (res.status === 404) return undefined;
  const json: { ok: boolean; data?: T; error?: string } = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? `Request to ${path} failed with status ${res.status}.`);
  }
  return json.data;
}

export function toQueryString(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
