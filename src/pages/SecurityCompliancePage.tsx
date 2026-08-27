import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { PageHeader } from '../components/common/PageHeader';
import { SeverityBadge, StatusBadge } from '../components/common/StatusBadge';
import { securityFindings, complianceEvidenceStatus, openExceptionsCount, approvalTrend7dPct, remediationAgingBuckets } from '../data/security';
import type { SecurityFinding } from '../types/domain';

const SEVERITIES: SecurityFinding['severity'][] = ['critical', 'high', 'medium', 'low'];

const CATEGORY_SECTIONS: { id: SecurityFinding['category']; label: string; icon: typeof ShieldOutlinedIcon }[] = [
  { id: 'identity', label: 'Identity security', icon: AdminPanelSettingsOutlinedIcon },
  { id: 'supply_chain', label: 'Supply-chain security', icon: Inventory2OutlinedIcon },
  { id: 'secrets_crypto', label: 'Secrets and cryptography', icon: VpnKeyOutlinedIcon },
  { id: 'cloud_runtime', label: 'Cloud and runtime security', icon: DnsOutlinedIcon },
  { id: 'privacy_data_governance', label: 'Privacy and data governance', icon: PolicyOutlinedIcon },
  { id: 'threat_intel', label: 'Threat intelligence', icon: GppMaybeOutlinedIcon },
  { id: 'incident_response', label: 'Incident response', icon: ShieldOutlinedIcon },
  { id: 'resilience', label: 'Resilience and recovery', icon: ShieldOutlinedIcon },
  { id: 'third_party_risk', label: 'Third-party risk', icon: ShieldOutlinedIcon },
];

export function SecurityCompliancePage() {
  const openFindings = securityFindings.filter((f) => f.status === 'open' || f.status === 'in_progress');
  const severityCounts = Object.fromEntries(SEVERITIES.map((s) => [s, openFindings.filter((f) => f.severity === s).length]));
  const criticalCount = severityCounts.critical ?? 0;
  const exposedSecretsCount = securityFindings.filter((f) => f.category === 'secrets_crypto' && f.status !== 'resolved').length;
  const excessivePrivilegeCount = securityFindings.filter((f) => f.category === 'identity' && /privilege/i.test(f.title)).length;
  const unverifiedArtifactCount = securityFindings.filter((f) => f.category === 'supply_chain').length;
  const runtimeExposureCount = securityFindings.filter((f) => f.category === 'cloud_runtime').length;
  const dataGovernanceGapCount = securityFindings.filter((f) => f.category === 'privacy_data_governance').length;
  const policyViolationCount = securityFindings.filter((f) => f.status === 'open' && f.severity !== 'low').length;

  const statCards = [
    { label: 'Critical findings', value: criticalCount },
    { label: 'Exposed secrets / crypto issues', value: exposedSecretsCount },
    { label: 'Excessive privileges', value: excessivePrivilegeCount },
    { label: 'Unverified artifacts', value: unverifiedArtifactCount },
    { label: 'Runtime exposures', value: runtimeExposureCount },
    { label: 'Data governance gaps', value: dataGovernanceGapCount },
    { label: 'Policy violations', value: policyViolationCount },
    { label: 'Open exceptions', value: openExceptionsCount },
  ];

  return (
    <Box>
      <PageHeader title="Security and Compliance" description="Cross-cutting security posture, aggregated from the security and governance agents." />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Open vulnerabilities by severity
            </Typography>
            <Stack gap={1}>
              {SEVERITIES.map((s) => (
                <Stack key={s} direction="row" alignItems="center" gap={1.5}>
                  <Box sx={{ width: 70 }}>
                    <SeverityBadge severity={s} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={openFindings.length ? ((severityCounts[s] ?? 0) / openFindings.length) * 100 : 0}
                    color={s === 'critical' || s === 'high' ? 'error' : s === 'medium' ? 'warning' : 'success'}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ width: 20, textAlign: 'right' }}>
                    {severityCounts[s] ?? 0}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Compliance evidence status
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <LinearProgress
                variant="determinate"
                value={(complianceEvidenceStatus.withCurrentEvidence / complianceEvidenceStatus.totalControls) * 100}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2">
                {complianceEvidenceStatus.withCurrentEvidence}/{complianceEvidenceStatus.totalControls}
              </Typography>
            </Stack>
            <Stack direction="row" gap={3} sx={{ mt: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Expiring soon</Typography>
                <Typography variant="body2">{complianceEvidenceStatus.expiringSoon} controls</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Missing evidence</Typography>
                <Typography variant="body2">{complianceEvidenceStatus.missingEvidence} controls</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Approval volume, 7d</Typography>
                <Typography variant="body2">{approvalTrend7dPct >= 0 ? '+' : ''}{approvalTrend7dPct}%</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((c) => (
          <Grid key={c.label} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h3">{c.value}</Typography>
                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2.5, mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Security remediation aging
        </Typography>
        <Grid container spacing={2}>
          {remediationAgingBuckets.map((b) => (
            <Grid key={b.label} size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4">{b.count}</Typography>
              <Typography variant="caption" color="text.secondary">{b.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h2" sx={{ mb: 2 }}>
        Findings by domain
      </Typography>
      <Grid container spacing={2}>
        {CATEGORY_SECTIONS.map((section) => {
          const findings = securityFindings.filter((f) => f.category === section.id);
          const Icon = section.icon;
          return (
            <Grid key={section.id} size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <Icon color="secondary" fontSize="small" />
                  <Typography variant="subtitle1">{section.label}</Typography>
                </Stack>
                {findings.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No findings recorded in this demo dataset.
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {findings.map((f, i) => (
                      <Box key={f.id}>
                        <ListItem disableGutters>
                          <ListItemText
                            primary={f.title}
                            secondary={`${f.ageDays} days old · ${f.description}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                          <Stack gap={0.5} alignItems="flex-end">
                            <SeverityBadge severity={f.severity} />
                            <StatusBadge status={f.status} />
                          </Stack>
                        </ListItem>
                        {i < findings.length - 1 && <Divider component="li" />}
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
