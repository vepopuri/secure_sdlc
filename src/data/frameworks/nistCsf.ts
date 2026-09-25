import type { Framework } from '../../types/domain';
import { control, fn } from './helpers';

// NIST Cybersecurity Framework (CSF) 2.0 — 6 functions. Modeled at the
// category level (not full subcategory granularity) to keep the catalog a
// manageable size for an initial assessment; a backend can later expand
// any category into its full set of subcategories without changing the shape.
export const nistCsfFramework: Framework = {
  id: 'nist-csf',
  name: 'NIST Cybersecurity Framework',
  shortName: 'NIST CSF 2.0',
  version: '2.0',
  description:
    'Guidance for managing cybersecurity risk, organized around six functions from governance through recovery.',
  reference: 'https://www.nist.gov/cyberframework',
  functions: [
    fn('GV', 'Govern', 'Establish, communicate, and monitor the organization’s cybersecurity risk management strategy.', [
      control('GV.OC', 'Organizational Context', 'Understand the mission, stakeholders, and legal/regulatory context that inform cybersecurity risk decisions.'),
      control('GV.RM', 'Risk Management Strategy', 'Establish organizational priorities, constraints, and risk tolerance to support decisions.'),
      control('GV.RR', 'Roles, Responsibilities & Authorities', 'Establish and communicate cybersecurity roles, responsibilities, and authorities.'),
      control('GV.PO', 'Policy', 'Establish and communicate organizational cybersecurity policy.'),
      control('GV.OV', 'Oversight', 'Use results of cybersecurity risk management to inform and improve strategy.'),
      control('GV.SC', 'Cybersecurity Supply Chain Risk Management', 'Identify, establish, and manage supply chain risk processes with stakeholders.'),
    ]),
    fn('ID', 'Identify', 'Understand the organization’s assets, risks, and improvement opportunities.', [
      control('ID.AM', 'Asset Management', 'Inventory assets (data, devices, systems, software, services) consistent with their relative importance.'),
      control('ID.RA', 'Risk Assessment', 'Understand the cybersecurity risk to the organization, assets, and individuals.'),
      control('ID.IM', 'Improvement', 'Identify improvements from evaluations, lessons learned, and testing.'),
    ]),
    fn('PR', 'Protect', 'Use safeguards to manage cybersecurity risk to selected assets.', [
      control('PR.AA', 'Identity Management, Authentication & Access Control', 'Limit access to physical and logical assets to authorized users, services, and devices.'),
      control('PR.AT', 'Awareness & Training', 'Provide personnel with cybersecurity awareness and training aligned to their roles.'),
      control('PR.DS', 'Data Security', 'Manage data consistent with the organization’s risk strategy to protect confidentiality, integrity, and availability.'),
      control('PR.PS', 'Platform Security', 'Manage the security of hardware, software, and services of physical and virtual platforms.'),
      control('PR.IR', 'Technology Infrastructure Resilience', 'Manage security architectures to protect asset confidentiality, integrity, availability, and resilience.'),
    ]),
    fn('DE', 'Detect', 'Find and analyze possible cybersecurity attacks and compromises.', [
      control('DE.CM', 'Continuous Monitoring', 'Monitor assets to find anomalies, indicators of compromise, and other potentially adverse events.'),
      control('DE.AE', 'Adverse Event Analysis', 'Analyze anomalies and adverse events to characterize them and detect cybersecurity incidents.'),
    ]),
    fn('RS', 'Respond', 'Take action regarding a detected cybersecurity incident.', [
      control('RS.MA', 'Incident Management', 'Manage incident response actions per an established process, including triage and escalation.'),
      control('RS.AN', 'Incident Analysis', 'Investigate and validate incidents to support response and recovery activities.'),
      control('RS.CO', 'Incident Response Reporting & Communication', 'Coordinate response with internal and external stakeholders.'),
      control('RS.MI', 'Incident Mitigation', 'Take actions to prevent expansion of an event and mitigate its effects.'),
    ]),
    fn('RC', 'Recover', 'Restore assets and operations affected by a cybersecurity incident.', [
      control('RC.RP', 'Incident Recovery Plan Execution', 'Execute restoration activities to ensure availability of affected systems and services.'),
      control('RC.CO', 'Incident Recovery Communication', 'Coordinate restoration activities with internal and external parties.'),
    ]),
  ],
};
