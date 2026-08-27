import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { EntityDrawer } from '../components/kg/EntityDrawer';
import { EntityGraphView } from '../components/kg/EntityGraphView';
import { KG_DOMAINS, kgEntities, getEntityById } from '../data/knowledgeGraph';
import { projects } from '../data/orgs';
import type { KgDomain, KgEntity } from '../types/domain';

const RELATIONSHIP_TYPES = Array.from(new Set(kgEntities.flatMap((e) => e.relationships.map((r) => r.type)))).sort();

const TIME_RANGES = [
  { id: 'all', label: 'All time', days: Infinity },
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '90d', label: 'Last 90 days', days: 90 },
];

export function KnowledgeGraphPage() {
  const [search, setSearch] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<KgDomain[]>([]);
  const [projectId, setProjectId] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [relationshipType, setRelationshipType] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [graphView, setGraphView] = useState(false);
  const [impactHighlighted, setImpactHighlighted] = useState(false);

  const results = useMemo(() => {
    let items = kgEntities;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((e) => `${e.name} ${e.summary} ${e.entityType}`.toLowerCase().includes(q));
    }
    if (selectedDomains.length > 0) items = items.filter((e) => selectedDomains.includes(e.domain));
    if (projectId !== 'all') items = items.filter((e) => e.projectId === projectId);
    if (relationshipType !== 'all') items = items.filter((e) => e.relationships.some((r) => r.type === relationshipType));
    if (timeRange !== 'all') {
      const range = TIME_RANGES.find((t) => t.id === timeRange)!;
      const cutoff = Date.now() - range.days * 86400000;
      items = items.filter((e) => new Date(e.lastUpdated).getTime() >= cutoff);
    }
    return items;
  }, [search, selectedDomains, projectId, relationshipType, timeRange]);

  const selectedEntity = selectedId ? getEntityById(selectedId) : null;
  const neighborhood = useMemo(() => {
    if (!selectedEntity) return null;
    const neighbors = selectedEntity.relationships
      .map((r) => getEntityById(r.targetEntityId))
      .filter((e): e is KgEntity => Boolean(e));
    return { center: selectedEntity, neighbors };
  }, [selectedEntity]);

  useEffect(() => {
    if (!selectedId) {
      setGraphView(false);
      setImpactHighlighted(false);
    }
  }, [selectedId]);

  function toggleDomain(domain: KgDomain) {
    setSelectedDomains((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]));
  }

  function openEntity(id: string) {
    setSelectedId(id);
    setDrawerOpen(true);
  }

  return (
    <Box>
      <PageHeader
        title="Knowledge Graph"
        description="Search entities across 19 domains and follow their relationships. Start simple, then expand into a graph view only when you need it."
      />

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search entities (e.g. “authentication module”)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Project</InputLabel>
              <Select label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <MenuItem value="all">All projects</MenuItem>
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Environment</InputLabel>
              <Select label="Environment" value="all" disabled>
                <MenuItem value="all">All environments</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Time range</InputLabel>
              <Select label="Time range" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                {TIME_RANGES.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Relationship type</InputLabel>
              <Select label="Relationship type" value={relationshipType} onChange={(e) => setRelationshipType(e.target.value)}>
                <MenuItem value="all">All relationship types</MenuItem>
                {RELATIONSHIP_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          Entity domains
        </Typography>
        <Stack direction="row" gap={0.75} flexWrap="wrap">
          {KG_DOMAINS.map((d) => (
            <Chip
              key={d.id}
              label={d.label}
              size="small"
              onClick={() => toggleDomain(d.id)}
              color={selectedDomains.includes(d.id) ? 'primary' : 'default'}
              variant={selectedDomains.includes(d.id) ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Paper>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {results.length} entities
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ShareIcon />}
          disabled={!selectedId}
          onClick={() => {
            setGraphView(true);
            setImpactHighlighted(true);
          }}
        >
          Show impact path
        </Button>
      </Stack>

      {results.length === 0 ? (
        <EmptyState title="No entities match these filters" description="Try a different search term or clear a domain filter." />
      ) : (
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {results.map((entity) => (
            <Grid key={entity.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card variant={selectedId === entity.id ? 'elevation' : 'outlined'} sx={selectedId === entity.id ? { borderColor: 'primary.main', borderWidth: 2, border: '2px solid', boxShadow: 'none' } : undefined}>
                <CardActionArea onClick={() => openEntity(entity.id)} sx={{ p: 1.5 }}>
                  <CardContent sx={{ p: '4px !important' }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2">{entity.name}</Typography>
                      <Chip size="small" label={entity.entityType} variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 0.5 }}>
                      {entity.summary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Owner: {entity.owner} · Updated {new Date(entity.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {neighborhood && (
        <Paper sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="h3">Relationships for {neighborhood.center.name}</Typography>
            <ToggleButtonGroup size="small" exclusive value={graphView ? 'graph' : 'list'} onChange={(_, v) => v && setGraphView(v === 'graph')}>
              <ToggleButton value="list">Simple list</ToggleButton>
              <ToggleButton value="graph">Graph view</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {impactHighlighted && (
            <Alert severity="info" sx={{ mb: 2 }} onClose={() => setImpactHighlighted(false)}>
              Highlighting entities that could be impacted by a change to {neighborhood.center.name}.
            </Alert>
          )}
          {graphView ? (
            <EntityGraphView center={neighborhood.center} neighbors={neighborhood.neighbors} onSelect={openEntity} highlightImpactPath={impactHighlighted} />
          ) : (
            <Grid container spacing={1}>
              {neighborhood.neighbors.map((n) => (
                <Grid key={n.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Chip
                    label={`${n.name} — ${KG_DOMAINS.find((d) => d.id === n.domain)?.label}`}
                    onClick={() => openEntity(n.id)}
                    variant="outlined"
                    sx={{ width: '100%', justifyContent: 'flex-start' }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      <EntityDrawer entity={selectedEntity ?? null} open={drawerOpen} onClose={() => setDrawerOpen(false)} onSelectRelated={openEntity} />
    </Box>
  );
}
