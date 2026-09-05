import type { KgEntity } from '../../types/domain';
import { daysAgo } from '../mockHelpers';

export const debtAuthTestGapsEntity: KgEntity = {
  id: 'debt_auth_test_gaps',
  name: 'Incomplete negative-path test coverage',
  domain: 'technical_debt',
  entityType: 'Technical Debt Item',
  summary: 'Negative-path and abuse-case tests are missing for the login and token endpoints.',
  sourceSystem: 'Jest / Pytest Test MCP',
  owner: 'Identity and Access Team',
  confidenceScore: 0.75,
  lastUpdated: daysAgo(20),
  projectId: 'proj_checkout_service',
  relationships: [],
  evidenceRefs: [],
  provenance: 'Filed by tech_debt_agent from coverage report gaps.',
  relatedAgentActivity: [],
};
