import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { SdlcPhase } from '../../types/domain';
import { StatusBadge } from '../common/StatusBadge';

const HEALTH_STATUS_MAP: Record<SdlcPhase['healthStatus'], string> = {
  on_track: 'on_track',
  needs_attention: 'needs_attention',
  blocked: 'blocked',
};

interface PhaseCardProps {
  phase: SdlcPhase;
  agentCount: number;
  onOpen: (phase: SdlcPhase) => void;
}

export function PhaseCard({ phase, agentCount, onOpen }: PhaseCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Phase {phase.order}
            </Typography>
            <Typography variant="h3">{phase.name}</Typography>
          </Box>
          <StatusBadge status={HEALTH_STATUS_MAP[phase.healthStatus]} />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>
          {phase.shortDescription}
        </Typography>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Chip size="small" label={`${agentCount} agents`} variant="outlined" />
          {phase.primaryOutputsSummary.map((o) => (
            <Chip key={o} size="small" label={o} variant="outlined" color="secondary" />
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block">
          Recent activity
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {phase.recentActivitySummary}
        </Typography>
        <Button size="small" onClick={() => onOpen(phase)}>
          View phase details
        </Button>
      </CardContent>
    </Card>
  );
}
