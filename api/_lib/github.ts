// Minimal GitHub REST API client for the live Remediation Agent integration.
// Uses only native fetch (available in the Vercel Node runtime) — no SDK
// dependency needed for the handful of calls this demo makes.

const GITHUB_API = 'https://api.github.com';

export class GitHubApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'agentic-sdlc-platform-demo',
  };
}

async function gh<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: { ...authHeaders(token), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new GitHubApiError(res.status, `GitHub API ${path} failed: ${res.status} ${body.slice(0, 300)}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface RepoInfo {
  default_branch: string;
}

export function getRepo(token: string, owner: string, repo: string): Promise<RepoInfo> {
  return gh<RepoInfo>(token, `/repos/${owner}/${repo}`);
}

export async function getBranchHeadSha(token: string, owner: string, repo: string, branch: string): Promise<string | null> {
  try {
    const ref = await gh<{ object: { sha: string } }>(token, `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
    return ref.object.sha;
  } catch (err) {
    if (err instanceof GitHubApiError && err.status === 404) return null;
    throw err;
  }
}

export function createBranch(token: string, owner: string, repo: string, branch: string, fromSha: string): Promise<unknown> {
  return gh(token, `/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: fromSha }),
  });
}

export async function getFileSha(token: string, owner: string, repo: string, path: string, branch: string): Promise<string | null> {
  try {
    const file = await gh<{ sha: string }>(
      token,
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
    );
    return file.sha;
  } catch (err) {
    if (err instanceof GitHubApiError && err.status === 404) return null;
    throw err;
  }
}

export function putFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string,
  content: string,
  message: string,
  existingSha: string | null,
): Promise<unknown> {
  return gh(token, `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });
}

export interface PullRequest {
  number: number;
  html_url: string;
  state: string;
}

export async function findOpenPullRequestForBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string,
): Promise<PullRequest | null> {
  const prs = await gh<PullRequest[]>(token, `/repos/${owner}/${repo}/pulls?head=${owner}:${branch}&state=open`);
  return prs[0] ?? null;
}

export function createPullRequest(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  base: string,
  title: string,
  body: string,
): Promise<PullRequest> {
  return gh<PullRequest>(token, `/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, head: branch, base, body, draft: true }),
  });
}
