import type { SdlcPhase } from '../types/domain';

// Demo data. The six SDLC phases the platform organizes work around.
export const sdlcPhases: SdlcPhase[] = [
  {
    id: 'planning_requirements',
    order: 1,
    name: 'Planning and Requirements',
    shortDescription:
      'Turn intent into governed epics, stories, estimates, and architecture decisions.',
    agentIds: ['requirements_agent', 'estimation_agent', 'architecture_agent', 'dependency_agent'],
    outputs: ['Epics', 'User stories', 'Acceptance criteria', 'Estimates', 'Architecture Decision Records', 'Dependency reports'],
    healthStatus: 'on_track',
    recentActivitySummary: '12 stories refined and 1 ADR drafted in the last 7 days.',
    primaryOutputsSummary: ['Epics & stories', 'ADRs', 'Dependency reports'],
  },
  {
    id: 'design',
    order: 2,
    name: 'Design',
    shortDescription:
      'Shape API contracts, data models, interfaces, and threat models before code is written.',
    agentIds: ['api_design_agent', 'database_schema_agent', 'ux_wireframe_agent', 'security_design_agent'],
    outputs: ['OpenAPI specifications', 'Changelogs', 'ERDs', 'Migration plans', 'Wireframe specifications', 'Threat models', 'Security requirements'],
    healthStatus: 'on_track',
    recentActivitySummary: '3 API contracts updated, 1 threat model generated for checkout redesign.',
    primaryOutputsSummary: ['OpenAPI specs', 'ERDs & migrations', 'Threat models'],
  },
  {
    id: 'development',
    order: 3,
    name: 'Development',
    shortDescription:
      'Generate, review, refactor, and document code with traceable agent assistance.',
    agentIds: ['code_generation_agent', 'code_review_agent', 'refactor_agent', 'documentation_agent'],
    outputs: ['Source code', 'Pull request drafts', 'Review comments', 'Refactored code', 'Diff summaries', 'Documentation', 'Changelogs'],
    healthStatus: 'needs_attention',
    recentActivitySummary: '18 pull requests reviewed; 2 flagged for elevated bug recurrence risk.',
    primaryOutputsSummary: ['PR drafts & reviews', 'Refactors', 'Docs'],
  },
  {
    id: 'testing_qa',
    order: 4,
    name: 'Testing and Quality Assurance',
    shortDescription:
      'Generate coverage, scan for vulnerabilities and performance regressions, and triage bugs.',
    agentIds: ['test_generation_agent', 'security_scan_agent', 'performance_agent', 'bug_triage_agent', 'remediation_agent'],
    outputs: ['Unit tests', 'Integration tests', 'E2E tests', 'Coverage reports', 'Vulnerability reports', 'Performance reports', 'Bug triage reports', 'Patch pull requests'],
    healthStatus: 'needs_attention',
    recentActivitySummary: '2 open CVEs in the authentication module surfaced by the last scan.',
    primaryOutputsSummary: ['Test suites', 'Vulnerability reports', 'Patch PRs'],
  },
  {
    id: 'deployment_operations',
    order: 5,
    name: 'Deployment and Operations',
    shortDescription:
      'Pipeline, provision, release, and observe systems in production with guardrails.',
    agentIds: ['cicd_agent', 'iac_agent', 'release_agent', 'observability_agent'],
    outputs: ['Pipeline definitions', 'Failure analysis', 'Infrastructure code', 'Drift reports', 'Cost estimates', 'Release notes', 'Rollback plans', 'Alert configurations', 'Incident summaries'],
    healthStatus: 'on_track',
    recentActivitySummary: '4 releases shipped this sprint; 0 rollbacks.',
    primaryOutputsSummary: ['Pipelines', 'IaC & drift reports', 'Release notes'],
  },
  {
    id: 'maintenance_feedback',
    order: 6,
    name: 'Maintenance and Feedback',
    shortDescription:
      'Track technical debt, compliance posture, and team retrospectives over time.',
    agentIds: ['tech_debt_agent', 'compliance_agent', 'retrospective_agent'],
    outputs: ['Debt registries', 'Priority heatmaps', 'Audit trails', 'Compliance gap reports', 'Retrospective reports', 'Velocity trends'],
    healthStatus: 'on_track',
    recentActivitySummary: 'Debt registry refreshed; 4 items linked to a recent incident.',
    primaryOutputsSummary: ['Debt registry', 'Compliance gap reports', 'Retrospectives'],
  },
];
