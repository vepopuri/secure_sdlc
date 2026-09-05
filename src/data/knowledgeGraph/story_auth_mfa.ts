import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const storyAuthMfaEntity: KgEntity = {
  id: 'story_auth_mfa',
  name: 'Add MFA to checkout login',
  domain: 'requirements',
  entityType: 'User Story',
  summary: 'Introduce optional multi-factor authentication at checkout login.',
  sourceSystem: 'Jira / Linear MCP',
  owner: 'Priya Nandakumar',
  confidenceScore: 0.9,
  lastUpdated: daysAgo(2),
  projectId: 'proj_checkout_service',
  relationships: [
    { id: 'r1', type: 'implemented_by', targetEntityId: 'auth_module', targetEntityName: 'Authentication Module', targetDomain: 'codebase' },
  ],
  evidenceRefs: [],
  provenance: 'Synced from Jira via Jira / Linear MCP.',
  relatedAgentActivity: ['requirements_agent drafted acceptance criteria 3 days ago'],
};
