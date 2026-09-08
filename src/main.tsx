import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme/theme';
import { AppStateProvider } from './context/AppStateContext';
import { DataCacheProvider } from './context/DataCacheContext';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppStateProvider>
          <DataCacheProvider>
            <App />
          </DataCacheProvider>
        </AppStateProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
