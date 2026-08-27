import Chip from '@mui/material/Chip';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';

/** Consistent label used everywhere demo/mock data is shown, per the platform's UX principle of being explicit about demo vs. live data. */
export function DemoDataChip({ label = 'Demo data' }: { label?: string }) {
  return (
    <Chip
      icon={<ScienceOutlinedIcon fontSize="small" />}
      label={label}
      size="small"
      variant="outlined"
      sx={{ borderColor: 'secondary.main', color: 'secondary.main', fontWeight: 600 }}
    />
  );
}
