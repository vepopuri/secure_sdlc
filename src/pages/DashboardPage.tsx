import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FRAMEWORKS } from '../data/frameworks';
import { useAppData } from '../context/AppDataContext';
import { scoreFramework } from '../utils/scoring';
import { FrameworkScoreCard } from '../components/dashboard/FrameworkScoreCard';

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="h4" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}

export default function DashboardPage() {
  const { observations, evidence } = useAppData();

  const scores = FRAMEWORKS.map((f) => scoreFramework(f, observations.filter((o) => o.frameworkId === f.id)));
  const totalControls = scores.reduce((sum, s) => sum + s.totalControls, 0);
  const ratedControls = scores.reduce((sum, s) => sum + s.ratedControls, 0);
  const weightedSum = scores.reduce((sum, s) => sum + (s.averageRating ?? 0) * s.ratedControls, 0);
  const overallAverage = ratedControls ? weightedSum / ratedControls : null;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Assessment progress across every configured framework.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile label="Frameworks" value={String(FRAMEWORKS.length)} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile label="Controls assessed" value={`${ratedControls} / ${totalControls}`} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile label="Evidence items" value={String(evidence.length)} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatTile label="Overall maturity" value={overallAverage !== null ? `${overallAverage.toFixed(1)} / 3` : '—'} />
        </Grid>
      </Grid>

      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          By framework
        </Typography>
        <Grid container spacing={2}>
          {FRAMEWORKS.map((f) => (
            <Grid key={f.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <FrameworkScoreCard framework={f} observations={observations.filter((o) => o.frameworkId === f.id)} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
