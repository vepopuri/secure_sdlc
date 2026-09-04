import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
import { kgEntities } from '../../data/knowledgeGraph';

/**
 * Renders stored evidence/artifact references. Where an artifact is actually indexed by a
 * Knowledge Graph entity (matched by the same evidenceRefs string), the chip is a real link to
 * that entity's record — otherwise it's a plain, non-clickable reference. No fake links.
 */
export function EvidenceChips({ refs }: { refs: string[] }) {
  const navigate = useNavigate();
  if (refs.length === 0) return null;
  return (
    <Stack direction="row" gap={0.5} flexWrap="wrap">
      {refs.map((ref) => {
        const entity = kgEntities.find((e) => e.evidenceRefs.includes(ref));
        return entity ? (
          <Chip
            key={ref}
            size="small"
            icon={<LaunchIcon fontSize="small" />}
            label={ref}
            clickable
            onClick={() => navigate(`/knowledge-graph?entity=${entity.id}`)}
            sx={{ fontFamily: 'monospace' }}
          />
        ) : (
          <Chip key={ref} size="small" variant="outlined" label={ref} sx={{ fontFamily: 'monospace' }} />
        );
      })}
    </Stack>
  );
}
