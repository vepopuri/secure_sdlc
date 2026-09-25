import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import type { Control, Evidence, MaturityValue, Observation } from '../../types/domain';
import { MATURITY_LEVELS } from '../../types/domain';
import { RatingBadge } from '../common/RatingBadge';
import { FileTypeIcon } from '../common/FileTypeIcon';

export function ControlDetailPanel({
  functionName,
  control,
  observation,
  evidence,
  onChange,
}: {
  functionName: string;
  control: Control;
  observation: Observation | undefined;
  evidence: Evidence[];
  onChange: (patch: Partial<Pick<Observation, 'rating' | 'notes' | 'evidenceIds'>>) => void;
}) {
  const [notes, setNotes] = useState(observation?.notes ?? '');

  useEffect(() => {
    setNotes(observation?.notes ?? '');
  }, [control.id, observation?.notes]);

  const selectedEvidence = evidence.filter((e) => observation?.evidenceIds.includes(e.id));

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="overline" color="text.secondary">
        {functionName} · {control.code}
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 0.5 }}>
        <Typography variant="h6" fontWeight={700} sx={{ pr: 2 }}>
          {control.name}
        </Typography>
        <RatingBadge rating={observation?.rating ?? null} />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {control.description}
      </Typography>
      {control.guidance && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
          {control.guidance}
        </Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Maturity rating
      </Typography>
      <ToggleButtonGroup
        value={observation?.rating ?? null}
        exclusive
        onChange={(_, v: MaturityValue | null) => onChange({ rating: v })}
        size="small"
        sx={{ flexWrap: 'wrap' }}
      >
        {MATURITY_LEVELS.map((l) => (
          <ToggleButton key={l.value} value={l.value}>
            {l.value} · {l.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Observation notes
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        placeholder="Record what was observed, who was interviewed, and how this conclusion was reached..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => onChange({ notes })}
      />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Linked evidence
      </Typography>
      <Autocomplete
        multiple
        options={evidence}
        value={selectedEvidence}
        getOptionLabel={(e) => e.title}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        onChange={(_, values) => onChange({ evidenceIds: values.map((v) => v.id) })}
        renderTags={(values, getTagProps) =>
          values.map((option, index) => {
            const { key, ...rest } = getTagProps({ index });
            return <Chip key={key} icon={<FileTypeIcon kind={option.kind} fontSize="small" />} label={option.title} size="small" {...rest} />;
          })
        }
        renderInput={(params) => (
          <TextField {...params} placeholder={evidence.length ? 'Link supporting evidence' : 'No evidence ingested yet'} />
        )}
        disabled={evidence.length === 0}
      />
    </Paper>
  );
}
