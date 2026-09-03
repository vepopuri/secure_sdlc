import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import HubIcon from '@mui/icons-material/Hub';
import type { McpConnector } from '../../types/domain';
import { StatusBadge } from '../common/StatusBadge';

interface ConnectorCardProps {
  connector: McpConnector;
  onConfigure: (connector: McpConnector) => void;
}

export function ConnectorCard({ connector, onConfigure }: ConnectorCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(connector.isPlatformService && { borderColor: 'secondary.main', borderWidth: 1.5 }),
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="h4" component="h3">
            {connector.name}
          </Typography>
          <StatusBadge status={connector.status} />
        </Stack>
        {connector.isPlatformService && (
          <Chip
            icon={<HubIcon fontSize="small" />}
            label="Platform MCP service"
            size="small"
            color="secondary"
            sx={{ mt: 0.75, mb: 0.5 }}
          />
        )}
        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
          {connector.description}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Connected systems
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {connector.connectedSystems.join(', ')}
        </Typography>
        <Stack direction="row" gap={2} sx={{ mb: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Agents using it
            </Typography>
            <Typography variant="body2">{connector.agentIdsUsing.length}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Health
            </Typography>
            <StatusBadge status={connector.healthCheck} />
          </Box>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {connector.lastSynchronization
            ? `Last synchronized ${new Date(connector.lastSynchronization).toLocaleString()}`
            : 'Not yet synchronized'}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button size="small" onClick={() => onConfigure(connector)}>
          Configure
        </Button>
      </CardActions>
    </Card>
  );
}
