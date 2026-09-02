import type { SecurityFinding } from '../types/domain';
import { daysAgo, seededInt } from './mockHelpers';

export const securityFindings: SecurityFinding[] = [
  {
    id: 'sec_1',
    title: 'Insecure token refresh in authentication module',
    category: 'identity',
    severity: 'critical',
    status: 'in_progress',
    discoveredAt: daysAgo(6),
    ageDays: 6,
    projectId: 'proj_checkout_service',
    description: 'Refresh tokens are not invalidated on rotation, enabling replay if a token leaks.',
    relatedEntityId: 'cve_auth_2024_1111',
  },
  {
    id: 'sec_2',
    title: 'Weak session fixation protection',
    category: 'identity',
    severity: 'high',
    status: 'open',
    discoveredAt: daysAgo(12),
    ageDays: 12,
    projectId: 'proj_checkout_service',
    description: 'Session identifier is not regenerated after privilege escalation.',
    relatedEntityId: 'cve_auth_2024_2222',
  },
  {
    id: 'sec_3',
    title: 'Deployment artifact with unverified provenance',
    category: 'supply_chain',
    severity: 'high',
    status: 'open',
    discoveredAt: daysAgo(2),
    ageDays: 2,
    projectId: 'proj_checkout_service',
    description: 'A recent build artifact lacks a signed provenance attestation and used a privileged service account.',
  },
  {
    id: 'sec_4',
    title: 'Expiring API gateway certificate',
    category: 'secrets_crypto',
    severity: 'medium',
    status: 'open',
    discoveredAt: daysAgo(1),
    ageDays: 1,
    projectId: 'proj_customer_portal',
    description: 'TLS certificate for the public API gateway expires in 9 days with no rotation scheduled.',
  },
  {
    id: 'sec_5',
    title: 'Excessive IAM privilege on deploy service account',
    category: 'identity',
    severity: 'high',
    status: 'open',
    discoveredAt: daysAgo(9),
    ageDays: 9,
    projectId: 'proj_checkout_service',
    description: 'The CI/CD deploy service account holds account-wide admin rather than scoped deploy permissions.',
  },
  {
    id: 'sec_6',
    title: 'Runtime container drift from baseline image',
    category: 'cloud_runtime',
    severity: 'medium',
    status: 'in_progress',
    discoveredAt: daysAgo(4),
    ageDays: 4,
    projectId: 'proj_checkout_service',
    description: 'A production pod is running a package version not present in the approved base image.',
  },
  {
    id: 'sec_7',
    title: 'Unclassified customer PII flow in checkout retry logic',
    category: 'privacy_data_governance',
    severity: 'medium',
    status: 'open',
    discoveredAt: daysAgo(15),
    ageDays: 15,
    projectId: 'proj_checkout_service',
    description: 'A newly added retry path writes customer PII to a log sink without a recorded data classification.',
  },
  {
    id: 'sec_8',
    title: 'Active exploitation observed for session-fixation pattern',
    category: 'threat_intel',
    severity: 'critical',
    status: 'open',
    discoveredAt: daysAgo(1),
    ageDays: 1,
    projectId: 'proj_checkout_service',
    description: 'Threat intelligence feed reports active exploitation of the pattern matching finding sec_2.',
    relatedEntityId: 'cve_auth_2024_2222',
  },
  {
    id: 'sec_9',
    title: 'Overdue disaster-recovery restore test',
    category: 'resilience',
    severity: 'medium',
    status: 'open',
    discoveredAt: daysAgo(20),
    ageDays: 20,
    projectId: 'proj_customer_portal',
    description: 'Quarterly restore test for the customer portal backup is 3 weeks overdue.',
  },
  {
    id: 'sec_10',
    title: 'Vendor risk assessment expired',
    category: 'third_party_risk',
    severity: 'low',
    status: 'accepted_risk',
    discoveredAt: daysAgo(35),
    ageDays: 35,
    projectId: 'proj_customer_portal',
    description: 'Security assessment for the payment processing vendor expired; renewal in progress.',
  },
  {
    id: 'sec_11',
    title: 'Incident response runbook missing for new service',
    category: 'incident_response',
    severity: 'low',
    status: 'open',
    discoveredAt: daysAgo(8),
    ageDays: 8,
    projectId: 'proj_checkout_service',
    description: 'The newly launched retry-processor service has no documented incident response runbook.',
  },
  {
    id: 'sec_12',
    title: 'Legacy password hashing scheme still in use',
    category: 'secrets_crypto',
    severity: 'medium',
    status: 'in_progress',
    discoveredAt: daysAgo(40),
    ageDays: 40,
    projectId: 'proj_checkout_service',
    description: 'Password hashing has not yet migrated to the approved Argon2id scheme.',
    relatedEntityId: 'debt_auth_legacy_hashing',
  },
];

export const complianceEvidenceStatus = {
  totalControls: 42,
  withCurrentEvidence: 33,
  expiringSoon: 6,
  missingEvidence: 3,
};

export const openExceptionsCount = 4;

/** Daily approval decision volume for the last 7 days, oldest first. */
export const approvalVolumeTrend7d: { date: string; approved: number; rejected: number; pending: number }[] = Array.from(
  { length: 7 },
  (_, i) => {
    const daysBack = 6 - i;
    const key = `approval-trend-${daysBack}`;
    return {
      date: daysAgo(daysBack),
      approved: seededInt(`${key}-approved`, 4, 14),
      rejected: seededInt(`${key}-rejected`, 0, 3),
      pending: seededInt(`${key}-pending`, 0, 5),
    };
  },
);

function totalVolume(day: (typeof approvalVolumeTrend7d)[number]): number {
  return day.approved + day.rejected + day.pending;
}

// Percentage change in total approval volume between the first and last day of the 7-day window.
const firstDayVolume = totalVolume(approvalVolumeTrend7d[0]);
const lastDayVolume = totalVolume(approvalVolumeTrend7d[approvalVolumeTrend7d.length - 1]);
export const approvalTrend7dPct = firstDayVolume === 0 ? 0 : Math.round(((lastDayVolume - firstDayVolume) / firstDayVolume) * 100);

export const remediationAgingBuckets = [
  { label: '0-7 days', count: 5 },
  { label: '8-30 days', count: 4 },
  { label: '31-90 days', count: 2 },
  { label: '90+ days', count: 1 },
];
