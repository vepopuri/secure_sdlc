import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import { AppDataProvider } from './context/AppDataContext';
import { AppShell } from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import EvidencePage from './pages/EvidencePage';
import AssessmentPage from './pages/AssessmentPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/evidence" element={<EvidencePage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </AppDataProvider>
    </ThemeProvider>
  );
}
