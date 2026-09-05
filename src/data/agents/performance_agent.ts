import type { AgentSeed } from './agentSeed';
import { CORE, phase } from './agentSeed';

export const performanceAgentSeed: AgentSeed = {
  id: 'performance_agent',
  name: 'Performance Agent',
  category: CORE,
  phaseIds: phase('testing_qa'),
  shortDescription: 'Runs load and performance tests and reports regressions.',
  purpose: 'Catch performance regressions before they reach production traffic.',
  responsibilities: [
    'Run load and latency benchmarks against changed services',
    'Compare results against historical performance baselines',
    'Produce a performance report with regression call-outs',
  ],
  inputs: ['Service endpoints', 'Historical performance baselines'],
  outputs: ['Performance reports'],
  requiredMcpConnectorIds: ['load_testing_mcp'],
  allowedMcpTools: ['k6.runLoadTest'],
  kgEntitiesRead: ['tests_quality', 'observability'],
  kgEntitiesWritten: ['tests_quality'],
  riskLevel: 'low',
  status: 'enabled',
  readOrWrite: 'read_only',
  approvalRequired: false,
  approvalLevel: 0,
  securityRelated: false,
  canCreatePullRequests: false,
  canModifyInfrastructure: false,
  canChangeFeatureFlags: false,
  canAffectProduction: false,
  relatedAgentIds: ['test_generation_agent'],
  capabilities: ['Load testing', 'Regression comparison'],
};
