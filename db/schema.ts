// Drizzle schema for Octopus's real backend. Mirrors the mutable-domain
// shapes in src/types/domain.ts (the single source of truth for the app's
// data model) as closely as possible — this file should read as "domain.ts,
// but as Postgres tables" rather than inventing a parallel shape.
//
// Static/never-mutated catalog content (security findings, platform
// components, SDLC phases, KG domain taxonomy) intentionally has NO table
// here — it stays as plain TS data under src/data/**, since nothing in the
// app ever writes to it.
import { pgTable, text, integer, boolean, jsonb, real } from 'drizzle-orm/pg-core';
import type {
  AgentCategory, AgentExecutionRecord, SdlcPhaseId, RiskLevel, EnabledStatus,
  McpCategory, ConnectionStatus, Environment,
  KgDomain,
  WorkflowStatus,
  RoleId, ActionLevel,
} from '../src/types/domain.js';

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------
export const agents = pgTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').$type<AgentCategory>().notNull(),
  phaseIds: jsonb('phase_ids').$type<SdlcPhaseId[]>().notNull(),
  shortDescription: text('short_description').notNull(),
  purpose: text('purpose').notNull(),
  responsibilities: jsonb('responsibilities').$type<string[]>().notNull(),
  inputs: jsonb('inputs').$type<string[]>().notNull(),
  outputs: jsonb('outputs').$type<string[]>().notNull(),
  requiredMcpConnectorIds: jsonb('required_mcp_connector_ids').$type<string[]>().notNull(),
  allowedMcpTools: jsonb('allowed_mcp_tools').$type<string[]>().notNull(),
  kgEntitiesRead: jsonb('kg_entities_read').$type<string[]>().notNull(),
  kgEntitiesWritten: jsonb('kg_entities_written').$type<string[]>().notNull(),
  riskLevel: text('risk_level').$type<RiskLevel>().notNull(),
  status: text('status').$type<EnabledStatus>().notNull(),
  readOrWrite: text('read_or_write').$type<'read_only' | 'write_enabled'>().notNull(),
  approvalRequired: boolean('approval_required').notNull(),
  approvalLevel: integer('approval_level').$type<ActionLevel>().notNull(),
  securityRelated: boolean('security_related').notNull(),
  canCreatePullRequests: boolean('can_create_pull_requests').notNull(),
  canModifyInfrastructure: boolean('can_modify_infrastructure').notNull(),
  canChangeFeatureFlags: boolean('can_change_feature_flags').notNull(),
  canAffectProduction: boolean('can_affect_production').notNull(),
  lastExecution: jsonb('last_execution').$type<AgentExecutionRecord | null>(),
  executionHistory: jsonb('execution_history').$type<AgentExecutionRecord[]>().notNull(),
  confidenceScore: real('confidence_score').notNull(),
  relatedAgentIds: jsonb('related_agent_ids').$type<string[]>().notNull(),
  capabilities: jsonb('capabilities').$type<string[]>().notNull(),
});

// ---------------------------------------------------------------------------
// MCP connectors
// ---------------------------------------------------------------------------
export const mcpConnectors = pgTable('mcp_connectors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').$type<McpCategory>().notNull(),
  isPlatformService: boolean('is_platform_service').notNull(),
  connectedSystems: jsonb('connected_systems').$type<string[]>().notNull(),
  status: text('status').$type<ConnectionStatus>().notNull(),
  dataTypes: jsonb('data_types').$type<string[]>().notNull(),
  readPermissions: jsonb('read_permissions').$type<string[]>().notNull(),
  writePermissions: jsonb('write_permissions').$type<string[]>().notNull(),
  environmentAccess: jsonb('environment_access').$type<Environment[]>().notNull(),
  agentIdsUsing: jsonb('agent_ids_using').$type<string[]>().notNull(),
  lastSynchronization: text('last_synchronization'),
  healthCheck: text('health_check').$type<'healthy' | 'degraded' | 'unavailable'>().notNull(),
  description: text('description').notNull(),
  capabilities: jsonb('capabilities').$type<string[] | null>(),
});

// ---------------------------------------------------------------------------
// Knowledge Graph — entities + a real relationships edge table (see plan:
// addRelationship writes a reciprocal edge on the OTHER entity, which is a
// second plain INSERT here instead of read-modify-write on two jsonb blobs).
// ---------------------------------------------------------------------------
export const kgEntities = pgTable('kg_entities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').$type<KgDomain>().notNull(),
  entityType: text('entity_type').notNull(),
  summary: text('summary').notNull(),
  sourceSystem: text('source_system').notNull(),
  owner: text('owner').notNull(),
  confidenceScore: real('confidence_score').notNull(),
  lastUpdated: text('last_updated').notNull(),
  projectId: text('project_id').notNull(),
  evidenceRefs: jsonb('evidence_refs').$type<string[]>().notNull(),
  provenance: text('provenance').notNull(),
  relatedAgentActivity: jsonb('related_agent_activity').$type<string[]>().notNull(),
});

export const kgRelationships = pgTable('kg_relationships', {
  id: text('id').primaryKey(),
  sourceEntityId: text('source_entity_id').notNull().references(() => kgEntities.id),
  type: text('type').notNull(),
  targetEntityId: text('target_entity_id').notNull(),
  targetEntityName: text('target_entity_name').notNull(),
  targetDomain: text('target_domain').$type<KgDomain>().notNull(),
});

