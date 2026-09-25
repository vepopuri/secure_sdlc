import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { FRAMEWORKS, getFramework } from '../data/frameworks';
import { useAppData } from '../context/AppDataContext';
import { scoreFramework, findGaps } from '../utils/scoring';
import { MaturityBar } from '../components/common/MaturityBar';
import { RatingBadge } from '../components/common/RatingBadge';

export default function ReportsPage() {
  const { observations } = useAppData();
  const [frameworkId, setFrameworkId] = useState(FRAMEWORKS[0].id);
  const framework = getFramework(frameworkId)!;

  const frameworkObservations = useMemo(
    () => observations.filter((o) => o.frameworkId === frameworkId),
    [observations, frameworkId],
  );
  const score = useMemo(() => scoreFramework(framework, frameworkObservations), [framework, frameworkObservations]);
  const gaps = useMemo(() => findGaps(framework, frameworkObservations).slice(0, 10), [framework, frameworkObservations]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Maturity by function and the highest-priority gaps for each framework.
      </Typography>

      <Tabs value={frameworkId} onChange={(_, v) => setFrameworkId(v)} sx={{ mb: 3, borderBottom: '1px solid var(--border)' }}>
        {FRAMEWORKS.map((f) => (
          <Tab key={f.id} value={f.id} label={f.shortName} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Average maturity by function
            </Typography>
            <MaturityBar
              data={score.functionScores.map((f) => ({
                label: f.function.code === f.function.name ? f.function.name : `${f.function.code} · ${f.function.name}`,
                value: f.averageRating,
                rated: f.ratedControls,
                total: f.totalControls,
              }))}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Top gaps
            </Typography>
            {gaps.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No unrated or low-maturity controls — nice work.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Control</TableCell>
                    <TableCell>Function</TableCell>
                    <TableCell align="right">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gaps.map((g) => (
                    <TableRow key={`${g.functionName}-${g.controlCode}`}>
                      <TableCell>
                        <Typography variant="body2">{g.controlName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {g.controlCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {g.functionName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <RatingBadge rating={g.rating} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
