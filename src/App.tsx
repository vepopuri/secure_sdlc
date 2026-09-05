import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { SdlcPhasesPage } from './pages/SdlcPhasesPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailsPage } from './pages/AgentDetailsPage';
import { AgentWorkflowPage } from './pages/AgentWorkflowPage';
import { McpConnectionsPage } from './pages/McpConnectionsPage';
import { ConnectorDetailsPage } from './pages/ConnectorDetailsPage';
import { ConnectorWorkflowPage } from './pages/ConnectorWorkflowPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { KgEntityDetailsPage } from './pages/KgEntityDetailsPage';
import { PlatformComponentsPage } from './pages/PlatformComponentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { WorkflowDetailsPage } from './pages/WorkflowDetailsPage';
import { WorkflowStepDetailsPage } from './pages/WorkflowStepDetailsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { SecurityCompliancePage } from './pages/SecurityCompliancePage';
import { ActivityAuditPage } from './pages/ActivityAuditPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/phases" element={<SdlcPhasesPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agents/:agentId" element={<AgentDetailsPage />} />
        <Route path="/agents/:agentId/workflow" element={<AgentWorkflowPage />} />
        <Route path="/mcp" element={<McpConnectionsPage />} />
        <Route path="/mcp/:connectorId" element={<ConnectorDetailsPage />} />
        <Route path="/mcp/:connectorId/workflow" element={<ConnectorWorkflowPage />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
        <Route path="/knowledge-graph/:entityId" element={<KgEntityDetailsPage />} />
        <Route path="/components" element={<PlatformComponentsPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/workflows/:workflowId" element={<WorkflowDetailsPage />} />
        <Route path="/workflows/:workflowId/steps/:stepId" element={<WorkflowStepDetailsPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/security" element={<SecurityCompliancePage />} />
        <Route path="/audit" element={<ActivityAuditPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<OverviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;
