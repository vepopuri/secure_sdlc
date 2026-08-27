import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { workflows } from '../data/workflows';
import { agents } from '../data/agents';
import type { WorkflowStatus } from '../types/domain';

const FILTERS: { id: WorkflowStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'awaiting_approval', label: 'Awaiting approval' },
  { id: 'completed', label: 'Completed' },
  { id: 'failed', label: 'Failed' },
  { id: 'scheduled', label: 'Scheduled' },
];

function agentNames(ids: string[]): string {
  return ids.map((id) => agents.find((a) => a.id === id)?.name ?? id).join(', ');
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}

export function WorkflowsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<WorkflowStatus | 'all'>('all');

  const rows = useMemo(() => (filter === 'all' ? workflows : workflows.filter((w) => w.status === filter)), [filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of workflows) map[w.status] = (map[w.status] ?? 0) + 1;
    return map;
  }, []);

  return (
    <Box>
      <PageHeader title="Workflows" description="End-to-end runs where agents hand off work to each other, call MCP tools, and update the Knowledge Graph." />

      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            label={f.id === 'all' ? `All (${workflows.length})` : `${f.label} (${counts[f.id] ?? 0})`}
            onClick={() => setFilter(f.id)}
            color={filter === f.id ? 'primary' : 'default'}
            variant={filter === f.id ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      <Paper>
        {rows.length === 0 ? (
          <EmptyState title="No workflows in this state" description="Try a different filter." />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Workflow</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trigger source</TableCell>
                  <TableCell>Initiating user</TableCell>
                  <TableCell>Agents involved</TableCell>
                  <TableCell>Current step</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Final result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((w) => (
                  <TableRow key={w.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/workflows/${w.id}`)}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {w.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={w.status} />
                    </TableCell>
                    <TableCell>{w.triggerSource}</TableCell>
                    <TableCell>{w.initiatingUser}</TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" noWrap title={agentNames(w.agentIds)}>
                        {agentNames(w.agentIds)}
                      </Typography>
                    </TableCell>
                    <TableCell>{w.currentStep}</TableCell>
                    <TableCell>{formatDuration(w.durationSeconds)}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={w.finalResult ?? ''}>
                        {w.finalResult ?? '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
