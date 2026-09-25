import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { useAppData } from '../context/AppDataContext';
import { EvidenceUploadDialog } from '../components/evidence/EvidenceUploadDialog';
import { EvidenceCard } from '../components/evidence/EvidenceCard';
import { EvidencePreviewDialog } from '../components/evidence/EvidencePreviewDialog';
import { EmptyState } from '../components/common/EmptyState';
import type { Evidence } from '../types/domain';

export default function EvidencePage() {
  const { evidence, removeEvidence } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preview, setPreview] = useState<Evidence | null>(null);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Evidence Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingest documentation, interview notes, screenshots, and other supporting files, then link them to controls during assessment.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add evidence
        </Button>
      </Stack>

      {evidence.length === 0 ? (
        <EmptyState
          icon={<FolderCopyIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
          title="No evidence yet"
          subtitle="Upload a policy document, a screenshot, or type up interview notes to get started."
          action={
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Add evidence
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2}>
          {evidence.map((e) => (
            <Grid key={e.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <EvidenceCard evidence={e} onOpen={() => setPreview(e)} onDelete={() => removeEvidence(e.id)} />
            </Grid>
          ))}
        </Grid>
      )}

      <EvidenceUploadDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <EvidencePreviewDialog evidence={preview} onClose={() => setPreview(null)} />
    </Box>
  );
}
