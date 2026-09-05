import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const prAuthTokenRotationEntity: KgEntity = {
  id: 'pr_auth_token_rotation',
  name: 'PR #1442: Rotate refresh tokens on reuse',
  domain: 'codebase',
  entityType: 'Pull Request',
  summary: 'Implements refresh-token rotation and reuse detection per ADR-014.',
  sourceSystem: 'GitHub / GitLab MCP',
  owner: 'Remediation Agent (drafted) / Dana Whitfield (reviewer)',
  confidenceScore: 0.91,
  lastUpdated: daysAgo(5),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Opened by remediation_agent, pending human review.',
  relatedAgentActivity: ['remediation_agent opened this draft PR 5 days ago'],
};
