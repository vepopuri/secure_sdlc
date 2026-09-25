import { useId, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface MaturityBarDatum {
  label: string;
  value: number | null;
  rated: number;
  total: number;
}

const MAX_VALUE = 3;
const ROW_HEIGHT = 32;
const ROW_GAP = 12;
const LABEL_WIDTH = 220;
const CHART_WIDTH = 420;
const BAR_HEIGHT = 14;

/** Horizontal bar chart: one hue, bar length encodes 0-3 average maturity.
 * Category identity comes from the row label, never from color, so every
 * bar shares the same series color per the "color follows a job" rule. */
export function MaturityBar({ data }: { data: MaturityBarDatum[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const uid = useId();
  const height = data.length * (ROW_HEIGHT + ROW_GAP);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: LABEL_WIDTH + CHART_WIDTH + 24 }}>
      <svg
        width="100%"
        viewBox={`0 0 ${LABEL_WIDTH + CHART_WIDTH} ${height}`}
        role="img"
        aria-label="Average maturity rating by function"
      >
        {[0, 1, 2, 3].map((tick) => {
          const x = LABEL_WIDTH + (tick / MAX_VALUE) * CHART_WIDTH;
          return (
            <line key={tick} x1={x} x2={x} y1={0} y2={height} stroke="var(--gridline)" strokeWidth={1} />
          );
        })}
        {data.map((d, i) => {
          const y = i * (ROW_HEIGHT + ROW_GAP);
          const barY = y + (ROW_HEIGHT - BAR_HEIGHT) / 2;
          const pct = d.value === null ? 0 : Math.max(d.value, 0) / MAX_VALUE;
          const barWidth = Math.max(pct * CHART_WIDTH, d.value === null ? 0 : 3);
          return (
            <g
              key={d.label}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
            >
              <rect x={0} y={y} width={LABEL_WIDTH + CHART_WIDTH} height={ROW_HEIGHT} fill="transparent" />
              <text x={LABEL_WIDTH - 12} y={y + ROW_HEIGHT / 2} textAnchor="end" dominantBaseline="middle" fontSize={13} fill="var(--text-secondary)">
                {d.label}
              </text>
              <rect x={LABEL_WIDTH} y={barY} width={CHART_WIDTH} height={BAR_HEIGHT} rx={4} fill="var(--gridline)" />
              {d.value !== null && (
                <rect x={LABEL_WIDTH} y={barY} width={barWidth} height={BAR_HEIGHT} rx={4} fill="var(--series-blue)" />
              )}
              <text
                x={LABEL_WIDTH + CHART_WIDTH + 8}
                y={y + ROW_HEIGHT / 2}
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={600}
                fill="var(--text-primary)"
              >
                {d.value === null ? '—' : d.value.toFixed(1)}
              </text>
            </g>
          );
        })}
        <line x1={LABEL_WIDTH} x2={LABEL_WIDTH} y1={0} y2={height} stroke="var(--baseline)" strokeWidth={1} />
      </svg>
      {hoverIdx !== null && (
        <Box
          role="tooltip"
          id={`${uid}-tooltip`}
          sx={{
            position: 'absolute',
            left: LABEL_WIDTH,
            top: 0,
            transform: `translateY(${hoverIdx * (ROW_HEIGHT + ROW_GAP)}px)`,
            bgcolor: 'var(--text-primary)',
            color: 'var(--surface)',
            px: 1.25,
            py: 0.75,
            borderRadius: 1,
            fontSize: 12,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: 'inherit', display: 'block' }}>
            {data[hoverIdx].label}
          </Typography>
          <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8 }}>
            {data[hoverIdx].rated} of {data[hoverIdx].total} controls rated
          </Typography>
        </Box>
      )}
    </Box>
  );
}
