import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Evidence } from '../../types/domain';
import { FileTypeIcon } from '../common/FileTypeIcon';

const KIND_LABEL: Record<Evidence['kind'], string> = {
  document: 'Document',
  'interview-note': 'Interview note',
  image: 'Image',
  other: 'Other',
};

function formatSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EvidenceCard({ evidence, onOpen, onDelete }: { evidence: Evidence; onOpen: () => void; onDelete: () => void }) {
  return (
    <Card variant="outlined" sx={{ position: 'relative' }}>
      <CardActionArea onClick={onOpen}>
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <FileTypeIcon kind={evidence.kind} sx={{ color: 'primary.main', mt: 0.25 }} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {evidence.title}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                <Chip size="small" label={KIND_LABEL[evidence.kind]} variant="outlined" />
                {evidence.tags.map((t) => (
                  <Chip key={t} size="small" label={t} />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {new Date(evidence.addedAt).toLocaleDateString()} {evidence.sizeBytes ? `· ${formatSize(evidence.sizeBytes)}` : ''}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
      <IconButton
        size="small"
        aria-label="Delete evidence"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        sx={{ position: 'absolute', top: 6, right: 6 }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Card>
  );
}
