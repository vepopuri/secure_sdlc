import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const debtAuthRateLimitEntity: KgEntity = {
  id: 'debt_auth_rate_limit',
  name: 'Missing per-account rate limiting',
  domain: 'technical_debt',
  entityType: 'Technical Debt Item',
  summary: 'Login endpoint lacks per-account rate limiting, increasing brute-force exposure.',
  sourceSystem: 'SonarQube / CodeClimate MCP',
  owner: 'Identity and Access Team',
  confidenceScore: 0.78,
  lastUpdated: daysAgo(18),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Filed by tech_debt_agent, linked to INC-0417.',
  relatedAgentActivity: ['tech_debt_agent linked this item to INC-0417 6 days ago'],
};
