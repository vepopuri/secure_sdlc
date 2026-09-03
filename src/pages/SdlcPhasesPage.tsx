import { useState } from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { AgentCard } from '../components/agents/AgentCard';
import { AgentDetailsDrawer } from '../components/agents/AgentDetailsDrawer';
import { sdlcPhases } from '../data/phases';
import { agents as seedAgents } from '../data/agents';
import { useAppState } from '../context/AppStateContext';
import type { Agent } from '../types/domain';

const HEALTH_MAP: Record<string, string> = { on_track: 'on_track', needs_attention: 'needs_attention', blocked: 'blocked' };

export function SdlcPhasesPage() {
  const { role, projectId, environment } = useAppState();
  const [agents, setAgents] = useState(seedAgents);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [expanded, setExpanded] = useState<string | false>(sdlcPhases[0].id);

  const crossCuttingAgents = agents.filter((a) => a.category === 'cross_cutting');

  function handleAgentChanged(updated: Agent) {
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(updated);
  }

  return (
    <Box>
      <PageHeader
        title="SDLC Phases"
        description="Six phases organize the 24 core agents end to end. Expand a phase to see its agents and outputs."
      />

      {sdlcPhases.map((phase) => (
        <Accordion
          key={phase.id}
          expanded={expanded === phase.id}
          onChange={() => setExpanded(expanded === phase.id ? false : phase.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" gap={2} sx={{ width: '100%', pr: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ minWidth: 64 }}>
                Phase {phase.order}
              </Typography>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {phase.name}
              </Typography>
              <Chip size="small" label={`${phase.agentIds.length} agents`} variant="outlined" />
              <StatusBadge status={HEALTH_MAP[phase.healthStatus]} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {phase.shortDescription}
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {phase.agentIds.map((id) => {
                const agent = agents.find((a) => a.id === id);
                if (!agent) return null;
                return (
                  <Grid key={id} size={{ xs: 12, sm: 6, lg: 3 }}>
                    <AgentCard agent={agent} onViewDetails={setSelected} dense />
                  </Grid>
                );
              })}
            </Grid>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Primary outputs
            </Typography>
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {phase.outputs.map((o) => (
                <Chip key={o} size="small" label={o} variant="outlined" color="secondary" />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h2" gutterBottom>
          Cross-cutting agents
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          These {crossCuttingAgents.length} agents are not owned by a single phase — they operate across planning,
          development, testing, deployment, and maintenance to enforce security, governance, and resilience.
        </Alert>
        <Grid container spacing={2}>
          {crossCuttingAgents.map((agent) => (
            <Grid key={agent.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <AgentCard agent={agent} onViewDetails={setSelected} dense />
            </Grid>
          ))}
        </Grid>
      </Box>

      <AgentDetailsDrawer
        agent={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onChanged={handleAgentChanged}
        canRunAgents={role.canRunAgents}
        context={{ projectId, environment }}
      />
    </Box>
  );
}
