import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ShareIcon from '@mui/icons-material/Share';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Policy';
import InventoryIcon from '@mui/icons-material/Inventory';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { PhaseCard } from '../components/phases/PhaseCard';
import { DemoDataChip } from '../components/common/DemoDataChip';
import { ConnectorMotif } from '../components/common/ConnectorMotif';
import { Reveal } from '../components/common/Reveal';
import { GovernanceJourneyDiagram } from '../components/common/GovernanceJourneyDiagram';
import { sdlcPhases } from '../data/phases';
import { agents, CORE_AGENT_COUNT, CROSS_CUTTING_AGENT_COUNT, TOTAL_AGENT_COUNT } from '../data/agents';
import { sourceConnectors, platformMcpServices } from '../data/mcpConnectors';
import { approvals } from '../data/approvals';
import { securityFindings } from '../data/security';
import { crossPhaseInsights } from '../data/insights';
import { auditEvents } from '../data/audit';
import { workflows } from '../data/workflows';

const CROSS_CUTTING_GROUPS = [
  { label: 'Security', icon: ShieldIcon, match: (name: string) => /security|iam|secrets|adversarial|detection|cloud/i.test(name) },
  { label: 'Governance', icon: GavelIcon, match: (name: string) => /governance/i.test(name) },
  { label: 'Privacy', icon: PolicyIcon, match: (name: string) => /privacy/i.test(name) },
  { label: 'Supply chain', icon: InventoryIcon, match: (name: string) => /supply chain|third-party/i.test(name) },
  { label: 'Resilience', icon: HealthAndSafetyIcon, match: (name: string) => /resilience|incident/i.test(name) },
];

/** A big-number "spec strip" row: a clickable stat with a thin divider between items, no card chrome. */
function StatItem({ value, label, sub, onClick }: { value: number | string; label: string; sub: string; onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: '1 1 160px',
        py: { xs: 1.5, md: 0 },
        px: { md: 3 },
        cursor: onClick ? 'pointer' : 'default',
        transition: 'opacity 150ms ease',
        '&:hover': onClick ? { opacity: 0.7 } : undefined,
      }}
    >
      <Typography sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</Typography>
      <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75 }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {sub}
      </Typography>
    </Box>
  );
}

