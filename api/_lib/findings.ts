// Whitelist of findings the live Remediation Agent is allowed to act on.
// Deliberately small and explicit: the server never accepts free-form
// finding data from the client, only a known id from this map.
//
// codeSnippet is a small, clearly-labeled SAMPLE illustrating the flaw
// described by the finding — this repository has no real backend with an
// actual vulnerable auth handler, so the agent demonstrates its patch
// generation against a representative snippet rather than faking a fix
// for code that doesn't exist here.

export interface KnownFinding {
  id: string;
  cveId: string;
  title: string;
  module: string;
  description: string;
  language: string;
  codeSnippet: string;
}

export const KNOWN_FINDINGS: Record<string, KnownFinding> = {
  cve_auth_2024_1111: {
    id: 'cve_auth_2024_1111',
    cveId: 'CVE-2024-11xx',
    title: 'Insecure token refresh in authentication module',
    module: 'Authentication Module',
    description:
      'Refresh tokens are not invalidated on rotation, enabling replay if a token leaks.',
    language: 'typescript',
    codeSnippet: `// routes/auth/refresh.ts — sample handler illustrating the flaw
export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const record = await db.refreshTokens.findByToken(refreshToken);

  if (!record || record.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // BUG: the old refresh token is never revoked, so it remains valid
  // after rotation and can be replayed if it was ever intercepted.
  const newAccessToken = signAccessToken(record.userId);
  const newRefreshToken = await db.refreshTokens.create(record.userId);

  return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}`,
  },
};
