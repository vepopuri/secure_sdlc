import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useState } from 'react';
import type { Agent, Environment } from '../../types/domain';
import { RiskBadge, StatusBadge, ActionLevelBadge } from '../common/StatusBadge';
import { agents as allAgents } from '../../data/agents';
import { sdlcPhases } from '../../data/phases';
import { mcpConnectors } from '../../data/mcpConnectors';
import { agentService } from '../../services';
import { createLiveRemediationPR, type LiveRemediationResult } from '../../services/liveRemediationService';

interface AgentDetailsDrawerProps {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
  onChanged?: (agent: Agent) => void;
  canRunAgents: boolean;
  context: { projectId: string; environment: Environment };
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function AgentDetailsDrawer({ agent, open, onClose, onChanged, canRunAgents, context }: AgentDetailsDrawerProps) {
  const [busy, setBusy] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [liveBusy, setLiveBusy] = useState(false);
  const [liveResult, setLiveResult] = useState<LiveRemediationResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!agent) return null;

  const phaseNames = agent.phaseIds.map((id) => sdlcPhases.find((p) => p.id === id)?.name ?? id);
  const connectorNames = agent.requiredMcpConnectorIds.map((id) => mcpConnectors.find((c) => c.id === id)?.name ?? id);
  const relatedAgents = agent.relatedAgentIds.map((id) => allAgents.find((a) => a.id === id)).filter((a): a is Agent => Boolean(a));
  const impactsProduction = agent.canAffectProduction || agent.canModifyInfrastructure || agent.canChangeFeatureFlags;

  async function handleToggle(enabled: boolean) {
    setBusy(true);
    const updated = await agentService.setEnabled(agent!.id, enabled);
    setBusy(false);
    if (updated) onChanged?.(updated);
  }

  async function handleRun() {
    setBusy(true);
    setRunResult(null);
    const updated = await agentService.run(agent!.id, context);
    setBusy(false);
    if (updated) {
      onChanged?.(updated);
      setRunResult(updated.lastExecution?.summary ?? 'Run complete.');
    }
  }

  async function handleLiveRemediate() {
    setConfirmOpen(false);
    setLiveBusy(true);
    setLiveResult(null);
    const result = await createLiveRemediationPR();
    setLiveBusy(false);
    setLiveResult(result);
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box sx={{ width: { xs: '100vw', sm: 480 }, p: 3 }} role="dialog" aria-label={`${agent.name} details`}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Typography variant="h3">{agent.name}</Typography>
          <IconButton onClick={onClose} aria-label="Close details">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
          <StatusBadge status={agent.status} />
          <RiskBadge level={agent.riskLevel} />
          <ActionLevelBadge level={agent.approvalLevel} />
          <Chip size="small" variant="outlined" label={agent.category === 'core' ? 'Core SDLC agent' : 'Cross-cutting agent'} />
        </Stack>

        {impactsProduction && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This agent can {agent.canCreatePullRequests && 'create pull requests, '}
            {agent.canModifyInfrastructure && 'modify infrastructure, '}
            {agent.canChangeFeatureFlags && 'change feature flags, '}
            {agent.canAffectProduction && 'affect production, '}
            and always requires explicit human approval before acting.
          </Alert>
        )}

        <FormControlLabel
          sx={{ mb: 2 }}
          control={<Switch checked={agent.status === 'enabled'} disabled={busy || !canRunAgents} onChange={(e) => handleToggle(e.target.checked)} />}
          label={agent.status === 'enabled' ? 'Enabled for this workspace' : 'Disabled for this workspace'}
        />

        <DetailSection title="Purpose">
          <Typography variant="body2">{agent.purpose}</Typography>
        </DetailSection>

