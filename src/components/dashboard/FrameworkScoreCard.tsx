import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import type { Framework, Observation } from '../../types/domain';
import { scoreFramework } from '../../utils/scoring';
import { MaturityBar } from '../common/MaturityBar';

export function FrameworkScoreCard({ framework, observations }: { framework: Framework; observations: Observation[] }) {
  const navigate = useNavigate();
  const score = scoreFramework(framework, observations);

  return (
    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {framework.shortName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {framework.version} · {score.ratedControls} of {score.totalControls} controls rated
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={700}>
          {score.averageRating !== null ? score.averageRating.toFixed(1) : '—'}
          <Typography component="span" variant="caption" color="text.secondary">
            {' '}/ 3
          </Typography>
        </Typography>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <MaturityBar
          data={score.functionScores.map((f) => ({
            label: f.function.code,
            value: f.averageRating,
            rated: f.ratedControls,
            total: f.totalControls,
          }))}
        />
      </Box>

      <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/assessment')}>
        Continue assessment
      </Button>
    </Paper>
  );
}
