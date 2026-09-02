import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { AgentCard } from '../components/agents/AgentCard';
import { AgentDetailsDrawer } from '../components/agents/AgentDetailsDrawer';
import { agentService, type AgentFilters } from '../services';
import { sdlcPhases } from '../data/phases';
import { mcpConnectors } from '../data/mcpConnectors';
import { useAppState } from '../context/AppStateContext';
import type { Agent } from '../types/domain';

type TriState = 'any' | 'yes' | 'no';

export function AgentsPage() {
  const { role, projectId, environment } = useAppState();
  const [search, setSearch] = useState('');
  const [phaseId, setPhaseId] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [risk, setRisk] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [connectorId, setConnectorId] = useState<string>('all');
  const [readWrite, setReadWrite] = useState<string>('all');
  const [approvalRequired, setApprovalRequired] = useState<TriState>('any');
  const [securityRelated, setSecurityRelated] = useState<TriState>('any');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Agent | null>(null);

  const filters: AgentFilters = useMemo(
    () => ({
      search: search || undefined,
      phaseId: phaseId === 'all' ? undefined : (phaseId as AgentFilters['phaseId']),
      category: category === 'all' ? undefined : (category as AgentFilters['category']),
      riskLevel: risk === 'all' ? undefined : (risk as AgentFilters['riskLevel']),
      status: statusFilter === 'all' ? undefined : (statusFilter as AgentFilters['status']),
      requiredMcpConnectorId: connectorId === 'all' ? undefined : connectorId,
      readOrWrite: readWrite === 'all' ? undefined : (readWrite as AgentFilters['readOrWrite']),
      approvalRequired: approvalRequired === 'any' ? undefined : approvalRequired === 'yes',
      securityRelated: securityRelated === 'any' ? undefined : securityRelated === 'yes',
    }),
    [search, phaseId, category, risk, statusFilter, connectorId, readWrite, approvalRequired, securityRelated],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    agentService.list(filters).then((result) => {
      if (!cancelled) {
        setAgents(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  function handleAgentChanged(updated: Agent) {
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(updated);
  }

  async function handleRun(agent: Agent) {
    const updated = await agentService.run(agent.id, { projectId, environment });
    if (updated) handleAgentChanged(updated);
  }

  const activeFilterChips: { key: string; label: string; clear: () => void }[] = [];
  if (phaseId !== 'all') activeFilterChips.push({ key: 'phase', label: sdlcPhases.find((p) => p.id === phaseId)?.name ?? phaseId, clear: () => setPhaseId('all') });
  if (category !== 'all') activeFilterChips.push({ key: 'category', label: category === 'core' ? 'Core' : 'Cross-cutting', clear: () => setCategory('all') });
  if (risk !== 'all') activeFilterChips.push({ key: 'risk', label: `${risk} risk`, clear: () => setRisk('all') });
  if (statusFilter !== 'all') activeFilterChips.push({ key: 'status', label: statusFilter, clear: () => setStatusFilter('all') });
  if (connectorId !== 'all') activeFilterChips.push({ key: 'conn', label: mcpConnectors.find((c) => c.id === connectorId)?.name ?? connectorId, clear: () => setConnectorId('all') });
  if (readWrite !== 'all') activeFilterChips.push({ key: 'rw', label: readWrite.replace('_', ' '), clear: () => setReadWrite('all') });
  if (approvalRequired !== 'any') activeFilterChips.push({ key: 'appr', label: approvalRequired === 'yes' ? 'Approval required' : 'No approval required', clear: () => setApprovalRequired('any') });
  if (securityRelated !== 'any') activeFilterChips.push({ key: 'sec', label: securityRelated === 'yes' ? 'Security-related' : 'Not security-related', clear: () => setSecurityRelated('any') });

  function clearAll() {
    setSearch('');
    setPhaseId('all');
    setCategory('all');
    setRisk('all');
    setStatusFilter('all');
    setConnectorId('all');
    setReadWrite('all');
    setApprovalRequired('any');
    setSecurityRelated('any');
  }

  return (
    <Box>
      <PageHeader title="Agents" description="Discover, filter, and inspect all 36 agents that make up the platform." />

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search agents by name, description, or capability…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Phase</InputLabel>
              <Select label="Phase" value={phaseId} onChange={(e) => setPhaseId(e.target.value)}>
                <MenuItem value="all">All phases</MenuItem>
                {sdlcPhases.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="all">All categories</MenuItem>
                <MenuItem value="core">Core SDLC</MenuItem>
                <MenuItem value="cross_cutting">Cross-cutting</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Risk level</InputLabel>
              <Select label="Risk level" value={risk} onChange={(e) => setRisk(e.target.value)}>
                <MenuItem value="all">Any risk</MenuItem>
                {['low', 'medium', 'high', 'critical'].map((r) => (
                  <MenuItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">Enabled or disabled</MenuItem>
                <MenuItem value="enabled">Enabled</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Required integration</InputLabel>
              <Select label="Required integration" value={connectorId} onChange={(e) => setConnectorId(e.target.value)}>
                <MenuItem value="all">Any integration</MenuItem>
                {mcpConnectors.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Read / write</InputLabel>
              <Select label="Read / write" value={readWrite} onChange={(e) => setReadWrite(e.target.value)}>
                <MenuItem value="all">Any</MenuItem>
                <MenuItem value="read_only">Read-only</MenuItem>
                <MenuItem value="write_enabled">Write-enabled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Stack direction="row" gap={2} sx={{ mt: 1.5 }} flexWrap="wrap" alignItems="center">
          <ToggleButtonGroup size="small" exclusive value={approvalRequired} onChange={(_, v) => v && setApprovalRequired(v)}>
            <ToggleButton value="any">Approval: any</ToggleButton>
            <ToggleButton value="yes">Approval required</ToggleButton>
            <ToggleButton value="no">No approval</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup size="small" exclusive value={securityRelated} onChange={(_, v) => v && setSecurityRelated(v)}>
            <ToggleButton value="any">Security: any</ToggleButton>
            <ToggleButton value="yes">Security-related</ToggleButton>
            <ToggleButton value="no">Not security-related</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {activeFilterChips.length > 0 && (
          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1.5 }} alignItems="center">
            {activeFilterChips.map((c) => (
              <Chip key={c.key} label={c.label} size="small" onDelete={c.clear} />
            ))}
            <Button size="small" onClick={clearAll}>
              Clear all
            </Button>
          </Stack>
        )}
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Showing {agents.length} of 36 agents
      </Typography>

      {!loading && agents.length === 0 ? (
        <EmptyState
          icon={<SmartToyOutlinedIcon fontSize="large" color="disabled" />}
          title="No agents match these filters"
          description="Try clearing a filter or searching a different term."
          actionLabel="Clear all filters"
          onAction={clearAll}
        />
      ) : (
        <Grid container spacing={2}>
          {agents.map((agent) => (
            <Grid key={agent.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <AgentCard agent={agent} onViewDetails={setSelected} onRun={role.canRunAgents ? handleRun : undefined} />
            </Grid>
          ))}
        </Grid>
      )}

      <AgentDetailsDrawer
        agent={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onChanged={handleAgentChanged}
        canRunAgents={role.canRunAgents}
        context={{ projectId, environment }}
      />
    </Box>
  );
}
