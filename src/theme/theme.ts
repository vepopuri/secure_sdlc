import { createTheme } from '@mui/material/styles';

// Deloitte-inspired palette, as specified for the Agentic SDLC Platform.
export const palette = {
  green: '#86BC25',
  greenDark: '#6B9A1D',
  black: '#0A0A0A',
  charcoal: '#282728',
  blue: '#00A3E0',
  lightBg: '#F5F5F5',
  white: '#FFFFFF',
  amber: '#B98900',
  red: '#C4262E',
};

declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      charcoal: string;
      black: string;
      blue: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      charcoal: string;
      black: string;
      blue: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.green, dark: palette.greenDark, contrastText: '#0A0A0A' },
    secondary: { main: palette.blue, contrastText: '#FFFFFF' },
    warning: { main: palette.amber },
    error: { main: palette.red },
    background: { default: palette.lightBg, paper: palette.white },
    text: { primary: '#1A1A1A', secondary: '#54534F' },
    brand: { charcoal: palette.charcoal, black: palette.black, blue: palette.blue },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.1rem' },
    h2: { fontWeight: 700, fontSize: '1.6rem' },
    h3: { fontWeight: 600, fontSize: '1.3rem' },
    h4: { fontWeight: 600, fontSize: '1.1rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.9rem' },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E1DD',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.75rem' },
      },
    },
  },
});
