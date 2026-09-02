import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { workflowService } from '../services';
import { agents } from '../data/agents';
import { useAppState } from '../context/AppStateContext';
import { useStepRunner } from '../hooks/useStepRunner';
import type { RunStatus, Workflow, WorkflowStepEvent } from '../types/domain';

const ICONS: Record<WorkflowStepEvent['kind'], typeof SmartToyOutlinedIcon> = {
  agent_handoff: SmartToyOutlinedIcon,
  mcp_call: HubOutlinedIcon,
  kg_read: ShareOutlinedIcon,
  kg_write: ShareOutlinedIcon,
  policy_decision: PolicyOutlinedIcon,
  human_approval: GavelOutlinedIcon,
  output: CheckCircleOutlineIcon,
  error: ErrorOutlineIcon,
};

const DOT_COLOR: Record<string, 'success' | 'info' | 'error' | 'warning' | 'grey'> = {
  completed: 'success',
  running: 'info',
  failed: 'error',
  awaiting_approval: 'warning',
  blocked: 'error',
};

export function WorkflowDetailsPage() {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const { projectId, environment } = useAppState();
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (workflowId) {
      workflowService.getById(workflowId).then((result) => {
        if (!cancelled) {
          setWorkflow(result);
          setLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [workflowId]);

  const stepRunner = useStepRunner(workflow?.steps.length ?? 0);

  function handleStartRun() {
    if (!workflow) return;
    workflowService.startRun(workflow.id).then((updated) => {
      if (updated) setWorkflow(updated);
      stepRunner.start((i) => {
        workflowService.advanceStep(workflow.id, i, { projectId, environment }).then((w) => {
          if (w) setWorkflow(w);
        });
      });
    });
  }

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  if (!workflow) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/workflows')} sx={{ mb: 2 }}>
          Back to workflows
        </Button>
        <EmptyState title="Workflow not found" description="It may have been removed from the demo dataset." />
      </Box>
    );
  }

  const involvedAgents = workflow.agentIds.map((id) => agents.find((a) => a.id === id)).filter(Boolean);

  // Once a live run has been started this page view, the timeline reflects
  // client-side progression (runIndex) rather than each step's stored
  // status, so steps that haven't been reached yet don't briefly show the
  // stale "completed" status they had from a previous/historical run.
  const liveActive = stepRunner.runIndex >= 0;

  function displayStatus(i: number, stored: RunStatus): RunStatus | undefined {
    if (!liveActive) return stored;
    if (i < stepRunner.runIndex) return 'completed';
    if (i === stepRunner.runIndex) return stepRunner.running ? 'running' : 'completed';
    return undefined;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/workflows')} sx={{ mb: 1 }}>
        Back to workflows
      </Button>
      <PageHeader
        title={workflow.name}
        description={workflow.description}
        breadcrumbs={['Workflows', workflow.name]}
        actions={
          <Stack direction="row" gap={1.5} alignItems="center">
            <StatusBadge status={workflow.status} size="medium" />
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              disabled={stepRunner.running}
              onClick={handleStartRun}
            >
              {stepRunner.running ? 'Running…' : liveActive ? 'Run again (demo mode)' : 'Start run (demo mode)'}
            </Button>
          </Stack>
        }
      />

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Stack direction="row" gap={4} flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Trigger source
            </Typography>
            <Typography variant="body2">{workflow.triggerSource}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Initiating user
            </Typography>
            <Typography variant="body2">{workflow.initiatingUser}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Correlation ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {workflow.correlationId}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Agents involved
            </Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {involvedAgents.map((a) => (
                <Chip key={a!.id} size="small" label={a!.name} variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Stack>
        {workflow.finalResult && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Result summary
            </Typography>
            <Typography variant="body2">{workflow.finalResult}</Typography>
          </Box>
        )}
        {workflow.evidenceRefs.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Evidence
            </Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {workflow.evidenceRefs.map((e) => (
                <Chip key={e} size="small" label={e} sx={{ fontFamily: 'monospace' }} />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      <Typography variant="h3" sx={{ mb: 1 }}>
        Timeline
      </Typography>
      <Paper sx={{ p: { xs: 1, md: 2 } }}>
        <Timeline sx={{ p: 0, m: 0 }}>
          {workflow.steps.map((step, i) => {
            const Icon = ICONS[step.kind];
            const status = displayStatus(i, step.status);
            return (
              <TimelineItem key={step.id}>
                <TimelineOppositeContent sx={{ flex: 0.25 }} color="text.secondary" variant="caption">
                  {status ? new Date(step.timestamp).toLocaleTimeString() : '—'}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={status ? (DOT_COLOR[status] ?? 'grey') : 'grey'} variant={status === 'running' ? 'filled' : 'outlined'}>
                    {status ? <Icon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                  </TimelineDot>
                  {i < workflow.steps.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 3 }}>
                  <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600}>
                      {step.label}
                    </Typography>
                    {status ? <StatusBadge status={status} /> : <Chip size="small" variant="outlined" label="Pending" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {status ? step.detail : 'Not yet reached in this run.'}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Paper>
    </Box>
  );
}
