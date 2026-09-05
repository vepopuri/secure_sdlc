import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import HubIcon from '@mui/icons-material/Hub';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { ConnectorCard } from '../components/mcp/ConnectorCard';
import { sourceConnectors, platformMcpServices, MCP_CATEGORY_LABELS } from '../data/mcpConnectors';
import type { McpCategory } from '../types/domain';

const CATEGORY_ORDER: McpCategory[] = [
  'project_planning',
  'code_development',
  'testing_quality',
  'deployment',
  'observability',
  'security_identity',
  'resilience_compliance_comms',
];

export function McpConnectionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredSource = useMemo(() => {
    if (!search) return sourceConnectors;
    const q = search.toLowerCase();
    return sourceConnectors.filter((c) => `${c.name} ${c.description} ${c.connectedSystems.join(' ')}`.toLowerCase().includes(q));
  }, [search]);

  return (
    <Box>
      <PageHeader
        title="MCP Connections"
        description="Every enterprise system agents can reach, organized by category, plus the two platform services that govern all access."
      />

      <Alert severity="info" icon={<HubIcon fontSize="inherit" />} sx={{ mb: 3 }}>
        Agents must not connect directly to source systems or write directly to the graph database. Every call shown
        here is routed through the <strong>MCP Gateway and Registry</strong>, and all Knowledge Graph access goes
        through the <strong>Knowledge Graph MCP Server</strong>.
      </Alert>

      <Typography variant="h2" sx={{ mb: 2 }}>
        Platform MCP services
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {platformMcpServices.map((c) => (
          <Grid key={c.id} size={{ xs: 12, md: 6 }}>
            <ConnectorCard connector={c} onConfigure={(c) => navigate(`/mcp/${c.id}`)} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search 35 source connectors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
      </Paper>

      {CATEGORY_ORDER.map((category) => {
        const items = filteredSource.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return (
          <Box key={category} sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="baseline" gap={1} sx={{ mb: 2 }}>
              <Typography variant="h3">{MCP_CATEGORY_LABELS[category]}</Typography>
              <Typography variant="body2" color="text.secondary">
                ({items.length})
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {items.map((c) => (
                <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ConnectorCard connector={c} onConfigure={(c) => navigate(`/mcp/${c.id}`)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}

      {filteredSource.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No connectors match "{search}".
        </Typography>
      )}
    </Box>
  );
}
