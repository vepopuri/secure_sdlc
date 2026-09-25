import type { Framework } from '../../types/domain';
import { control, fn } from './helpers';

// NIST Secure Software Development Framework (SSDF), SP 800-218 — 4 practice
// groups covering the full software lifecycle.
export const ssdfFramework: Framework = {
  id: 'nist-ssdf',
  name: 'NIST Secure Software Development Framework',
  shortName: 'NIST SSDF',
  version: 'SP 800-218',
  description:
    'A set of fundamental, sound, and secure software development practices based on established standards and guidance.',
  reference: 'https://csrc.nist.gov/pubs/sp/800/218/final',
  functions: [
    fn('PO', 'Prepare the Organization', 'Ensure people, processes, and technology are prepared to perform secure software development.', [
      control('PO.1', 'Define Security Requirements for Software Development', 'Identify and document security requirements for the organization’s software.'),
      control('PO.2', 'Implement Roles & Responsibilities', 'Ensure the people performing secure development have the necessary roles and responsibilities defined.'),
      control('PO.3', 'Implement Supporting Toolchains', 'Use tools that help enforce security requirements and reduce manual effort.'),
      control('PO.4', 'Define Criteria for Software Security Checks', 'Define and use criteria for evaluating the effectiveness of security practices.'),
      control('PO.5', 'Implement & Maintain Secure Environments', 'Secure all components of the environments used for software development.'),
    ]),
    fn('PS', 'Protect the Software', 'Protect all components of software from tampering and unauthorized access.', [
      control('PS.1', 'Protect Code from Unauthorized Access & Tampering', 'Prevent unauthorized changes to code, both accidental and intentional.'),
      control('PS.2', 'Provide Provenance for Software Releases', 'Make it possible to trace a release back to its source and build process.'),
      control('PS.3', 'Archive & Protect Each Release', 'Preserve software releases, including components and provenance data, for future analysis.'),
    ]),
    fn('PW', 'Produce Well-Secured Software', 'Produce software with minimal security vulnerabilities.', [
      control('PW.1', 'Design Software to Meet Security Requirements', 'Identify and evaluate the security requirements and risks the design must address.'),
      control('PW.2', 'Review the Software Design', 'Confirm the software design satisfies security requirements before implementation.'),
      control('PW.4', 'Reuse Existing, Well-Secured Software', 'Reuse well-secured software components rather than duplicating functionality.'),
      control('PW.5', 'Create Source Code per Secure Coding Practices', 'Follow secure coding practices to reduce vulnerabilities in produced code.'),
      control('PW.6', 'Configure Compilation & Build Processes for Security', 'Configure the build toolchain to improve the security of the executable.'),
      control('PW.7', 'Review & Analyze Human-Readable Code', 'Identify vulnerabilities via code review and static analysis and confirm remediation.'),
      control('PW.8', 'Test Executable Code', 'Identify vulnerabilities via dynamic and other executable-level testing and confirm remediation.'),
      control('PW.9', 'Configure Software to Have Secure Settings by Default', 'Ensure the default configuration is the most secure feasible configuration.'),
    ]),
    fn('RV', 'Respond to Vulnerabilities', 'Identify residual vulnerabilities and respond appropriately.', [
      control('RV.1', 'Identify & Confirm Vulnerabilities', 'Continuously monitor for and confirm the presence of vulnerabilities.'),
      control('RV.2', 'Assess, Prioritize & Remediate Vulnerabilities', 'Analyze and prioritize confirmed vulnerabilities and remediate them.'),
      control('RV.3', 'Analyze Vulnerabilities to Identify Root Causes', 'Analyze vulnerabilities to identify their root cause and prevent recurrence.'),
    ]),
  ],
};
