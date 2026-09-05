import type { McpCategory, McpConnector } from '../../types/domain';
import { agents } from '../agents';
import { minutesAgo, seededInt } from '../mockHelpers';
import type { ConnectorSeed } from './connectorSeed';
import { jiraLinearMcpSeed } from './jira_linear_mcp';
import { confluenceNotionMcpSeed } from './confluence_notion_mcp';
import { figmaMcpSeed } from './figma_mcp';
import { githubGitlabMcpSeed } from './github_gitlab_mcp';
import { sonarqubeCodeclimateMcpSeed } from './sonarqube_codeclimate_mcp';
import { ideLspBridgeMcpSeed } from './ide_lsp_bridge_mcp';
import { packageRegistryMcpSeed } from './package_registry_mcp';
import { artifactRegistryMcpSeed } from './artifact_registry_mcp';
import { testRunnerMcpSeed } from './test_runner_mcp';
import { playwrightMcpSeed } from './playwright_mcp';
import { snykSemgrepMcpSeed } from './snyk_semgrep_mcp';
import { loadTestingMcpSeed } from './load_testing_mcp';
import { fuzzingApiSecurityMcpSeed } from './fuzzing_api_security_mcp';
import { cicdPlatformMcpSeed } from './cicd_platform_mcp';
import { iacMcpSeed } from './iac_mcp';
import { cloudProviderMcpSeed } from './cloud_provider_mcp';
import { kubernetesContainerMcpSeed } from './kubernetes_container_mcp';
import { featureFlagMcpSeed } from './feature_flag_mcp';
import { cloudSecurityPostureMcpSeed } from './cloud_security_posture_mcp';
import { observabilityPlatformMcpSeed } from './observability_platform_mcp';
import { pagerdutyOpsgenieMcpSeed } from './pagerduty_opsgenie_mcp';
import { opentelemetryMcpSeed } from './opentelemetry_mcp';
import { siemDetectionMcpSeed } from './siem_detection_mcp';
import { runtimeSecurityMcpSeed } from './runtime_security_mcp';
import { identityProviderMcpSeed } from './identity_provider_mcp';
import { cloudIamSessionBrokerMcpSeed } from './cloud_iam_session_broker_mcp';
import { secretsKeysCertsMcpSeed } from './secrets_keys_certs_mcp';
import { policyEngineMcpSeed } from './policy_engine_mcp';
import { threatIntelligenceMcpSeed } from './threat_intelligence_mcp';
import { dataCatalogDlpMcpSeed } from './data_catalog_dlp_mcp';
import { incidentCaseForensicsMcpSeed } from './incident_case_forensics_mcp';
import { backupDrChaosMcpSeed } from './backup_dr_chaos_mcp';
import { thirdPartyRiskGrcMcpSeed } from './third_party_risk_grc_mcp';
import { slackTeamsMcpSeed } from './slack_teams_mcp';
import { emailCalendarMcpSeed } from './email_calendar_mcp';
import { mcpGatewayRegistrySeed } from './mcp_gateway_registry';
import { knowledgeGraphMcpServerSeed } from './knowledge_graph_mcp_server';

function usingAgents(connectorId: string): string[] {
  return agents.filter((a) => a.requiredMcpConnectorIds.includes(connectorId)).map((a) => a.id);
}

function build(seed: ConnectorSeed): McpConnector {
  const agentIds = usingAgents(seed.id);
  const isDegraded = seed.status === 'needs_attention';
  const isDown = seed.status === 'not_configured';
  return {
    ...seed,
    agentIdsUsing: agentIds,
    lastSynchronization: isDown ? null : minutesAgo(seededInt(seed.id + '-sync', 5, 720)),
    healthCheck: isDown ? 'unavailable' : isDegraded ? 'degraded' : 'healthy',
  };
}

// One seed file per connector (this directory) keeps each connector's full
// definition independently editable; this index just wires them together in
// the same order and with the same derived-field behavior as before the split.
const seeds: ConnectorSeed[] = [
  jiraLinearMcpSeed,
  confluenceNotionMcpSeed,
  figmaMcpSeed,
  githubGitlabMcpSeed,
  sonarqubeCodeclimateMcpSeed,
  ideLspBridgeMcpSeed,
  packageRegistryMcpSeed,
  artifactRegistryMcpSeed,
  testRunnerMcpSeed,
  playwrightMcpSeed,
  snykSemgrepMcpSeed,
  loadTestingMcpSeed,
  fuzzingApiSecurityMcpSeed,
  cicdPlatformMcpSeed,
  iacMcpSeed,
  cloudProviderMcpSeed,
  kubernetesContainerMcpSeed,
  featureFlagMcpSeed,
  cloudSecurityPostureMcpSeed,
  observabilityPlatformMcpSeed,
  pagerdutyOpsgenieMcpSeed,
  opentelemetryMcpSeed,
  siemDetectionMcpSeed,
  runtimeSecurityMcpSeed,
  identityProviderMcpSeed,
  cloudIamSessionBrokerMcpSeed,
  secretsKeysCertsMcpSeed,
  policyEngineMcpSeed,
  threatIntelligenceMcpSeed,
  dataCatalogDlpMcpSeed,
  incidentCaseForensicsMcpSeed,
  backupDrChaosMcpSeed,
  thirdPartyRiskGrcMcpSeed,
  slackTeamsMcpSeed,
  emailCalendarMcpSeed,
  mcpGatewayRegistrySeed,
  knowledgeGraphMcpServerSeed,
];

export const mcpConnectors: McpConnector[] = seeds.map(build);

export const sourceConnectors = mcpConnectors.filter((c) => !c.isPlatformService);
export const platformMcpServices = mcpConnectors.filter((c) => c.isPlatformService);

export const MCP_CATEGORY_LABELS: Record<McpCategory, string> = {
  project_planning: 'Project and planning',
  code_development: 'Code and development',
  testing_quality: 'Testing and quality',
  deployment: 'Deployment',
  observability: 'Observability',
  security_identity: 'Security and identity',
  resilience_compliance_comms: 'Resilience, compliance, and communication',
  platform: 'Platform MCP services',
};
