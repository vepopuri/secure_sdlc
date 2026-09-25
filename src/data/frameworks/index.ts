import type { Framework } from '../../types/domain';
import { sammFramework } from './samm';
import { nistCsfFramework } from './nistCsf';
import { ssdfFramework } from './ssdf';

// The framework registry. Adding a new framework later is just adding a
// module like the ones above and listing it here — every page in the app
// (assessment workspace, dashboard, reports) reads from this list rather
// than hardcoding framework-specific logic.
export const FRAMEWORKS: Framework[] = [sammFramework, nistCsfFramework, ssdfFramework];

export function getFramework(id: string): Framework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}

export function getAllControls(framework: Framework): { functionCode: string; functionName: string; control: Framework['functions'][number]['controls'][number] }[] {
  return framework.functions.flatMap((f) =>
    f.controls.map((c) => ({ functionCode: f.code, functionName: f.name, control: c })),
  );
}
