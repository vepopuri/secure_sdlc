import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { KgEntity } from '../../types/domain';

const DOMAIN_COLORS: Record<string, string> = {
  codebase: '#00A3E0',
  requirements: '#86BC25',
  architecture: '#6B9A1D',
  security_compliance: '#C4262E',
  technical_debt: '#B98900',
  incidents_bugs: '#C4262E',
  deployments: '#00A3E0',
  tests_quality: '#86BC25',
  team_people: '#54534F',
};

function colorFor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? '#7A7A76';
}

interface EntityGraphViewProps {
  center: KgEntity;
  neighbors: KgEntity[];
  onSelect: (id: string) => void;
  highlightImpactPath?: boolean;
}

export function EntityGraphView({ center, neighbors, onSelect, highlightImpactPath }: EntityGraphViewProps) {
  const shown = neighbors.slice(0, 10);
  const cx = 300;
  const cy = 220;
  const r = 160;

  const nodes = shown.map((n, i) => {
    const angle = (i / shown.length) * Math.PI * 2 - Math.PI / 2;
    return { entity: n, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box
        component="svg"
        viewBox="0 0 600 440"
        sx={{ width: '100%', minWidth: 480, height: 380, display: 'block' }}
        role="img"
        aria-label={`Relationship graph centered on ${center.name}`}
      >
        {nodes.map((n) => (
          <line
            key={`edge-${n.entity.id}`}
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke={highlightImpactPath ? colorFor(n.entity.domain) : '#D8D7D3'}
            strokeWidth={highlightImpactPath ? 2.5 : 1.5}
            opacity={highlightImpactPath ? 0.9 : 0.6}
          />
        ))}
        <circle cx={cx} cy={cy} r={34} fill="#282728" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="#fff" fontWeight={700}>
          {center.name.length > 16 ? `${center.name.slice(0, 14)}…` : center.name}
        </text>
        {nodes.map((n) => (
          <g key={n.entity.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(n.entity.id)}>
            <circle cx={n.x} cy={n.y} r={24} fill={colorFor(n.entity.domain)} opacity={0.9} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight={600}>
              {n.entity.name.length > 14 ? `${n.entity.name.slice(0, 12)}…` : n.entity.name}
            </text>
          </g>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        Showing {nodes.length} of {neighbors.length} direct relationships. Click a node to recenter the graph.
      </Typography>
    </Box>
  );
}
