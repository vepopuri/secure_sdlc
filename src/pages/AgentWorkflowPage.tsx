import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import CableOutlinedIcon from '@mui/icons-material/CableOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { FlowPipeline } from '../components/common/FlowPipeline';
import { agentService } from '../services';
import { mcpConnectors } from '../data/mcpConnectors';
import { KG_DOMAINS } from '../data/knowledgeGraph';
import { buildAgentUseCase } from '../utils/useCaseNarrative';
import type { Agent } from '../types/domain';

function kgLabel(domainId: string): string {
  return KG_DOMAINS.find((d) => d.id === domainId)?.label ?? domainId;
}

export function AgentWorkflowPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (agentId) {
      agentService.getById(agentId).then((result) => {
        if (!cancelled) {
          setAgent(result);
          setLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [agentId]);

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  if (!agent) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agents')} sx={{ mb: 2 }}>
          Back to Agents
        </Button>
        <EmptyState title="Agent not found" description="It may have been removed from the demo dataset." />
      </Box>
    );
  }

  const connectors = agent.requiredMcpConnectorIds.map((id) => mcpConnectors.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const sourceSystems = Array.from(new Set(connectors.flatMap((c) => c.connectedSystems)));
  const steps = buildAgentUseCase(agent);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agents')} sx={{ mb: 2 }}>
        Back to Agents
      </Button>
      <PageHeader title={agent.name} description={agent.purpose} breadcrumbs={['Agents', agent.name]} />

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          How it works
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Every path an agent action can take through this platform — never a direct call to a source system.
        </Typography>
        <FlowPipeline
          stages={[
            { icon: BoltOutlinedIcon, title: 'Trigger', subtitle: agent.inputs[0] },
            { icon: SmartToyOutlinedIcon, title: agent.name, subtitle: agent.shortDescription },
            { icon: HubOutlinedIcon, title: 'MCP Gateway', subtitle: 'Routes, authorizes, and audits every call' },
            {
              icon: CableOutlinedIcon,
              title: connectors.length === 1 ? 'MCP connector' : 'MCP connectors',
              chips: connectors.map((c) => c.name),
              onChipClick: (name) => {
                const c = connectors.find((x) => x.name === name);
                if (c) navigate(`/mcp/${c.id}/workflow`);
              },
            },
            { icon: StorageOutlinedIcon, title: 'Source systems', chips: sourceSystems.length > 0 ? sourceSystems : ['None — self-contained'] },
          ]}
          branch={
            agent.kgEntitiesRead.length > 0 || agent.kgEntitiesWritten.length > 0
              ? {
                  label: 'Also connects to the Knowledge Graph',
                  stages: [
                    { icon: SmartToyOutlinedIcon, title: agent.name },
                    { icon: ShareOutlinedIcon, title: 'Knowledge Graph MCP Server', subtitle: 'The only path to graph reads/writes' },
                    {
                      icon: ShareOutlinedIcon,
                      title: 'Graph domains',
                      chips: Array.from(new Set([...agent.kgEntitiesRead, ...agent.kgEntitiesWritten])).map(kgLabel),
                    },
                  ],
                }
              : undefined
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
                  Allowed MCP tools
                </Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {agent.allowedMcpTools.map((t) => (
                    <Chip key={t} size="small" label={t} sx={{ fontFamily: 'monospace' }} />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Knowledge Graph — reads
                </Typography>
                <Typography variant="body2">{agent.kgEntitiesRead.map(kgLabel).join(', ') || 'None'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Knowledge Graph — writes
                </Typography>
                <Typography variant="body2">{agent.kgEntitiesWritten.map(kgLabel).join(', ') || 'None'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Approval policy
                </Typography>
                <Typography variant="body2">
                  {agent.approvalRequired
                    ? `Requires human approval (${['Read-only', 'Reversible non-production write', 'Controlled change', 'High-impact or production action'][agent.approvalLevel]}) before the output is applied.`
                    : 'Runs without human approval; outputs are still logged and auditable.'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>
              Sample use case
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A walkthrough built from this agent's actual configuration, not a generic script.
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
