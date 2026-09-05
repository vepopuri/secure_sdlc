import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const teamIdentityEntityEntity: KgEntity = {
  id: 'team_identity_entity',
  name: 'Identity and Access Team',
  domain: 'team_people',
  entityType: 'Team',
  summary: 'Owns authentication, session management, and access control services.',
  sourceSystem: 'Identity Provider MCP',
  owner: 'Marcus Ito (Engineering Manager)',
  confidenceScore: 0.99,
  lastUpdated: daysAgo(10),
  projectId: 'proj_customer_portal',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Synced from the identity provider group directory.',
  relatedAgentActivity: [],
};
