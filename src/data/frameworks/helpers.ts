import type { Control, FrameworkFunction } from '../../types/domain';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function control(code: string, name: string, description: string, guidance?: string): Control {
  return { id: slug(code), code, name, description, guidance };
}

export function fn(
  code: string,
  name: string,
  description: string,
  controls: Control[],
): FrameworkFunction {
  return { id: slug(code), code, name, description, controls };
}
