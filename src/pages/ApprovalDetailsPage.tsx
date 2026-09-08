import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ActionLevelBadge, RiskBadge, StatusBadge } from '../components/common/StatusBadge';
import { EvidenceChips } from '../components/common/EvidenceChips';
import { approvalService } from '../services';
import { agents } from '../data/agents';
import { useAppState } from '../context/AppStateContext';
import { useDataCache } from '../context/DataCacheContext';
import type { ApprovalItem } from '../types/domain';

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function ApprovalDetailsPage() {
  const { approvalId } = useParams();
  const navigate = useNavigate();
  const { role } = useAppState();
  const { projects } = useDataCache();
  const [approval, setApproval] = useState<ApprovalItem | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (approvalId) {
      approvalService.getById(approvalId).then((result) => {
        if (!cancelled) {
          setApproval(result);
          setLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [approvalId]);

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  if (!approval) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/approvals')} sx={{ mb: 2 }}>
          Back to Approvals
        </Button>
        <EmptyState title="Approval not found" description="It may have been removed from the demo dataset." />
      </Box>
    );
  }

  const agent = agents.find((a) => a.id === approval.initiatingAgentId);
  const project = projects.find((p) => p.id === approval.projectId);
  const canDecide = role.canApprove.includes(approval.actionLevel) && approval.status === 'pending';

  async function decide(decision: 'approved' | 'rejected' | 'changes_requested') {
    const updated = await approvalService.decide(approval!.id, decision, `${role.name} (demo user)`);
    if (updated) setApproval(updated);
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/approvals')} sx={{ mb: 1 }}>
        Back to Approvals
      </Button>
      <PageHeader
        title={approval.requestedAction}
        description={`Initiated by ${agent?.name ?? approval.initiatingAgentId} · ${approval.triggerSource}`}
        breadcrumbs={['Approvals', approval.requestedAction]}
        actions={<StatusBadge status={approval.status} size="medium" />}
      />

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
          <ActionLevelBadge level={approval.actionLevel} />
          <RiskBadge level={approval.riskLevel} />
          {agent && (
            <Chip size="small" variant="outlined" label={agent.name} clickable onClick={() => navigate(`/agents/${agent.id}`)} />
          )}
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">Project</Typography>
            <Typography variant="body2">{project?.name ?? approval.projectId}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">Environment</Typography>
            <Chip size="small" label={approval.environment} variant="outlined" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">Policy result</Typography>
            <StatusBadge status={approval.policyResult} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block">Related finding</Typography>
            <Typography variant="body2">{approval.relatedFinding ?? 'None'}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">Requested at</Typography>
          <Typography variant="body2">{new Date(approval.createdAt).toLocaleString()}</Typography>
        </Box>

        {approval.status !== 'pending' && (
          <Alert severity={approval.status === 'approved' ? 'success' : approval.status === 'rejected' ? 'error' : 'warning'} sx={{ mt: 2 }}>
            {approval.status.replace('_', ' ')} by {approval.decidedBy} on {approval.decidedAt ? new Date(approval.decidedAt).toLocaleString() : ''}
          </Alert>
        )}
        {approval.status === 'pending' && !canDecide && (
          <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
            Your current role ({role.name}) cannot decide on Level {approval.actionLevel} actions.
          </Alert>
        )}

        {canDecide && (
          <Stack direction="row" gap={1} sx={{ mt: 2 }}>
            <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => decide('approved')}>
              Approve
            </Button>
            <Button variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => decide('rejected')}>
              Reject
            </Button>
            <Button variant="outlined" onClick={() => decide('changes_requested')}>
              Request changes
            </Button>
          </Stack>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
            <DetailSection title="Proposed change">
              <Typography variant="body2">{approval.proposedChange}</Typography>
            </DetailSection>

            <DetailSection title="Evidence">
              {approval.evidenceRefs.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  None attached
                </Typography>
              ) : (
                <EvidenceChips refs={approval.evidenceRefs} />
              )}
            </DetailSection>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
