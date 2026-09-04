import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ActionLevelBadge, RiskBadge, StatusBadge } from '../components/common/StatusBadge';
import { EvidenceChips } from '../components/common/EvidenceChips';
import { approvalService } from '../services';
import { agents } from '../data/agents';
import { projects } from '../data/orgs';
import { useAppState } from '../context/AppStateContext';
import type { ApprovalItem } from '../types/domain';

const LEVEL_LEGEND = [
  { level: 0, title: 'Level 0 · Read-only', examples: 'No approval required.' },
  { level: 1, title: 'Level 1 · Reversible non-production write', examples: 'Draft ticket, PR comment, branch, draft document.' },
  { level: 2, title: 'Level 2 · Controlled change', examples: 'Open a pull request, modify non-production resources, update tests, feature-flag change.' },
  { level: 3, title: 'Level 3 · High-impact or production action', examples: 'Deploy to production, modify prod infra, rotate secrets, disable security controls. Always requires approval.' },
];

export function ApprovalsPage() {
  const { role } = useAppState();
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApprovalItem['status'] | 'all'>('pending');
  const [detailsItem, setDetailsItem] = useState<ApprovalItem | null>(null);

  useEffect(() => {
    approvalService.list().then((result) => {
      setItems(result);
      setLoading(false);
    });
  }, []);

  const filtered = statusFilter === 'all' ? items : items.filter((a) => a.status === statusFilter);

  async function decide(id: string, decision: 'approved' | 'rejected' | 'changes_requested') {
    const updated = await approvalService.decide(id, decision, `${role.name} (demo user)`);
    if (updated) setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  return (
    <Box>
      <PageHeader title="Approvals" description="Every controlled or high-impact agent action waits here until a human decides." />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Action levels
        </Typography>
        <Grid container spacing={1.5}>
          {LEVEL_LEGEND.map((l) => (
            <Grid key={l.level} size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack direction="row" gap={1} alignItems="flex-start">
                <ActionLevelBadge level={l.level} />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {l.examples}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {(['pending', 'approved', 'rejected', 'changes_requested', 'all'] as const).map((s) => (
          <Chip
            key={s}
            label={s === 'all' ? `All (${items.length})` : `${s.replace('_', ' ')} (${items.filter((a) => a.status === s).length})`}
            onClick={() => setStatusFilter(s)}
            color={statusFilter === s ? 'primary' : 'default'}
            variant={statusFilter === s ? 'filled' : 'outlined'}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Stack>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          icon={<RateReviewOutlinedIcon fontSize="large" color="disabled" />}
          title="Nothing in this queue"
          description="Approval requests will appear here as agents propose controlled or high-impact actions."
        />
      ) : (
        <Grid container spacing={2}>
          {filtered.map((item) => {
            const agent = agents.find((a) => a.id === item.initiatingAgentId);
            const project = projects.find((p) => p.id === item.projectId);
            const canDecide = role.canApprove.includes(item.actionLevel) && item.status === 'pending';
            return (
              <Grid key={item.id} size={12}>
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                      <Box>
                        <Typography variant="h4">{item.requestedAction}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Initiated by {agent?.name ?? item.initiatingAgentId} · {item.triggerSource}
                        </Typography>
                      </Box>
                      <Stack direction="row" gap={0.75}>
                        <ActionLevelBadge level={item.actionLevel} />
                        <RiskBadge level={item.riskLevel} />
                        <StatusBadge status={item.status} />
                      </Stack>
                    </Stack>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block">Project</Typography>
                        <Typography variant="body2">{project?.name ?? item.projectId}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block">Environment</Typography>
                        <Chip size="small" label={item.environment} variant="outlined" />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block">Policy result</Typography>
                        <StatusBadge status={item.policyResult} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block">Related finding</Typography>
                        <Typography variant="body2">{item.relatedFinding ?? 'None'}</Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
                      Proposed change
                    </Typography>
                    <Typography variant="body2">{item.proposedChange}</Typography>

                    {item.status !== 'pending' && (
                      <Alert severity={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'} sx={{ mt: 1.5 }}>
                        {item.status.replace('_', ' ')} by {item.decidedBy} on {item.decidedAt ? new Date(item.decidedAt).toLocaleString() : ''}
                      </Alert>
                    )}
                    {item.status === 'pending' && !canDecide && (
                      <Alert severity="info" variant="outlined" sx={{ mt: 1.5 }}>
                        Your current role ({role.name}) cannot decide on Level {item.actionLevel} actions.
                      </Alert>
                    )}
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button size="small" onClick={() => setDetailsItem(item)}>
                      View details
                    </Button>
                    {canDecide && (
                      <>
                        <Button size="small" color="success" startIcon={<CheckIcon />} onClick={() => decide(item.id, 'approved')}>
                          Approve
                        </Button>
                        <Button size="small" color="error" startIcon={<CloseIcon />} onClick={() => decide(item.id, 'rejected')}>
                          Reject
                        </Button>
                        <Button size="small" onClick={() => decide(item.id, 'changes_requested')}>
                          Request changes
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={Boolean(detailsItem)} onClose={() => setDetailsItem(null)} maxWidth="sm" fullWidth>
        {detailsItem && (
          <>
            <DialogTitle>{detailsItem.requestedAction}</DialogTitle>
            <DialogContent dividers>
              <Stack gap={1.5}>
                <Typography variant="body2">{detailsItem.proposedChange}</Typography>
                <Box>
                  <Typography variant="caption" color="text.secondary">Evidence</Typography>
                  {detailsItem.evidenceRefs.length === 0 ? (
                    <Typography variant="body2">None attached</Typography>
                  ) : (
                    <EvidenceChips refs={detailsItem.evidenceRefs} />
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Requested at</Typography>
                  <Typography variant="body2">{new Date(detailsItem.createdAt).toLocaleString()}</Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsItem(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
