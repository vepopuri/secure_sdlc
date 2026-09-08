// Tiny localStorage helper. Every domain store (approvals, agents, workflows,
// KG entities, settings, ...) now lives in the real Postgres database behind
// api/*.ts — see each service's own file for its fetch() calls. The only
// thing still using this helper is AppStateContext's role/environment/
// project SELECTION (which demo role/env/project you're currently viewing
// as) — a local UI preference with no server-side meaning, so it stays a
// plain browser-local value rather than a database row.
//
// Deliberately fails soft: if localStorage is unavailable (private
// browsing, storage quota, SSR) every function below just falls back to
// in-memory-only behavior instead of throwing.

const NAMESPACE = 'agentic_sdlc_demo/v1';

export function loadPersisted<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(`${NAMESPACE}/${key}`);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function savePersisted<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${NAMESPACE}/${key}`, JSON.stringify(value));
  } catch {
    // Storage unavailable or full — the demo continues in-memory only.
  }
}
