import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import CableOutlinedIcon from '@mui/icons-material/CableOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { FlowPipeline } from './FlowPipeline';

/**
 * An illustrative, simplified architecture diagram for the Overview page — not the exhaustive
 * component-by-component view PlatformComponentsPage already provides. Two columns, side by
 * side: the governed path every one of the 36 agents runs through (entirely simulated in this
 * build), next to the two agents that bypass it and call a real external system directly. The
 * point is honesty about what's real, not architectural completeness.
 */
export function ArchitectureDiagram() {
  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
            <Chip size="small" label="Demo mode" variant="outlined" />
            <Typography variant="subtitle1">How most of the platform works</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Every one of the 36 agents proposes an action through the same governed path — routed,
            authorized, and audited, but simulated end to end in this build.
          </Typography>
          <FlowPipeline
            orientation="vertical"
            muted
            stages={[
              { icon: SmartToyOutlinedIcon, title: '36 agents', subtitle: 'Propose a governed action' },
              { icon: HubOutlinedIcon, title: 'MCP Gateway & Registry', subtitle: 'Authorizes, routes, and audits every call' },
              { icon: CableOutlinedIcon, title: '35 connectors + Knowledge Graph', subtitle: 'Translate to source-system calls' },
              { icon: StorageOutlinedIcon, title: 'Enterprise source systems', subtitle: 'Jira, GitHub, cloud, and the rest' },
            ]}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, md: 2.5 }, height: '100%', borderColor: 'primary.main', borderWidth: 2, bgcolor: 'rgba(23,182,196,0.04)' }}
        >
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
            <Chip size="small" label="Live" color="primary" />
            <Typography variant="subtitle1">What's actually real, today</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Two agents skip the simulated path entirely and call a real external system directly —
            no mock in between.
          </Typography>
          <Stack gap={2.5}>
            <FlowPipeline
              orientation="vertical"
              stages={[
                { icon: AutoFixHighOutlinedIcon, title: 'Remediation Agent', subtitle: 'api/remediate.ts' },
                { icon: GitHubIcon, title: 'GitHub REST API', subtitle: 'Opens a real draft pull request' },
              ]}
            />
            <Divider sx={{ borderStyle: 'dashed' }} />
            <FlowPipeline
              orientation="vertical"
              stages={[
                { icon: TravelExploreIcon, title: 'Security Scan Agent', subtitle: 'api/scan-dependencies.ts' },
                { icon: BugReportOutlinedIcon, title: 'OSV.dev', subtitle: 'Real CVE lookup, no credentials needed' },
              ]}
            />
          </Stack>
        </Paper>
      </Grid>
      <Grid size={12}>
        <Stack direction="row" gap={3} flexWrap="wrap" alignItems="center" sx={{ mt: 0.5 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ width: 22, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Live — a real external call
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ width: 22, height: 0, borderTop: '2px dashed', borderColor: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              Simulated — demo mode, no real system called
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
