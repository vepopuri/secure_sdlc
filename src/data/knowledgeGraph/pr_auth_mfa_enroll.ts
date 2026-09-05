import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const prAuthMfaEnrollEntity: KgEntity = {
  id: 'pr_auth_mfa_enroll',
  name: 'PR #1458: MFA enrollment flow',
  domain: 'codebase',
  entityType: 'Pull Request',
  summary: 'Adds the enrollment UI and backend flow for optional MFA.',
  sourceSystem: 'GitHub / GitLab MCP',
  owner: 'Code Generation Agent (drafted) / Priya Nandakumar (reviewer)',
  confidenceScore: 0.86,
  lastUpdated: daysAgo(2),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Opened by code_generation_agent, pending human review.',
  relatedAgentActivity: ['code_generation_agent opened this draft PR 2 days ago', 'code_review_agent posted 4 review comments 2 days ago'],
};
