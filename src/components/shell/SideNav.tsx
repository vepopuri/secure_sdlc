import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';

export const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', path: '/', icon: DashboardOutlinedIcon },
  { key: 'get-started', label: 'Get Started', path: '/get-started', icon: RocketLaunchOutlinedIcon },
  { key: 'phases', label: 'SDLC Phases', path: '/phases', icon: AccountTreeOutlinedIcon },
  { key: 'agents', label: 'Agents', path: '/agents', icon: SmartToyOutlinedIcon },
  { key: 'mcp', label: 'MCP Connections', path: '/mcp', icon: HubOutlinedIcon },
  { key: 'knowledge-graph', label: 'Knowledge Graph', path: '/knowledge-graph', icon: ShareOutlinedIcon },
  { key: 'components', label: 'Platform Components', path: '/components', icon: WidgetsOutlinedIcon },
  { key: 'workflows', label: 'Workflows', path: '/workflows', icon: PlayCircleOutlinedIcon },
  { key: 'approvals', label: 'Approvals', path: '/approvals', icon: FactCheckOutlinedIcon },
  { key: 'security', label: 'Security and Compliance', path: '/security', icon: ShieldOutlinedIcon },
  { key: 'audit', label: 'Activity and Audit', path: '/audit', icon: HistoryOutlinedIcon },
  { key: 'settings', label: 'Settings', path: '/settings', icon: SettingsOutlinedIcon },
];

export const DRAWER_WIDTH = 248;

export function SideNav({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAppState();

  const visible = NAV_ITEMS.filter((item) => role.visibleTabs.includes(item.key));

  const content = (
    <Box sx={{ bgcolor: 'brand.charcoal', height: '100%', color: '#fff' }}>
      <Toolbar />
      <List sx={{ px: 1, pt: 1 }}>
        {visible.map((item) => {
          const Icon = item.icon;
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.key}
              selected={active}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                color: active ? '#0A0A0A' : '#E4E4E2',
                bgcolor: active ? 'primary.main' : 'transparent',
                '&:hover': { bgcolor: active ? 'primary.main' : 'rgba(255,255,255,0.08)' },
                '&.Mui-selected': { bgcolor: 'primary.main' },
                '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <ListItemIcon sx={{ color: active ? '#0A0A0A' : '#B7B6B2', minWidth: 36 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500 }} primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider sx={{ borderColor: '#3a3a3a', mx: 2, my: 1 }} />
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" sx={{ color: '#8b8a86' }}>
          Viewing as
        </Typography>
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
          {role.name}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
        open
      >
        {content}
      </Drawer>
    </Box>
  );
}
