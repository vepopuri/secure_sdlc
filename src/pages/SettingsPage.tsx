import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge, ActionLevelBadge } from '../components/common/StatusBadge';
import { settingsService, type PlatformSettings, agentService } from '../services';
import { teams, projects } from '../data/orgs';
import { roles } from '../data/roles';
import { agents as seedAgents } from '../data/agents';
import { mcpConnectors as seedConnectors } from '../data/mcpConnectors';
import { useAppState } from '../context/AppStateContext';
import type { Agent, Environment, McpConnector } from '../types/domain';

function Section({ id, title, children, defaultExpanded }: { id: string; title: string; children: React.ReactNode; defaultExpanded?: boolean }) {
  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{ mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${id}-header`}>
        <Typography variant="h4">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

export function SettingsPage() {
  const { role } = useAppState();
  const readOnly = !role.canConfigureIntegrations;
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [agentList, setAgentList] = useState<Agent[]>(seedAgents);
  const [connectorList] = useState<McpConnector[]>(seedConnectors);

  useEffect(() => {
    settingsService.get().then(setSettings);
  }, []);

  function patch(update: Partial<PlatformSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...update } : prev));
    settingsService.update(update);
  }

  async function toggleAgent(id: string, enabled: boolean) {
    const updated = await agentService.setEnabled(id, enabled);
    if (updated) setAgentList((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  if (!settings) return null;

  return (
    <Box>
      <PageHeader title="Settings" description="Workspace configuration. Structured today for demo behavior; ready to bind to a real backend." showDemoChip />

      {readOnly && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your role ({role.name}) has read-only access to settings.
        </Alert>
      )}

      <Section id="workspace" title="Workspace settings" defaultExpanded>
        <Grid container spacing={2} maxWidth={640}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Workspace name" value={settings.workspaceName} disabled={readOnly} onChange={(e) => patch({ workspaceName: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Organization name" value={settings.organizationName} disabled={readOnly} onChange={(e) => patch({ organizationName: e.target.value })} />
          </Grid>
        </Grid>
      </Section>

      <Section id="teams" title="Team management">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Projects</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.memberCount}</TableCell>
                  <TableCell>{t.projectIds.map((id) => projects.find((p) => p.id === id)?.name).join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section id="projects" title="Project management">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Repository</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Environments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{p.repository}</TableCell>
                  <TableCell>{teams.find((t) => t.id === p.teamId)?.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5}>
                      {p.environment.map((e) => <Chip key={e} size="small" label={e} variant="outlined" />)}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section id="agent-subs" title={`Agent subscriptions (${agentList.filter((a) => a.status === 'enabled').length} of ${agentList.length} enabled)`}>
        <TableContainer sx={{ maxHeight: 360 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Agent</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell align="right">Enabled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentList.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.category === 'core' ? 'Core' : 'Cross-cutting'}</TableCell>
                  <TableCell><StatusBadge status={a.riskLevel === 'critical' || a.riskLevel === 'high' ? 'failed' : 'completed'} /></TableCell>
                  <TableCell align="right">
                    <Switch checked={a.status === 'enabled'} disabled={readOnly} onChange={(e) => toggleAgent(a.id, e.target.checked)} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section id="mcp-subs" title={`MCP subscriptions (${connectorList.filter((c) => c.status === 'connected').length} of ${connectorList.length} connected)`}>
        <TableContainer sx={{ maxHeight: 360 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Connector</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connectorList.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.category.replace(/_/g, ' ')}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section id="roles" title="Roles and permissions">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Can approve up to</TableCell>
                <TableCell>Configure integrations</TableCell>
                <TableCell>Run agents</TableCell>
                <TableCell>Environment access</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.canApprove.length > 0 ? <ActionLevelBadge level={Math.max(...r.canApprove)} /> : 'None'}</TableCell>
                  <TableCell>{r.canConfigureIntegrations ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{r.canRunAgents ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5}>
                      {r.environmentAccess.map((e) => <Chip key={e} size="small" label={e} variant="outlined" />)}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section id="env-restrictions" title="Environment restrictions">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          When restricted, only Platform Administrator and Security Lead roles may approve actions in that environment.
        </Typography>
        <Stack gap={0.5}>
          {(Object.keys(settings.environmentRestrictions) as Environment[]).map((env) => (
            <FormControlLabel
              key={env}
              control={
                <Switch
                  checked={settings.environmentRestrictions[env]}
                  disabled={readOnly}
                  onChange={(e) => patch({ environmentRestrictions: { ...settings.environmentRestrictions, [env]: e.target.checked } })}
                />
              }
              label={`Restrict ${env}`}
            />
          ))}
        </Stack>
      </Section>

      <Section id="approval-policies" title="Approval policies">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>Requires approval</TableCell>
                <TableCell>Approver roles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.approvalPolicies.map((p) => (
                <TableRow key={p.actionLevel}>
                  <TableCell><ActionLevelBadge level={p.actionLevel} /></TableCell>
                  <TableCell>
                    <Switch checked={p.requiresApproval} disabled={readOnly || p.actionLevel === 3} size="small" onChange={(e) => {
                      const updated = settings.approvalPolicies.map((x) => (x.actionLevel === p.actionLevel ? { ...x, requiresApproval: e.target.checked } : x));
                      patch({ approvalPolicies: updated });
                    }} />
                  </TableCell>
                  <TableCell>{p.approverRoles.join(', ') || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Level 3 (high-impact / production) approval cannot be disabled.
        </Typography>
      </Section>

      <Section id="retention" title="Data retention">
        <Grid container spacing={2} maxWidth={480}>
          <Grid size={6}>
            <TextField fullWidth type="number" label="General data (days)" value={settings.dataRetentionDays} disabled={readOnly} onChange={(e) => patch({ dataRetentionDays: Number(e.target.value) })} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth type="number" label="Audit data (days)" value={settings.auditRetentionDays} disabled={readOnly} onChange={(e) => patch({ auditRetentionDays: Number(e.target.value) })} />
          </Grid>
        </Grid>
      </Section>

      <Section id="notifications" title="Notification preferences">
        <TextField
          size="small"
          label="Notification channel"
          value={settings.notificationChannel}
          disabled={readOnly}
          onChange={(e) => patch({ notificationChannel: e.target.value })}
          sx={{ mb: 1.5, display: 'block', maxWidth: 320 }}
        />
        <Stack>
          <FormControlLabel control={<Switch checked={settings.notifyOnApprovalRequest} disabled={readOnly} onChange={(e) => patch({ notifyOnApprovalRequest: e.target.checked })} />} label="Notify on new approval request" />
          <FormControlLabel control={<Switch checked={settings.notifyOnSecurityFinding} disabled={readOnly} onChange={(e) => patch({ notifyOnSecurityFinding: e.target.checked })} />} label="Notify on new security finding" />
          <FormControlLabel control={<Switch checked={settings.notifyOnWorkflowFailure} disabled={readOnly} onChange={(e) => patch({ notifyOnWorkflowFailure: e.target.checked })} />} label="Notify on workflow failure" />
        </Stack>
      </Section>

      <Section id="audit-settings" title="Audit settings">
        <Typography variant="body2" color="text.secondary">
          Audit visibility for your current role ({role.name}) is <strong>{role.auditVisibility}</strong>. All governed
          actions are logged immutably; audit records never include secret values or tokens.
        </Typography>
      </Section>

      <Section id="model-config" title="Model configuration">
        <Grid container spacing={2} maxWidth={640}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="Provider" value={settings.modelConfig.provider} disabled={readOnly} onChange={(e) => patch({ modelConfig: { ...settings.modelConfig, provider: e.target.value } })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Select
              fullWidth
              size="medium"
              value={settings.modelConfig.reasoningEffort}
              disabled={readOnly}
              onChange={(e) => patch({ modelConfig: { ...settings.modelConfig, reasoningEffort: e.target.value as PlatformSettings['modelConfig']['reasoningEffort'] } })}
            >
              <MenuItem value="low">Low reasoning effort</MenuItem>
              <MenuItem value="medium">Medium reasoning effort</MenuItem>
              <MenuItem value="high">High reasoning effort</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Max autonomous steps"
              value={settings.modelConfig.maxAutonomousSteps}
              disabled={readOnly}
              onChange={(e) => patch({ modelConfig: { ...settings.modelConfig, maxAutonomousSteps: Number(e.target.value) } })}
            />
          </Grid>
        </Grid>
      </Section>

      <Section id="feature-flags" title="Feature flags">
        <Stack>
          <FormControlLabel control={<Switch checked={settings.featureFlags.knowledgeGraphExpandedView} disabled={readOnly} onChange={(e) => patch({ featureFlags: { ...settings.featureFlags, knowledgeGraphExpandedView: e.target.checked } })} />} label="Default to expanded Knowledge Graph view" />
          <FormControlLabel control={<Switch checked={settings.featureFlags.adversarialTestingAgent} disabled={readOnly} onChange={(e) => patch({ featureFlags: { ...settings.featureFlags, adversarialTestingAgent: e.target.checked } })} />} label="Enable Adversarial Testing Agent" />
          <FormControlLabel control={<Switch checked={settings.featureFlags.costEstimatesOnIac} disabled={readOnly} onChange={(e) => patch({ featureFlags: { ...settings.featureFlags, costEstimatesOnIac: e.target.checked } })} />} label="Show cost estimates on infrastructure changes" />
        </Stack>
      </Section>

      <Section id="tenant-isolation" title="Tenant isolation status">
        <Stack direction="row" alignItems="center" gap={1.5}>
          <StatusBadge status={settings.tenantIsolation.enforced ? 'enabled' : 'disabled'} />
          <Typography variant="body2" color="text.secondary">
            Last verified {new Date(settings.tenantIsolation.lastVerified).toLocaleString()}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enforced at the MCP Gateway and Knowledge Graph layers — one team cannot reach another team's data, tools,
          credentials, or graph entities.
        </Typography>
      </Section>
    </Box>
  );
}
