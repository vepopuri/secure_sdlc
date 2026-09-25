import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { FRAMEWORKS, getFramework } from '../data/frameworks';
import { useAppData } from '../context/AppDataContext';
import { FrameworkTree } from '../components/assessment/FrameworkTree';
import { ControlDetailPanel } from '../components/assessment/ControlDetailPanel';
import { EmptyState } from '../components/common/EmptyState';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export default function AssessmentPage() {
  const { observations, evidence, setObservation } = useAppData();
  const [frameworkId, setFrameworkId] = useState(FRAMEWORKS[0].id);
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);

  const framework = getFramework(frameworkId)!;
  const frameworkObservations = useMemo(
    () => observations.filter((o) => o.frameworkId === frameworkId),
    [observations, frameworkId],
  );

  const selected = useMemo(() => {
    if (!selectedControlId) return null;
    for (const fn of framework.functions) {
      const control = fn.controls.find((c) => c.id === selectedControlId);
      if (control) return { control, functionName: fn.name };
    }
    return null;
  }, [framework, selectedControlId]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Assessment Workspace
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Work through each control, record a maturity rating and observation notes, and link supporting evidence.
      </Typography>

      <Tabs
        value={frameworkId}
        onChange={(_, v) => {
          setFrameworkId(v);
          setSelectedControlId(null);
        }}
        sx={{ mb: 2, borderBottom: '1px solid var(--border)' }}
      >
        {FRAMEWORKS.map((f) => (
          <Tab key={f.id} value={f.id} label={f.shortName} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <FrameworkTree
            framework={framework}
            observations={frameworkObservations}
            selectedControlId={selectedControlId}
            onSelectControl={setSelectedControlId}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          {selected ? (
            <ControlDetailPanel
              functionName={selected.functionName}
              control={selected.control}
              observation={frameworkObservations.find((o) => o.controlId === selected.control.id)}
              evidence={evidence}
              onChange={(patch) => setObservation(frameworkId, selected.control.id, patch)}
            />
          ) : (
            <Paper variant="outlined" sx={{ height: '100%' }}>
              <EmptyState
                icon={<FactCheckIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
                title="Select a control"
                subtitle="Choose a control from the list to record an observation."
              />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
