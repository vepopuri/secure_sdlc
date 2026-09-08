// One-time seed script: reads every mutable-domain array out of src/data/**
// and bulk-inserts it into the freshly migrated Postgres database. Not part
// of the app runtime, not an api/ route — run it manually with:
//
//   DATABASE_URL=... npx tsx scripts/seed.ts
//
// Idempotent: every insert uses ON CONFLICT (id) DO NOTHING, so re-running
// against a database that already has rows is a safe no-op rather than a
// duplicate-key error. Static/never-mutated catalog content (security
// findings, platform components, SDLC phases, KG domain taxonomy) is
// intentionally NOT seeded here — see db/schema.ts's header comment.
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  agents as agentsTable,
  mcpConnectors as mcpConnectorsTable,
  kgEntities as kgEntitiesTable,
  kgRelationships as kgRelationshipsTable,
  workflows as workflowsTable,
  workflowSteps as workflowStepsTable,
  approvals as approvalsTable,
  platformSettings as platformSettingsTable,
  roles as rolesTable,
  teams as teamsTable,
  projects as projectsTable,
  auditEvents as auditEventsTable,
} from '../db/schema.js';
import { agents } from '../src/data/agents/index.js';
import { mcpConnectors } from '../src/data/mcpConnectors/index.js';
import { kgEntities } from '../src/data/knowledgeGraph/index.js';
import { workflows } from '../src/data/workflows.js';
import { approvals } from '../src/data/approvals.js';
import { auditEvents } from '../src/data/audit.js';
import { teams, projects } from '../src/data/orgs.js';
import { roles } from '../src/data/roles.js';

const seedSettings = {
  workspaceName: 'Northwind Platform Engineering',
  organizationName: 'Northwind Retail Group',
  dataRetentionDays: 90,
  auditRetentionDays: 365,
  notificationChannel: '#platform-agent-activity',
  notifyOnApprovalRequest: true,
  notifyOnSecurityFinding: true,
  notifyOnWorkflowFailure: true,
  environmentRestrictions: { demo: false, development: false, staging: false, production: true },
  approvalPolicies: [
    { actionLevel: 0, label: 'Read-only', requiresApproval: false, approverRoles: [] },
    { actionLevel: 1, label: 'Reversible non-production write', requiresApproval: true, approverRoles: ['Developer', 'Engineering Manager'] },
    { actionLevel: 2, label: 'Controlled change', requiresApproval: true, approverRoles: ['Engineering Manager', 'Security Lead'] },
    { actionLevel: 3, label: 'High-impact or production action', requiresApproval: true, approverRoles: ['Security Lead', 'Platform Administrator'] },
  ],
  modelConfig: { provider: 'Anthropic Claude', reasoningEffort: 'medium', maxAutonomousSteps: 12 },
  featureFlags: { knowledgeGraphExpandedView: false, adversarialTestingAgent: false, costEstimatesOnIac: true },
  tenantIsolation: { enforced: true, lastVerified: '2026-08-26T09:00:00Z' },
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. See .env.example.');
    process.exit(1);
  }
  const sql = neon(url);
  const db = drizzle(sql);

  console.log(`Seeding ${agents.length} agents...`);
  if (agents.length > 0) {
    await db.insert(agentsTable).values(agents).onConflictDoNothing();
  }

  console.log(`Seeding ${mcpConnectors.length} MCP connectors...`);
  if (mcpConnectors.length > 0) {
    await db.insert(mcpConnectorsTable).values(mcpConnectors).onConflictDoNothing();
  }

  console.log(`Seeding ${kgEntities.length} KG entities + their relationships...`);
  if (kgEntities.length > 0) {
    await db.insert(kgEntitiesTable).values(
      kgEntities.map(({ relationships: _relationships, ...entity }) => entity),
    ).onConflictDoNothing();
    const allRelationships = kgEntities.flatMap((e) =>
      e.relationships.map((r) => ({ ...r, sourceEntityId: e.id })),
    );
    if (allRelationships.length > 0) {
      await db.insert(kgRelationshipsTable).values(allRelationships).onConflictDoNothing();
    }
  }

  console.log(`Seeding ${workflows.length} workflows + their steps...`);
  if (workflows.length > 0) {
    await db.insert(workflowsTable).values(
      workflows.map(({ steps: _steps, ...wf }) => wf),
    ).onConflictDoNothing();
    const allSteps = workflows.flatMap((w) =>
      w.steps.map((s, i) => ({ ...s, workflowId: w.id, stepIndex: i })),
    );
    if (allSteps.length > 0) {
      await db.insert(workflowStepsTable).values(allSteps).onConflictDoNothing();
    }
  }

  console.log(`Seeding ${approvals.length} approvals...`);
  if (approvals.length > 0) {
    await db.insert(approvalsTable).values(approvals).onConflictDoNothing();
  }

  console.log('Seeding platform settings singleton...');
  await db.insert(platformSettingsTable).values({ id: 'singleton', data: seedSettings }).onConflictDoNothing();

  console.log(`Seeding ${roles.length} roles...`);
  if (roles.length > 0) {
    await db.insert(rolesTable).values(roles).onConflictDoNothing();
  }

  console.log(`Seeding ${teams.length} teams and ${projects.length} projects...`);
  if (teams.length > 0) await db.insert(teamsTable).values(teams).onConflictDoNothing();
  if (projects.length > 0) await db.insert(projectsTable).values(projects).onConflictDoNothing();

  console.log(`Seeding ${auditEvents.length} audit events...`);
  if (auditEvents.length > 0) {
    await db.insert(auditEventsTable).values(auditEvents).onConflictDoNothing();
  }

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
