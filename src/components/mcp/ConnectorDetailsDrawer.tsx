import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { McpConnector } from '../../types/domain';
import { StatusBadge } from '../common/StatusBadge';
import { agents } from '../../data/agents';
import { mcpService } from '../../services';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function ConnectorDetailsDrawer({
  connector,
  open,
  onClose,
}: {
  connector: McpConnector | null;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!connector) return null;
  const usingAgents = agents.filter((a) => connector.agentIdsUsing.includes(a.id));

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    const result = await mcpService.testConnection(connector!.id);
    setTesting(false);
    setTestResult(result);
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box sx={{ width: { xs: '100vw', sm: 460 }, p: 3 }} role="dialog" aria-label={`${connector.name} details`}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Typography variant="h3">{connector.name}</Typography>
          <IconButton onClick={onClose} aria-label="Close details">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" gap={0.75} sx={{ mb: 2 }}>
          <StatusBadge status={connector.status} />
          <StatusBadge status={connector.healthCheck} />
          {connector.isPlatformService && <Chip size="small" color="secondary" label="Platform MCP service" />}
        </Stack>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {connector.description}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<AccountTreeOutlinedIcon />}
          onClick={() => {
            onClose();
            navigate(`/mcp/${connector.id}/workflow`);
          }}
          sx={{ mb: 2 }}
        >
          See how it works
        </Button>

        <Section title="Connected systems">
          <Typography variant="body2">{connector.connectedSystems.join(', ')}</Typography>
        </Section>

        <Section title="Data types available">
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {connector.dataTypes.map((d) => (
              <Chip key={d} size="small" label={d} variant="outlined" />
            ))}
          </Stack>
        </Section>

        <Stack direction="row" gap={3}>
          <Section title="Read permissions">
            <Typography variant="body2">{connector.readPermissions.join(', ') || 'None'}</Typography>
          </Section>
          <Section title="Write permissions">
            <Typography variant="body2">{connector.writePermissions.join(', ') || 'None (read-only)'}</Typography>
          </Section>
        </Stack>

        <Section title="Environment access">
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {connector.environmentAccess.map((e) => (
              <Chip key={e} size="small" label={e} variant="outlined" />
            ))}
          </Stack>
        </Section>

        {connector.capabilities && (
          <Section title="Capabilities">
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {connector.capabilities.map((c) => (
                <Chip key={c} size="small" label={c} />
              ))}
            </Stack>
          </Section>
        )}

        <Section title="Agents using this connector">
          {usingAgents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No agents currently use this connector.
            </Typography>
          ) : (
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {usingAgents.map((a) => (
                <Chip key={a.id} size="small" label={a.name} variant="outlined" />
              ))}
            </Stack>
          )}
        </Section>

        <Typography variant="caption" color="text.secondary">
          {connector.lastSynchronization
            ? `Last synchronized ${new Date(connector.lastSynchronization).toLocaleString()}`
            : 'Not yet synchronized'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {testResult && (
          <Alert severity={testResult.ok ? 'success' : 'error'} sx={{ mb: 2 }} onClose={() => setTestResult(null)}>
            {testResult.message}
          </Alert>
        )}

        <Stack direction="row" gap={1}>
          <Button variant="contained" disabled={testing} onClick={handleTest}>
            {testing ? 'Testing…' : 'Test connection (demo mode)'}
          </Button>
          <Button variant="outlined" disabled>
            Configure
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Configuration is disabled in this demo build. Connect a real backend to enable it.
        </Typography>
      </Box>
    </Drawer>
  );
}
