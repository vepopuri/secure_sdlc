import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface FlowStage {
  icon: typeof ArrowForwardIcon;
  title: string;
  subtitle?: string;
  chips?: string[];
  onChipClick?: (chip: string) => void;
}

interface FlowPipelineProps {
  stages: FlowStage[];
  /** An optional side interaction (e.g. the Knowledge Graph) rendered as its own smaller row below the main pipeline. */
  branch?: { label: string; stages: FlowStage[] };
}

function StageCard({ stage }: { stage: FlowStage }) {
  const Icon = stage.icon;
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        minWidth: 190,
        flex: '1 1 190px',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.75 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(23,182,196,0.12)',
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
          {stage.title}
        </Typography>
      </Stack>
      {stage.subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: stage.chips?.length ? 0.75 : 0 }}>
          {stage.subtitle}
        </Typography>
      )}
      {stage.chips && stage.chips.length > 0 && (
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {stage.chips.map((c) => (
            <Chip
              key={c}
              size="small"
              label={c}
              variant="outlined"
              onClick={stage.onChipClick ? () => stage.onChipClick!(c) : undefined}
              clickable={Boolean(stage.onChipClick)}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
}

function PipelineRow({ stages }: { stages: FlowStage[] }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} gap={1.5}>
      {stages.map((stage, i) => (
        <Stack key={i} direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={1.5} sx={{ flex: '1 1 0' }}>
          <StageCard stage={stage} />
          {i < stages.length - 1 && (
            <ArrowForwardIcon
              fontSize="small"
              sx={{ color: 'text.disabled', transform: { xs: 'rotate(90deg)', md: 'none' }, flexShrink: 0 }}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
}

/** A hand-rolled, fixed pipeline diagram — deliberately linear (no auto-layout graph library) since the underlying data (trigger → agent → gateway → connector → system) is genuinely a straight line, with at most one side branch. */
export function FlowPipeline({ stages, branch }: FlowPipelineProps) {
  return (
    <Box>
      <PipelineRow stages={stages} />
      {branch && (
        <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {branch.label}
          </Typography>
          <PipelineRow stages={branch.stages} />
        </Box>
      )}
    </Box>
  );
}
