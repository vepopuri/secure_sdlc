import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const cveAuth20242222Entity: KgEntity = {
  id: 'cve_auth_2024_2222',
  name: 'CVE-2024-22xx: Weak session fixation protection',
  domain: 'security_compliance',
  entityType: 'Vulnerability',
  summary: 'Session identifier is not regenerated after privilege escalation.',
  sourceSystem: 'Snyk / Semgrep MCP',
  owner: 'Security Lead',
  confidenceScore: 0.9,
  lastUpdated: daysAgo(12),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: ['snyk_finding_88097.json'],
  provenance: 'Reported by Snyk / Semgrep MCP scan.',
  relatedAgentActivity: ['security_scan_agent identified this finding 12 days ago'],
};
