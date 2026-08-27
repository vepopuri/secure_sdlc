import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OctopusMark } from '../common/OctopusMark';
import { useAppState } from '../../context/AppStateContext';
import { workspace, projects } from '../../data/orgs';
import { roles } from '../../data/roles';
import type { Environment } from '../../types/domain';

const ENV_LABELS: Record<Environment, string> = {
  demo: 'Demo',
  development: 'Development',
  staging: 'Staging',
  production: 'Production',
};

const ENV_COLOR: Record<Environment, string> = {
  demo: '#00A3E0',
  development: '#86BC25',
  staging: '#B98900',
  production: '#C4262E',
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { role, roleId, setRoleId, environment, setEnvironment, projectId, setProjectId } = useAppState();
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ bgcolor: 'brand.black', color: '#fff', zIndex: (t) => t.zIndex.drawer + 1, borderBottom: '1px solid #222' }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </IconButton>

        <Stack direction="row" alignItems="center" gap={1} sx={{ cursor: 'pointer', mr: 1 }} onClick={() => navigate('/')}>
          <OctopusMark size={30} />
          <Box>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
              Agentic SDLC Platform
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.400', lineHeight: 1 }}>
              One brain, many agents
            </Typography>
          </Box>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#333', display: { xs: 'none', lg: 'block' } }} />

        <Stack direction="row" gap={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <Select
            value={workspace.id}
            size="small"
            sx={{ color: '#fff', minWidth: 200, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a3a' }, '& .MuiSvgIcon-root': { color: '#aaa' } }}
          >
            <MenuItem value={workspace.id}>{workspace.name}</MenuItem>
          </Select>
          <Select
            value={projectId}
            size="small"
            onChange={(e) => setProjectId(e.target.value)}
            sx={{ color: '#fff', minWidth: 170, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a3a' }, '& .MuiSvgIcon-root': { color: '#aaa' } }}
          >
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            bgcolor: '#1a1a1a',
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            flexGrow: 1,
            maxWidth: 360,
            ml: 1,
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: 'grey.500', mr: 1 }} />
          <InputBase
            placeholder="Search agents, connectors, entities…"
            sx={{ color: '#fff', fontSize: '0.875rem', width: '100%' }}
            inputProps={{ 'aria-label': 'Global search' }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Switch environment (demo)">
          <Select
            value={environment}
            size="small"
            onChange={(e) => setEnvironment(e.target.value as Environment)}
            renderValue={(v) => (
              <Chip
                size="small"
                label={ENV_LABELS[v as Environment]}
                sx={{ bgcolor: ENV_COLOR[v as Environment], color: '#0A0A0A', fontWeight: 700 }}
              />
            )}
            sx={{ color: '#fff', minWidth: 130, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a3a' }, '& .MuiSvgIcon-root': { color: '#aaa' } }}
          >
            {(Object.keys(ENV_LABELS) as Environment[]).map((env) => (
              <MenuItem key={env} value={env}>
                {ENV_LABELS[env]}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>

        <Tooltip title="Notifications (demo)">
          <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)} aria-label="Notifications">
            <Badge badgeContent={3} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}>
          <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 700 }}>
            Demo notifications
          </MenuItem>
          <MenuItem onClick={() => setNotifAnchor(null)}>2 approvals awaiting your review</MenuItem>
          <MenuItem onClick={() => setNotifAnchor(null)}>1 workflow failed: none currently</MenuItem>
          <MenuItem onClick={() => setNotifAnchor(null)}>Security scan found 2 new findings</MenuItem>
        </Menu>

        <Tooltip title="Help">
          <IconButton color="inherit" aria-label="Help">
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile and role (demo role switcher)">
          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} aria-label="User profile menu">
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 700 }}>
              {role.name.slice(0, 1)}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">Demo user</Typography>
            <Typography variant="caption" color="text.secondary">
              Viewing as: {role.name}
            </Typography>
          </Box>
          <Divider />
          <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 700, fontSize: '0.75rem' }}>
            SWITCH ROLE (DEMO)
          </MenuItem>
          {roles.map((r) => (
            <MenuItem key={r.id} selected={r.id === roleId} onClick={() => setRoleId(r.id)}>
              <ListItemIcon>{r.id === roleId ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
              <ListItemText primary={r.name} secondary={r.description} secondaryTypographyProps={{ sx: { whiteSpace: 'normal' } }} />
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
