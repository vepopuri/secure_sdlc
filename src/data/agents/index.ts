import type { Agent, AgentExecutionRecord } from '../../types/domain';
import { daysAgo, seededInt, seededScore } from '../mockHelpers';
import type { AgentSeed } from './agentSeed';
import { requirementsAgentSeed } from './requirements_agent';
import { estimationAgentSeed } from './estimation_agent';
import { architectureAgentSeed } from './architecture_agent';
import { dependencyAgentSeed } from './dependency_agent';
import { apiDesignAgentSeed } from './api_design_agent';
import { databaseSchemaAgentSeed } from './database_schema_agent';
import { uxWireframeAgentSeed } from './ux_wireframe_agent';
import { securityDesignAgentSeed } from './security_design_agent';
import { codeGenerationAgentSeed } from './code_generation_agent';
import { codeReviewAgentSeed } from './code_review_agent';
import { refactorAgentSeed } from './refactor_agent';
import { documentationAgentSeed } from './documentation_agent';
import { testGenerationAgentSeed } from './test_generation_agent';
import { securityScanAgentSeed } from './security_scan_agent';
import { performanceAgentSeed } from './performance_agent';
import { bugTriageAgentSeed } from './bug_triage_agent';
import { remediationAgentSeed } from './remediation_agent';
import { cicdAgentSeed } from './cicd_agent';
import { iacAgentSeed } from './iac_agent';
import { releaseAgentSeed } from './release_agent';
import { observabilityAgentSeed } from './observability_agent';
import { techDebtAgentSeed } from './tech_debt_agent';
import { complianceAgentSeed } from './compliance_agent';
import { retrospectiveAgentSeed } from './retrospective_agent';
import { agentGovernanceSafetyAgentSeed } from './agent_governance_safety_agent';
import { iamAccessSecurityAgentSeed } from './iam_access_security_agent';
import { softwareSupplyChainAgentSeed } from './software_supply_chain_agent';
import { secretsCryptographyAgentSeed } from './secrets_cryptography_agent';
import { cloudContainerRuntimeSecurityAgentSeed } from './cloud_container_runtime_security_agent';
import { privacyDataGovernanceAgentSeed } from './privacy_data_governance_agent';
import { threatIntelVulnPrioritizationAgentSeed } from './threat_intel_vuln_prioritization_agent';
import { adversarialTestingAgentSeed } from './adversarial_testing_agent';
import { detectionEngineeringAgentSeed } from './detection_engineering_agent';
import { incidentResponseForensicsAgentSeed } from './incident_response_forensics_agent';
import { resilienceRecoveryAgentSeed } from './resilience_recovery_agent';
import { thirdPartySecurityRiskAgentSeed } from './third_party_security_risk_agent';

function buildExecutionHistory(id: string, count: number, status: Agent['status']): AgentExecutionRecord[] {
  if (status === 'disabled') return [];
  const summaries = [
    'Completed run against current sprint scope.',
    'Processed incremental changes since last sync.',
    'Flagged items for human review before proceeding.',
    'Completed with no material findings.',
    'Completed and produced draft outputs for approval.',
  ];
  const history: AgentExecutionRecord[] = [];
  for (let i = 0; i < count; i++) {
    const key = `${id}-exec-${i}`;
    const failed = seededInt(key, 0, 20) === 0;
    history.push({
      id: `${id}-run-${i + 1}`,
      timestamp: daysAgo(i * 2 + 1, seededInt(key + 'h', 0, 23)),
      status: failed ? 'failed' : 'completed',
      summary: failed ? 'Run failed: upstream MCP timeout, auto-retried.' : summaries[seededInt(key + 's', 0, summaries.length - 1)],
      durationSeconds: seededInt(key + 'd', 8, 420),
      confidenceScore: seededScore(key + 'c'),
    });
  }
  return history;
}

function buildAgent(seed: AgentSeed): Agent {
  const history = buildExecutionHistory(seed.id, seed.historyLength ?? 5, seed.status);
  return {
    ...seed,
    executionHistory: history,
    lastExecution: history[0] ?? null,
    confidenceScore: seededScore(seed.id + '-confidence'),
  };
}

// One seed file per agent (this directory) keeps each agent's full definition
// independently editable; this index just wires them together in the same
// order and with the same derived-field behavior as before the split.
const seeds: AgentSeed[] = [
  requirementsAgentSeed,
  estimationAgentSeed,
  architectureAgentSeed,
  dependencyAgentSeed,
  apiDesignAgentSeed,
  databaseSchemaAgentSeed,
  uxWireframeAgentSeed,
  securityDesignAgentSeed,
  codeGenerationAgentSeed,
  codeReviewAgentSeed,
  refactorAgentSeed,
  documentationAgentSeed,
  testGenerationAgentSeed,
  securityScanAgentSeed,
  performanceAgentSeed,
  bugTriageAgentSeed,
  remediationAgentSeed,
  cicdAgentSeed,
  iacAgentSeed,
  releaseAgentSeed,
  observabilityAgentSeed,
  techDebtAgentSeed,
  complianceAgentSeed,
  retrospectiveAgentSeed,
  agentGovernanceSafetyAgentSeed,
  iamAccessSecurityAgentSeed,
  softwareSupplyChainAgentSeed,
  secretsCryptographyAgentSeed,
  cloudContainerRuntimeSecurityAgentSeed,
  privacyDataGovernanceAgentSeed,
  threatIntelVulnPrioritizationAgentSeed,
  adversarialTestingAgentSeed,
  detectionEngineeringAgentSeed,
  incidentResponseForensicsAgentSeed,
  resilienceRecoveryAgentSeed,
  thirdPartySecurityRiskAgentSeed,
];

export const agents: Agent[] = seeds.map(buildAgent);

export const CORE_AGENT_COUNT = agents.filter((a) => a.category === 'core').length;
export const CROSS_CUTTING_AGENT_COUNT = agents.filter((a) => a.category === 'cross_cutting').length;
export const TOTAL_AGENT_COUNT = agents.length;
