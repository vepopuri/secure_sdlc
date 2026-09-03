// Shared domain types for Octopus, the secure SDLC intelligence platform.
// These types describe the shape of data the mock service layer returns today
// and that a real backend API would return tomorrow. Keep this file as the
// single source of truth for cross-cutting shapes.

export type ConnectionStatus =
  | 'connected'
  | 'needs_attention'
  | 'not_configured';

export type EnabledStatus = 'enabled' | 'disabled';

export type RunStatus =
  | 'running'
  | 'completed'
  | 'failed'
  | 'awaiting_approval'
  | 'blocked';

export type AccessMode = 'read_only' | 'production_restricted';

export type PlatformStatus =
  | ConnectionStatus
  | EnabledStatus
  | RunStatus
  | AccessMode;

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type Environment = 'demo' | 'development' | 'staging' | 'production';

export type OperatingMode =
  | 'observe_only'
  | 'recommend_changes'
  | 'create_drafts'
  | 'execute_approved_changes';

/** Approval / action impact levels, from read-only to production-impacting. */
export type ActionLevel = 0 | 1 | 2 | 3;

export type RoleId =
  | 'platform_administrator'
  | 'engineering_manager'
  | 'developer'
  | 'security_lead'
  | 'architect'
  | 'compliance_officer'
  | 'read_only_user';

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  visibleTabs: string[];
  canApprove: ActionLevel[];
  canConfigureIntegrations: boolean;
  canRunAgents: boolean;
  environmentAccess: Environment[];
  auditVisibility: 'full' | 'team' | 'own';
}

export type SdlcPhaseId =
  | 'planning_requirements'
  | 'design'
  | 'development'
  | 'testing_qa'
  | 'deployment_operations'
  | 'maintenance_feedback';

export interface SdlcPhase {
  id: SdlcPhaseId;
  order: number;
  name: string;
  shortDescription: string;
  agentIds: string[];
  outputs: string[];
  healthStatus: 'on_track' | 'needs_attention' | 'blocked';
  recentActivitySummary: string;
  primaryOutputsSummary: string[];
}

export type AgentCategory = 'core' | 'cross_cutting';

export interface AgentExecutionRecord {
  id: string;
  timestamp: string;
  status: RunStatus;
  summary: string;
  durationSeconds: number;
  confidenceScore: number;
}

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  phaseIds: SdlcPhaseId[];
  shortDescription: string;
  purpose: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  requiredMcpConnectorIds: string[];
  allowedMcpTools: string[];
  kgEntitiesRead: string[];
  kgEntitiesWritten: string[];
  riskLevel: RiskLevel;
  status: EnabledStatus;
  readOrWrite: 'read_only' | 'write_enabled';
  approvalRequired: boolean;
  approvalLevel: ActionLevel;
  securityRelated: boolean;
  canCreatePullRequests: boolean;
  canModifyInfrastructure: boolean;
  canChangeFeatureFlags: boolean;
  canAffectProduction: boolean;
  lastExecution: AgentExecutionRecord | null;
  executionHistory: AgentExecutionRecord[];
  confidenceScore: number;
  relatedAgentIds: string[];
  capabilities: string[];
}

export type McpCategory =
  | 'project_planning'
  | 'code_development'
  | 'testing_quality'
  | 'deployment'
  | 'observability'
  | 'security_identity'
  | 'resilience_compliance_comms'
  | 'platform';

export interface McpConnector {
  id: string;
  name: string;
  category: McpCategory;
  isPlatformService: boolean;
  connectedSystems: string[];
  status: ConnectionStatus;
  dataTypes: string[];
  readPermissions: string[];
  writePermissions: string[];
  environmentAccess: Environment[];
  agentIdsUsing: string[];
  lastSynchronization: string | null;
  healthCheck: 'healthy' | 'degraded' | 'unavailable';
  description: string;
  capabilities?: string[];
}

