import type { Evidence, EvidenceKind } from '../types/domain';
import { readJson, writeJson } from './storage';
import { putBlob, getBlob, deleteBlob } from '../lib/idb';

// Evidence ingestion service. Today this stores metadata in localStorage and
// file bytes in IndexedDB; every function is async and returns/accepts plain
// data, so it can be re-implemented against a real upload API later without
// changing any component that calls it.

const KEY = 'sdlc-assessment.evidence';

function list(): Evidence[] {
  return readJson<Evidence[]>(KEY, []);
}

function persist(items: Evidence[]): void {
  writeJson(KEY, items);
}

function newId(): string {
  return crypto.randomUUID();
}

export const evidenceService = {
  list,

  async addFile(file: File, kind: EvidenceKind, opts?: { tags?: string[]; notes?: string }): Promise<Evidence> {
    const id = newId();
    await putBlob(id, file);
    const evidence: Evidence = {
      id,
      kind,
      title: file.name,
      fileName: file.name,
      mimeType: file.type || undefined,
      sizeBytes: file.size,
      notes: opts?.notes,
      tags: opts?.tags ?? [],
      addedAt: new Date().toISOString(),
      hasBlob: true,
    };
    persist([evidence, ...list()]);
    return evidence;
  },

  addNote(title: string, body: string, tags: string[] = []): Evidence {
    const evidence: Evidence = {
      id: newId(),
      kind: 'interview-note',
      title,
      notes: body,
      tags,
      addedAt: new Date().toISOString(),
      hasBlob: false,
    };
    persist([evidence, ...list()]);
    return evidence;
  },

  update(id: string, patch: Partial<Pick<Evidence, 'title' | 'notes' | 'tags'>>): Evidence | undefined {
    const items = list();
    const idx = items.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    const updated = { ...items[idx], ...patch };
    items[idx] = updated;
    persist(items);
    return updated;
  },

  async remove(id: string): Promise<void> {
    const items = list().filter((e) => e.id !== id);
    persist(items);
    await deleteBlob(id);
  },

  async getObjectUrl(id: string): Promise<string | undefined> {
    const blob = await getBlob(id);
    if (!blob) return undefined;
    return URL.createObjectURL(blob);
  },
};
