import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const incidentAuthOutage0417Entity: KgEntity = {
  id: 'incident_auth_outage_0417',
  name: 'INC-0417: Elevated login failures',
  domain: 'incidents_bugs',
  entityType: 'Incident',
  summary: 'Elevated login failure rate traced to a stale session-store node during a rolling deploy.',
  sourceSystem: 'PagerDuty / Opsgenie MCP',
  owner: 'Identity and Access Team',
  confidenceScore: 0.93,
  lastUpdated: daysAgo(6),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: ['incident_0417_timeline.json'],
  provenance: 'Captured by incident_response_forensics_agent from PagerDuty and deployment logs.',
  relatedAgentActivity: ['incident_response_forensics_agent assembled this timeline 6 days ago'],
};
