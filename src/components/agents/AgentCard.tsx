import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { Agent } from '../../types/domain';
import { RiskBadge, StatusBadge } from '../common/StatusBadge';

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
  onRun?: (agent: Agent) => void;
  dense?: boolean;
}

export function AgentCard({ agent, onViewDetails, onRun, dense }: AgentCardProps) {
  const impactsProduction = agent.canAffectProduction || agent.canModifyInfrastructure || agent.canChangeFeatureFlags;
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="h4" component="h3">
            {agent.name}
          </Typography>
          <StatusBadge status={agent.status} />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
          {agent.shortDescription}
        </Typography>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 1.5 }}>
          <RiskBadge level={agent.riskLevel} />
          <Chip size="small" label={agent.category === 'core' ? 'Core SDLC agent' : 'Cross-cutting agent'} variant="outlined" />
          <Chip size="small" label={agent.readOrWrite === 'read_only' ? 'Read-only' : 'Write-enabled'} variant="outlined" />
          {agent.approvalRequired && <Chip size="small" label="Approval required" color="warning" variant="outlined" />}
        </Stack>
        {!dense && (
          <>
            <Typography variant="caption" color="text.secondary" display="block">
              Primary outputs
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {agent.outputs.slice(0, 3).join(', ')}
              {agent.outputs.length > 3 ? '…' : ''}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last execution
                </Typography>
                <Typography variant="body2">
                  {agent.lastExecution ? new Date(agent.lastExecution.timestamp).toLocaleString() : 'Never run'}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary" display="block">
                  Confidence score
                </Typography>
                <Typography variant="body2">{Math.round(agent.confidenceScore * 100)}%</Typography>
              </Box>
            </Stack>
          </>
        )}
        {impactsProduction && (
          <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 1.5, color: 'warning.dark' }}>
            <WarningAmberIcon fontSize="small" />
            <Typography variant="caption" fontWeight={600}>
              Can affect production — always requires approval
            </Typography>
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button size="small" onClick={() => onViewDetails(agent)}>
          View details
        </Button>
        {onRun && (
          <Button size="small" variant="outlined" onClick={() => onRun(agent)} disabled={agent.status === 'disabled'}>
            Run agent
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
