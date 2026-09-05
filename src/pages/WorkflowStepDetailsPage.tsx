import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { STEP_KIND_ICONS, STEP_KIND_LABELS, StepStatusChip } from '../components/workflows/stepDisplay';
import { workflowService } from '../services';
import { agents } from '../data/agents';
import { mcpConnectors } from '../data/mcpConnectors';
import type { Workflow } from '../types/domain';

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

export function WorkflowStepDetailsPage() {
  const { workflowId, stepId } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  const stepIndex = workflow?.steps.findIndex((s) => s.id === stepId) ?? -1;
  const step = stepIndex >= 0 ? workflow!.steps[stepIndex] : undefined;

  if (!workflow || !step) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(workflow ? `/workflows/${workflow.id}` : '/workflows')} sx={{ mb: 2 }}>
          Back to {workflow ? workflow.name : 'workflows'}
        </Button>
        <EmptyState title="Step not found" description="It may have been removed from the demo dataset." />
      </Box>
    );
  }

  const Icon = STEP_KIND_ICONS[step.kind];
  const agent = step.agentId ? agents.find((a) => a.id === step.agentId) : undefined;
  const connector = step.mcpConnectorId ? mcpConnectors.find((c) => c.id === step.mcpConnectorId) : undefined;
  const prevStep = stepIndex > 0 ? workflow.steps[stepIndex - 1] : undefined;
  const nextStep = stepIndex < workflow.steps.length - 1 ? workflow.steps[stepIndex + 1] : undefined;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/workflows/${workflow.id}`)} sx={{ mb: 1 }}>
        Back to {workflow.name}
      </Button>
      <PageHeader
        title={step.label}
        description={step.detail}
        breadcrumbs={['Workflows', workflow.name, step.label]}
        actions={<StepStatusChip step={step} status={step.status} />}
      />

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip size="small" variant="outlined" icon={<Icon fontSize="small" />} label={STEP_KIND_LABELS[step.kind]} />
          <Chip size="small" variant="outlined" label={`Step ${stepIndex + 1} of ${workflow.steps.length}`} />
        </Stack>

        <Stack direction="row" gap={4} flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Timestamp
            </Typography>
            <Typography variant="body2">{new Date(step.timestamp).toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Part of workflow
            </Typography>
            <Chip size="small" variant="outlined" label={workflow.name} clickable onClick={() => navigate(`/workflows/${workflow.id}`)} />
          </Box>
        </Stack>
      </Paper>

      {(agent || connector) && (
        <Grid container spacing={3} sx={{ mb: 1 }}>
          {agent && (
            <Grid size={{ xs: 12, md: connector ? 6 : 12 }}>
              <Paper sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
                <DetailSection title="Agent">
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<SmartToyOutlinedIcon fontSize="small" />}
                    label={agent.name}
                    clickable
                    onClick={() => navigate(`/agents/${agent.id}`)}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {agent.shortDescription}
                  </Typography>
                </DetailSection>
              </Paper>
            </Grid>
          )}

          {connector && (
            <Grid size={{ xs: 12, md: agent ? 6 : 12 }}>
              <Paper sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
                <DetailSection title="MCP connector">
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<HubOutlinedIcon fontSize="small" />}
                    label={connector.name}
                    clickable
                    onClick={() => navigate(`/mcp/${connector.id}`)}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {connector.description}
                  </Typography>
                </DetailSection>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Button
          startIcon={<ArrowBackIosNewIcon fontSize="small" />}
          disabled={!prevStep}
          onClick={() => prevStep && navigate(`/workflows/${workflow.id}/steps/${prevStep.id}`)}
        >
          {prevStep ? prevStep.label : 'Previous step'}
        </Button>
        <Button
          endIcon={<ArrowForwardIosIcon fontSize="small" />}
          disabled={!nextStep}
          onClick={() => nextStep && navigate(`/workflows/${workflow.id}/steps/${nextStep.id}`)}
        >
          {nextStep ? nextStep.label : 'Next step'}
        </Button>
      </Stack>
    </Box>
  );
}
