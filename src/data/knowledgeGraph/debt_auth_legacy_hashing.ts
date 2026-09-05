import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const debtAuthLegacyHashingEntity: KgEntity = {
  id: 'debt_auth_legacy_hashing',
  name: 'Legacy password hashing scheme',
  domain: 'technical_debt',
  entityType: 'Technical Debt Item',
  summary: 'Password hashing still uses a legacy scheme pending migration to Argon2id.',
  sourceSystem: 'SonarQube / CodeClimate MCP',
  owner: 'Identity and Access Team',
  confidenceScore: 0.85,
  lastUpdated: daysAgo(40),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Filed by tech_debt_agent from static analysis findings.',
  relatedAgentActivity: ['tech_debt_agent scored this item 40 days ago'],
};
