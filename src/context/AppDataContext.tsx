import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Evidence, EvidenceKind, FrameworkId, Observation } from '../types/domain';
import { evidenceService } from '../services/evidenceService';
import { assessmentService } from '../services/assessmentService';

interface AppDataContextValue {
  evidence: Evidence[];
  observations: Observation[];
  addEvidenceFile: (file: File, kind: EvidenceKind, opts?: { tags?: string[]; notes?: string }) => Promise<Evidence>;
  addEvidenceNote: (title: string, body: string, tags?: string[]) => Evidence;
  removeEvidence: (id: string) => Promise<void>;
  setObservation: (
    frameworkId: FrameworkId,
    controlId: string,
    patch: Partial<Pick<Observation, 'rating' | 'notes' | 'evidenceIds'>>,
  ) => Observation;
  getObservation: (frameworkId: FrameworkId, controlId: string) => Observation | undefined;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [evidence, setEvidence] = useState<Evidence[]>(() => evidenceService.list());
  const [observations, setObservations] = useState<Observation[]>(() => assessmentService.list());

  const addEvidenceFile = useCallback(
    async (file: File, kind: EvidenceKind, opts?: { tags?: string[]; notes?: string }) => {
      const created = await evidenceService.addFile(file, kind, opts);
      setEvidence(evidenceService.list());
      return created;
    },
    [],
  );

  const addEvidenceNote = useCallback((title: string, body: string, tags: string[] = []) => {
    const created = evidenceService.addNote(title, body, tags);
    setEvidence(evidenceService.list());
    return created;
  }, []);

  const removeEvidence = useCallback(async (id: string) => {
    await evidenceService.remove(id);
    setEvidence(evidenceService.list());
  }, []);

  const setObservation = useCallback(
    (
      frameworkId: FrameworkId,
      controlId: string,
      patch: Partial<Pick<Observation, 'rating' | 'notes' | 'evidenceIds'>>,
    ) => {
      const updated = assessmentService.upsert(frameworkId, controlId, patch);
      setObservations(assessmentService.list());
      return updated;
    },
    [],
  );

  const getObservation = useCallback(
    (frameworkId: FrameworkId, controlId: string) => assessmentService.get(frameworkId, controlId),
    [],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({ evidence, observations, addEvidenceFile, addEvidenceNote, removeEvidence, setObservation, getObservation }),
    [evidence, observations, addEvidenceFile, addEvidenceNote, removeEvidence, setObservation, getObservation],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
