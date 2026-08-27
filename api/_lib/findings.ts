// Whitelist of findings the live Remediation Agent is allowed to act on.
// Deliberately small and explicit: the server never accepts free-form
// finding data from the client, only a known id from this map.

export interface KnownFinding {
  id: string;
  cveId: string;
  title: string;
  module: string;
  description: string;
}

export const KNOWN_FINDINGS: Record<string, KnownFinding> = {
  cve_auth_2024_1111: {
    id: 'cve_auth_2024_1111',
    cveId: 'CVE-2024-11xx',
    title: 'Insecure token refresh in authentication module',
    module: 'Authentication Module',
    description:
      'Refresh tokens are not invalidated on rotation, enabling replay if a token leaks.',
  },
};