export function OverviewPage() {
  const navigate = useNavigate();
  const crossCuttingAgents = agents.filter((a) => a.category === 'cross_cutting');
  const connectedSystemsCount = sourceConnectors.filter((c) => c.status === 'connected').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const openFindingsCount = securityFindings.filter((f) => f.status === 'open').length;

  const recentActivity = useMemo(() => {
    const items = [
      ...auditEvents.slice(0, 4).map((e) => ({
        ts: e.timestamp,
        icon: <FactCheckIcon fontSize="small" />,
        text: `${e.agentId ?? e.user}: ${e.action}`,
        type: 'Agent execution',
      })),
      ...workflows.slice(0, 3).map((w) => ({
        ts: w.startedAt,
        icon: <PlayCircleIcon fontSize="small" />,
        text: `Workflow "${w.name}" — ${w.status.replace('_', ' ')}`,
        type: 'Pipeline event',
      })),
      ...approvals.slice(0, 2).map((a) => ({
        ts: a.createdAt,
        icon: <GavelIcon fontSize="small" />,
        text: `Approval requested: ${a.requestedAction}`,
        type: 'Approval request',
      })),
      ...securityFindings.slice(0, 2).map((f) => ({
        ts: f.discoveredAt,
        icon: <ShieldIcon fontSize="small" />,
        text: `Security finding: ${f.title}`,
        type: 'Security finding',
      })),
    ];
    return items.sort((a, b) => (a.ts < b.ts ? 1 : -1)).slice(0, 8);
  }, []);

  const summaryStats = [
    { label: 'Total agents', value: TOTAL_AGENT_COUNT, sub: `${CORE_AGENT_COUNT} core · ${CROSS_CUTTING_AGENT_COUNT} cross-cutting`, path: '/agents' },
    { label: 'SDLC phases', value: sdlcPhases.length, sub: 'Planning through maintenance', path: '/phases' },
    { label: 'Source MCP connectors', value: sourceConnectors.length, sub: 'Across 7 categories', path: '/mcp' },
    { label: 'Platform MCP services', value: platformMcpServices.length, sub: 'Gateway & Knowledge Graph server', path: '/mcp' },
    { label: 'Knowledge Graph', value: 1, sub: '19 entity domains', path: '/knowledge-graph' },
    { label: 'Connected systems', value: connectedSystemsCount, sub: `of ${sourceConnectors.length} source connectors`, path: '/mcp' },
    { label: 'Pending approvals', value: pendingApprovalsCount, sub: 'Awaiting review', path: '/approvals' },
    { label: 'Open security findings', value: openFindingsCount, sub: 'Across all severities', path: '/security' },
  ];

  return (
    <Box>
      {/* Hero — breaks out of the standard page padding for a true landing-page feel. */}
      <Paper
        sx={{
          mx: { xs: -2, md: -3 },
          mt: { xs: -2, md: -3 },
          p: { xs: 4, sm: 6, md: 10 },
          mb: { xs: 6, md: 10 },
          background: 'linear-gradient(160deg, #04070B 0%, #101820 55%, #0E838D 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          <ConnectorMotif variant="hero" animated />
        </Box>
        <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: { xs: 'left', md: 'center' }, position: 'relative' }}>
          <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'center' }}>
            <DemoDataChip label="Demo workspace" />
          </Stack>
          <Typography variant="overline" sx={{ display: 'block', mt: 2, color: '#5EEAD4' }}>
            Octopus — Secure SDLC Intelligence
          </Typography>
          <Typography
            variant="h1"
            sx={{ mt: 1, mb: 2, fontSize: { xs: '2.3rem', sm: '3rem', md: '4rem' }, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.03 }}
          >
            Build, secure, and operate software with governed AI agents
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.300', mb: 4, fontSize: { xs: '1rem', md: '1.15rem' }, mx: { md: 'auto' }, maxWidth: 560 }}>
            One governing intelligence, coordinating specialized agents at every limb — connect your engineering
            tools, activate the right agents, and surface cross-phase intelligence from one workspace.
          </Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap" justifyContent={{ xs: 'flex-start', md: 'center' }}>
            <Button size="large" variant="contained" startIcon={<RocketLaunchIcon />} onClick={() => navigate('/get-started')} sx={{ borderRadius: 999 }}>
              Start setup
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 999 }}
              startIcon={<AccountTreeIcon />}
              onClick={() => navigate('/components')}
            >
              Explore the architecture
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 999 }}
              startIcon={<PlayCircleIcon />}
              onClick={() => navigate('/workflows')}
            >
              Run a sample workflow
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* By the numbers — a spec strip, not a grid of boxed cards. */}
      <Reveal>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography variant="overline" color="text.secondary">
            The workspace, at a glance
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.5, mb: 1 }}>
            36 agents. One brain.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
            24 core SDLC agents plus 12 cross-cutting security, governance, and resilience agents — an expansion from
            an earlier 21-agent model — connected through 35 source MCP connectors and 2 platform MCP services.
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          >
            {summaryStats.map((s) => (
              <StatItem key={s.label} value={s.value} label={s.label} sub={s.sub} onClick={() => navigate(s.path)} />
            ))}
          </Stack>
        </Box>
      </Reveal>

      {/* SDLC phases */}
      <Reveal>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography variant="overline" color="text.secondary">
            End to end
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.5, mb: 1 }}>
            Six phases. One workspace.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
            Every phase of the delivery lifecycle, from planning through maintenance, backed by its own set of
            specialized agents.
          </Typography>
          <Grid container spacing={2.5}>
            {sdlcPhases.map((phase) => (
              <Grid key={phase.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <PhaseCard phase={phase} agentCount={phase.agentIds.length} onOpen={() => navigate('/phases')} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Reveal>

      {/* Cross-cutting intelligence */}
      <Reveal>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography variant="overline" color="text.secondary">
            Always on
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.5, mb: 1 }}>
            Cross-cutting intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
            {crossCuttingAgents.length} agents operate across multiple SDLC phases rather than owning a single one —
            security, governance, privacy, supply chain, and resilience, watching everything at once.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          >
            {CROSS_CUTTING_GROUPS.map((group) => {
              const Icon = group.icon;
              const count = crossCuttingAgents.filter((a) => group.match(a.name)).length;
              return (
                <Box
                  key={group.label}
                  onClick={() => navigate('/agents')}
                  sx={{
                    flex: '1 1 0',
                    py: 2,
                    px: { sm: 2.5 },
                    cursor: 'pointer',
                    transition: 'opacity 150ms ease',
                    '&:hover': { opacity: 0.7 },
                  }}
                >
                  <Icon color="secondary" />
                  <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, mt: 0.5 }}>{count}</Typography>
                  <Typography variant="body2">{group.label}</Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Reveal>

      {/* Governance journey: illustrative, not exhaustive — see Approvals for the real queue */}
      <Reveal>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography variant="overline" color="text.secondary">
            How agents are governed
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.5, mb: 1 }}>
            Running the agent is never the last step
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
            A simplified, illustrative view of the loop every agent — mandatory or optional —
            runs through. Each step's evidence is saved before the next one is even considered,
            and nothing advances without either an approval or a reviewed, logged exemption.
          </Typography>
          <GovernanceJourneyDiagram />
        </Box>
      </Reveal>

      {/* Live from the workspace */}
      <Reveal>
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" color="text.secondary">
            Right now
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.5, mb: 3 }}>
            Live from the workspace
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={{ p: 2.5, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h3">Cross-phase intelligence</Typography>
                  <DemoDataChip label="Demo insights" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Generated by agents traversing the Knowledge Graph across phase boundaries.
                </Typography>
                <Stack gap={1.5}>
                  {crossPhaseInsights.map((insight) => (
                    <Alert key={insight.id} severity={insight.severity === 'critical' ? 'error' : insight.severity === 'warning' ? 'warning' : 'info'} icon={<ShareIcon fontSize="inherit" />}>
                      {insight.summary}
                    </Alert>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="h3" sx={{ mb: 1.5 }}>
                  Recent activity
                </Typography>
                <List dense disablePadding>
                  {recentActivity.map((item, i) => (
                    <Box key={i}>
                      <ListItem disableGutters>
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.200', color: 'text.primary' }}>{item.icon}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.text}
                          secondary={`${item.type} · ${new Date(item.ts).toLocaleString()}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {i < recentActivity.length - 1 && <Divider component="li" />}
                    </Box>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Reveal>

      <Reveal>
        <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/get-started')}>
            See everything Octopus can do
          </Button>
        </Stack>
      </Reveal>
    </Box>
  );
}
