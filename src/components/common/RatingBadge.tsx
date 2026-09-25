import Chip from '@mui/material/Chip';
import { MATURITY_LEVELS, type MaturityValue } from '../../types/domain';

const COLORS: Record<MaturityValue, string> = {
  0: '#d03b3b',
  1: '#ec835a',
  2: '#c98500',
  3: '#0ca30c',
};

export function RatingBadge({ rating, size = 'small' }: { rating: MaturityValue | null; size?: 'small' | 'medium' }) {
  if (rating === null) {
    return <Chip size={size} label="Not assessed" sx={{ bgcolor: '#e1e0d9', color: '#52514e', fontWeight: 500 }} />;
  }
  const label = MATURITY_LEVELS.find((l) => l.value === rating)?.label ?? String(rating);
  const color = COLORS[rating];
  return (
    <Chip
      size={size}
      label={label}
      sx={{
        bgcolor: color,
        color: '#fff',
        fontWeight: 600,
      }}
    />
  );
}
