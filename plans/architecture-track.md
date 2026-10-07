# Solutions architecture track: security, cloud, data, AI

**Status:** draft for review, not published. **Pace:** 10 h/week personal.
**Goal:** design, defend and explain the systems you work on, as a
**solutions architect** and **senior backend engineer**: in interviews,
with stakeholders, and when teaching the team. Infra, DevOps and security are
learned to **architect depth**: enough to design, review and lead them, not
to operate them.

**Solutions, not tools.** Every week is a *decision*: the problem, the
options, the trade-offs, and when you'd choose differently. Products appear
as examples and as the means of a small proof, never as the goal. The exams
are milestones along the way; they don't set the destination.

**The lab is Azure** (cloud budget): small proofs in **Bicep**, torn down
afterwards. The homelab comes later, in its own repo.

**Public/private rule.** This repo is public (GitHub Pages). Nothing from the
work platform goes here: no names, incidents, security gaps, costs or data.
Labs and pages use a fictional distribution group ("Northwind Cold Chain").
The mapping to the real system lives in private notes, and that is what you
talk about in interviews and with stakeholders.

---

## The calendar

| Quarter | Exam (target) | Track content that prepares you |
|---|---|---|
| **Q4 2026** | **AZ-104** Azure Administrator: sit **week of 30 Nov** | Sprint 1: Azure foundations + the company AI harness (work) |
| **Q1 2027** | **SC-500** Cloud and AI Security Engineer: sit **week of 1 Feb** | Sprint 2: security architecture, AI security, then secure delivery |
| **Q2 2027** | **AZ-305** Azure Solutions Architect: sit **late June** → with AZ-104, *Azure Solutions Architect Expert* | Sprint 3: reliability, data platform, AI architecture, capstones |
| **Q3 2027** | **AWS Solutions Architect – Associate**: sit **late September** | Sprint 4: translate every Azure decision to AWS, and back |
| *later, optional* | SC-100 Cybersecurity Architect | Check whether SC-500 counts as a prerequisite first |

**Stretch option:** sit SC-500 in December instead, *only if* AZ-104 is
passed by about 20 November *and* SC-500 practice tests score 80%+ by
early December. That means ~15 h/week through December leave. Decide on
1 December, not now.

**Booking:** book each exam when you start its sprint. A date makes the plan
real. Pearson VUE allows rescheduling ahead of time (check the current
window), so book the target and move it only on evidence (practice scores),
not on feeling.

---

## The weekly rhythm (10 h)

| Block | Hours | Output |
|---|---|---|
| **Understand**: the exam domain through the architect's question behind it (Microsoft Learn + docs) | 3 | A diagram and a one-page note |
| **Prove**: the smallest Azure spike that tests the idea | 3 | Bicep + a few lines of code, deployed, checked, torn down |
| **Decide**: one architecture decision record | 1 | ADR (context, options, decision, consequences, when to revisit) |
| **Explain**: say it three ways | 1 | Interview answer (2 min, out loud) · stakeholder line · teach it to someone |
| **Practice**: exam questions (sprint weeks) or a mock design interview | 2 | Score tracked weekly; every wrong answer becomes a one-line note |

In the final week of each sprint the rhythm flips to practice tests, weak
areas and the exam.

---

## Sprint 1: AZ-104 + the company AI harness (12 Oct - 4 Dec 2026)

The **AI harness** (remote MCP over company data, users connecting their own
AI tools as themselves) runs on **work time** in weeks 1-4, for the work
deadline. Personal hours go to AZ-104, but the spikes in weeks 1, 2 and 5
deliberately reuse harness building blocks (Entra app registrations,
Container Apps), so both sides help each other.

Domain weights below are from the AZ-104 skills outline as I know it. Check
the current outline on Microsoft Learn when you start.

