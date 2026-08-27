import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import type { KgEntity } from '../../types/domain';
import { KG_DOMAINS } from '../../data/knowledgeGraph';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function EntityDrawer({
  entity,
  open,
  onClose,
  onSelectRelated,
}: {
  entity: KgEntity | null;
  open: boolean;
  onClose: () => void;
  onSelectRelated: (id: string) => void;
}) {
  if (!entity) return null;
  const domainLabel = KG_DOMAINS.find((d) => d.id === entity.domain)?.label ?? entity.domain;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box sx={{ width: { xs: '100vw', sm: 460 }, p: 3 }} role="dialog" aria-label={`${entity.name} details`}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Typography variant="h3">{entity.name}</Typography>
          <IconButton onClick={onClose} aria-label="Close details">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip size="small" label={domainLabel} color="secondary" variant="outlined" />
          <Chip size="small" label={entity.entityType} variant="outlined" />
        </Stack>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {entity.summary}
        </Typography>

        <Stack direction="row" gap={3}>
          <Section title="Owner">
            <Typography variant="body2">{entity.owner}</Typography>
          </Section>
          <Section title="Source system">
            <Typography variant="body2">{entity.sourceSystem}</Typography>
          </Section>
        </Stack>

        <Section title="Confidence score">
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress variant="determinate" value={entity.confidenceScore * 100} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
            <Typography variant="body2">{Math.round(entity.confidenceScore * 100)}%</Typography>
          </Stack>
        </Section>

        <Section title="Last updated">
          <Typography variant="body2">{new Date(entity.lastUpdated).toLocaleString()}</Typography>
        </Section>

        <Section title="Provenance">
          <Typography variant="body2" color="text.secondary">
            {entity.provenance}
          </Typography>
        </Section>

        {entity.evidenceRefs.length > 0 && (
          <Section title="Evidence">
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {entity.evidenceRefs.map((e) => (
                <Chip key={e} size="small" label={e} sx={{ fontFamily: 'monospace' }} />
              ))}
            </Stack>
          </Section>
        )}

        {entity.relatedAgentActivity.length > 0 && (
          <Section title="Related agent activity">
            <Stack gap={0.5}>
              {entity.relatedAgentActivity.map((a) => (
                <Typography key={a} variant="body2" color="text.secondary">
                  • {a}
                </Typography>
              ))}
            </Stack>
          </Section>
        )}

        <Divider sx={{ my: 2 }} />

        <Section title={`Related entities (${entity.relationships.length})`}>
          {entity.relationships.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No recorded relationships.
            </Typography>
          ) : (
            <List dense disablePadding>
              {entity.relationships.map((rel) => (
                <ListItemButton key={rel.id} onClick={() => onSelectRelated(rel.targetEntityId)} sx={{ borderRadius: 1 }}>
                  <ListItemText
                    primary={rel.targetEntityName}
                    secondary={`${rel.type.replace(/_/g, ' ')} · ${KG_DOMAINS.find((d) => d.id === rel.targetDomain)?.label ?? rel.targetDomain}`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Section>
      </Box>
    </Drawer>
  );
}
