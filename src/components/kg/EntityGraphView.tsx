import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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

const BASE_VIEW_BOX = { x: 0, y: 0, w: 600, h: 440 };
const MIN_WIDTH = 220;
const MAX_WIDTH = 1400;
const DRAG_THRESHOLD_PX = 4;

type DragState =
  | { kind: 'pan'; startClientX: number; startClientY: number; startVb: { x: number; y: number } }
  | { kind: 'node'; id: string; startClientX: number; startClientY: number; startOffset: { x: number; y: number } };

export function EntityGraphView({ center, neighbors, onSelect, highlightImpactPath }: EntityGraphViewProps) {
  const shown = neighbors.slice(0, 10);
  const cx = 300;
  const cy = 220;
  const r = 160;

  const baseNodes = shown.map((n, i) => {
    const angle = (i / shown.length) * Math.PI * 2 - Math.PI / 2;
    return { entity: n, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const didDragRef = useRef(false);
  const [viewBox, setViewBox] = useState(BASE_VIEW_BOX);
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, { x: number; y: number }>>({});

  // Recentering on a different entity is a fresh view — drop any pan/zoom/drag
  // adjustments from the previous center rather than carrying them over.
  useEffect(() => {
    setViewBox(BASE_VIEW_BOX);
    setNodeOffsets({});
  }, [center.id]);

  // React attaches wheel listeners as passive by default, so e.preventDefault() inside
  // a React onWheel handler is a no-op (and logs a console error). Zooming needs to stop
  // the page from scrolling, so this listener is attached natively as non-passive instead.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.12 : 1 / 1.12;
      setViewBox((vb) => {
        const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, vb.w * factor));
        const newH = newW * (BASE_VIEW_BOX.h / BASE_VIEW_BOX.w);
        const centerX = vb.x + vb.w / 2;
        const centerY = vb.y + vb.h / 2;
        return { x: centerX - newW / 2, y: centerY - newH / 2, w: newW, h: newH };
      });
    }
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  function clientPxToSvgUnits(): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 1;
    return viewBox.w / rect.width;
  }

  function handleBackgroundPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    didDragRef.current = false;
    dragRef.current = { kind: 'pan', startClientX: e.clientX, startClientY: e.clientY, startVb: { x: viewBox.x, y: viewBox.y } };
    svgRef.current?.setPointerCapture(e.pointerId);
  }

  function handleNodePointerDown(e: React.PointerEvent<SVGGElement>, id: string) {
    e.stopPropagation();
    didDragRef.current = false;
    const startOffset = nodeOffsets[id] ?? { x: 0, y: 0 };
    dragRef.current = { kind: 'node', id, startClientX: e.clientX, startClientY: e.clientY, startOffset };
    svgRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dxClient = e.clientX - drag.startClientX;
    const dyClient = e.clientY - drag.startClientY;
    if (Math.abs(dxClient) > DRAG_THRESHOLD_PX || Math.abs(dyClient) > DRAG_THRESHOLD_PX) {
      didDragRef.current = true;
    }
    const scale = clientPxToSvgUnits();
    const dx = dxClient * scale;
    const dy = dyClient * scale;
    if (drag.kind === 'pan') {
      setViewBox((vb) => ({ ...vb, x: drag.startVb.x - dx, y: drag.startVb.y - dy }));
    } else {
      setNodeOffsets((prev) => ({ ...prev, [drag.id]: { x: drag.startOffset.x + dx, y: drag.startOffset.y + dy } }));
    }
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function resetView() {
    setViewBox(BASE_VIEW_BOX);
    setNodeOffsets({});
  }

  function handleNodeClick(id: string) {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    onSelect(id);
  }

  const nodes = baseNodes.map((n) => {
    const offset = nodeOffsets[n.entity.id];
    return offset ? { ...n, x: n.x + offset.x, y: n.y + offset.y } : n;
  });

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box
        component="svg"
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        sx={{ width: '100%', minWidth: 480, height: 380, display: 'block', touchAction: 'none', cursor: 'grab', userSelect: 'none' }}
        role="img"
        aria-label={`Relationship graph centered on ${center.name}`}
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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
          <g
            key={n.entity.id}
            style={{ cursor: 'pointer' }}
            onPointerDown={(e) => handleNodePointerDown(e, n.entity.id)}
            onClick={() => handleNodeClick(n.entity.id)}
          >
            <circle cx={n.x} cy={n.y} r={24} fill={colorFor(n.entity.domain)} opacity={0.9} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight={600}>
              {n.entity.name.length > 14 ? `${n.entity.name.slice(0, 12)}…` : n.entity.name}
            </text>
          </g>
        ))}
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Showing {nodes.length} of {neighbors.length} direct relationships. Drag to pan, scroll to zoom, drag a node
          to reposition it, click a node to recenter.
        </Typography>
        <Button size="small" onClick={resetView}>
          Reset view
        </Button>
      </Stack>
    </Box>
  );
}
