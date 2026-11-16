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
| **Q1 2027** | **Databricks Certified Data Engineer Associate**: sit **by 5 Mar** | Sprint 2: dimensional modelling, correctness, orchestration, Spark and Delta, governance |
| **Q2 2027** | **AZ-305** Azure Solutions Architect: sit **late June** → with AZ-104, *Azure Solutions Architect Expert* | Sprint 3: reliability, data platform, AI architecture, capstones |
| **Q3 2027** | **Databricks Certified Generative AI Engineer Associate**: sit **by 24 Sep** | Sprint 4: RAG, agents and tools, evaluation, serving and cost, building the minimal Applied D |

**Four certifications, no more** (decided 16 Nov 2026): Azure Solutions
Architect Expert (AZ-104 + AZ-305), Databricks Data Engineer Associate and
Databricks Generative AI Engineer Associate. Together they say *data and AI
architect*. Dropped: SC-500 (no exam page found on Microsoft Learn on
16 Nov 2026), AWS Solutions Architect – Associate and SC-100. Security stays
in the plan as knowledge, without an exam. Microsoft retired AI-102 on
30 June 2026, which is why the AI certification is Databricks'. Swap the
Databricks Data Engineer exam for DP-700 (Fabric Data Engineer) only if the
work platform moves to Fabric.

**Booking:** book each exam when you start its sprint. A date makes the plan
real. Pearson VUE allows rescheduling ahead of time (check the current
window), so book the target and move it only on evidence (practice scores),
not on feeling.

---

## The weekly rhythm (10 h)

Since 11 Oct 2026 the 10 hours are split three ways: **5 h exam track**, **3 h
mastering the guide's concepts**, **2 h coding**. The same table is on the
roadmap page under "Your week".

| Day | Hours | Block | What you do |
|---|---|---|---|
| Mon | 1 | **Coding** | Two LeetCode mediums, 25 min each on a timer; say the approach out loud before coding |
| Tue | 1 | **Concept A** | 10 min recalling last week's two concepts from memory; then the page, the diagram, a 2-minute explanation out loud |
| Wed | 1 | **Exam track: understand** | This week's roadmap item on Microsoft Learn, read through its architect's question |
| Thu | 1 | **Coding** | As Monday, plus redo one problem you failed before |
| Sat | 4 | **Exam track: understand, prove, decide** | 1 h finish the learning · 2 h the Azure spike (Bicep: deploy, check, tear down) · 1 h the ADR and saying it three ways |
| Sun | 2 | **Concept B, in depth** | The page, the chapter on its "Read" line, then its practice exercise (or the smallest version that teaches it); set mastery on the learning map |

- **Concept order:** the learning map's architect path, two concepts a week
  (about 10-12 months for all of it). Concepts that repeat each other count as
  one session. When a sprint covers the same ground, take the concepts from its
  page: 08 during Sprint 2, 07 during Q1's security weeks.
- **Exam weeks:** the last week of each sprint flips to 7 h of practice tests
  and weak areas, 1 h concept review, coding stays at 2 h.
- **Once a month:** Sunday becomes a mock interview: one applied design,
  35 minutes, out loud, timed; write down what you could not explain.
- **Mastered** means level 3 on the map: explained without notes, you know when
  not to use it, and the exercise is done.
- **Missed a session:** drop the concept, never the coding or the exam spike.

The exam block keeps its shape from the original plan: **understand** (the
domain through the architect's question behind it), **prove** (the smallest
Azure spike that tests the idea), **decide** (one ADR), **explain** (interview
answer, stakeholder line, teach it). In the final week of each sprint it flips
to practice tests, weak areas and the exam.

---|---|---|
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

**How to work each study week (weeks 1-7):**

