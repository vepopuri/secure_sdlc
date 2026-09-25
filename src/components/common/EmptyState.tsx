import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export function EmptyState({ icon, title, subtitle, action }: { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: 8,
        px: 3,
        color: 'text.secondary',
      }}
    >
      {icon}
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      {action}
    </Box>
  );
}
