import { useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import type { EvidenceKind } from '../../types/domain';
import { useAppData } from '../../context/AppDataContext';

function inferKind(file: File): EvidenceKind {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('text')) return 'document';
  return 'other';
}

const parseTags = (raw: string) => raw.split(',').map((t) => t.trim()).filter(Boolean);

export function EvidenceUploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addEvidenceFile, addEvidenceNote } = useAppData();
  const [tab, setTab] = useState<'file' | 'note'>('file');

  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<EvidenceKind>('document');
  const [fileTags, setFileTags] = useState('');
  const [fileNotes, setFileNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteTags, setNoteTags] = useState('');

  const reset = () => {
    setFile(null);
    setFileTags('');
    setFileNotes('');
    setNoteTitle('');
    setNoteBody('');
    setNoteTags('');
    setTab('file');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFilePick = (f: File | null) => {
    setFile(f);
    if (f) setKind(inferKind(f));
  };

  const canSubmitFile = file !== null;
  const canSubmitNote = noteTitle.trim().length > 0 && noteBody.trim().length > 0;

  const handleSubmit = async () => {
    if (tab === 'file' && file) {
      await addEvidenceFile(file, kind, { tags: parseTags(fileTags), notes: fileNotes || undefined });
    } else if (tab === 'note' && canSubmitNote) {
      addEvidenceNote(noteTitle.trim(), noteBody.trim(), parseTags(noteTags));
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add evidence</DialogTitle>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3 }}>
        <Tab value="file" label="Upload file" />
        <Tab value="note" label="Interview note" />
      </Tabs>
      <DialogContent>
        {tab === 'file' ? (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
              />
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? file.name : 'Choose file'}
              </Button>
            </Box>
            <ToggleButtonGroup
              value={kind}
              exclusive
              size="small"
              onChange={(_, v) => v && setKind(v)}
            >
              <ToggleButton value="document">Document</ToggleButton>
              <ToggleButton value="image">Image</ToggleButton>
              <ToggleButton value="other">Other</ToggleButton>
            </ToggleButtonGroup>
            <TextField label="Tags (comma separated)" value={fileTags} onChange={(e) => setFileTags(e.target.value)} fullWidth size="small" />
            <TextField label="Notes (optional)" value={fileNotes} onChange={(e) => setFileNotes(e.target.value)} fullWidth multiline minRows={2} size="small" />
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} fullWidth size="small" autoFocus />
            <TextField
              label="Notes"
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              fullWidth
              multiline
              minRows={6}
              placeholder="Paste or type interview notes, observations, or transcript excerpts..."
            />
            <TextField label="Tags (comma separated)" value={noteTags} onChange={(e) => setNoteTags(e.target.value)} fullWidth size="small" />
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={tab === 'file' ? !canSubmitFile : !canSubmitNote}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