1. **Read.** Read the Microsoft Learn modules for this week's topic and do the knowledge checks at the end of each module.
2. **Build.** Build it on Saturday. Use the official GitHub lab for this topic ([MicrosoftLearning/AZ-104-MicrosoftAzureAdministrator](https://github.com/MicrosoftLearning/AZ-104-MicrosoftAzureAdministrator)), then your Bicep version. Do each one at least once in the portal too, because the exam asks about portal steps.
3. **Write.** Write it down: the ADR and saying it three ways.

**Extra networking time (weeks 4-7).** The baseline practice assessment
(16 Oct) put networking lowest, at about 20%. In weeks 4-7, Tuesday's concept
hour moves to networking, so the exam track gets 6 h those weeks and concepts
get 2 h:

- **Weeks 4-5:** a head start, one module from the AZ-104 networking path each Tuesday.
- **Weeks 6-7:** redo the week's lab through the CLI and drill the questions you got wrong.

**Midpoint check (Mon 9 Nov).** Retake the free Microsoft practice assessment
(about 45 minutes), cold. Compare each section with the 16 Oct baseline: 40%
overall, networking about 20%, monitoring about 30%. Identity, governance and
storage should be around 70% or better by now. If networking is still under
40%, decide that week whether 4 Dec holds or the exam moves to mid-December.

**Exit:** AZ-104 passed, and the harness identity model designed and proven at work.

---

## Sprint 2: Databricks Data Engineer Associate + data engineering depth (7 Dec 2026 - 5 Mar 2027)

The skill to be expert in, made official. Read *Fundamentals of Data
Engineering* end to end through this sprint, with the Kimball chapters as
listed. Practise on a free Databricks workspace (Free Edition or a trial).
Weeks 11-12 fall over the December break and are kept light.

| Wk | Starts | Topic | The architect's decision | Prove / output |
|---|---|---|---|---|
| 9 | 7 Dec | Dimensional modelling (Kimball ch. 1-2) | **What is the grain, and which facts and dimensions follow?** | One sample mart as a star schema, grain in one sentence |
| 10 | 14 Dec | Modelling your domain (Kimball ch. 4, 5, 6, 7, 12) | **Snapshot, transaction or accumulating fact?** | A bus matrix for a fictional distribution group |
| 11 | 21 Dec | *Holiday: light.* Reading week (*Fundamentals of Data Engineering*) | | |
| 12 | 28 Dec | *Holiday: light.* Catch-up | | |
| 13 | 4 Jan | Data correctness: reconciliation, dbt tests, contracts (*Data Quality Fundamentals* ch. 3-5) | **How do you prove the numbers match the source?** | Reconciliation tests that fail a bad load |
| 14 | 11 Jan | Orchestration: assets, partitions, backfills | **How does a pipeline recover without double-loading?** | A partitioned backfill and a safe one-day rerun |
| 15 | 18 Jan | Spark and Delta Lake | **When does a single node stop being enough?** | The same mart on DuckDB and on Databricks, time and cost compared |
| 16 | 25 Jan | Incremental ingestion and CDC, medallion layers | **Full, incremental or CDC per source?** | Bronze to gold for one source, incremental and rerunnable |
| 17 | 1 Feb | Declarative pipelines and jobs | **Declarative or hand-written: what do you give up?** | A scheduled pipeline with data-quality expectations |
| 18 | 8 Feb | Governance: Unity Catalog, masking, row filters, POPIA (*Data Governance* ch. 7) | **Who can see which data, and how is that enforced?** | Row-level access for two users from one entitlement table |
| 19 | 15 Feb | Identity and security for data | **How do pipelines reach data without a shared key?** | A pipeline with no stored credential |
| 20-21 | 22 Feb | **Practice tests → sit Databricks Data Engineer Associate** (by 5 Mar) | | |

**Exit:** Databricks Data Engineer Associate passed; correctness and governance proven on sample data.

---

## Q1 remainder: AI security and delivery (8 Mar - 2 Apr 2027)

| Week of | Topic | The decisions |
|---|---|---|
| 8 Mar | **AI security and guardrails** | Threat model an AI system; prompt injection through data; tool permissions (*AI Engineering* ch. 5; Applied D §5-6) |
| 15 Mar | **Secure delivery** | Environments and promotion; CI/CD with OIDC and no stored credentials |
| 22 Mar | **Reliability and cost** | SLOs and error budgets, Well-Architected reviews, FinOps and cost models |
| 29 Mar | **Buffer** (Easter) | Catch up, or start the AZ-305 reading early |

---

## Sprint 3: AZ-305 + architecture capstones (5 Apr - 25 Jun 2027)

AZ-305 is *design*, and it draws on everything so far: identity, governance
and monitoring; data storage; business continuity; infrastructure.

| Weeks of | Topic | The decisions |
|---|---|---|
| 5 Apr, 12 Apr | **Identity, governance, monitoring design** | Revisit Sprints 1-2 as *designs*: landing zones, policy strategy, monitoring strategy |
| 19 Apr, 26 Apr | **Data platform architecture** | Lake vs warehouse vs lakehouse; batch vs CDC; modelling and correctness; serving; **batch or stream** from the freshness SLO (event time, windows, watermarks); data observability (freshness, volume, schema, distribution, lineage); **build vs buy: self-run vs Fabric vs Databricks** |
| 3 May | **Business continuity design** | RPO/RTO per tier, zones vs regions, backup vs replication |
| 10 May | **AI architecture** | Tools vs RAG (Azure AI Search), evaluation and trust, ML in the platform |
| 17 May, 24 May | **Capstone: Applied C, lakehouse under three constraints** | The same requirements solved lean, at scale with fresh data, and managed (Fabric) |
| 31 May | **Capstone: Applied D, AI operations assistant** | The site's Applied D page rebuilt from your own ADRs: identity, tools, retrieval, guardrails, evaluation, cost |
| 7 Jun - 25 Jun | **Practice tests → sit AZ-305** | Three weeks: AZ-305 is a design exam and rewards case-study practice |

**Exit:** *Azure Solutions Architect Expert*, and two capstones you can present.

---

## Sprint 4: Databricks Generative AI Engineer Associate (5 Jul - 30 Sep 2027)

Build the minimal Applied D as you go: the same retrieval, tools and
evaluation, on your own sample data. Microsoft retired AI-102 in June 2026,
so this is the AI certification.

| Weeks of | Topic | Prove |
|---|---|---|
| 5 Jul, 12 Jul | RAG on your own data (*AI Engineering* ch. 6; Applied D §3) | Hybrid retrieval with recall@6 measured |
| 19 Jul, 26 Jul | Agents and tools, MCP (Applied D §2, §4) | One read tool, one confirmed write tool |
| 2 Aug, 9 Aug | Evaluation and monitoring (*AI Engineering* ch. 3-4; Applied D §7) | An eval gate in CI |
| 16 Aug, 23 Aug | Serving, governance and cost (*AI Engineering* ch. 9-10; Applied D §5, §8) | Cost per question; an access test across two users |
| 30 Aug - 30 Sep | Practice tests → sit by 24 Sep, with a buffer week | |

---

## On the site (proposed)

A sidebar section, **Architecture track**, written *after* each sprint from
the ADRs and proofs:

| Page | From |
|---|---|
| **08 · Security architecture** (deeper than 07) | Q1 + Sprint 3 |
| **09 · Cloud architecture: Azure** | Sprints 1, 3 |
| **10 · Data platform architecture** | Sprint 3 |
| **11 · AI architecture** | Sprints 1-3 |
| **Applied C · Lakehouse under three constraints** | Sprint 3 |
| **Applied D · AI operations assistant** | Sprints 1-3 |
| **Architecture track study plan** (tickable, with the exam dates) | This document |

---

## Open questions

1. **AI harness detail:** which AI tools will users connect from (Claude
   Desktop, claude.ai, Copilot, a company web app), and which data first?
   That shapes the week 1-2 spikes.
2. **Exam booking:** happy to book AZ-104 for the week of 30 November now?
