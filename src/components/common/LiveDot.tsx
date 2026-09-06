import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { chartColors } from '../../theme/theme';

/**
 * A small pulsing dot + optional label signaling that the thing beside it is live —
 * either a whole panel that's actively streaming updates, or a single in-progress row.
 * Pass label={null} for a dot-only marker. Respects prefers-reduced-motion (dot just sits
 * solid, no pulse).
 */
export function LiveDot({ label = 'Live' }: { label?: string | null }) {
  return (
    <Stack direction="row" gap={0.75} alignItems="center">
      <Box className="live-dot-pulse" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: chartColors.positive, flexShrink: 0 }} />
      {label && (
        <Typography variant="caption" fontWeight={700} sx={{ color: chartColors.positive, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </Typography>
      )}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .live-dot-pulse { animation: live-dot-pulse 1.8s ease-in-out infinite; }
        }
        @keyframes live-dot-pulse {
          0% { box-shadow: 0 0 0 0 ${chartColors.positive}88; }
          70% { box-shadow: 0 0 0 7px ${chartColors.positive}00; }
          100% { box-shadow: 0 0 0 0 ${chartColors.positive}00; }
        }
      `}</style>
    </Stack>
  );
}
