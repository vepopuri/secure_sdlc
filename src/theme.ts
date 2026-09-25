import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2a78d6' },
    secondary: { main: '#eb6834' },
    background: { default: '#f9f9f7', paper: '#fcfcfb' },
    text: { primary: '#0b0b0b', secondary: '#52514e' },
    success: { main: '#0ca30c' },
    warning: { main: '#fab219' },
    error: { main: '#d03b3b' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#fcfcfb', color: '#0b0b0b' },
      },
    },
  },
});
