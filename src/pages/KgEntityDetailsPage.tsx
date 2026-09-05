import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { KG_DOMAINS } from '../data/knowledgeGraph';
import { projects } from '../data/orgs';
import { knowledgeGraphService } from '../services';
import type { KgEntity } from '../types/domain';

interface EntityFormState {
  name: string;
  domain: KgEntity['domain'];
  entityType: string;
  summary: string;
  sourceSystem: string;
  owner: string;
  projectId: string;
  provenance: string;
}

function toForm(entity: KgEntity): EntityFormState {
  return {
    name: entity.name,
    domain: entity.domain,
    entityType: entity.entityType,
    summary: entity.summary,
    sourceSystem: entity.sourceSystem,
    owner: entity.owner,
    projectId: entity.projectId,
    provenance: entity.provenance,
  };
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function KgEntityDetailsPage() {
  const { entityId } = useParams();
  const navigate = useNavigate();

  const [allEntities, setAllEntities] = useState<KgEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EntityFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [relTargetId, setRelTargetId] = useState('');
  const [relType, setRelType] = useState('');
  const [addingRelationship, setAddingRelationship] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setEditing(false);
    knowledgeGraphService.search({}).then((result) => {
      if (!cancelled) {
        setAllEntities(result);
        const found = result.find((e) => e.id === entityId);
        setForm(found ? toForm(found) : null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [entityId]);

  const entity = entityId ? allEntities.find((e) => e.id === entityId) : undefined;

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
      </Box>
    );
  }

  if (!entity || !form) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/knowledge-graph')} sx={{ mb: 2 }}>
          Back to Knowledge Graph
        </Button>
        <EmptyState title="Entity not found" description="It may have been removed from the demo dataset." />
      </Box>
    );
  }

  const domainLabel = KG_DOMAINS.find((d) => d.id === entity.domain)?.label ?? entity.domain;
  const relationshipTargetOptions = allEntities.filter((e) => e.id !== entity.id);

  function updateField<K extends keyof EntityFormState>(key: K, value: EntityFormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    const updated = await knowledgeGraphService.updateEntity(entity!.id, form);
    setSaving(false);
    if (updated) {
      setAllEntities((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEditing(false);
    }
  }

  async function handleAddRelationship() {
    if (!relTargetId || !relType.trim()) return;
    setAddingRelationship(true);
    const target = allEntities.find((e) => e.id === relTargetId);
    if (target) {
      await knowledgeGraphService.addRelationship(entity!.id, {
        type: relType.trim(),
        targetEntityId: target.id,
        targetEntityName: target.name,
        targetDomain: target.domain,
      });
      // Refetch (rather than patch locally) so the reciprocal relationship written
      // onto the *target* entity is reflected too, not just the one being edited.
      const refreshed = await knowledgeGraphService.search({});
      setAllEntities(refreshed);
    }
    setAddingRelationship(false);
    setRelTargetId('');
    setRelType('');
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/knowledge-graph')} sx={{ mb: 1 }}>
        Back to Knowledge Graph
      </Button>
      <PageHeader
        title={entity.name}
        description={entity.summary}
        breadcrumbs={['Knowledge Graph', entity.name]}
        actions={
          !editing && (
            <IconButton onClick={() => setEditing(true)} aria-label="Edit entity">
              <EditIcon />
            </IconButton>
          )
        }
      />

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
        {!editing && (
          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
            <Chip size="small" label={domainLabel} color="secondary" variant="outlined" />
            <Chip size="small" label={entity.entityType} variant="outlined" />
          </Stack>
        )}

        {editing ? (
          <Box>
            <Grid container spacing={1.5}>
              <Grid size={12}>
                <TextField fullWidth size="small" label="Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Domain</InputLabel>
                  <Select label="Domain" value={form.domain} onChange={(e) => updateField('domain', e.target.value as KgEntity['domain'])}>
                    {KG_DOMAINS.map((d) => (
                      <MenuItem key={d.id} value={d.id}>{d.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <TextField fullWidth size="small" label="Entity type" value={form.entityType} onChange={(e) => updateField('entityType', e.target.value)} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth size="small" multiline minRows={2} label="Summary" value={form.summary} onChange={(e) => updateField('summary', e.target.value)} />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth size="small" label="Owner" value={form.owner} onChange={(e) => updateField('owner', e.target.value)} />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Project</InputLabel>
                  <Select label="Project" value={form.projectId} onChange={(e) => updateField('projectId', e.target.value)}>
                    {projects.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField fullWidth size="small" label="Source system" value={form.sourceSystem} onChange={(e) => updateField('sourceSystem', e.target.value)} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth size="small" multiline minRows={2} label="Provenance" value={form.provenance} onChange={(e) => updateField('provenance', e.target.value)} />
              </Grid>
            </Grid>
            <Stack direction="row" gap={1} sx={{ mt: 2 }}>
              <Button variant="contained" size="small" disabled={saving || !form.name.trim()} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setForm(toForm(entity));
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Stack direction="row" gap={3} flexWrap="wrap">
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Owner
              </Typography>
              <Typography variant="body2">{entity.owner}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Source system
              </Typography>
              <Typography variant="body2">{entity.sourceSystem}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Last updated
              </Typography>
              <Typography variant="body2">{new Date(entity.lastUpdated).toLocaleString()}</Typography>
            </Box>
            <Box sx={{ minWidth: 160 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Confidence score
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Box sx={{ flexGrow: 1, maxWidth: 120 }}>
                  <LinearProgress variant="determinate" value={entity.confidenceScore * 100} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Typography variant="body2">{Math.round(entity.confidenceScore * 100)}%</Typography>
              </Stack>
            </Box>
          </Stack>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
            <DetailSection title="Provenance">
              <Typography variant="body2" color="text.secondary">
                {entity.provenance}
              </Typography>
            </DetailSection>

            {entity.evidenceRefs.length > 0 && (
              <DetailSection title="Evidence">
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {entity.evidenceRefs.map((e) => (
                    <Chip key={e} size="small" label={e} sx={{ fontFamily: 'monospace' }} />
                  ))}
                </Stack>
              </DetailSection>
            )}

            {entity.relatedAgentActivity.length > 0 && (
              <DetailSection title="Related agent activity">
                <Stack gap={0.5}>
                  {entity.relatedAgentActivity.map((a) => (
                    <Typography key={a} variant="body2" color="text.secondary">
                      • {a}
                    </Typography>
                  ))}
                </Stack>
              </DetailSection>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
            <DetailSection title={`Related entities (${entity.relationships.length})`}>
              {entity.relationships.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recorded relationships.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {entity.relationships.map((rel) => (
                    <ListItemButton key={rel.id} onClick={() => navigate(`/knowledge-graph/${rel.targetEntityId}`)} sx={{ borderRadius: 1 }}>
                      <ListItemText
                        primary={rel.targetEntityName}
                        secondary={`${rel.type.replace(/_/g, ' ')} · ${KG_DOMAINS.find((d) => d.id === rel.targetDomain)?.label ?? rel.targetDomain}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                <FormControl size="small" sx={{ minWidth: 180, flexGrow: 1 }}>
                  <InputLabel>Target entity</InputLabel>
                  <Select label="Target entity" value={relTargetId} onChange={(e) => setRelTargetId(e.target.value)}>
                    {relationshipTargetOptions.map((e) => (
                      <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Relationship type"
                  placeholder="e.g. implements"
                  value={relType}
                  onChange={(e) => setRelType(e.target.value)}
                  sx={{ minWidth: 160 }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!relTargetId || !relType.trim() || addingRelationship}
                  onClick={handleAddRelationship}
                >
                  Add
                </Button>
              </Stack>
            </DetailSection>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
