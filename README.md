# Agentic SDLC Platform — Web Application

An AI-powered software delivery control plane that connects planning, design, development, testing, security,
deployment, operations, compliance, and feedback. This repository contains the **frontend application shell** for
the platform: a React + TypeScript + Material UI app with a full, typed mock data layer and a mock service layer
designed so a real backend can be dropped in later without a UI redesign.

This is a **demo build**. All data — agents, MCP connectors, workflows, approvals, security findings, audit
events — is realistic mock data, clearly labeled throughout the UI with a "Demo data" chip. The one exception is the
Remediation Agent's live GitHub integration — see [Live integration: Remediation Agent](#live-integration-remediation-agent) below.

## Platform model

- **6 SDLC phases**: Planning and Requirements, Design, Development, Testing and QA, Deployment and Operations,
  Maintenance and Feedback.
- **36 total agents**: 24 core SDLC agents (owned by one phase) + 12 cross-cutting security, governance, and
  resilience agents (operate across phases). This supersedes an earlier 21-agent model — the Overview tab calls
  this out explicitly.
- **35 source MCP connectors**, grouped into 7 categories (project/planning, code/development, testing/quality,
  deployment, observability, security/identity, resilience/compliance/communication).
- **2 platform MCP services**: the **MCP Gateway and Registry** (all source-system and tool access) and the
  **Knowledge Graph MCP Server** (all graph reads/writes). Agents never connect directly to source systems or
  write directly to the graph database — every path runs through one of these two services.
- **1 Knowledge Graph** spanning 19 entity domains.

## Running the app

```bash
npm install
npm run dev       # start the Vite dev server (http://localhost:5173)
npm run build     # type-check (tsc -b) and produce a production build in dist/
npm run preview   # serve the production build locally
```

No environment variables or backend are required — everything runs against the in-memory mock service layer.

## Project structure

```
src/
  types/domain.ts        Shared TypeScript types — the contract every mock (and future real) API honors
  data/                   Static, typed seed data (agents, phases, MCP connectors, KG entities, workflows, …)
  services/               Mock service layer — async functions that stand in for a real backend API
  context/                React context for the demo role switcher, environment, workspace, and project selection
  theme/                  MUI theme (Deloitte-inspired palette) and design tokens
  components/
    shell/                Header, side navigation, responsive app shell
    common/                Status badges, page headers, empty states, the octopus brand mark
    agents/ phases/ mcp/ kg/ workflows/   Feature-specific reusable cards and drawers
  pages/                  One file per left-nav tab (Overview, Agents, Knowledge Graph, Settings, …)
```

## Where mock data is defined

All seed data lives in `src/data/`, fully typed against `src/types/domain.ts`:

| File | Contents |
|---|---|
| `phases.ts` | The 6 SDLC phases |
| `agents.ts` | All 36 agents (core + cross-cutting), built via a small `buildAgent()` helper that fills in deterministic execution history |
| `mcpConnectors.ts` | The 35 source connectors + 2 platform services |
| `knowledgeGraph.ts` | The 19 entity domains and a connected set of KG entities (see the "Authentication Module" example) |
| `workflows.ts` | 8 sample end-to-end workflows with step-by-step timelines |
| `approvals.ts` | Sample approval queue items across all 4 action levels |
| `security.ts` | Sample security findings across all cross-cutting security domains |
| `audit.ts` | Sample audit log events |
| `orgs.ts` | One tenant, 3 teams, 2 projects, 1 workspace |
| `roles.ts` | The 7 demo roles and what each can see/do |
| `platformComponents.ts` | The 13 platform components and the 7-layer architecture view |

Timestamps and scores are generated deterministically (`mockHelpers.ts`) from a fixed "demo now" so the app looks
the same on every reload instead of reshuffling.

## How to replace mock services with real APIs

Every page talks to data exclusively through `src/services/*Service.ts` (`agentService`, `mcpService`,
`knowledgeGraphService`, `workflowService`, `approvalService`, `auditService`, `settingsService`), re-exported from
`src/services/index.ts`. Each function already returns a `Promise` of a typed domain object, matching what a real
`fetch()`-backed implementation would return. To connect a real backend:

