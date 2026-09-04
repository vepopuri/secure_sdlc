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
  /** 'vertical' stacks stages top-to-bottom at every breakpoint (not just mobile) — used for side-by-side comparison diagrams. Defaults to the original responsive row/column behavior. */
  orientation?: 'horizontal' | 'vertical';
  /** Dims the stage cards — for illustrating a simulated/inactive path alongside a highlighted real one. */
  muted?: boolean;
}

function StageCard({ stage, muted }: { stage: FlowStage; muted?: boolean }) {
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
        opacity: muted ? 0.75 : 1,
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
            bgcolor: muted ? 'action.selected' : 'rgba(23,182,196,0.12)',
            color: muted ? 'text.secondary' : 'primary.main',
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

function PipelineRow({ stages, orientation = 'horizontal', muted }: { stages: FlowStage[]; orientation?: 'horizontal' | 'vertical'; muted?: boolean }) {
  const rowDirection = orientation === 'vertical' ? 'column' : { xs: 'column' as const, md: 'row' as const };
  const arrowTransform = orientation === 'vertical' ? 'rotate(90deg)' : { xs: 'rotate(90deg)', md: 'none' };
  return (
    <Stack direction={rowDirection} alignItems={orientation === 'vertical' ? 'stretch' : { xs: 'stretch', md: 'center' }} gap={1.5}>
      {stages.map((stage, i) => (
        <Stack key={i} direction={rowDirection} alignItems="center" gap={1.5} sx={{ flex: '1 1 0' }}>
          <StageCard stage={stage} muted={muted} />
          {i < stages.length - 1 && (
            <ArrowForwardIcon fontSize="small" sx={{ color: 'text.disabled', transform: arrowTransform, flexShrink: 0 }} />
          )}
        </Stack>
      ))}
    </Stack>
  );
}

/** A hand-rolled, fixed pipeline diagram — deliberately linear (no auto-layout graph library) since the underlying data (trigger → agent → gateway → connector → system) is genuinely a straight line, with at most one side branch. */
export function FlowPipeline({ stages, branch, orientation = 'horizontal', muted }: FlowPipelineProps) {
  return (
    <Box>
      <PipelineRow stages={stages} orientation={orientation} muted={muted} />
      {branch && (
        <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {branch.label}
          </Typography>
          <PipelineRow stages={branch.stages} orientation={orientation} muted={muted} />
        </Box>
      )}
    </Box>
  );
}
