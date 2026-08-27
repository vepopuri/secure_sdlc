import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { mcpConnectors } from '../data/mcpConnectors';
import { agents } from '../data/agents';
import { workspace } from '../data/orgs';
import { mcpService } from '../services';
import type { Environment, OperatingMode } from '../types/domain';

const STEPS = [
  'Create workspace',
  'Connect source systems',
  'Select initial agents',
  'Operating mode',
  'Run sample workflow',
  'Setup complete',
];

const SOURCE_SYSTEM_CONNECTOR_IDS = [
  'github_gitlab_mcp',
  'jira_linear_mcp',
  'slack_teams_mcp',
  'cloud_provider_mcp',
  'cicd_platform_mcp',
  'observability_platform_mcp',
];

const STARTER_AGENT_IDS = [
  'requirements_agent',
  'architecture_agent',
  'code_review_agent',
  'test_generation_agent',
  'security_scan_agent',
  'cicd_agent',
  'observability_agent',
];

const OPERATING_MODES: { id: OperatingMode; label: string; description: string }[] = [
  { id: 'observe_only', label: 'Observe only', description: 'Agents read context and surface insight; they take no actions.' },
  { id: 'recommend_changes', label: 'Recommend changes', description: 'Agents propose changes for a human to apply manually.' },
  { id: 'create_drafts', label: 'Create drafts', description: 'Agents may open draft tickets, branches, or pull requests for review.' },
  { id: 'execute_approved_changes', label: 'Execute approved changes', description: 'Agents apply changes once a human approves them through the Approvals queue.' },
];

const SAMPLE_WORKFLOW_STEPS = [
  { label: 'Requirement', agent: 'Requirements Agent', mcp: 'Jira / Linear MCP', kg: 'Reads related requirements entities' },
  { label: 'Code Review', agent: 'Code Review Agent', mcp: 'GitHub / GitLab MCP', kg: 'Reads codebase and technical-debt entities' },
  { label: 'Test Generation', agent: 'Test Generation Agent', mcp: 'Jest / Pytest Test MCP', kg: 'Writes new coverage report entity' },
  { label: 'Security Scan', agent: 'Security Scan Agent', mcp: 'Snyk / Semgrep MCP', kg: 'Writes vulnerability finding entity' },
  { label: 'Approval', agent: 'Human approver', mcp: 'Policy Engine MCP', kg: 'Records approval decision as evidence' },
] as const;

