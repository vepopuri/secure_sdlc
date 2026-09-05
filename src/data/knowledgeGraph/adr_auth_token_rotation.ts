import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const adrAuthTokenRotationEntity: KgEntity = {
  id: 'adr_auth_token_rotation',
  name: 'ADR-014: JWT rotation strategy',
  domain: 'architecture',
  entityType: 'Architecture Decision Record',
  summary: 'Decision to rotate refresh tokens on every use and detect reuse as a compromise signal.',
  sourceSystem: 'Confluence / Notion MCP',
  owner: 'Architecture Agent (drafted) / Marcus Ito (approved)',
  confidenceScore: 0.92,
  lastUpdated: daysAgo(30),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: ['adr-014.md'],
  provenance: 'Drafted by architecture_agent, approved by human review.',
  relatedAgentActivity: ['architecture_agent drafted this ADR 30 days ago'],
};
