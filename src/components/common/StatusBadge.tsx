import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

const LABELS: Record<string, string> = {
  connected: 'Connected',
  needs_attention: 'Needs attention',
  not_configured: 'Not configured',
  enabled: 'Enabled',
  disabled: 'Disabled',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  awaiting_approval: 'Awaiting approval',
  blocked: 'Blocked',
  read_only: 'Read-only',
  production_restricted: 'Production restricted',
  healthy: 'Healthy',
  degraded: 'Degraded',
  unavailable: 'Unavailable',
  active: 'Active',
  scheduled: 'Scheduled',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  changes_requested: 'Changes requested',
  allowed: 'Allowed',
  denied: 'Denied',
  approval_required: 'Approval required',
  success: 'Success',
  failure: 'Failure',
  open: 'Open',
  in_progress: 'In progress',
  accepted_risk: 'Accepted risk',
  resolved: 'Resolved',
  on_track: 'On track',
  pass: 'Pass',
  flagged: 'Flagged',
  fail: 'Fail',
};

type ColorKey = ChipProps['color'];

const COLORS: Record<string, ColorKey> = {
  connected: 'success',
  needs_attention: 'warning',
  not_configured: 'default',
  enabled: 'success',
  disabled: 'default',
  running: 'info',
  completed: 'success',
  failed: 'error',
  awaiting_approval: 'warning',
  blocked: 'error',
  read_only: 'default',
  production_restricted: 'error',
  healthy: 'success',
  degraded: 'warning',
  unavailable: 'error',
  active: 'info',
  scheduled: 'default',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  changes_requested: 'warning',
  allowed: 'success',
  denied: 'error',
  approval_required: 'warning',
  success: 'success',
  failure: 'error',
  open: 'error',
  in_progress: 'warning',
  accepted_risk: 'default',
  resolved: 'success',
  on_track: 'success',
  pass: 'success',
  flagged: 'warning',
  fail: 'error',
};

export function StatusBadge({ status, size = 'small' }: { status: string; size?: ChipProps['size'] }) {
  const label = LABELS[status] ?? status;
  const color = COLORS[status] ?? 'default';
  return <Chip label={label} color={color} size={size} variant={color === 'default' ? 'outlined' : 'filled'} />;
}

const RISK_COLORS: Record<string, ColorKey> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

const RISK_LABELS: Record<string, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
  critical: 'Critical risk',
};

export function RiskBadge({ level, size = 'small' }: { level: string; size?: ChipProps['size'] }) {
  return (
    <Chip
      label={RISK_LABELS[level] ?? level}
      color={RISK_COLORS[level] ?? 'default'}
      size={size}
      variant={level === 'critical' ? 'filled' : 'outlined'}
      sx={level === 'critical' ? { fontWeight: 700 } : undefined}
    />
  );
}

const SEVERITY_COLORS: Record<string, ColorKey> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

export function SeverityBadge({ severity, size = 'small' }: { severity: string; size?: ChipProps['size'] }) {
  return (
    <Chip
      label={severity.charAt(0).toUpperCase() + severity.slice(1)}
      color={SEVERITY_COLORS[severity] ?? 'default'}
      size={size}
      variant="filled"
    />
  );
}

const ACTION_LEVEL_LABELS: Record<number, string> = {
  0: 'Level 0 · Read-only',
  1: 'Level 1 · Reversible',
  2: 'Level 2 · Controlled',
  3: 'Level 3 · High-impact',
};

const ACTION_LEVEL_COLORS: Record<number, ColorKey> = {
  0: 'default',
  1: 'info',
  2: 'warning',
  3: 'error',
};

export function ActionLevelBadge({ level, size = 'small' }: { level: number; size?: ChipProps['size'] }) {
  return (
    <Chip
      label={ACTION_LEVEL_LABELS[level] ?? `Level ${level}`}
      color={ACTION_LEVEL_COLORS[level] ?? 'default'}
      size={size}
      variant={level === 3 ? 'filled' : 'outlined'}
    />
  );
}
