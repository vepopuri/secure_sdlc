import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const storyAuthSsoEntity: KgEntity = {
  id: 'story_auth_sso',
  name: 'Support SSO for enterprise customers',
  domain: 'requirements',
  entityType: 'User Story',
  summary: 'Allow enterprise customers to authenticate via SAML SSO.',
  sourceSystem: 'Jira / Linear MCP',
  owner: 'Priya Nandakumar',
  confidenceScore: 0.88,
  lastUpdated: daysAgo(4),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Synced from Jira via Jira / Linear MCP.',
  relatedAgentActivity: [],
};
