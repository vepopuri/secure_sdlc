import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { platformComponents, ARCHITECTURE_LAYERS } from '../data/platformComponents';

export function PlatformComponentsPage() {
  const [highlightLayer, setHighlightLayer] = useState<number | null>(null);

  return (
    <Box>
      <PageHeader
        title="Platform Components"
        description="How the platform is put together, kept intentionally simple: layers of responsibility, not an all-to-all wiring diagram."
      />

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Layered architecture
        </Typography>
        <Stack gap={1}>
          {ARCHITECTURE_LAYERS.map((layer) => {
            const components = platformComponents.filter((c) => c.layer === layer.layer);
            const active = highlightLayer === layer.layer;
            return (
              <Paper
                key={layer.layer}
                variant="outlined"
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1,
                  borderColor: active ? 'primary.main' : undefined,
                  borderWidth: active ? 2 : 1,
                  bgcolor: active ? 'rgba(134,188,37,0.06)' : undefined,
                  transition: 'all 0.15s ease',
                }}
              >
                <Chip label={`${layer.layer}`} size="small" sx={{ bgcolor: 'brand.charcoal', color: '#fff', fontWeight: 700 }} />
                <Typography variant="subtitle2" sx={{ minWidth: 220 }}>
                  {layer.name}
                </Typography>
                <Stack direction="row" gap={0.75} flexWrap="wrap">
                  {components.map((c) => (
                    <Chip key={c.id} size="small" label={c.name} variant="outlined" />
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
          Enterprise source systems (layer 7) are your existing tools — GitHub, Jira, cloud providers, and the rest —
          reached only through the MCP connectors above them.
        </Typography>
      </Paper>

      <Typography variant="h2" sx={{ mb: 2 }}>
        Component library
      </Typography>
      <Grid container spacing={2}>
        {platformComponents.map((c) => (
          <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h4">{c.name}</Typography>
                  <StatusBadge status={c.operationalStatus} />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  {c.purpose}
                </Typography>
                <Alert severity="info" variant="outlined" sx={{ py: 0, mb: 1.5 }}>
                  <Typography variant="caption">{c.whyItMatters}</Typography>
                </Alert>
                <Typography variant="caption" color="text.secondary" display="block">
                  Inputs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {c.inputs.join(', ')}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Outputs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {c.outputs.join(', ')}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Security responsibility
                </Typography>
                <Typography variant="body2">{c.securityResponsibility}</Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" onClick={() => setHighlightLayer(c.layer)}>
                  View architecture relationship
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
