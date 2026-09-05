import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const deployCheckoutProdV482Entity: KgEntity = {
  id: 'deploy_checkout_prod_v482',
  name: 'checkout-service v4.8.2 (production)',
  domain: 'deployments',
  entityType: 'Deployment',
  summary: 'Current production deployment of the checkout service.',
  sourceSystem: 'GitHub Actions / CircleCI MCP',
  owner: 'Checkout Platform Team',
  confidenceScore: 0.96,
  lastUpdated: daysAgo(3),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Reported by cicd_platform_mcp from the production pipeline run.',
  relatedAgentActivity: ['release_agent prepared release notes 3 days ago'],
};
