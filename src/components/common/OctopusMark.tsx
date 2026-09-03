import { useId } from 'react';
import Box from '@mui/material/Box';

interface OctopusMarkProps {
  /** Overall square size in pixels. */
  size?: number;
  /** Render the eight-branch "distributed intelligence" motif behind the mark. */
  variant?: 'mark' | 'glyph';
}

/**
 * Brand mark for Octopus, the secure SDLC intelligence platform: a central
 * "main brain" with eight branches, each ending in a smaller node-brain. The
 * idea it signals is distributed intelligence — one governing mind, many
 * specialized agents acting at the edges — used sparingly as a logo, not as
 * a literal diagram.
 */
export function OctopusMark({ size = 32, variant = 'mark' }: OctopusMarkProps) {
  const gradId = useId();
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = 34;
    return { x: 50 + Math.cos(angle) * r, y: 50 + Math.sin(angle) * r, i };
  });

  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Octopus"
      sx={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#17B6C4" />
          <stop offset="100%" stopColor="#3E6FFA" />
        </linearGradient>
      </defs>
      {nodes.map((n) => (
        <path
          key={n.i}
          d={`M 50 50 Q ${50 + (n.x - 50) * 0.5} ${50 + (n.y - 50) * 0.2}, ${n.x} ${n.y}`}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
      {variant === 'mark' &&
        nodes.map((n) => <circle key={`node-${n.i}`} cx={n.x} cy={n.y} r={4.5} fill="#5EEAD4" opacity={0.9} />)}
      <circle cx={50} cy={50} r={16} fill={`url(#${gradId})`} />
      <circle cx={50} cy={50} r={16} fill="none" stroke="#04070B" strokeOpacity={0.08} strokeWidth={1} />
    </Box>
  );
}
