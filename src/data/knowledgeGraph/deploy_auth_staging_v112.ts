import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const deployAuthStagingV112Entity: KgEntity = {
  id: 'deploy_auth_staging_v112',
  name: 'auth-service v1.1.2 (staging)',
  domain: 'deployments',
  entityType: 'Deployment',
  summary: 'Staging deployment carrying the token-rotation fix, awaiting production promotion.',
  sourceSystem: 'GitHub Actions / CircleCI MCP',
  owner: 'Identity and Access Team',
  confidenceScore: 0.9,
  lastUpdated: daysAgo(1),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Reported by cicd_platform_mcp from the staging pipeline run.',
  relatedAgentActivity: [],
};
