import type { Framework, FrameworkFunction, MaturityValue, Observation } from '../types/domain';

export interface FunctionScore {
  function: FrameworkFunction;
  totalControls: number;
  ratedControls: number;
  averageRating: number | null;
}

export interface FrameworkScore {
  framework: Framework;
  totalControls: number;
  ratedControls: number;
  averageRating: number | null;
  functionScores: FunctionScore[];
}

function observationMap(observations: Observation[]): Map<string, Observation> {
  return new Map(observations.map((o) => [o.controlId, o]));
}

export function scoreFunction(fn: FrameworkFunction, observations: Observation[]): FunctionScore {
  const byControl = observationMap(observations);
  const ratings = fn.controls
    .map((c) => byControl.get(c.id)?.rating)
    .filter((r): r is MaturityValue => r !== null && r !== undefined);

  return {
    function: fn,
    totalControls: fn.controls.length,
    ratedControls: ratings.length,
    averageRating: ratings.length ? ratings.reduce((a: number, b) => a + b, 0) / ratings.length : null,
  };
}

export function scoreFramework(framework: Framework, observations: Observation[]): FrameworkScore {
  const functionScores = framework.functions.map((fn) => scoreFunction(fn, observations));
  const totalControls = functionScores.reduce((sum, f) => sum + f.totalControls, 0);
  const ratedControls = functionScores.reduce((sum, f) => sum + f.ratedControls, 0);
  const allRatings = functionScores.flatMap((f) => (f.averageRating !== null ? [f.averageRating * f.ratedControls] : []));
  const averageRating = ratedControls ? allRatings.reduce((a, b) => a + b, 0) / ratedControls : null;

  return { framework, totalControls, ratedControls, averageRating, functionScores };
}

export interface GapItem {
  functionName: string;
  controlCode: string;
  controlName: string;
  rating: MaturityValue | null;
  status: Observation['status'];
}

/** Controls that are unrated or rated at the two lowest maturity levels, worst first. */
export function findGaps(framework: Framework, observations: Observation[]): GapItem[] {
  const byControl = observationMap(observations);
  const gaps: GapItem[] = [];
  for (const fn of framework.functions) {
    for (const c of fn.controls) {
      const obs = byControl.get(c.id);
      const rating = obs?.rating ?? null;
      if (rating === null || rating <= 1) {
        gaps.push({ functionName: fn.name, controlCode: c.code, controlName: c.name, rating, status: obs?.status ?? 'not-started' });
      }
    }
  }
  return gaps.sort((a, b) => (a.rating ?? -1) - (b.rating ?? -1));
}
