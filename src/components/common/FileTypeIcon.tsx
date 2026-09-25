import DescriptionIcon from '@mui/icons-material/Description';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { EvidenceKind } from '../../types/domain';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export function FileTypeIcon({ kind, ...props }: { kind: EvidenceKind } & SvgIconProps) {
  switch (kind) {
    case 'document':
      return <DescriptionIcon {...props} />;
    case 'interview-note':
      return <MicIcon {...props} />;
    case 'image':
      return <ImageIcon {...props} />;
    default:
      return <InsertDriveFileIcon {...props} />;
  }
}
