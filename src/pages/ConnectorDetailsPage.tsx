import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { mcpService } from '../services';
import { agents } from '../data/agents';
import type { McpConnector } from '../types/domain';

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

export function ConnectorDetailsPage() {
  const { connectorId } = useParams();
  const navigate = useNavigate();

  const [connector, setConnector] = useState<McpConnector | undefined>();
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

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

  const usingAgents = agents.filter((a) => connector.agentIdsUsing.includes(a.id));

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    const result = await mcpService.testConnection(connector!.id);
    setTesting(false);
    setTestResult(result);
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/mcp')} sx={{ mb: 1 }}>
        Back to MCP Connections
      </Button>
      <PageHeader
        title={connector.name}
        description={connector.description}
        breadcrumbs={['MCP Connections', connector.name]}
        actions={
          <Button
            variant="outlined"
            startIcon={<AccountTreeOutlinedIcon />}
            onClick={() => navigate(`/mcp/${connector.id}/workflow`)}
          >
            See how it works
          </Button>
        }
      />

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
          <StatusBadge status={connector.status} />
          <StatusBadge status={connector.healthCheck} />
          {connector.isPlatformService && <Chip size="small" color="secondary" label="Platform MCP service" />}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {connector.lastSynchronization
            ? `Last synchronized ${new Date(connector.lastSynchronization).toLocaleString()}`
            : 'Not yet synchronized'}
        </Typography>

        {testResult && (
          <Alert severity={testResult.ok ? 'success' : 'error'} sx={{ mb: 2 }} onClose={() => setTestResult(null)}>
            {testResult.message}
          </Alert>
        )}

        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          <Button variant="contained" size="small" disabled={testing} onClick={handleTest}>
            {testing ? 'Testing…' : 'Test connection (demo mode)'}
          </Button>
          <Button variant="outlined" size="small" disabled>
            Configure
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Configuration is disabled in this demo build. Connect a real backend to enable it.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
            <DetailSection title="Connected systems">
              <Typography variant="body2">{connector.connectedSystems.join(', ')}</Typography>
            </DetailSection>

            <DetailSection title="Data types available">
              <Stack direction="row" gap={0.5} flexWrap="wrap">
                {connector.dataTypes.map((d) => (
                  <Chip key={d} size="small" label={d} variant="outlined" />
                ))}
              </Stack>
            </DetailSection>

            <Stack direction="row" gap={3}>
              <DetailSection title="Read permissions">
                <Typography variant="body2">{connector.readPermissions.join(', ') || 'None'}</Typography>
              </DetailSection>
              <DetailSection title="Write permissions">
                <Typography variant="body2">{connector.writePermissions.join(', ') || 'None (read-only)'}</Typography>
              </DetailSection>
            </Stack>

            <DetailSection title="Environment access">
              <Stack direction="row" gap={0.5} flexWrap="wrap">
                {connector.environmentAccess.map((e) => (
                  <Chip key={e} size="small" label={e} variant="outlined" />
                ))}
              </Stack>
            </DetailSection>

            {connector.capabilities && (
              <DetailSection title="Capabilities">
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {connector.capabilities.map((c) => (
                    <Chip key={c} size="small" label={c} />
                  ))}
                </Stack>
              </DetailSection>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
            <DetailSection title="Agents using this connector">
              {usingAgents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No agents currently use this connector.
                </Typography>
              ) : (
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {usingAgents.map((a) => (
                    <Chip key={a.id} size="small" label={a.name} variant="outlined" clickable onClick={() => navigate(`/agents/${a.id}`)} />
                  ))}
                </Stack>
              )}
            </DetailSection>

            <Divider sx={{ my: 2 }} />

            <DetailSection title="Sample workflow">
              <Typography variant="body2" color="text.secondary">
                See this connector in context on the <strong>Workflows</strong> tab, where the agents
                above use it during end-to-end demo runs.
              </Typography>
            </DetailSection>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
