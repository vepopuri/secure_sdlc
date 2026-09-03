import { useId } from 'react';
import Box from '@mui/material/Box';

interface ConnectorMotifProps {
  /** Controls the aspect ratio and point density — a wide hero backdrop vs. a small corner accent vs. a thin divider. */
  variant?: 'hero' | 'panel' | 'divider';
  /** Pulses a few nodes' opacity/radius — respects prefers-reduced-motion automatically. */
  animated?: boolean;
  /** Overall opacity of the whole motif; callers control how loud it reads against their background. */
  opacity?: number;
}

interface Node {
  x: number;
  y: number;
}

// Fixed, hand-placed point sets per variant — deterministic (no Math.random()) so the motif
// renders identically on every mount/SSR pass instead of reshuffling.
const POINTS: Record<'hero' | 'panel' | 'divider', { viewBox: string; nodes: Node[]; edges: [number, number][] }> = {
  hero: {
    viewBox: '0 0 800 400',
    nodes: [
      { x: 90, y: 120 }, { x: 210, y: 60 }, { x: 320, y: 170 }, { x: 250, y: 280 },
      { x: 420, y: 90 }, { x: 480, y: 230 }, { x: 610, y: 130 }, { x: 700, y: 60 },
      { x: 650, y: 260 }, { x: 760, y: 220 }, { x: 380, y: 330 }, { x: 550, y: 340 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [2, 5], [4, 6], [6, 7], [6, 8], [8, 9], [5, 10], [10, 11], [8, 11]],
  },
  panel: {
    viewBox: '0 0 200 160',
    nodes: [{ x: 30, y: 40 }, { x: 100, y: 20 }, { x: 160, y: 70 }, { x: 90, y: 110 }, { x: 150, y: 140 }],
    edges: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]],
  },
  divider: {
    viewBox: '0 0 600 60',
    nodes: [{ x: 20, y: 30 }, { x: 140, y: 12 }, { x: 260, y: 44 }, { x: 380, y: 16 }, { x: 500, y: 40 }, { x: 580, y: 22 }],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
};

/**
 * Ambient background texture, not a logo — a looser network of nodes and curved connector
 * lines echoing the OctopusMark's "one brain, many limbs" idea without repeating the mark
 * itself. Used behind the hero, as a subtle PageHeader corner accent, and inside EmptyState.
 */
export function ConnectorMotif({ variant = 'panel', animated = false, opacity = 1 }: ConnectorMotifProps) {
  const gradId = useId();
  const { viewBox, nodes, edges } = POINTS[variant];
  const pulseNodes = animated ? new Set([0, Math.floor(nodes.length / 2), nodes.length - 1]) : new Set<number>();

  return (
    <Box
      component="svg"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      sx={{ display: 'block', width: '100%', height: '100%', opacity, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#17B6C4" />
          <stop offset="55%" stopColor="#3E6FFA" />
          <stop offset="100%" stopColor="#5EEAD4" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2 - 12;
        return (
          <path
            key={i}
            d={`M ${na.x} ${na.y} Q ${mx} ${my}, ${nb.x} ${nb.y}`}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.55}
          />
        );
      })}
      {nodes.map((n, i) => {
        const pulseIndex = animated ? Array.from(pulseNodes).indexOf(i) : -1;
        return (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={pulseNodes.has(i) ? 4 : 2.75}
            fill={`url(#${gradId})`}
            className={pulseIndex >= 0 ? 'connector-motif-pulse' : undefined}
            style={pulseIndex >= 0 ? { animationDelay: `${pulseIndex}s` } : undefined}
          />
        );
      })}
      {animated && (
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .connector-motif-pulse {
              animation: connector-motif-pulse 3.2s ease-in-out infinite;
              transform-origin: center;
              transform-box: fill-box;
            }
          }
          @keyframes connector-motif-pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.35); }
          }
        `}</style>
      )}
    </Box>
  );
}
