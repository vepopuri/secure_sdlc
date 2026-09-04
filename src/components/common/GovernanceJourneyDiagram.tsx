import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { FlowPipeline } from './FlowPipeline';

/**
 * Illustrative, simplified view of the per-step governance loop — not a literal state machine.
 * The point being made: an agent isn't "done" the moment it acts. Every step, mandatory or
 * optional agent alike, writes its evidence first, then has to clear a gate — either an
 * approval or a logged exemption request — before the next step is allowed to run.
 */
export function GovernanceJourneyDiagram() {
  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Every step, every agent
          </Typography>
          <FlowPipeline
            stages={[
              { icon: SmartToyOutlinedIcon, title: 'Agent acts', subtitle: 'Mandatory or optional — proposes one governed action at a time' },
              { icon: SaveOutlinedIcon, title: 'Evidence saved', subtitle: 'Inputs, outputs, and confidence written to the audit trail first' },
              { icon: GavelOutlinedIcon, title: 'Governance gate', subtitle: 'Policy engine checks risk level and action level' },
            ]}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, md: 2.5 }, height: '100%', borderColor: 'primary.main', borderWidth: 2, bgcolor: 'rgba(23,182,196,0.04)' }}
        >
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
            <Chip size="small" label="Common path" color="primary" />
            <Typography variant="subtitle1">Cleared on review</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Low-risk actions clear the policy engine on their own; anything above that threshold
            waits for a human sign-off before it can proceed.
          </Typography>
          <FlowPipeline
            orientation="vertical"
            stages={[
              { icon: GavelOutlinedIcon, title: 'Governance gate', subtitle: 'Policy pass, or routed for sign-off' },
              { icon: CheckCircleOutlineIcon, title: 'Approved', subtitle: 'Decision recorded against the evidence' },
              { icon: LockOpenOutlinedIcon, title: 'Next step unlocked', subtitle: 'Only now can the workflow advance' },
            ]}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
            <Chip size="small" label="Exception path" variant="outlined" />
            <Typography variant="subtitle1">Exemption, not a bypass</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            A team that wants to skip a gate can't just skip it — they have to ask, in writing,
            and someone has to decide.
          </Typography>
          <FlowPipeline
            orientation="vertical"
            muted
            stages={[
              { icon: GppMaybeOutlinedIcon, title: 'Exemption requested', subtitle: 'Justification logged against the evidence' },
              { icon: FactCheckOutlinedIcon, title: 'Reviewed by owner', subtitle: 'Granted, time-boxed, or denied' },
              { icon: LockOpenOutlinedIcon, title: 'Next step unlocked', subtitle: 'Only if the exemption was granted' },
            ]}
          />
        </Paper>
      </Grid>
      <Grid size={12}>
        <Stack direction="row" gap={3} flexWrap="wrap" alignItems="center" sx={{ mt: 0.5 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ width: 22, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Every step — no agent, mandatory or optional, skips the gate
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ width: 22, height: 0, borderTop: '2px dashed', borderColor: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              Exception path — still logged and reviewed, never silent
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
