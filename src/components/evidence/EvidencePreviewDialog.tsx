import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Evidence } from '../../types/domain';
import { evidenceService } from '../../services/evidenceService';

export function EvidencePreviewDialog({ evidence, onClose }: { evidence: Evidence | null; onClose: () => void }) {
  const [objectUrl, setObjectUrl] = useState<string | undefined>();

  useEffect(() => {
    let url: string | undefined;
    if (evidence?.hasBlob) {
      evidenceService.getObjectUrl(evidence.id).then((u) => {
        url = u;
        setObjectUrl(u);
      });
    } else {
      setObjectUrl(undefined);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [evidence]);

  return (
    <Dialog open={evidence !== null} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{evidence?.title}</DialogTitle>
      <DialogContent dividers>
        {evidence?.kind === 'image' && objectUrl && (
          <Box component="img" src={objectUrl} alt={evidence.title} sx={{ maxWidth: '100%', display: 'block', mx: 'auto', borderRadius: 1 }} />
        )}
        {evidence?.kind !== 'image' && evidence?.hasBlob && objectUrl && (
          <Button variant="outlined" href={objectUrl} download={evidence.fileName}>
            Download {evidence.fileName}
          </Button>
        )}
        {evidence?.notes && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: evidence.hasBlob ? 2 : 0 }}>
            {evidence.notes}
          </Typography>
        )}
        {evidence?.tags && evidence.tags.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Tags: {evidence.tags.join(', ')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
