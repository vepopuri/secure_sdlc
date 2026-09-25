import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/EditNote';
import type { Framework, Observation } from '../../types/domain';

const STATUS_ICON = {
  complete: <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />,
  'in-progress': <EditIcon fontSize="small" sx={{ color: 'warning.main' }} />,
  'not-started': <RadioButtonUncheckedIcon fontSize="small" sx={{ color: 'text.disabled' }} />,
};

export function FrameworkTree({
  framework,
  observations,
  selectedControlId,
  onSelectControl,
}: {
  framework: Framework;
  observations: Observation[];
  selectedControlId: string | null;
  onSelectControl: (controlId: string) => void;
}) {
  const byControl = new Map(observations.map((o) => [o.controlId, o]));

  return (
    <Box>
      {framework.functions.map((fn) => (
        <Accordion key={fn.id} defaultExpanded disableGutters variant="outlined" sx={{ mb: 1, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {fn.code === fn.name ? fn.name : `${fn.code} · ${fn.name}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fn.controls.length} controls
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List dense disablePadding>
              {fn.controls.map((c) => {
                const status = byControl.get(c.id)?.status ?? 'not-started';
                return (
                  <ListItemButton
                    key={c.id}
                    selected={selectedControlId === c.id}
                    onClick={() => onSelectControl(c.id)}
                    sx={{ pl: 2 }}
                  >
                    <Box sx={{ mr: 1.5, display: 'flex' }}>{STATUS_ICON[status]}</Box>
                    <ListItemText
                      primary={c.name}
                      secondary={c.code}
                      slotProps={{ primary: { variant: 'body2', noWrap: true } }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
