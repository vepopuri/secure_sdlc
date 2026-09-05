import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const cveAuth20241111Entity: KgEntity = {
  id: 'cve_auth_2024_1111',
  name: 'CVE-2024-11xx: Insecure token refresh',
  domain: 'security_compliance',
  entityType: 'Vulnerability',
  summary: 'Refresh token endpoint does not invalidate prior tokens on rotation.',
  sourceSystem: 'Snyk / Semgrep MCP',
  owner: 'Security Lead',
  confidenceScore: 0.97,
  lastUpdated: daysAgo(6),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: ['snyk_finding_88213.json'],
  provenance: 'Reported by Snyk / Semgrep MCP scan.',
  relatedAgentActivity: ['security_scan_agent identified this finding 6 days ago', 'remediation_agent drafted a patch PR 5 days ago'],
};
