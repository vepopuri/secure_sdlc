import { createTheme } from '@mui/material/styles';

// Octopus ocean/ink palette — one governing "brain," many specialized agent "limbs."
export const palette = {
  ink: '#04070B',
  abyss: '#101820',
  abyssLight: '#1B2731',
  teal: '#17B6C4',
  tealDark: '#0E838D',
  indigo: '#3E6FFA',
  glow: '#5EEAD4',
  lightBg: '#F4F6F7',
  white: '#FFFFFF',
  amber: '#E0A526',
  red: '#D6323B',
  sky: '#38BDF8',
};

// Dedicated chart colors — kept distinct from primary/secondary so trend lines read as
// their own semantic (positive/negative/neutral) rather than borrowing brand chrome.
export const chartColors = {
  positive: '#2FBF71',
  negative: palette.red,
  neutral: palette.amber,
};

declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      charcoal: string;
      black: string;
      blue: string;
      glow: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      charcoal: string;
      black: string;
      blue: string;
      glow: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.teal, dark: palette.tealDark, contrastText: palette.ink },
    secondary: { main: palette.indigo, contrastText: '#FFFFFF' },
    warning: { main: palette.amber },
    error: { main: palette.red },
    info: { main: palette.sky },
    background: { default: palette.lightBg, paper: palette.white },
    text: { primary: '#12181D', secondary: '#56636B' },
    brand: { charcoal: palette.abyss, black: palette.ink, blue: palette.indigo, glow: palette.glow },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.7rem', letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, fontSize: '1.35rem' },
    h4: { fontWeight: 600, fontSize: '1.1rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.9rem' },
    subtitle1: { fontWeight: 500 },
    overline: { fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.09em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: '18px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: '0 1px 2px rgba(4,7,11,0.06), 0 8px 20px rgba(4,7,11,0.05)',
          transition: 'box-shadow 180ms ease',
          '&:hover': { boxShadow: '0 2px 4px rgba(4,7,11,0.08), 0 14px 32px rgba(4,7,11,0.08)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
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
    // Detail drawers (agent/connector/KG entity) render at zIndex 1400 so they sit above
    // the header — higher than MUI's default Popover/Menu zIndex (1300). Without this, a
    // Select's dropdown menu opened inside one of those drawers renders behind it and its
    // options become unclickable.
    MuiPopover: {
      styleOverrides: {
        root: { zIndex: 1500 },
      },
    },
  },
});
