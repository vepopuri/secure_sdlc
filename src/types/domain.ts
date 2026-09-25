// Core domain model for the Secure SDLC controls assessment tool.
// This is intentionally backend-agnostic: every service that reads or writes
// these types today does so against localStorage/IndexedDB, and can be
// swapped for real HTTP calls later without touching the UI layer.

export type FrameworkId = 'owasp-samm' | 'nist-csf' | 'nist-ssdf' | (string & {});

export interface Control {
  id: string;
  /** Short framework-native code, e.g. "SM-A", "GV.OC", "PO.1" */
  code: string;
  name: string;
  description: string;
  /** Free-form implementation guidance / example activities shown to the assessor. */
  guidance?: string;
}

export interface FrameworkFunction {
  id: string;
  /** Short code, e.g. "GV", "Governance", "PW" */
  code: string;
  name: string;
  description: string;
  controls: Control[];
}

export interface Framework {
  id: FrameworkId;
  name: string;
  shortName: string;
  version: string;
  description: string;
  /** URL or citation shown to the user; informational only. */
  reference?: string;
  functions: FrameworkFunction[];
}

/** Normalized 0-3 maturity scale applied consistently across every framework
 * so cross-framework reporting stays comparable, even though each
 * framework's own catalog structure is preserved faithfully. */
export const MATURITY_LEVELS = [
  { value: 0, label: 'Not Implemented' },
  { value: 1, label: 'Partially Implemented' },
  { value: 2, label: 'Largely Implemented' },
  { value: 3, label: 'Fully Implemented' },
] as const;

export type MaturityValue = (typeof MATURITY_LEVELS)[number]['value'];

export type ObservationStatus = 'not-started' | 'in-progress' | 'complete';

export interface Observation {
  /** Composite key: `${frameworkId}:${controlId}` */
  id: string;
  frameworkId: FrameworkId;
  controlId: string;
  status: ObservationStatus;
  rating: MaturityValue | null;
  notes: string;
  evidenceIds: string[];
  updatedAt: string;
}

export type EvidenceKind = 'document' | 'interview-note' | 'image' | 'other';

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  title: string;
  /** Original file name, when ingested from a file. Absent for typed interview notes. */
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  /** Free-text body for interview notes, or a description for any evidence item. */
  notes?: string;
  tags: string[];
  addedAt: string;
  /** True when the underlying file bytes are stored in IndexedDB under this id. */
  hasBlob: boolean;
}
