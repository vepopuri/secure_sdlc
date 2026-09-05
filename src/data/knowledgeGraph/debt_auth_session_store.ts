import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const debtAuthSessionStoreEntity: KgEntity = {
  id: 'debt_auth_session_store',
  name: 'Session store not horizontally scalable',
  domain: 'technical_debt',
  entityType: 'Technical Debt Item',
  summary: 'In-memory session store limits horizontal scaling of the auth service.',
  sourceSystem: 'SonarQube / CodeClimate MCP',
  owner: 'Identity and Access Team',
  confidenceScore: 0.8,
  lastUpdated: daysAgo(55),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Filed by tech_debt_agent from architecture review.',
  relatedAgentActivity: [],
};