| Wk | Starts | AZ-104 domain | The architect's decision | Prove |
|---|---|---|---|---|
| 1 | 12 Oct | Identities: Entra users, groups, external users, licences | **Whose identity does a system act as?** | Entra app registration; sign in to a remote MCP server as yourself |
| 2 | 19 Oct | Governance: RBAC scopes, management groups, Azure Policy, locks, tags, cost | **How is access organised for three teams?** | A management-group + RBAC design; a Policy denying public storage |
| 3 | 26 Oct | Storage: accounts, redundancy, SAS vs keys vs RBAC, private access, tiers and lifecycle, Files | **Which redundancy and access model, and why?** | Locked-down storage reachable only privately; lifecycle rules |
| 4 | 2 Nov | Compute I: VMs, availability sets and zones, scale sets, Bicep/ARM | **What level of availability is worth paying for?** | A zone-redundant VM pair from Bicep; break one zone's VM |
| 5 | 9 Nov | Compute II: App Service, Container Apps, ACI, ACR | **Where does code run?** (cost, scale, operations, cold start) | The same small API on App Service and Container Apps, compared |
| 6 | 16 Nov | Networking I: VNets, peering, NSG/ASG, routing, DNS | **How is the network shaped?** (flat vs hub-spoke) | Hub-spoke with peering; prove an NSG blocks what it should |
| 7 | 23 Nov | Networking II + Monitor: private endpoints, load balancing, VPN basics; Monitor, Log Analytics, alerts, Backup, Site Recovery | **How will you know it broke, and how fast can you recover?** | A private endpoint to a database; an outcome-based alert; a timed restore |
| 8 | 30 Nov | **Practice tests → sit AZ-104** | | |

**Exit:** AZ-104 passed, and the harness identity model designed and proven at work.

---

## Sprint 2: SC-500 + security architecture (7 Dec 2026 - 5 Feb 2027)

SC-500 domains: identity, access and governance (20-25%) · storage,
databases and networking (25-30%) · compute (20-25%) · security posture
(20-25%). **AI security is new and gets 25-30% of study time**, despite its
modest weight on paper: it's the newest content and the most relevant to
your work.

Weeks 11-12 fall over the December break: keep them light (one block each)
or use them as catch-up. That's already built into the dates.

| Wk | Starts | SC-500 domain | The architect's decision | Prove / output |
|---|---|---|---|---|
| 9 | 7 Dec | Threat modelling (the frame for everything after) | **What could go wrong, and what matters most?** | A threat model of the AI harness: data flows, trust boundaries, STRIDE |
| 10 | 14 Dec | Identity and access: conditional access, ID Protection, PIM, app and workload identities | **Which OAuth flow, and how much standing access?** | A sequence diagram per flow; just-in-time admin with PIM |
| 11 | 21 Dec | *Holiday: light.* Governance: Azure Policy at scale, Defender for Cloud regulatory compliance | **How do you keep a fleet compliant without reviewing every change?** | A policy initiative assigned and its compliance report read |
| 12 | 28 Dec | *Holiday: light.* Catch-up week | | |
| 13 | 4 Jan | Storage and databases: Key Vault, encryption and keys, SQL security, masking, row-level security, POPIA | **Who can see which data, and how is that enforced?** | An app with no secrets in config; RLS + masking for one consumer and for the harness |
| 14 | 11 Jan | Network security: Firewall, WAF, private endpoints, DDoS, egress control | **Private by default: what does it cost and what does it buy?** | The Sprint 1 network re-reviewed against the threat model |
| 15 | 18 Jan | Compute security: VMs, containers, App Service, managed identities, secure delivery (CI/CD with **OIDC, no stored credentials**) | **How does code reach production without anyone holding a key?** | A pipeline deploying to Azure with no stored credential |
| 16 | 25 Jan | **AI security**: Entra Agent ID, Defender for AI, AI gateway, prompt injection through data, tool permissions; posture: secure score, Sentinel basics | **What can an AI agent do, as whom, and how would you know?** | The harness threat model revisited for AI; an alert on a suspicious agent action |
| 17 | 1 Feb | **Practice tests → sit SC-500** | | |

**Exit:** SC-500 passed; a reviewed, threat-modelled design for the work AI harness.

---

## Q1 remainder: security review and delivery architecture (8 Feb - 2 Apr 2027)

From here, rows carry dates rather than week numbers.

