// Small deterministic helpers shared across mock data files so that
// demo numbers (dates, scores, durations) stay stable across renders
// instead of reshuffling on every reload.

/** Simple deterministic string hash -> 32-bit int. */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Deterministic pseudo-random float in [0, 1) seeded by a string key. */
export function seededRandom(key: string): number {
  const h = hashString(key);
  return (h % 10000) / 10000;
}

/** Deterministic ISO timestamp offset backward from a fixed demo "now". */
export const DEMO_NOW = new Date('2026-08-27T15:00:00Z');

export function daysAgo(days: number, hourOffset = 0): string {
  const ms = DEMO_NOW.getTime() - days * 86400000 - hourOffset * 3600000;
  return new Date(ms).toISOString();
}

export function minutesAgo(minutes: number): string {
  const d = new Date(DEMO_NOW);
  d.setUTCMinutes(d.getUTCMinutes() - minutes);
  return d.toISOString();
}

export function seededInt(key: string, min: number, max: number): number {
  const r = seededRandom(key);
  return Math.floor(min + r * (max - min + 1));
}

export function seededScore(key: string, min = 0.72, max = 0.98): number {
  const r = seededRandom(key);
  return Math.round((min + r * (max - min)) * 100) / 100;
}
