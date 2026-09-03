import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import CableOutlinedIcon from '@mui/icons-material/CableOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { FlowPipeline } from '../components/common/FlowPipeline';
import { mcpService } from '../services';
import { agents } from '../data/agents';
import { buildConnectorUseCase } from '../utils/useCaseNarrative';
import type { McpConnector, Agent } from '../types/domain';

const MAX_AGENT_CHIPS = 4;

export function ConnectorWorkflowPage() {
  const { connectorId } = useParams();
  const navigate = useNavigate();
  const [connector, setConnector] = useState<McpConnector | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (connectorId) {
      mcpService.getById(connectorId).then((result) => {
        if (!cancelled) {
          setConnector(result);
          setLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [connectorId]);

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  if (!connector) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/mcp')} sx={{ mb: 2 }}>
          Back to MCP Connections
        </Button>
        <EmptyState title="Connector not found" description="It may have been removed from the demo dataset." />
      </Box>
    );
  }

  const usingAgents: Agent[] = agents.filter((a) => connector.agentIdsUsing.includes(a.id));
  const shownAgents = usingAgents.slice(0, MAX_AGENT_CHIPS);
  const extraAgentCount = usingAgents.length - shownAgents.length;
  const steps = buildConnectorUseCase(connector, usingAgents);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/mcp')} sx={{ mb: 2 }}>
        Back to MCP Connections
      </Button>
      <PageHeader title={connector.name} description={connector.description} breadcrumbs={['MCP Connections', connector.name]} />

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          How it works
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {connector.isPlatformService
            ? 'This is one of the two platform services every agent action passes through — not a source system itself.'
            : 'Agents never connect directly to source systems — every call is routed through the MCP Gateway.'}
        </Typography>
        <FlowPipeline
          stages={
            connector.isPlatformService
              ? [
                  { icon: SmartToyOutlinedIcon, title: 'Every agent', subtitle: 'All agent-to-tool calls pass through here' },
                  { icon: CableOutlinedIcon, title: connector.name, subtitle: 'Platform MCP service' },
                  { icon: StorageOutlinedIcon, title: 'Connected systems', chips: connector.connectedSystems },
                ]
              : [
                  {
                    icon: SmartToyOutlinedIcon,
                    title: usingAgents.length === 1 ? 'Agent' : 'Agents',
                    subtitle: usingAgents.length === 0 ? 'No agents currently require this connector' : undefined,
                    chips: [...shownAgents.map((a) => a.name), ...(extraAgentCount > 0 ? [`+${extraAgentCount} more`] : [])],
                    onChipClick: (name) => {
                      if (name.startsWith('+')) return;
                      navigate('/agents');
                    },
                  },
                  { icon: HubOutlinedIcon, title: 'MCP Gateway', subtitle: 'Routes, authorizes, and audits every call' },
                  { icon: CableOutlinedIcon, title: connector.name, subtitle: 'Source connector' },
                  { icon: StorageOutlinedIcon, title: 'Connected systems', chips: connector.connectedSystems },
                ]
          }
        />
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>
              Integration details
            </Typography>
            <Stack gap={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Data types available
                </Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {connector.dataTypes.map((d) => (
                    <Chip key={d} size="small" label={d} variant="outlined" />
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" gap={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Read permissions
                  </Typography>
                  <Typography variant="body2">{connector.readPermissions.join(', ') || 'None'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Write permissions
                  </Typography>
                  <Typography variant="body2">{connector.writePermissions.join(', ') || 'None (read-only)'}</Typography>
                </Box>
              </Stack>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Environment access
                </Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {connector.environmentAccess.map((e) => (
                    <Chip key={e} size="small" label={e} variant="outlined" />
                  ))}
                </Stack>
              </Box>
              {connector.capabilities && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Capabilities
                  </Typography>
                  <Stack direction="row" gap={0.5} flexWrap="wrap">
                    {connector.capabilities.map((c) => (
                      <Chip key={c} size="small" label={c} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>
              Sample use case
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A walkthrough built from this connector's actual configuration, not a generic script.
            </Typography>
            <Stack gap={1.5}>
              {steps.map((step, i) => (
                <Stack key={i} direction="row" gap={1.5}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography variant="body2">{step}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
