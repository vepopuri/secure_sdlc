import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ShareIcon from '@mui/icons-material/Share';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Policy';
import InventoryIcon from '@mui/icons-material/Inventory';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { PhaseCard } from '../components/phases/PhaseCard';
import { DemoDataChip } from '../components/common/DemoDataChip';
import { OctopusMark } from '../components/common/OctopusMark';
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

  const summaryCards = [
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
      <PageHeader title="Overview" showDemoChip={false} />

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          background: 'linear-gradient(135deg, #0A0A0A 0%, #282728 60%, #1c3a17 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.25 }}>
          <OctopusMark size={220} />
        </Box>
        <Box sx={{ maxWidth: 640, position: 'relative' }}>
          <DemoDataChip label="Demo workspace" />
          <Typography variant="h1" sx={{ mt: 1.5, mb: 1, fontSize: { xs: '1.6rem', md: '2.1rem' } }}>
            Build, secure, and operate software with governed AI agents
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.300', mb: 3 }}>
            Connect your engineering tools, activate the right agents, and surface cross-phase intelligence from one
            workspace.
          </Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Button variant="contained" startIcon={<RocketLaunchIcon />} onClick={() => navigate('/get-started')}>
              Start setup
            </Button>
            <Button variant="outlined" sx={{ color: '#fff', borderColor: 'grey.500' }} startIcon={<AccountTreeIcon />} onClick={() => navigate('/components')}>
              Explore the architecture
            </Button>
            <Button variant="outlined" sx={{ color: '#fff', borderColor: 'grey.500' }} startIcon={<PlayCircleIcon />} onClick={() => navigate('/workflows')}>
              Run a sample workflow
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Alert severity="info" icon={<SmartToyIcon fontSize="inherit" />} sx={{ mb: 3 }}>
        This workspace models <strong>36 agents</strong> (24 core SDLC agents + 12 cross-cutting security, governance,
        and resilience agents) — an expansion from an earlier 21-agent model — connected through{' '}
        <strong>35 source MCP connectors</strong> and <strong>2 platform MCP services</strong>.
      </Alert>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {summaryCards.map((card) => (
          <Grid key={card.label} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card sx={{ cursor: 'pointer', height: '100%' }} onClick={() => navigate(card.path)}>
              <CardContent>
                <Typography variant="h2" sx={{ fontSize: '1.9rem' }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {card.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.sub}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h2" sx={{ mb: 2 }}>
        SDLC phases
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {sdlcPhases.map((phase) => (
          <Grid key={phase.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <PhaseCard phase={phase} agentCount={phase.agentIds.length} onOpen={() => navigate('/phases')} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h2" sx={{ mb: 1 }}>
        Cross-cutting: security, governance, and resilience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {crossCuttingAgents.length} agents operate across multiple SDLC phases rather than owning a single one.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {CROSS_CUTTING_GROUPS.map((group) => {
          const Icon = group.icon;
          const count = crossCuttingAgents.filter((a) => group.match(a.name)).length;
          return (
            <Grid key={group.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: 'center', height: '100%', cursor: 'pointer' }}
                onClick={() => navigate('/agents')}
              >
                <Icon color="secondary" />
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  {count}
                </Typography>
                <Typography variant="body2">{group.label}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

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
  );
}