export type KgDomain =
  | 'codebase'
  | 'requirements'
  | 'architecture'
  | 'tests_quality'
  | 'deployments'
  | 'security_compliance'
  | 'observability'
  | 'incidents_bugs'
  | 'team_people'
  | 'technical_debt'
  | 'identities'
  | 'tools_permissions_actions'
  | 'secrets_keys_certs'
  | 'sboms_provenance'
  | 'cloud_runtime'
  | 'data_classification'
  | 'threat_intel'
  | 'vendors_third_party'
  | 'policies_approvals_evidence';

export interface KgRelationship {
  id: string;
  type: string;
  targetEntityId: string;
  targetEntityName: string;
  targetDomain: KgDomain;
}

export interface KgEntity {
  id: string;
  name: string;
  domain: KgDomain;
  entityType: string;
  summary: string;
  sourceSystem: string;
  owner: string;
  confidenceScore: number;
  lastUpdated: string;
  projectId: string;
  relationships: KgRelationship[];
  evidenceRefs: string[];
  provenance: string;
  relatedAgentActivity: string[];
}

export type WorkflowStatus =
  | 'active'
  | 'completed'
  | 'failed'
  | 'awaiting_approval'
  | 'scheduled';

export interface WorkflowStepEvent {
  id: string;
  label: string;
  kind: 'agent_handoff' | 'mcp_call' | 'kg_read' | 'kg_write' | 'policy_decision' | 'human_approval' | 'output' | 'error';
  timestamp: string;
  agentId?: string;
  mcpConnectorId?: string;
  detail: string;
  status: RunStatus;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerSource: string;
  initiatingUser: string;
  agentIds: string[];
  currentStep: string;
  startedAt: string;
  durationSeconds: number;
  finalResult: string | null;
  correlationId: string;
  steps: WorkflowStepEvent[];
  evidenceRefs: string[];
}

export interface ApprovalItem {
  id: string;
  requestedAction: string;
  initiatingAgentId: string;
  triggerSource: string;
  projectId: string;
  environment: Environment;
  riskLevel: RiskLevel;
  actionLevel: ActionLevel;
  relatedFinding: string | null;
  proposedChange: string;
  evidenceRefs: string[];
  policyResult: 'pass' | 'flagged' | 'fail';
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  createdAt: string;
  decidedBy?: string;
  decidedAt?: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  category:
    | 'identity'
    | 'supply_chain'
    | 'secrets_crypto'
    | 'cloud_runtime'
    | 'privacy_data_governance'
    | 'threat_intel'
    | 'incident_response'
    | 'resilience'
    | 'third_party_risk';
  severity: Severity;
  status: 'open' | 'in_progress' | 'accepted_risk' | 'resolved';
  discoveredAt: string;
  ageDays: number;
  projectId: string;
  description: string;
  relatedEntityId?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  tenant: string;
  projectId: string;
  user: string;
  agentId: string | null;
  action: string;
  mcpServer: string | null;
  tool: string | null;
  environment: Environment;
  riskLevel: RiskLevel;
  policyDecision: 'allowed' | 'denied' | 'approval_required';
  result: 'success' | 'failure' | 'pending';
  correlationId: string;
  relatedWorkflowId?: string;
  relatedGraphEntityIds?: string[];
  inputClassification?: string;
  outputClassification?: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  projectIds: string[];
}

export interface Project {
  id: string;
  name: string;
  repository: string;
  teamId: string;
  environment: Environment[];
}

export interface Workspace {
  id: string;
  name: string;
  organizationName: string;
  primaryTeam: string;
  defaultEnvironment: Environment;
  notificationChannel: string;
}

export interface PlatformComponent {
  id: string;
  name: string;
  purpose: string;
  whyItMatters: string;
  inputs: string[];
  outputs: string[];
  connectedAgentIds: string[];
  connectedMcpIds: string[];
  securityResponsibility: string;
  operationalStatus: 'healthy' | 'degraded' | 'unavailable';
  layer: number;
}

export interface CrossPhaseInsight {
  id: string;
  summary: string;
  relatedEntityIds: string[];
  severity: 'info' | 'warning' | 'critical';
}
