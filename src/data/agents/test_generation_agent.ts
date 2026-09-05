import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const testGenerationAgentSeed: AgentSeed = {
  id: 'test_generation_agent',
  name: 'Test Generation Agent',
  category: CORE,
  phaseIds: phase('testing_qa'),
  shortDescription: 'Generates unit, integration, and E2E tests with coverage reporting.',
  purpose: 'Close coverage gaps proactively rather than after a defect ships.',
  responsibilities: [
    'Generate unit, integration, and end-to-end tests for changed code paths',
    'Produce coverage reports highlighting untested branches',
    'Prioritize test generation for high-risk modules',
  ],
  inputs: ['Source code', 'Existing test suites', 'Coverage baselines'],
  outputs: ['Unit tests', 'Integration tests', 'E2E tests', 'Coverage reports'],
  requiredMcpConnectorIds: ['test_runner_mcp', 'playwright_mcp'],
  allowedMcpTools: ['testRunner.runSuite', 'playwright.generateSpec'],
  kgEntitiesRead: ['codebase', 'tests_quality'],
  kgEntitiesWritten: ['tests_quality'],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'write_enabled',
  approvalRequired: true,
  approvalLevel: 1,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['code_review_agent', 'performance_agent'],
  capabilities: ['Test synthesis', 'Coverage-gap prioritization'],
};
