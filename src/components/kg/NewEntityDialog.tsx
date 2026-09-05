import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import type { KgEntity } from '../../types/domain';
import { KG_DOMAINS } from '../../data/knowledgeGraph';
import { projects } from '../../data/orgs';
import { knowledgeGraphService } from '../../services';

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

export function NewEntityDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (entityId: string) => void }) {
  const [form, setForm] = useState<EntityFormState>(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(BLANK_FORM);
  }, [open]);

  function updateField<K extends keyof EntityFormState>(key: K, value: EntityFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate() {
    setSaving(true);
    const created = await knowledgeGraphService.createEntity({
      ...form,
      relationships: [],
      evidenceRefs: [],
      provenance: form.provenance,
      confidenceScore: 0.75,
      relatedAgentActivity: [],
    });
    setSaving(false);
    onCreated(created.id);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New entity</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1.5} sx={{ mt: 0.25 }}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={saving || !form.name.trim()} onClick={handleCreate}>
          {saving ? 'Creating…' : 'Create entity'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
