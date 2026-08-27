// Calls Claude to generate a real remediation patch for a known finding.
// This is what upgrades the Remediation Agent from a template note to an
// actual AI-generated analysis + patch, gated behind ANTHROPIC_API_KEY.

import Anthropic from '@anthropic-ai/sdk';
import type { KnownFinding } from './findings.js';

const SYSTEM_PROMPT = `You are an expert DevSecOps and Autonomous Remediation Agent. Your job is to analyze software vulnerabilities (CVEs, SAST/DAST alerts, or misconfigurations) and generate safe, precise, production-ready code patches.

Execute your remediation process following these strict rules:

1. ANALYZE THE ROOT CAUSE: Brief identification of why the code is vulnerable. Do not rewrite unrelated logic.
2. APPLY THE PRINCIPLE OF LEAST PRIVILEGE/IMPACT: The fix must be minimal, idiomatic, and highly targeted. Avoid introducing heavy new libraries unless necessary.
3. PREVENT SIDE EFFECTS: Ensure the patch maintains the original business logic, handles edge cases (like null pointers or empty strings), and does not break backward compatibility.
4. ENFORCE SECURE CODING STANDARDS: Use standard, modern security patterns (e.g., parameterized queries for SQLi, proper escaping for XSS, strong cryptographic algorithms).
5. GENERATE THE PATCH: Output ONLY a valid Git Diff or a cleanly formatted code block replacing the vulnerable code. Do not include conversational filler in the final code output.

Provide your output in this exact structure:
### Root Cause Analysis
[1-2 sentences explaining the flaw]

### Remediation Patch
\`\`\`[language]
[Clean, patched code or Git Diff]
\`\`\`

### Verification & Test Strategy
- How to verify the fix: [1 short bullet]
- Potential regression risk to monitor: [1 short bullet]`;

export interface GeneratedPatch {
  markdown: string;
  model: string;
}

export async function generateRemediationPatch(finding: KnownFinding): Promise<GeneratedPatch> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured.');
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `Vulnerability Report:
- CVE: ${finding.cveId}
- Title: ${finding.title}
- Affected component: ${finding.module}
- Description: ${finding.description}

Target Code Snippet:
\`\`\`${finding.language}
${finding.codeSnippet}
\`\`\`

Language/Framework: ${finding.language} (Node.js)`;

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 2048,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  let markdown = '';
  for (const block of response.content) {
    if (block.type === 'text') {
      markdown += block.text;
    }
  }
  markdown = markdown.trim();

  if (!markdown) {
    throw new Error(`Model produced no text output (stop_reason: ${response.stop_reason}).`);
  }

  return { markdown, model: response.model };
}
