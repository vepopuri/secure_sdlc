import type { KgDomain, KgEntity } from '../../types/domain';
import { authModuleEntity } from './auth_module';
import { storyAuthMfaEntity } from './story_auth_mfa';
import { storyAuthSsoEntity } from './story_auth_sso';
import { adrAuthTokenRotationEntity } from './adr_auth_token_rotation';
import { cveAuth20241111Entity } from './cve_auth_2024_1111';
import { cveAuth20242222Entity } from './cve_auth_2024_2222';
import { debtAuthLegacyHashingEntity } from './debt_auth_legacy_hashing';
import { debtAuthSessionStoreEntity } from './debt_auth_session_store';
import { debtAuthRateLimitEntity } from './debt_auth_rate_limit';
import { debtAuthTestGapsEntity } from './debt_auth_test_gaps';
import { prAuthTokenRotationEntity } from './pr_auth_token_rotation';
import { prAuthMfaEnrollEntity } from './pr_auth_mfa_enroll';
import { coverageAuthModuleEntity } from './coverage_auth_module';
import { incidentAuthOutage0417Entity } from './incident_auth_outage_0417';
import { deployCheckoutProdV482Entity } from './deploy_checkout_prod_v482';
import { deployAuthStagingV112Entity } from './deploy_auth_staging_v112';
import { teamIdentityEntityEntity } from './team_identity_entity';

export const KG_DOMAINS: { id: KgDomain; label: string; description: string }[] = [
  { id: 'codebase', label: 'Codebase', description: 'Repositories, modules, pull requests, and commits.' },
  { id: 'requirements', label: 'Requirements', description: 'Epics, stories, and acceptance criteria.' },
  { id: 'architecture', label: 'Architecture', description: 'ADRs, API contracts, and schema designs.' },
  { id: 'tests_quality', label: 'Tests and Quality', description: 'Test suites, coverage, and quality gates.' },
  { id: 'deployments', label: 'Deployments', description: 'Releases, pipelines, and environment state.' },
  { id: 'security_compliance', label: 'Security and Compliance', description: 'Findings, threat models, and control status.' },
  { id: 'observability', label: 'Observability', description: 'Metrics, alerts, and service-level objectives.' },
  { id: 'incidents_bugs', label: 'Incidents and Bugs', description: 'Incident records and bug reports.' },
  { id: 'team_people', label: 'Team and People', description: 'Teams, ownership, and on-call assignments.' },
  { id: 'technical_debt', label: 'Technical Debt', description: 'Registered debt items and priority scores.' },
  { id: 'identities', label: 'Human, Service, and Agent Identities', description: 'Accounts and their access grants.' },
  { id: 'tools_permissions_actions', label: 'Tools, Permissions, Prompts, and Agent Actions', description: 'Agent tool allowlists and executed actions.' },
  { id: 'secrets_keys_certs', label: 'Secrets, Keys, and Certificates', description: 'Rotation state and expiry, never secret values.' },
  { id: 'sboms_provenance', label: 'SBOMs, Artifacts, Registries, and Build Provenance', description: 'Build artifacts and their attestations.' },
  { id: 'cloud_runtime', label: 'Cloud Assets, Containers, Clusters, and Runtime Events', description: 'Live infrastructure and runtime signals.' },
  { id: 'data_classification', label: 'Data Classifications and Sensitive-Data Flows', description: 'Where sensitive data flows and how it is classified.' },
  { id: 'threat_intel', label: 'Threat Intelligence and Exploitability Signals', description: 'External threat context and exploitability.' },
  { id: 'vendors_third_party', label: 'Vendors and Third-Party Services', description: 'Vendor risk posture and assessments.' },
  { id: 'policies_approvals_evidence', label: 'Policies, Exceptions, Approvals, and Evidence', description: 'Policy decisions and compliance evidence.' },
];

// One file per entity (this directory) keeps each entity's full definition
// independently editable; this index just wires them together in the same
// order as before the split.
export const kgEntities: KgEntity[] = [
  authModuleEntity,
  storyAuthMfaEntity,
  storyAuthSsoEntity,
  adrAuthTokenRotationEntity,
  cveAuth20241111Entity,
  cveAuth20242222Entity,
  debtAuthLegacyHashingEntity,
  debtAuthSessionStoreEntity,
  debtAuthRateLimitEntity,
  debtAuthTestGapsEntity,
  prAuthTokenRotationEntity,
  prAuthMfaEnrollEntity,
  coverageAuthModuleEntity,
  incidentAuthOutage0417Entity,
  deployCheckoutProdV482Entity,
  deployAuthStagingV112Entity,
  teamIdentityEntityEntity,
];

export function getEntityById(id: string): KgEntity | undefined {
  return kgEntities.find((e) => e.id === id);
}

export function getEntitiesByDomain(domain: KgDomain): KgEntity[] {
  return kgEntities.filter((e) => e.domain === domain);
}
