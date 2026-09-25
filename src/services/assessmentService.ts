import type { FrameworkId, MaturityValue, Observation, ObservationStatus } from '../types/domain';
import { readJson, writeJson } from './storage';

const KEY = 'sdlc-assessment.observations';

const compositeId = (frameworkId: FrameworkId, controlId: string) => `${frameworkId}:${controlId}`;

function list(): Observation[] {
  return readJson<Observation[]>(KEY, []);
}

function persist(items: Observation[]): void {
  writeJson(KEY, items);
}

export const assessmentService = {
  list,

  listByFramework(frameworkId: FrameworkId): Observation[] {
    return list().filter((o) => o.frameworkId === frameworkId);
  },

  get(frameworkId: FrameworkId, controlId: string): Observation | undefined {
    return list().find((o) => o.id === compositeId(frameworkId, controlId));
  },

  upsert(
    frameworkId: FrameworkId,
    controlId: string,
    patch: Partial<Pick<Observation, 'rating' | 'notes' | 'evidenceIds' | 'status'>>,
  ): Observation {
    const items = list();
    const id = compositeId(frameworkId, controlId);
    const idx = items.findIndex((o) => o.id === id);
    const existing: Observation = idx >= 0
      ? items[idx]
      : {
          id,
          frameworkId,
          controlId,
          status: 'not-started',
          rating: null,
          notes: '',
          evidenceIds: [],
          updatedAt: new Date().toISOString(),
        };

    const merged: Observation = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    if (!patch.status) {
      merged.status = deriveStatus(merged.rating, merged.notes, merged.evidenceIds);
    }

    if (idx >= 0) items[idx] = merged;
    else items.push(merged);
    persist(items);
    return merged;
  },
};

function deriveStatus(rating: MaturityValue | null, notes: string, evidenceIds: string[]): ObservationStatus {
  if (rating === null && !notes && evidenceIds.length === 0) return 'not-started';
  if (rating !== null) return 'complete';
  return 'in-progress';
}
