import type { Framework } from '../../types/domain';
import { control, fn } from './helpers';

// OWASP Software Assurance Maturity Model (SAMM) v2 — 5 business functions,
// 3 practices each, 2 streams (A/B) per practice. Each stream is modeled as
// a control so an assessor can rate A and B independently.
export const sammFramework: Framework = {
  id: 'owasp-samm',
  name: 'OWASP Software Assurance Maturity Model',
  shortName: 'OWASP SAMM',
  version: 'v2',
  description:
    'An open framework to help organizations formulate and implement a software security strategy tailored to their specific risks.',
  reference: 'https://owaspsamm.org/model/',
  functions: [
    fn('Governance', 'Governance', 'Manage software security activities holistically across the organization.', [
      control('SM-A', 'Strategy & Metrics: Risk Strategy', 'Understand the business risk profile and align a security strategy to it.'),
      control('SM-B', 'Strategy & Metrics: Metrics', 'Measure the effectiveness of the security program with meaningful metrics.'),
      control('PC-A', 'Policy & Compliance: Policy & Standards', 'Define and communicate security policies and standards for software development.'),
      control('PC-B', 'Policy & Compliance: Compliance Management', 'Track and manage compliance with internal and external requirements.'),
      control('EG-A', 'Education & Guidance: Training & Awareness', 'Provide role-specific security training to build capability.'),
      control('EG-B', 'Education & Guidance: Organization & Culture', 'Establish supporting processes and incentives that reinforce secure behavior.'),
    ]),
    fn('Design', 'Design', 'Build security into the design of software through risk-driven requirements and architecture.', [
      control('TA-A', 'Threat Assessment: Application Risk Profile', 'Identify and maintain a risk profile for each application.'),
      control('TA-B', 'Threat Assessment: Threat Modeling', 'Identify and evaluate application-level threats through structured threat modeling.'),
      control('SR-A', 'Security Requirements: Software Requirements', 'Derive security requirements from the risk profile and applicable standards.'),
      control('SR-B', 'Security Requirements: Supplier Security', 'Evaluate and manage the security posture of third-party components and suppliers.'),
      control('SA-A', 'Security Architecture: Architecture Design', 'Provide reusable, secure-by-design architecture patterns and reference designs.'),
      control('SA-B', 'Security Architecture: Technology Management', 'Manage the security implications of the technology stack over its lifecycle.'),
    ]),
    fn('Implementation', 'Implementation', 'Establish secure and repeatable build, deployment, and defect-management processes.', [
      control('SB-A', 'Secure Build: Build Process', 'Use a repeatable, hardened build process for all software components.'),
      control('SB-B', 'Secure Build: Software Dependencies', 'Manage the security of third-party and open-source dependencies used in the build.'),
      control('SD-A', 'Secure Deployment: Deployment Process', 'Use a repeatable, auditable process to deploy software into production.'),
      control('SD-B', 'Secure Deployment: Secret Management', 'Protect credentials, keys, and other secrets used across the deployment pipeline.'),
      control('DM-A', 'Defect Management: Defect Tracking', 'Track security defects with the same rigor as other quality defects.'),
      control('DM-B', 'Defect Management: Defect Response', 'Define and follow a process to respond to and remediate discovered defects.'),
    ]),
    fn('Verification', 'Verification', 'Verify that software meets security requirements through assessment and testing.', [
      control('AA-A', 'Architecture Assessment: Architecture Validation', 'Validate that the implemented architecture matches the intended secure design.'),
      control('AA-B', 'Architecture Assessment: Architecture Compliance', 'Confirm architecture continues to comply with standards as the system evolves.'),
      control('RT-A', 'Requirements-driven Testing: Control Verification', 'Verify that specified security controls are implemented correctly.'),
      control('RT-B', 'Requirements-driven Testing: Misuse/Abuse Testing', 'Test for how the software behaves under intentional misuse or abuse.'),
      control('ST-A', 'Security Testing: Scalable Baseline', 'Apply automated security testing (SAST/DAST/SCA) at scale across the portfolio.'),
      control('ST-B', 'Security Testing: Deep Understanding', 'Apply deep, manual security testing (e.g. penetration testing) for higher-risk applications.'),
    ]),
    fn('Operations', 'Operations', 'Maintain the security posture of software once it is running in production.', [
      control('IM-A', 'Incident Management: Incident Detection', 'Detect security incidents affecting in-scope applications and infrastructure.'),
      control('IM-B', 'Incident Management: Incident Response', 'Respond to, contain, and learn from security incidents.'),
      control('EM-A', 'Environment Management: Configuration Hardening', 'Harden and baseline the configuration of runtime environments.'),
      control('EM-B', 'Environment Management: Patching & Updating', 'Keep runtime environments and dependencies patched against known vulnerabilities.'),
      control('OM-A', 'Operational Management: Data Protection', 'Protect sensitive data handled by the application in production.'),
      control('OM-B', 'Operational Management: Legacy Management', 'Manage the security risk of legacy and end-of-life systems.'),
    ]),
  ],
};
