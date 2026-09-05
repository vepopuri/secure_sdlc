import type { Agent, AgentCategory, SdlcPhaseId } from '../../types/domain';

/** What each per-agent file provides — everything except the fields index.ts computes (execution history, confidence). */
export type AgentSeed = Omit<Agent, 'lastExecution' | 'executionHistory' | 'confidenceScore'> & {
  historyLength?: number;
};

export const CORE: AgentCategory = 'core';
export const CROSS: AgentCategory = 'cross_cutting';

export function phase(id: SdlcPhaseId): SdlcPhaseId[] {
  return [id];
}
