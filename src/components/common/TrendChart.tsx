import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface TrendSeries {
  label: string;
  color: string;
  points: { x: string; y: number }[];
}

interface TrendChartProps {
  series: TrendSeries[];
  height?: number;
}

const WIDTH = 560;
const PAD_X = 24;
const PAD_Y = 18;

/** Hand-rolled inline SVG line chart — no charting dependency, matching the technique already used in EntityGraphView. */
export function TrendChart({ series, height = 180 }: TrendChartProps) {
  const pointCount = series[0]?.points.length ?? 0;
  const allValues = series.flatMap((s) => s.points.map((p) => p.y));
  const maxY = Math.max(1, ...allValues);
  const minY = Math.min(0, ...allValues);
  const range = maxY - minY || 1;

  const innerW = WIDTH - PAD_X * 2;
  const innerH = height - PAD_Y * 2;

  function xFor(i: number): number {
    if (pointCount <= 1) return PAD_X + innerW / 2;
    return PAD_X + (i / (pointCount - 1)) * innerW;
  }
  function yFor(v: number): number {
    return PAD_Y + innerH - ((v - minY) / range) * innerH;
  }

  if (pointCount === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No trend data available.
      </Typography>
    );
  }

  return (
    <Box>
      <Box component="svg" viewBox={`0 0 ${WIDTH} ${height}`} sx={{ width: '100%', height, display: 'block' }} role="img" aria-label="Approval volume trend, last 7 days">
        <line x1={PAD_X} y1={yFor(0)} x2={WIDTH - PAD_X} y2={yFor(0)} stroke="#D8D7D3" strokeWidth={1} />
        {series.map((s) => {
          const path = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p.y)}`).join(' ');
          return (
            <g key={s.label}>
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} />
              {s.points.map((p, i) => (
                <circle key={i} cx={xFor(i)} cy={yFor(p.y)} r={2.5} fill={s.color} />
              ))}
            </g>
          );
        })}
        {series[0]?.points.map((p, i) => (
          <text key={p.x} x={xFor(i)} y={height - 2} textAnchor="middle" fontSize="8" fill="#7A7A76">
            {p.x}
          </text>
        ))}
      </Box>
      <Stack direction="row" gap={2} sx={{ mt: 0.5 }}>
        {series.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" gap={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
            <Typography variant="caption" color="text.secondary">
              {s.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