1. Keep the exported function names and signatures in each `*Service.ts` file unchanged.
2. Replace the body (which currently reads/mutates an in-memory array copied from `src/data/`) with an HTTP call.
3. No page or component needs to change — they only import from `src/services`, never from `src/data` for anything
   that should eventually be live (a few read-only reference lookups, like looking up a phase name by id, still
   import directly from `src/data` since that's static reference/display data, not stateful).

## How new agents are added

Add one object to the `agents` array in `src/data/agents.ts` via `buildAgent({...})`, filling in every field on the
`Agent` type (purpose, responsibilities, inputs/outputs, required MCP connectors, KG entities read/written, risk
level, approval level, production-impact flags, etc.). The Agents catalog, SDLC Phases tab, and Get Started wizard
all read from this single array — no other file needs to change. If the agent is cross-cutting rather than
phase-owned, set `category: 'cross_cutting'` and list every phase it touches in `phaseIds`.

## How new MCP connectors are added

Add one object to the relevant category array in `src/data/mcpConnectors.ts` (e.g. `codeDevelopment`,
`securityIdentity`). `agentIdsUsing` is derived automatically from which agents list the connector in their
`requiredMcpConnectorIds` — you don't set it by hand. Platform services (as opposed to source connectors) go in the
`platformServices` array and get `isPlatformService: true` plus a `capabilities` list.

## How Knowledge Graph entities are represented

Each `KgEntity` (`src/data/knowledgeGraph.ts`) belongs to exactly one of the 19 `KgDomain`s and carries its own
`relationships: KgRelationship[]` — a typed edge list pointing at other entities by id, each tagged with a
relationship type and the target's domain. The Knowledge Graph tab renders a simple list view of an entity's
relationships by default, and an optional lightweight SVG graph view (`EntityGraphView`) only when the user asks for
it — the app deliberately avoids an all-to-all diagram by default. Provenance, evidence references, confidence
score, and related agent activity are first-class fields on every entity, matching what the details drawer shows.

## How permissions and approval levels work

Every controlled or write-capable agent action carries an `ActionLevel` (0–3):

- **Level 0 — Read-only**: no approval required.
- **Level 1 — Reversible non-production write**: draft ticket, PR comment, branch, draft document.
- **Level 2 — Controlled change**: open a pull request, modify non-production resources, update tests, change a
  feature flag.
- **Level 3 — High-impact / production action**: deploy to production, modify production infrastructure, rotate
  secrets, disable a security control. **Always** requires explicit human approval — this is enforced in the UI
  (the Approvals page will not let a Level 3 item auto-resolve) and called out on every agent that `canAffectProduction`.

`Role` (`src/data/roles.ts`) determines which action levels a demo user can decide on (`canApprove`), which of the
12 left-nav tabs are visible (`visibleTabs`), whether they can configure integrations or run agents, and which
environments they can act in. The header's profile menu includes a role switcher so you can see the same data
under different role lenses without a real login system.

## Live integration: Remediation Agent

Everywhere else in this app, "Run agent" is simulated. The **Remediation Agent** is the one deliberate exception: its
details drawer has a separate, clearly-labeled **"Open real remediation PR (live)"** button that calls a real
Vercel serverless function (`api/remediate.ts`), which calls the real GitHub REST API to open — or reuse, if one is
already open — an actual draft pull request on `vepopuri/secure_sdlc`. This proves the write-integration pattern the
rest of the platform describes (agent → governed action → real system) end to end for one concrete case.

The PR's content has two tiers, controlled by whether `ANTHROPIC_API_KEY` is set:

- **Without it (default):** a static template remediation note under `remediation/<finding-id>.md` — proves the
  branch/file/PR plumbing without claiming to be a real fix.
- **With it:** `api/_lib/anthropic.ts` calls **Claude Opus 5** with a DevSecOps remediation system prompt (root
  cause → patch → verification strategy) against the finding's CVE details and a small representative code snippet
  (`api/_lib/findings.ts` — this repo has no real vulnerable backend code, so the snippet is a clearly-labeled
  sample, not code pulled live from the repository). The model's actual output becomes the PR content. Either way,
  the PR is explicitly marked as unreviewed and routed through the platform's Level 2 approval policy before merge.

**Setup** (see `.env.example`): create a fine-grained GitHub Personal Access Token scoped to just this repository
with `Contents: Read and write` and `Pull requests: Read and write` permissions, then add it as `GITHUB_TOKEN` in
Vercel Project Settings → Environment Variables. Without it, the button returns a clear "not configured yet" error
instead of failing silently. Add `ANTHROPIC_API_KEY` to enable the real patch-generation tier above. Optionally set
`DEMO_TRIGGER_SECRET` (server) and the matching `VITE_DEMO_TRIGGER_SECRET` (client, must be set at build time) once
this app's URL is shared publicly — otherwise anyone who finds the link could trigger a real GitHub write (and, with
`ANTHROPIC_API_KEY` set, a real model call). The server never accepts a finding, repo, file content, or code snippet
from the client; it only accepts a `findingId` checked against a small whitelist in `api/_lib/findings.ts`, and
reuses the same deterministic branch/PR per finding so repeated clicks don't spam new PRs (though each click with
`ANTHROPIC_API_KEY` set still re-runs the model — there's no response caching).

## What is intentionally deferred

This build is the application shell and demo experience, not the production backend. Not implemented, on purpose,
outside the one live integration described above:

- Real MCP connector calls, OAuth/connection flows, and live source-system data for every agent other than the
  Remediation Agent's GitHub write path — everything else is simulated with artificial latency and an occasional
  simulated failure, clearly labeled "demo mode."
- A real Agent Orchestrator / Agent Runtime that actually executes agent logic — "Run agent" appends a synthetic
  execution record rather than invoking a model, for every agent except the Remediation Agent's live action (and
  even there, only when `ANTHROPIC_API_KEY` is set — see above).
- A real Knowledge Graph database, policy engine, or audit log — these are typed, seeded, in-memory arrays.
- Authentication/SSO — the role switcher is a demo convenience, not a login system.
- Persisting any change across a page reload — state lives in memory for the session only.