// ---------------------------------------------------------------------------
// Workflows — split from steps so advanceStep() is a targeted single-row
// UPDATE instead of read-modify-write on a jsonb array (see plan).
// ---------------------------------------------------------------------------
export const workflows = pgTable('workflows', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  status: text('status').$type<WorkflowStatus>().notNull(),
  triggerSource: text('trigger_source').notNull(),
  initiatingUser: text('initiating_user').notNull(),
  agentIds: jsonb('agent_ids').$type<string[]>().notNull(),
  currentStep: text('current_step').notNull(),
  startedAt: text('started_at').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  finalResult: text('final_result'),
  correlationId: text('correlation_id').notNull(),
  evidenceRefs: jsonb('evidence_refs').$type<string[]>().notNull(),
});

export const workflowSteps = pgTable('workflow_steps', {
  id: text('id').primaryKey(),
  workflowId: text('workflow_id').notNull().references(() => workflows.id),
  stepIndex: integer('step_index').notNull(),
  label: text('label').notNull(),
  kind: text('kind').$type<'agent_handoff' | 'mcp_call' | 'kg_read' | 'kg_write' | 'policy_decision' | 'human_approval' | 'output' | 'error'>().notNull(),
  timestamp: text('timestamp').notNull(),
  agentId: text('agent_id'),
  mcpConnectorId: text('mcp_connector_id'),
  detail: text('detail').notNull(),
  status: text('status').$type<'running' | 'completed' | 'failed' | 'awaiting_approval' | 'blocked'>().notNull(),
});

// ---------------------------------------------------------------------------
// Approvals
// ---------------------------------------------------------------------------
export const approvals = pgTable('approvals', {
  id: text('id').primaryKey(),
  requestedAction: text('requested_action').notNull(),
  initiatingAgentId: text('initiating_agent_id').notNull(),
  triggerSource: text('trigger_source').notNull(),
  projectId: text('project_id').notNull(),
  environment: text('environment').$type<Environment>().notNull(),
  riskLevel: text('risk_level').$type<RiskLevel>().notNull(),
  actionLevel: integer('action_level').$type<ActionLevel>().notNull(),
  relatedFinding: text('related_finding'),
  proposedChange: text('proposed_change').notNull(),
  evidenceRefs: jsonb('evidence_refs').$type<string[]>().notNull(),
  policyResult: text('policy_result').$type<'pass' | 'flagged' | 'fail'>().notNull(),
  status: text('status').$type<'pending' | 'approved' | 'rejected' | 'changes_requested'>().notNull(),
  createdAt: text('created_at').notNull(),
  decidedBy: text('decided_by'),
  decidedAt: text('decided_at'),
});

// ---------------------------------------------------------------------------
// Settings — singleton row — and roles (7 fixed rows, never created/deleted)
// ---------------------------------------------------------------------------
export const platformSettings = pgTable('platform_settings', {
  id: text('id').primaryKey().default('singleton'),
  data: jsonb('data').notNull(),
});

export const roles = pgTable('roles', {
  id: text('id').$type<RoleId>().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  visibleTabs: jsonb('visible_tabs').$type<string[]>().notNull(),
  canApprove: jsonb('can_approve').$type<ActionLevel[]>().notNull(),
  canConfigureIntegrations: boolean('can_configure_integrations').notNull(),
  canRunAgents: boolean('can_run_agents').notNull(),
  environmentAccess: jsonb('environment_access').$type<Environment[]>().notNull(),
  auditVisibility: text('audit_visibility').$type<'full' | 'team' | 'own'>().notNull(),
});

// ---------------------------------------------------------------------------
// Teams + projects. Both `teams.project_ids` and `projects.team_id` are kept
// as independently stored/editable fields (not one derived from the other):
// SettingsPage.tsx lets an admin edit a team's projectIds multi-select and a
// project's single teamId as two separate operations, and the current seed
// data already has team_platform listing projects that point elsewhere via
// their own teamId — this mirrors that existing (if redundant) behavior
// faithfully rather than "fixing" it as part of this migration.
// ---------------------------------------------------------------------------
export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  memberCount: integer('member_count').notNull(),
  projectIds: jsonb('project_ids').$type<string[]>().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  repository: text('repository').notNull(),
  teamId: text('team_id').notNull(),
  environment: jsonb('environment').$type<Environment[]>().notNull(),
});

// ---------------------------------------------------------------------------
// Audit events — append-only
// ---------------------------------------------------------------------------
export const auditEvents = pgTable('audit_events', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  tenant: text('tenant').notNull(),
  projectId: text('project_id').notNull(),
  user: text('user').notNull(),
  agentId: text('agent_id'),
  action: text('action').notNull(),
  mcpServer: text('mcp_server'),
  tool: text('tool'),
  environment: text('environment').$type<Environment>().notNull(),
  riskLevel: text('risk_level').$type<RiskLevel>().notNull(),
  policyDecision: text('policy_decision').$type<'allowed' | 'denied' | 'approval_required'>().notNull(),
  result: text('result').$type<'success' | 'failure' | 'pending'>().notNull(),
  correlationId: text('correlation_id').notNull(),
  relatedWorkflowId: text('related_workflow_id'),
  relatedGraphEntityIds: jsonb('related_graph_entity_ids').$type<string[] | null>(),
  inputClassification: text('input_classification'),
  outputClassification: text('output_classification'),
});
