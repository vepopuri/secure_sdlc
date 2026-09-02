import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import type { KgEntity } from '../../types/domain';
import { KG_DOMAINS } from '../../data/knowledgeGraph';
import { projects } from '../../data/orgs';
import { knowledgeGraphService } from '../../services';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

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

const BLANK_FORM: EntityFormState = {
  name: '',
  domain: KG_DOMAINS[0].id,
  entityType: '',
  summary: '',
  sourceSystem: 'Manually entered (demo)',
  owner: '',
  projectId: projects[0].id,
  provenance: 'Manually entered through the Knowledge Graph tab (demo mode).',
};

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

export function EntityDrawer({
  entity,
  mode = 'view',
  open,
  onClose,
  onSelectRelated,
  onChanged,
  allEntities,
}: {
  entity: KgEntity | null;
  mode?: 'view' | 'create';
  open: boolean;
  onClose: () => void;
  onSelectRelated: (id: string) => void;
  onChanged: (entityId: string) => void;
  allEntities: KgEntity[];
}) {
  const [editing, setEditing] = useState(mode === 'create');
  const [form, setForm] = useState<EntityFormState>(entity ? toForm(entity) : BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [relTargetId, setRelTargetId] = useState('');
  const [relType, setRelType] = useState('');
  const [addingRelationship, setAddingRelationship] = useState(false);

  useEffect(() => {
    setEditing(mode === 'create');
    setForm(entity ? toForm(entity) : BLANK_FORM);
    setRelTargetId('');
    setRelType('');
  }, [entity, mode, open]);

  if (mode === 'view' && !entity) return null;

  const domainLabel = entity ? KG_DOMAINS.find((d) => d.id === entity.domain)?.label ?? entity.domain : '';

  function updateField<K extends keyof EntityFormState>(key: K, value: EntityFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    if (mode === 'create') {
      const created = await knowledgeGraphService.createEntity({
        ...form,
        relationships: [],
        evidenceRefs: [],
        provenance: form.provenance,
        confidenceScore: 0.75,
        relatedAgentActivity: [],
      });
      setSaving(false);
      onChanged(created.id);
      onClose();
    } else if (entity) {
      const updated = await knowledgeGraphService.updateEntity(entity.id, form);
      setSaving(false);
      if (updated) {
        onChanged(updated.id);
        setEditing(false);
      }
    }
  }

  async function handleAddRelationship() {
    if (!entity || !relTargetId || !relType.trim()) return;
    setAddingRelationship(true);
    const target = allEntities.find((e) => e.id === relTargetId);
    if (target) {
      const updated = await knowledgeGraphService.addRelationship(entity.id, {
        type: relType.trim(),
        targetEntityId: target.id,
        targetEntityName: target.name,
        targetDomain: target.domain,
      });
      if (updated) onChanged(updated.id);
    }
    setAddingRelationship(false);
    setRelTargetId('');
    setRelType('');
  }

  const relationshipTargetOptions = allEntities.filter((e) => e.id !== entity?.id);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box sx={{ width: { xs: '100vw', sm: 460 }, p: 3 }} role="dialog" aria-label={entity ? `${entity.name} details` : 'New Knowledge Graph entity'}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Typography variant="h3">{mode === 'create' ? 'New entity' : entity!.name}</Typography>
          <Stack direction="row" gap={0.5}>
            {mode === 'view' && !editing && (
              <IconButton onClick={() => setEditing(true)} aria-label="Edit entity">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={onClose} aria-label="Close details">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>

        {!editing && entity && (
          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
            <Chip size="small" label={domainLabel} color="secondary" variant="outlined" />
            <Chip size="small" label={entity.entityType} variant="outlined" />
          </Stack>
        )}

        {editing ? (
          <Box sx={{ mb: 2 }}>
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
                {saving ? 'Saving…' : mode === 'create' ? 'Create entity' : 'Save changes'}
              </Button>
              <Button
                size="small"
                onClick={() => {
                  if (mode === 'create') {
                    onClose();
                  } else {
                    setForm(entity ? toForm(entity) : BLANK_FORM);
                    setEditing(false);
                  }
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : entity ? (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {entity.summary}
            </Typography>

            <Stack direction="row" gap={3}>
              <Section title="Owner">
                <Typography variant="body2">{entity.owner}</Typography>
              </Section>
              <Section title="Source system">
                <Typography variant="body2">{entity.sourceSystem}</Typography>
              </Section>
            </Stack>

            <Section title="Confidence score">
              <Stack direction="row" alignItems="center" gap={1}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress variant="determinate" value={entity.confidenceScore * 100} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Typography variant="body2">{Math.round(entity.confidenceScore * 100)}%</Typography>
              </Stack>
            </Section>

            <Section title="Last updated">
              <Typography variant="body2">{new Date(entity.lastUpdated).toLocaleString()}</Typography>
            </Section>

            <Section title="Provenance">
              <Typography variant="body2" color="text.secondary">
                {entity.provenance}
              </Typography>
            </Section>

            {entity.evidenceRefs.length > 0 && (
              <Section title="Evidence">
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {entity.evidenceRefs.map((e) => (
                    <Chip key={e} size="small" label={e} sx={{ fontFamily: 'monospace' }} />
                  ))}
                </Stack>
              </Section>
            )}

            {entity.relatedAgentActivity.length > 0 && (
              <Section title="Related agent activity">
                <Stack gap={0.5}>
                  {entity.relatedAgentActivity.map((a) => (
                    <Typography key={a} variant="body2" color="text.secondary">
                      • {a}
                    </Typography>
                  ))}
                </Stack>
              </Section>
            )}

            <Divider sx={{ my: 2 }} />

            <Section title={`Related entities (${entity.relationships.length})`}>
              {entity.relationships.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recorded relationships.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {entity.relationships.map((rel) => (
                    <ListItemButton key={rel.id} onClick={() => onSelectRelated(rel.targetEntityId)} sx={{ borderRadius: 1 }}>
                      <ListItemText
                        primary={rel.targetEntityName}
                        secondary={`${rel.type.replace(/_/g, ' ')} · ${KG_DOMAINS.find((d) => d.id === rel.targetDomain)?.label ?? rel.targetDomain}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}

              <Stack direction="row" gap={1} sx={{ mt: 1.5 }} flexWrap="wrap" alignItems="center">
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
            </Section>
          </>
        ) : null}
      </Box>
    </Drawer>
  );
}
