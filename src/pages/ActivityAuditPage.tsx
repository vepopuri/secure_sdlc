import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { auditService, type AuditFilters } from '../services';
import { projects } from '../data/orgs';
import { agents } from '../data/agents';
import { mcpConnectors } from '../data/mcpConnectors';
import { workflows } from '../data/workflows';
import type { AuditEvent, Environment, RiskLevel } from '../types/domain';

export function ActivityAuditPage() {
  const [search, setSearch] = useState('');
  const [projectId, setProjectId] = useState('all');
  const [agentId, setAgentId] = useState('all');
  const [mcpServer, setMcpServer] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [result, setResult] = useState('all');
  const [environment, setEnvironment] = useState('all');

  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [selected, setSelected] = useState<AuditEvent | null>(null);

  const filters: AuditFilters = useMemo(
    () => ({
      search: search || undefined,
      projectId: projectId === 'all' ? undefined : projectId,
      agentId: agentId === 'all' ? undefined : agentId,
      mcpServer: mcpServer === 'all' ? undefined : mcpServer,
      riskLevel: riskLevel === 'all' ? undefined : (riskLevel as RiskLevel),
      result: result === 'all' ? undefined : (result as AuditEvent['result']),
      environment: environment === 'all' ? undefined : (environment as Environment),
    }),
    [search, projectId, agentId, mcpServer, riskLevel, result, environment],
  );

  useEffect(() => {
    auditService.list(filters).then(setEvents);
  }, [filters]);

  const mcpServerNames = Array.from(new Set(mcpConnectors.map((c) => c.name)));
  const relatedWorkflow = selected?.relatedWorkflowId ? workflows.find((w) => w.id === selected.relatedWorkflowId) : undefined;

  return (
    <Box>
      <PageHeader title="Activity and Audit" description="A searchable record of every governed action — human and agent — across the workspace." />

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by action, user, or correlation ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Project</InputLabel>
              <Select label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <MenuItem value="all">All projects</MenuItem>
                {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent</InputLabel>
              <Select label="Agent" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                <MenuItem value="all">All agents</MenuItem>
                {agents.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>MCP server</InputLabel>
              <Select label="MCP server" value={mcpServer} onChange={(e) => setMcpServer(e.target.value)}>
                <MenuItem value="all">All MCP servers</MenuItem>
                {mcpServerNames.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Risk</InputLabel>
              <Select label="Risk" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                <MenuItem value="all">Any risk</MenuItem>
                {['low', 'medium', 'high', 'critical'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Result</InputLabel>
              <Select label="Result" value={result} onChange={(e) => setResult(e.target.value)}>
                <MenuItem value="all">Any result</MenuItem>
                {['success', 'failure', 'pending'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Environment</InputLabel>
              <Select label="Environment" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
                <MenuItem value="all">Any environment</MenuItem>
                {['demo', 'development', 'staging', 'production'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        {events.length === 0 ? (
          <EmptyState title="No audit events match these filters" description="Try clearing a filter." />
        ) : (
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>User / Agent</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>MCP server</TableCell>
                  <TableCell>Environment</TableCell>
                  <TableCell>Risk</TableCell>
                  <TableCell>Policy decision</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Correlation ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((e) => (
                  <TableRow key={e.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelected(e)}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(e.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{projects.find((p) => p.id === e.projectId)?.name ?? e.projectId}</TableCell>
                    <TableCell>{e.agentId ?? e.user}</TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>{e.action}</TableCell>
                    <TableCell>{e.mcpServer ?? '—'}</TableCell>
                    <TableCell>{e.environment}</TableCell>
                    <TableCell><RiskBadge level={e.riskLevel} /></TableCell>
                    <TableCell><StatusBadge status={e.policyDecision} /></TableCell>
                    <TableCell><StatusBadge status={e.result} /></TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{e.correlationId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (
          <Box sx={{ width: { xs: '100vw', sm: 440 }, p: 3 }} role="dialog" aria-label="Audit event details">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Typography variant="h3">Event detail</Typography>
              <IconButton onClick={() => setSelected(null)} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Stack>
            <Stack gap={1.5}>
              <Field label="Action" value={selected.action} />
              <Field label="Timestamp" value={new Date(selected.timestamp).toLocaleString()} />
              <Field label="Tenant" value={selected.tenant} />
              <Field label="Project" value={projects.find((p) => p.id === selected.projectId)?.name ?? selected.projectId} />
              <Field label="User / Agent" value={selected.agentId ?? selected.user} />
              <Field label="MCP server / tool" value={`${selected.mcpServer ?? 'None'} ${selected.tool ? `· ${selected.tool}` : ''}`} />
              <Field label="Environment" value={selected.environment} />
              <Stack direction="row" gap={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Risk level</Typography>
                  <Box><RiskBadge level={selected.riskLevel} /></Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Policy decision</Typography>
                  <Box><StatusBadge status={selected.policyDecision} /></Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Result</Typography>
                  <Box><StatusBadge status={selected.result} /></Box>
                </Box>
              </Stack>
              <Field label="Input classification" value={selected.inputClassification ?? 'Not classified'} />
              <Field label="Output classification" value={selected.outputClassification ?? 'Not classified'} />
              {relatedWorkflow && <Field label="Related workflow" value={relatedWorkflow.name} />}
              {selected.relatedGraphEntityIds && selected.relatedGraphEntityIds.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Related graph entities</Typography>
                  <Stack direction="row" gap={0.5} flexWrap="wrap">
                    {selected.relatedGraphEntityIds.map((id) => <Chip key={id} size="small" label={id} />)}
                  </Stack>
                </Box>
              )}
              <Field label="Correlation ID" value={selected.correlationId} mono />
              <Typography variant="caption" color="text.secondary">
                Secret values and tokens are never displayed in audit records.
              </Typography>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={mono ? { fontFamily: 'monospace' } : undefined}>
        {value}
      </Typography>
    </Box>
  );
}
