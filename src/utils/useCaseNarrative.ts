import type { Agent, McpConnector } from '../types/domain';
import { mcpConnectors } from '../data/mcpConnectors';
import { KG_DOMAINS } from '../data/knowledgeGraph';

const APPROVAL_LEVEL_LABELS = ['Read-only', 'Reversible non-production write', 'Controlled change', 'High-impact or production action'];

function kgDomainLabels(domainIds: string[]): string {
  if (domainIds.length === 0) return 'none';
  return domainIds.map((id) => KG_DOMAINS.find((d) => d.id === id)?.label ?? id).join(', ');
}

/**
 * A step-by-step sample walkthrough built entirely from the agent's own real fields
 * (inputs, connectors, capabilities, KG domains, approval policy) — no invented facts,
 * so it can never drift out of sync with what the agent actually does.
 */
export function buildAgentUseCase(agent: Agent): string[] {
  const connectorNames = agent.requiredMcpConnectorIds.map((id) => mcpConnectors.find((c) => c.id === id)?.name ?? id);

  const steps: string[] = [
    `Trigger — ${agent.inputs[0]}${agent.inputs.length > 1 ? ` (or ${agent.inputs.slice(1).join(', ')})` : ''} reaches the ${agent.name}.`,
  ];

  const contextParts: string[] = [];
  if (agent.kgEntitiesRead.length > 0) contextParts.push(`reads ${kgDomainLabels(agent.kgEntitiesRead)} context from the Knowledge Graph`);
  if (connectorNames.length > 0) contextParts.push(`calls ${connectorNames.join(', ')} through the MCP Gateway`);
  steps.push(
    contextParts.length > 0
      ? `Gather context — it ${contextParts.join(' and ')}.`
      : `Gather context — it works from the trigger input alone, with no external calls required.`,
  );

  steps.push(
    `Act — using ${agent.capabilities[0] ?? 'its core capability'}${agent.allowedMcpTools[0] ? ` (e.g. \`${agent.allowedMcpTools[0]}\`)` : ''}, it produces ${agent.outputs.join(', ')}.`,
  );

  steps.push(
    agent.kgEntitiesWritten.length > 0
      ? `Record — the result is written back to ${kgDomainLabels(agent.kgEntitiesWritten)} in the Knowledge Graph and logged to the audit trail.`
      : `Record — nothing is written to the Knowledge Graph; the output is logged to the audit trail.`,
  );

  steps.push(
    agent.approvalRequired
      ? `Gate — because this is a ${APPROVAL_LEVEL_LABELS[agent.approvalLevel]} action, a human reviewer approves it in the Approvals tab before it takes effect.`
      : `Gate — this is a read-only, no-approval action: it runs automatically and stays fully auditable.`,
  );

  return steps;
}

/**
 * A step-by-step sample call walkthrough for an MCP connector, built from its own real
 * permissions/data-type fields plus the agents that actually use it.
 */
export function buildConnectorUseCase(connector: McpConnector, usingAgents: Agent[]): string[] {
  const exampleAgent = usingAgents[0]?.name ?? 'An agent';
  const permission = connector.readPermissions[0] ?? connector.writePermissions[0] ?? 'access this connector';
  // The Gateway is itself one of the two platform services — its own page shouldn't describe
  // a call being routed "through the Gateway" before reaching the Gateway.
  const isGatewayItself = connector.id === 'mcp_gateway_registry';

  return [
    `Request — ${exampleAgent} needs to ${permission.toLowerCase()}.`,
    isGatewayItself
      ? `Route — ${connector.name} itself checks the agent's allowlist and enforces any approval gate before the call proceeds.`
      : `Route — the call goes through the MCP Gateway, which checks the agent's allowlist and enforces any approval gate before it reaches ${connector.name}.`,
    `Execute — ${connector.name} carries out the call against ${connector.connectedSystems.join(', ')}${
      connector.capabilities?.[0] ? `, using ${connector.capabilities[0]}` : ''
    }.`,
    isGatewayItself
      ? `Return — the result (${connector.dataTypes.slice(0, 3).join(', ')}${connector.dataTypes.length > 3 ? ', …' : ''}) flows back to the agent, and the exchange is recorded in the audit log.`
      : `Return — the result (${connector.dataTypes.slice(0, 3).join(', ')}${connector.dataTypes.length > 3 ? ', …' : ''}) flows back through the Gateway to the agent, and the exchange is recorded in the audit log.`,
  ];
}