export function GetStartedPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 state
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [orgName, setOrgName] = useState(workspace.organizationName);
  const [primaryTeam, setPrimaryTeam] = useState(workspace.primaryTeam);
  const [defaultEnv, setDefaultEnv] = useState<Environment>(workspace.defaultEnvironment);
  const [notifChannel, setNotifChannel] = useState(workspace.notificationChannel);

  // Step 2 state
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; message: string }>>({});

  // Step 3 state
  const [enabledAgents, setEnabledAgents] = useState<Record<string, boolean>>(
    Object.fromEntries(STARTER_AGENT_IDS.map((id) => [id, true])),
  );

  // Step 4 state
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('create_drafts');

  // Step 5 state
  const [runIndex, setRunIndex] = useState(-1);
  const [running, setRunning] = useState(false);

  async function handleTestConnection(id: string) {
    setTestingId(id);
    const result = await mcpService.testConnection(id);
    setTestResults((prev) => ({ ...prev, [id]: result }));
    setTestingId(null);
  }

  function runSampleWorkflow() {
    setRunning(true);
    setRunIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setRunIndex(i);
      if (i >= SAMPLE_WORKFLOW_STEPS.length - 1) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 900);
  }

  const next = () => setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  const connectedCount = SOURCE_SYSTEM_CONNECTOR_IDS.filter((id) => testResults[id]?.ok).length;
  const enabledCount = Object.values(enabledAgents).filter(Boolean).length;

  return (
    <Box>
      <PageHeader
        title="Get Started"
        description="A guided first run: create your workspace, connect source systems, activate agents, and see a sample workflow end to end."
      />

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="h3" gutterBottom>
              Create your workspace
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This information scopes agents, approvals, and audit records to your team.
            </Typography>
            <Grid container spacing={2} maxWidth={720}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Workspace name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Organization or tenant name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Primary engineering team" value={primaryTeam} onChange={(e) => setPrimaryTeam(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth select label="Default environment" value={defaultEnv} onChange={(e) => setDefaultEnv(e.target.value as Environment)}>
                  {(['demo', 'development', 'staging', 'production'] as Environment[]).map((e) => (
                    <MenuItem key={e} value={e}>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Preferred notification channel" value={notifChannel} onChange={(e) => setNotifChannel(e.target.value)} />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h3" gutterBottom>
              Connect source systems
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Demo mode: connection tests are simulated and never call a real system.
            </Alert>
            <Grid container spacing={2}>
              {SOURCE_SYSTEM_CONNECTOR_IDS.map((id) => {
                const connector = mcpConnectors.find((c) => c.id === id)!;
                const result = testResults[id];
                return (
                  <Grid key={id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="h4">{connector.name}</Typography>
                          <StatusBadge status={result?.ok ? 'connected' : connector.status} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          Data types available
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {connector.dataTypes.join(', ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Permissions requested
                        </Typography>
                        <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mb: 1 }}>
                          {[...connector.readPermissions, ...connector.writePermissions].slice(0, 3).map((p) => (
                            <Chip key={p} size="small" label={p} variant="outlined" />
                          ))}
                        </Stack>
                        <Chip
                          size="small"
                          label={connector.writePermissions.length > 0 ? 'Read / write capable' : 'Read-only'}
                          color={connector.writePermissions.length > 0 ? 'warning' : 'default'}
                          variant="outlined"
                        />
                        {result && (
                          <Alert severity={result.ok ? 'success' : 'error'} sx={{ mt: 1.5 }}>
                            {result.message}
                          </Alert>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button size="small" disabled>
                          Configure
                        </Button>
                        <Button size="small" variant="outlined" disabled={testingId === id} onClick={() => handleTestConnection(id)}>
                          {testingId === id ? 'Testing…' : 'Test connection'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h3" gutterBottom>
              Select initial agents
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A recommended starter set covering planning, development, testing, and operations. You can change this
              anytime in the Agents catalog.
            </Typography>
            <Grid container spacing={2}>
              {STARTER_AGENT_IDS.map((id) => {
                const agent = agents.find((a) => a.id === id)!;
                return (
                  <Grid key={id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="h4">{agent.name}</Typography>
                          <Switch
                            checked={enabledAgents[id]}
                            onChange={(e) => setEnabledAgents((prev) => ({ ...prev, [id]: e.target.checked }))}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {agent.shortDescription}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Reads
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {agent.inputs.join(', ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Produces
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {agent.outputs.join(', ')}
                        </Typography>
                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                          <RiskBadge level={agent.riskLevel} />
                          {agent.approvalRequired && <Chip size="small" color="warning" variant="outlined" label="Approval required" />}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {activeStep === 3 && (
          <Box maxWidth={640}>
            <Typography variant="h3" gutterBottom>
              Select operating mode
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Production-impacting actions always require explicit human approval, regardless of the mode you choose here.
            </Alert>
            <RadioGroup value={operatingMode} onChange={(e) => setOperatingMode(e.target.value as OperatingMode)}>
              {OPERATING_MODES.map((mode) => (
                <Paper key={mode.id} variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
                  <FormControlLabel
                    value={mode.id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {mode.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mode.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              ))}
            </RadioGroup>
          </Box>
        )}

        {activeStep === 4 && (
          <Box>
            <Typography variant="h3" gutterBottom>
              Run a sample workflow
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Requirement → Code Review → Test Generation → Security Scan → Approval
            </Typography>
            <Button variant="contained" onClick={runSampleWorkflow} disabled={running} sx={{ mb: 3 }}>
              {running ? 'Running…' : runIndex >= 0 ? 'Run again' : 'Run sample workflow (demo mode)'}
            </Button>
            <List>
              {SAMPLE_WORKFLOW_STEPS.map((step, i) => {
                const status = runIndex < 0 ? 'pending' : i < runIndex ? 'completed' : i === runIndex ? (running ? 'running' : 'completed') : 'pending';
                return (
                  <ListItem key={step.label} sx={{ alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ mt: 0.5 }}>
                      {status === 'completed' ? (
                        <CheckCircleIcon color="success" />
                      ) : status === 'running' ? (
                        <StatusBadge status="running" />
                      ) : (
                        <RadioButtonUncheckedIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${i + 1}. ${step.label}`}
                      secondary={`Agent handoff: ${step.agent} · MCP call: ${step.mcp} · Knowledge Graph: ${step.kg}`}
                    />
                  </ListItem>
                );
              })}
            </List>
            {runIndex >= SAMPLE_WORKFLOW_STEPS.length - 1 && !running && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Result summary: story reviewed, tests generated, no critical vulnerabilities found, change approved and
                ready for merge. (Demo result — no real systems were called.)
              </Alert>
            )}
          </Box>
        )}

        {activeStep === 5 && (
          <Box>
            <Typography variant="h3" gutterBottom>
              Setup complete
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Connected systems ({connectedCount} of {SOURCE_SYSTEM_CONNECTOR_IDS.length})
                </Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mb: 2 }}>
                  {SOURCE_SYSTEM_CONNECTOR_IDS.map((id) => (
                    <Chip
                      key={id}
                      size="small"
                      label={mcpConnectors.find((c) => c.id === id)!.name}
                      color={testResults[id]?.ok ? 'success' : 'default'}
                      variant={testResults[id]?.ok ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Enabled agents ({enabledCount} of {STARTER_AGENT_IDS.length})
                </Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {STARTER_AGENT_IDS.filter((id) => enabledAgents[id]).map((id) => (
                    <Chip key={id} size="small" label={agents.find((a) => a.id === id)!.name} color="success" />
                  ))}
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Remaining configuration items
                </Typography>
                <List dense>
                  {[
                    'Connect remaining source systems from the MCP Connections tab',
                    'Review and adjust approval policies in Settings',
                    'Invite additional team members',
                    'Configure production environment access',
                  ].map((item) => (
                    <ListItem key={item} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
                      </ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }} gutterBottom>
                  Recommended next actions
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Button size="small" variant="outlined" onClick={() => navigate('/agents')}>
                    Review agent catalog
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => navigate('/knowledge-graph')}>
                    Explore Knowledge Graph
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ mt: 3 }} onClick={() => navigate('/')}>
              Open Overview
            </Button>
          </Box>
        )}

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Button disabled={activeStep === 0} onClick={back}>
            Back
          </Button>
          {activeStep < STEPS.length - 1 && (
            <Button variant="contained" onClick={next}>
              Continue
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