| Weeks of | Topic | The decisions |
|---|---|---|
| 8 Feb, 15 Feb | **Security review and governance** | Running a security architecture review; risk registers; controls frameworks (CIS, ISO 27001) at stakeholder depth; a review template you can use at work |
| 22 Feb, 1 Mar | **Delivery architecture** | Environments and promotion, release strategies, feature flags; infrastructure as code as a team practice (modules, review, drift, ownership) |
| 8 Mar, 15 Mar | **Reliability and cost** | SLOs and error budgets, failure-mode analysis, the Well-Architected Framework as a review method; FinOps, cost models, managed vs self-run |
| 22 Mar, 29 Mar | **Buffer** (Easter falls here) | Catch up, or start the AZ-305 reading early |

---

## Sprint 3: AZ-305 + architecture capstones (5 Apr - 25 Jun 2027)

AZ-305 is *design*, and it draws on everything so far: identity, governance
and monitoring; data storage; business continuity; infrastructure.

| Weeks of | Topic | The decisions |
|---|---|---|
| 5 Apr, 12 Apr | **Identity, governance, monitoring design** | Revisit Sprints 1-2 as *designs*: landing zones, policy strategy, monitoring strategy |
| 19 Apr, 26 Apr | **Data platform architecture** | Lake vs warehouse vs lakehouse; batch vs CDC; modelling and correctness; serving; **build vs buy: self-run vs Fabric vs Databricks** |
| 3 May | **Business continuity design** | RPO/RTO per tier, zones vs regions, backup vs replication |
| 10 May | **AI architecture** | Tools vs RAG (Azure AI Search), evaluation and trust, ML in the platform |
| 17 May, 24 May | **Capstone: Applied C, lakehouse under three constraints** | The same requirements solved lean, at scale with fresh data, and managed (Fabric) |
| 31 May | **Capstone: Applied D, AI harness over company data** | The work problem as an interview-grade design: identity, curated tools, RLS, audit, evaluation, threat model |
| 7 Jun - 25 Jun | **Practice tests → sit AZ-305** | Three weeks: AZ-305 is a design exam and rewards case-study practice |

**Exit:** *Azure Solutions Architect Expert*, and two capstones you can present.

---

## Sprint 4: AWS Solutions Architect - Associate (5 Jul - 30 Sep 2027)

You learn AWS by **translating**, not from scratch: each week takes an Azure
decision you've already made and redoes it in AWS (and the AWS
Well-Architected Framework). That comparison is also strong interview
material: "in Azure I'd use X, in AWS Y, because…".

| Weeks of | Translate |
|---|---|
| 5 Jul, 12 Jul | Identity and access (IAM, Organizations, SCPs vs Entra/RBAC/Policy) |
| 19 Jul, 26 Jul | Networking (VPC, security groups vs NSGs, PrivateLink vs private endpoints) |
| 2 Aug, 9 Aug | Compute and storage (EC2/Lambda/ECS vs VMs/Functions/Container Apps; S3 vs Blob) |
| 16 Aug, 23 Aug | Data, resilience and cost (RDS/Aurora/DynamoDB, multi-AZ/region, cost tools) |
| 30 Aug - 30 Sep | Practice tests → sit AWS SAA (mid-to-late September), with a buffer week |

---

## On the site (proposed)

A sidebar section, **Architecture track**, written *after* each sprint from
the ADRs and proofs:

| Page | From |
|---|---|
| **08 · Security architecture** (deeper than 07) | Sprint 2 + Q1 |
| **09 · Cloud architecture: Azure and AWS** | Sprints 1, 3, 4 |
| **10 · Data platform architecture** | Sprint 3 |
| **11 · AI architecture** | Sprints 1-3 |
| **Applied C · Lakehouse under three constraints** | Sprint 3 |
| **Applied D · AI harness over company data** | Sprints 1-3 |
| **Architecture track study plan** (tickable, with the exam dates) | This document |

---

## Open questions

1. **AI harness detail:** which AI tools will users connect from (Claude
   Desktop, claude.ai, Copilot, a company web app), and which data first?
   That shapes the week 1-2 spikes.
2. **Exam booking:** happy to book AZ-104 for the week of 30 November now?
