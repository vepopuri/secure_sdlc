import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
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
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { workflows } from '../data/workflows';
import { agents } from '../data/agents';
import type { WorkflowStepEvent } from '../types/domain';

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
  const workflow = workflows.find((w) => w.id === workflowId);

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

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/workflows')} sx={{ mb: 1 }}>
        Back to workflows
      </Button>
      <PageHeader
        title={workflow.name}
        description={workflow.description}
        breadcrumbs={['Workflows', workflow.name]}
        actions={<StatusBadge status={workflow.status} size="medium" />}
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
            return (
              <TimelineItem key={step.id}>
                <TimelineOppositeContent sx={{ flex: 0.25 }} color="text.secondary" variant="caption">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={DOT_COLOR[step.status] ?? 'grey'} variant={step.status === 'running' ? 'filled' : 'outlined'}>
                    <Icon fontSize="small" />
                  </TimelineDot>
                  {i < workflow.steps.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 3 }}>
                  <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600}>
                      {step.label}
                    </Typography>
                    <StatusBadge status={step.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {step.detail}
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