        <DetailSection title="Responsibilities">
          <List dense disablePadding>
            {agent.responsibilities.map((r) => (
              <ListItem key={r} disableGutters sx={{ display: 'list-item', listStyleType: 'disc', ml: 2, py: 0.25 }}>
                <ListItemText primary={r} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </DetailSection>

        <Stack direction="row" gap={3}>
          <DetailSection title="Inputs">
            <Typography variant="body2">{agent.inputs.join(', ')}</Typography>
          </DetailSection>
          <DetailSection title="Outputs">
            <Typography variant="body2">{agent.outputs.join(', ')}</Typography>
          </DetailSection>
        </Stack>

        <DetailSection title="SDLC phases">
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {phaseNames.map((n) => (
              <Chip key={n} size="small" label={n} variant="outlined" />
            ))}
          </Stack>
        </DetailSection>

        <DetailSection title="Allowed MCP tools">
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {agent.allowedMcpTools.map((t) => (
              <Chip key={t} size="small" label={t} sx={{ fontFamily: 'monospace' }} />
            ))}
          </Stack>
        </DetailSection>

        <DetailSection title="Required MCP connections">
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {connectorNames.map((n) => (
              <Chip key={n} size="small" label={n} variant="outlined" color="secondary" />
            ))}
          </Stack>
        </DetailSection>

        <Stack direction="row" gap={3}>
          <DetailSection title="Knowledge Graph entities read">
            <Typography variant="body2">{agent.kgEntitiesRead.join(', ') || 'None'}</Typography>
          </DetailSection>
          <DetailSection title="Knowledge Graph entities written">
            <Typography variant="body2">{agent.kgEntitiesWritten.join(', ') || 'None'}</Typography>
          </DetailSection>
        </Stack>

        <DetailSection title="Approval policy">
          <Typography variant="body2">
            {agent.approvalRequired
              ? `Requires human approval (${['Read-only', 'Reversible non-production write', 'Controlled change', 'High-impact or production action'][agent.approvalLevel]}) before the output is applied.`
              : 'Runs without human approval; outputs are still logged and auditable.'}
          </Typography>
        </DetailSection>

        <DetailSection title="Execution history">
          {agent.executionHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No executions recorded yet.
            </Typography>
          ) : (
            <List dense disablePadding>
              {agent.executionHistory.slice(0, 5).map((run) => (
                <ListItem key={run.id} disableGutters sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={`${new Date(run.timestamp).toLocaleString()} — ${run.summary}`}
                    secondary={`${run.durationSeconds}s · confidence ${Math.round(run.confidenceScore * 100)}%`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <StatusBadge status={run.status} />
                </ListItem>
              ))}
            </List>
          )}
        </DetailSection>

        {relatedAgents.length > 0 && (
          <DetailSection title="Related agents">
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {relatedAgents.map((r) => (
                <Chip key={r.id} size="small" label={r.name} variant="outlined" />
              ))}
            </Stack>
          </DetailSection>
        )}

        <Divider sx={{ my: 2 }} />

        <DetailSection title="Sample workflow">
          <Typography variant="body2" color="text.secondary">
            See this agent in context on the <strong>Workflows</strong> tab, where it participates in
            end-to-end demo runs alongside other agents.
          </Typography>
        </DetailSection>

        {runResult && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setRunResult(null)}>
            {runResult}
          </Alert>
        )}

        {canRunAgents && (
          <Button
            variant="contained"
            fullWidth
            disabled={agent.status === 'disabled' || busy}
            onClick={handleRun}
          >
            {busy ? 'Running…' : 'Run agent (demo mode)'}
          </Button>
        )}

        {agent.id === 'remediation_agent' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Alert severity="warning" icon={<GitHubIcon fontSize="inherit" />} sx={{ mb: 1.5 }}>
              <strong>Live integration.</strong> This is the one agent in this build wired to a real
              system — every other action in this app is simulated. The button below opens (or reuses)
              an actual draft pull request on <strong>vepopuri/secure_sdlc</strong> via the GitHub API.
            </Alert>
            {liveResult?.ok && (
              <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setLiveResult(null)}>
                {liveResult.reused ? 'Reused the existing pull request: ' : 'Opened a new pull request: '}
                <Link href={liveResult.prUrl} target="_blank" rel="noopener noreferrer">
                  {liveResult.prUrl}
                </Link>
              </Alert>
            )}
            {liveResult && !liveResult.ok && (
              <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setLiveResult(null)}>
                {liveResult.error}
              </Alert>
            )}
            {canRunAgents && (
              <Button
                variant="outlined"
                color="warning"
                fullWidth
                startIcon={<GitHubIcon />}
                disabled={liveBusy}
                onClick={() => setConfirmOpen(true)}
              >
                {liveBusy ? 'Opening real pull request…' : 'Open real remediation PR (live)'}
              </Button>
            )}
          </>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Open a real pull request?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This creates (or reuses) a real branch and opens a real draft pull request on{' '}
            <strong>vepopuri/secure_sdlc</strong> through GitHub's API. This is not a simulation — it is
            a genuine write action, visible to anyone with access to that repository.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleLiveRemediate}>
            Yes, open the real PR
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
