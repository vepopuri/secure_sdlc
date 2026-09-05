import Chip from '@mui/material/Chip';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { StatusBadge } from '../common/StatusBadge';
import type { RunStatus, WorkflowStepEvent } from '../../types/domain';

export const STEP_KIND_ICONS: Record<WorkflowStepEvent['kind'], typeof SmartToyOutlinedIcon> = {
  agent_handoff: SmartToyOutlinedIcon,
  mcp_call: HubOutlinedIcon,
  kg_read: ShareOutlinedIcon,
  kg_write: ShareOutlinedIcon,
  policy_decision: PolicyOutlinedIcon,
  human_approval: GavelOutlinedIcon,
  output: CheckCircleOutlineIcon,
  error: ErrorOutlineIcon,
};

export const STEP_KIND_LABELS: Record<WorkflowStepEvent['kind'], string> = {
  agent_handoff: 'Agent handoff',
  mcp_call: 'MCP tool call',
  kg_read: 'Knowledge Graph read',
  kg_write: 'Knowledge Graph write',
  policy_decision: 'Policy decision',
  human_approval: 'Human approval',
  output: 'Output',
  error: 'Error',
};

export const STEP_DOT_COLOR: Record<string, 'success' | 'info' | 'error' | 'warning' | 'grey'> = {
  completed: 'success',
  running: 'info',
  failed: 'error',
  awaiting_approval: 'warning',
  blocked: 'error',
};

/** For a human_approval step, "Completed" is ambiguous — say plainly whether it was approved or is still pending. */
export function StepStatusChip({ step, status }: { step: WorkflowStepEvent; status?: RunStatus }) {
  if (!status) return <Chip size="small" variant="outlined" label="Pending" />;
  if (step.kind === 'human_approval') {
    if (status === 'completed') return <Chip size="small" color="success" label="Approved" />;
    if (status === 'awaiting_approval') return <Chip size="small" color="warning" label="Pending approval" />;
  }
  return <StatusBadge status={status} />;
}
