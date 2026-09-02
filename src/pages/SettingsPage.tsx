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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge, ActionLevelBadge } from '../components/common/StatusBadge';
import { settingsService, orgService, type PlatformSettings, agentService } from '../services';
import { mcpConnectors as seedConnectors } from '../data/mcpConnectors';
import { useAppState } from '../context/AppStateContext';
import type { Agent, ActionLevel, Environment, McpConnector, Project, Role, Team } from '../types/domain';

const ALL_ENVIRONMENTS: Environment[] = ['demo', 'development', 'staging', 'production'];
const ALL_ACTION_LEVELS: ActionLevel[] = [0, 1, 2, 3];
const AUDIT_VISIBILITIES: Role['auditVisibility'][] = ['own', 'team', 'full'];

interface TeamFormState {
  name: string;
  memberCount: number;
  projectIds: string[];
}

interface ProjectFormState {
  name: string;
  repository: string;
  teamId: string;
  environment: Environment[];
}

interface RoleFormState {
  canApprove: ActionLevel[];
  canConfigureIntegrations: boolean;
  canRunAgents: boolean;
  environmentAccess: Environment[];
  auditVisibility: Role['auditVisibility'];
}

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
  const { role, refreshRoles } = useAppState();
  const readOnly = !role.canConfigureIntegrations;
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [connectorList] = useState<McpConnector[]>(seedConnectors);
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);

  const [teamDialog, setTeamDialog] = useState<{ id?: string; form: TeamFormState } | null>(null);
  const [projectDialog, setProjectDialog] = useState<{ id?: string; form: ProjectFormState } | null>(null);
  const [roleDialog, setRoleDialog] = useState<{ id: Role['id']; name: string; form: RoleFormState } | null>(null);

  useEffect(() => {
    settingsService.get().then(setSettings);
    orgService.listTeams().then(setTeamList);
    orgService.listProjects().then(setProjectList);
    settingsService.listRoles().then(setRoleList);
    agentService.list().then(setAgentList);
  }, []);

  function patch(update: Partial<PlatformSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...update } : prev));
    settingsService.update(update);
  }

  async function toggleAgent(id: string, enabled: boolean) {
    const updated = await agentService.setEnabled(id, enabled);
    if (updated) setAgentList((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  function openNewTeam() {
    setTeamDialog({ form: { name: '', memberCount: 1, projectIds: [] } });
  }
  function openEditTeam(t: Team) {
    setTeamDialog({ id: t.id, form: { name: t.name, memberCount: t.memberCount, projectIds: [...t.projectIds] } });
  }
  async function saveTeam() {
    if (!teamDialog) return;
    if (teamDialog.id) {
      const updated = await orgService.updateTeam(teamDialog.id, teamDialog.form);
      if (updated) setTeamList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await orgService.createTeam(teamDialog.form);
      setTeamList((prev) => [...prev, created]);
    }
    setTeamDialog(null);
  }

  function openNewProject() {
    setProjectDialog({ form: { name: '', repository: '', teamId: teamList[0]?.id ?? '', environment: [] } });
  }
  function openEditProject(p: Project) {
    setProjectDialog({ id: p.id, form: { name: p.name, repository: p.repository, teamId: p.teamId, environment: [...p.environment] } });
  }
  async function saveProject() {
    if (!projectDialog) return;
    if (projectDialog.id) {
      const updated = await orgService.updateProject(projectDialog.id, projectDialog.form);
      if (updated) setProjectList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await orgService.createProject(projectDialog.form);
      setProjectList((prev) => [...prev, created]);
    }
    setProjectDialog(null);
  }

  function openEditRole(r: Role) {
    setRoleDialog({
      id: r.id,
      name: r.name,
      form: {
        canApprove: [...r.canApprove],
        canConfigureIntegrations: r.canConfigureIntegrations,
        canRunAgents: r.canRunAgents,
        environmentAccess: [...r.environmentAccess],
        auditVisibility: r.auditVisibility,
      },
    });
  }
  async function saveRole() {
    if (!roleDialog) return;
    const updated = await settingsService.updateRole(roleDialog.id, roleDialog.form);
    if (updated) setRoleList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    refreshRoles();
    setRoleDialog(null);
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
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
          <Button size="small" startIcon={<AddIcon />} disabled={readOnly} onClick={openNewTeam}>
            Add team
          </Button>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Projects</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamList.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.memberCount}</TableCell>
                  <TableCell>{t.projectIds.map((id) => projectList.find((p) => p.id === id)?.name).filter(Boolean).join(', ') || '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" disabled={readOnly} onClick={() => openEditTeam(t)} aria-label={`Edit ${t.name}`}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section id="projects" title="Project management">
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
          <Button size="small" startIcon={<AddIcon />} disabled={readOnly || teamList.length === 0} onClick={openNewProject}>
            Add project
          </Button>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Repository</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Environments</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectList.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{p.repository}</TableCell>
                  <TableCell>{teamList.find((t) => t.id === p.teamId)?.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5}>
                      {p.environment.map((e) => <Chip key={e} size="small" label={e} variant="outlined" />)}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" disabled={readOnly} onClick={() => openEditProject(p)} aria-label={`Edit ${p.name}`}>
                      <EditIcon fontSize="small" />
                    </IconButton>
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
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roleList.map((r) => (
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
                  <TableCell align="right">
                    <IconButton size="small" disabled={readOnly} onClick={() => openEditRole(r)} aria-label={`Edit ${r.name} permissions`}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Role names are fixed in this demo; only permission fields can be edited.
        </Typography>
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

      <Dialog open={Boolean(teamDialog)} onClose={() => setTeamDialog(null)} maxWidth="sm" fullWidth>
        {teamDialog && (
          <>
            <DialogTitle>{teamDialog.id ? 'Edit team' : 'Add team'}</DialogTitle>
            <DialogContent dividers>
              <Stack gap={2} sx={{ mt: 0.5 }}>
                <TextField
                  fullWidth
                  label="Team name"
                  value={teamDialog.form.name}
                  onChange={(e) => setTeamDialog({ ...teamDialog, form: { ...teamDialog.form, name: e.target.value } })}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Member count"
                  value={teamDialog.form.memberCount}
                  onChange={(e) => setTeamDialog({ ...teamDialog, form: { ...teamDialog.form, memberCount: Number(e.target.value) } })}
                />
                <FormControl fullWidth>
                  <InputLabel>Projects</InputLabel>
                  <Select
                    multiple
                    label="Projects"
                    value={teamDialog.form.projectIds}
                    onChange={(e) => setTeamDialog({ ...teamDialog, form: { ...teamDialog.form, projectIds: e.target.value as string[] } })}
                    input={<OutlinedInput label="Projects" />}
                    renderValue={(selected) => (
                      <Stack direction="row" gap={0.5} flexWrap="wrap">
                        {(selected as string[]).map((id) => (
                          <Chip key={id} size="small" label={projectList.find((p) => p.id === id)?.name ?? id} />
                        ))}
                      </Stack>
                    )}
                  >
                    {projectList.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTeamDialog(null)}>Cancel</Button>
              <Button variant="contained" onClick={saveTeam} disabled={!teamDialog.form.name.trim()}>
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={Boolean(projectDialog)} onClose={() => setProjectDialog(null)} maxWidth="sm" fullWidth>
        {projectDialog && (
          <>
            <DialogTitle>{projectDialog.id ? 'Edit project' : 'Add project'}</DialogTitle>
            <DialogContent dividers>
              <Stack gap={2} sx={{ mt: 0.5 }}>
                <TextField
                  fullWidth
                  label="Project name"
                  value={projectDialog.form.name}
                  onChange={(e) => setProjectDialog({ ...projectDialog, form: { ...projectDialog.form, name: e.target.value } })}
                />
                <TextField
                  fullWidth
                  label="Repository"
                  value={projectDialog.form.repository}
                  onChange={(e) => setProjectDialog({ ...projectDialog, form: { ...projectDialog.form, repository: e.target.value } })}
                />
                <FormControl fullWidth>
                  <InputLabel>Team</InputLabel>
                  <Select
                    label="Team"
                    value={projectDialog.form.teamId}
                    onChange={(e) => setProjectDialog({ ...projectDialog, form: { ...projectDialog.form, teamId: e.target.value } })}
                  >
                    {teamList.map((t) => (
                      <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Environments</InputLabel>
                  <Select
                    multiple
                    label="Environments"
                    value={projectDialog.form.environment}
                    onChange={(e) => setProjectDialog({ ...projectDialog, form: { ...projectDialog.form, environment: e.target.value as Environment[] } })}
                    input={<OutlinedInput label="Environments" />}
                    renderValue={(selected) => (
                      <Stack direction="row" gap={0.5} flexWrap="wrap">
                        {(selected as Environment[]).map((env) => <Chip key={env} size="small" label={env} />)}
                      </Stack>
                    )}
                  >
                    {ALL_ENVIRONMENTS.map((env) => (
                      <MenuItem key={env} value={env}>{env}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setProjectDialog(null)}>Cancel</Button>
              <Button variant="contained" onClick={saveProject} disabled={!projectDialog.form.name.trim() || !projectDialog.form.teamId}>
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={Boolean(roleDialog)} onClose={() => setRoleDialog(null)} maxWidth="sm" fullWidth>
        {roleDialog && (
          <>
            <DialogTitle>Edit permissions — {roleDialog.name}</DialogTitle>
            <DialogContent dividers>
              <Stack gap={2} sx={{ mt: 0.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Can approve action levels</InputLabel>
                  <Select
                    multiple
                    label="Can approve action levels"
                    value={roleDialog.form.canApprove}
                    onChange={(e) => {
                      const value = (e.target.value as (ActionLevel | string)[]).map((v) => Number(v) as ActionLevel);
                      setRoleDialog({ ...roleDialog, form: { ...roleDialog.form, canApprove: value } });
                    }}
                    input={<OutlinedInput label="Can approve action levels" />}
                    renderValue={(selected) => (
                      <Stack direction="row" gap={0.5} flexWrap="wrap">
                        {(selected as ActionLevel[]).map((lvl) => <Chip key={lvl} size="small" label={`Level ${lvl}`} />)}
                      </Stack>
                    )}
                  >
                    {ALL_ACTION_LEVELS.map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>Level {lvl}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Environment access</InputLabel>
                  <Select
                    multiple
                    label="Environment access"
                    value={roleDialog.form.environmentAccess}
                    onChange={(e) => setRoleDialog({ ...roleDialog, form: { ...roleDialog.form, environmentAccess: e.target.value as Environment[] } })}
                    input={<OutlinedInput label="Environment access" />}
                    renderValue={(selected) => (
                      <Stack direction="row" gap={0.5} flexWrap="wrap">
                        {(selected as Environment[]).map((env) => <Chip key={env} size="small" label={env} />)}
                      </Stack>
                    )}
                  >
                    {ALL_ENVIRONMENTS.map((env) => (
                      <MenuItem key={env} value={env}>{env}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Audit visibility</InputLabel>
                  <Select
                    label="Audit visibility"
                    value={roleDialog.form.auditVisibility}
                    onChange={(e) => setRoleDialog({ ...roleDialog, form: { ...roleDialog.form, auditVisibility: e.target.value as Role['auditVisibility'] } })}
                  >
                    {AUDIT_VISIBILITIES.map((v) => (
                      <MenuItem key={v} value={v}>{v}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={roleDialog.form.canConfigureIntegrations}
                      onChange={(e) => setRoleDialog({ ...roleDialog, form: { ...roleDialog.form, canConfigureIntegrations: e.target.checked } })}
                    />
                  }
                  label="Can configure integrations"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={roleDialog.form.canRunAgents}
                      onChange={(e) => setRoleDialog({ ...roleDialog, form: { ...roleDialog.form, canRunAgents: e.target.checked } })}
                    />
                  }
                  label="Can run agents"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRoleDialog(null)}>Cancel</Button>
              <Button variant="contained" onClick={saveRole}>
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
