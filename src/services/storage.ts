// Thin localStorage JSON helpers. Every read/write in the app goes through
// here, so swapping to a real backend later means changing these two
// functions (or the call sites in services/*) rather than scattering
// localStorage calls throughout the UI.

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private browsing) — fail silently, the
    // in-memory state the caller already updated remains usable this session.
  }
}
