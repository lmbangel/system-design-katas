/* ==========================================================================
   Architecture roadmap - roadmap.html
   One data list (ROADMAP, below) drives the exam countdowns, the timeline,
   the filters and the week rows. To change the plan, change the data.

   Ticks and "passed" marks are saved in this browser only (localStorage),
   like the interview checklist. The page works without storage, it just
   won't remember.

   Mirrors plans/architecture-track.md.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------- the plan */

  // Strands. Order is the filter order.
  var STRANDS = {
    security: 'Security',
    cloud:    'Cloud',
    data:     'Data',
    ai:       'AI',
    delivery: 'Delivery',
    exam:     'Exam'
  };

  // Each item: id (stable: progress is saved against it), start (a Monday),
  // weeks, title, q (the architect's decision), learn, prove, strands, and
  // optionally extra (where this week's extra hours go) and checkpoint (a dated
  // check that decides whether the plan or the exam date has to move).
  // A sprint's routine (read, build, write) shows on every study week in it;
  // exam weeks and light weeks skip it.
  var ROADMAP = [
    {
      id: 's1', anchor: 'sprint-1', name: 'Sprint 1 · Azure foundations',
      exam: { code: 'AZ-104', name: 'Azure Administrator', date: '2026-12-04' },
      note: 'The company AI harness runs on work time in weeks 1-4. The week 1, 2 and 5 proofs reuse its pieces, so both sides help each other.',
      routine: [
        { step: 'Read', text: 'Read the Microsoft Learn modules for this week\'s topic and do the knowledge checks at the end of each module.' },
        { step: 'Build', text: 'Build it on Saturday. Use the official GitHub lab for this topic (',
          link: { href: 'https://github.com/MicrosoftLearning/AZ-104-MicrosoftAzureAdministrator', text: 'MicrosoftLearning/AZ-104-MicrosoftAzureAdministrator' },
          after: '), then your Bicep version. Do each one at least once in the portal too, because the exam asks about portal steps.' },
        { step: 'Write', text: 'Write it down: the ADR and saying it three ways.' }
      ],
      items: [
        { id: 's1w1', start: '2026-10-12', weeks: 1, title: 'Identities', strands: ['cloud', 'security', 'ai'],
          q: 'Whose identity does a system act as?',
          learn: 'Entra ID users, groups, external users, licences; app registrations and service principals.',
          prove: 'An Entra app registration; sign in to a remote MCP server as yourself.' },
        { id: 's1w2', start: '2026-10-19', weeks: 1, title: 'Governance', strands: ['cloud', 'security'],
          q: 'How is access organised for three teams?',
          learn: 'RBAC scopes, management groups, Azure Policy, locks, tags, cost management.',
          prove: 'A management-group and RBAC design; a Policy that denies public storage.' },
        { id: 's1w3', start: '2026-10-26', weeks: 1, title: 'Storage', strands: ['cloud'],
          q: 'Which redundancy and access model, and why?',
          learn: 'Storage accounts, redundancy (LRS/ZRS/GRS), SAS vs keys vs RBAC, private access, tiers and lifecycle, Files.',
          prove: 'Locked-down storage reachable only privately, with lifecycle rules.' },
        { id: 's1w4', start: '2026-11-02', weeks: 1, title: 'Compute I: VMs and availability', strands: ['cloud'],
          q: 'What level of availability is worth paying for?',
          learn: 'VMs, availability sets and zones, scale sets, Bicep/ARM.',
          extra: 'Networking head start: Tuesday\'s concept hour becomes one module from the AZ-104 networking path, so the exam track gets 6 h this week. Networking was the weakest area on the baseline (about 20%).',
          prove: 'A zone-redundant VM pair from Bicep; break one zone\'s VM.' },
        { id: 's1w5', start: '2026-11-09', weeks: 1, title: 'Compute II: where code runs', strands: ['cloud'],
          q: 'Where does code run: VMs, App Service, Container Apps or Functions?',
          learn: 'App Service, Container Apps, ACI, ACR: cost, scale, operations, cold starts, limits.',
          extra: 'Networking head start: Tuesday\'s concept hour becomes one module from the AZ-104 networking path, so the exam track gets 6 h this week. Networking was the weakest area on the baseline (about 20%).',
          checkpoint: { date: '2026-11-09', title: 'Midpoint check',
            text: 'Retake the free Microsoft practice assessment (about 45 minutes), cold, no looking things up. Compare each section with the 16 October baseline: 40% overall, networking about 20%, monitoring about 30%. Identity, governance and storage should now be around 70% or better. If networking is still under 40%, decide this week whether 4 December holds or the exam moves to mid-December, and give weeks 6 and 7 whatever time they need.',
            link: { href: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/practice/assessment?assessment-type=practice&assessmentId=21', text: 'Open the practice assessment' } },
          prove: 'The same small API on App Service and Container Apps, compared.' },
        { id: 's1w6', start: '2026-11-16', weeks: 1, title: 'Networking I', strands: ['cloud', 'security'],
          q: 'How is the network shaped: flat or hub-spoke?',
          learn: 'VNets, peering, NSGs and ASGs, routing, DNS.',
          extra: 'Tuesday\'s concept hour goes to networking: redo the week\'s lab through the CLI and drill the questions you got wrong. The exam track gets 6 h this week.',
          prove: 'Hub-spoke with peering; prove an NSG blocks what it should.' },
        { id: 's1w7', start: '2026-11-23', weeks: 1, title: 'Networking II + monitoring', strands: ['cloud'],
          q: 'How will you know it broke, and how fast can you recover?',
          learn: 'Private endpoints, load balancing, VPN basics; Azure Monitor, Log Analytics, alerts, Backup, Site Recovery.',
          extra: 'Tuesday\'s concept hour goes to networking: redo the week\'s lab through the CLI and drill the questions you got wrong. The exam track gets 6 h this week.',
          prove: 'A private endpoint to a database; an outcome-based alert; a timed restore.' },
        { id: 's1w8', start: '2026-11-30', weeks: 1, title: 'Practice tests → sit AZ-104', strands: ['exam'],
          q: 'Are the practice scores telling you to sit, or to move the date?',
          learn: 'Full practice tests; every wrong answer becomes a one-line note.',
          prove: 'Sit the exam by Friday 4 December.' }
      ]
    },
    {
      id: 's2', anchor: 'sprint-2', name: 'Sprint 2 · Data engineering depth',
      exam: { code: 'Databricks DE', name: 'Databricks Data Engineer Associate', date: '2027-03-05' },
      note: 'The skill to be expert in, made official. Read Fundamentals of Data Engineering end to end through this sprint, with the Kimball chapters as listed. Practise on a free Databricks workspace (Free Edition or a trial).',
      items: [
        { id: 'dbx1', start: '2026-12-07', weeks: 1, title: 'Dimensional modelling', strands: ['data'],
          q: 'What is the grain, and which facts and dimensions follow from it?',
          learn: 'Kimball chapters 1-2: grain, facts, dimensions, conformed dimensions, slowly changing dimensions, the bus matrix (site 08 §7).',
          prove: 'One sample mart redesigned as a star schema, with its grain stated in one sentence.' },
        { id: 'dbx2', start: '2026-12-14', weeks: 1, title: 'Modelling your domain', strands: ['data'],
          q: 'Snapshot, transaction or accumulating fact: which one does each question need?',
          learn: 'Kimball chapters 4 Inventory, 5 Procurement, 6 Order Management, 7 Accounting, 12 Transportation.',
          prove: 'A bus matrix for a fictional distribution group: processes against conformed dimensions.' },
        { id: 'dbx3', start: '2026-12-21', weeks: 1, title: 'Reading week (holiday: light)', strands: ['data'], light: true,
          q: 'What does the whole data lifecycle look like, end to end?',
          learn: 'Fundamentals of Data Engineering, the lifecycle and architecture chapters.',
          prove: 'Nothing new. Read.' },
        { id: 'dbx4', start: '2026-12-28', weeks: 1, title: 'Catch-up (holiday)', strands: [], light: true,
          q: 'What slipped, and what needs a second pass?',
          learn: 'Whatever is behind.',
          prove: 'Nothing new. Rest counts.' },
        { id: 'dbx5', start: '2027-01-04', weeks: 1, title: 'Data correctness', strands: ['data'],
          q: 'How do you prove the numbers match the source?',
          learn: 'Reconciliation to control totals, dbt tests and contracts, freshness and volume checks (Data Quality Fundamentals chapters 3-5; site 08 §9, §12).',
          prove: 'Reconciliation tests that fail a load when a mart disagrees with its source.' },
        { id: 'dbx6', start: '2027-01-11', weeks: 1, title: 'Orchestration', strands: ['data'],
          q: 'How does a pipeline recover from a failed night without double-loading?',
          learn: 'Assets, partitions, backfills, retries and idempotent loads (site 08 §8).',
          prove: 'A partitioned asset that backfills a month and reruns one day safely.' },
        { id: 'dbx7', start: '2027-01-18', weeks: 1, title: 'Spark and Delta Lake', strands: ['data'],
          q: 'When does a single node stop being enough?',
          learn: 'DataFrames and Spark SQL, Delta tables, transactions on files, time travel, file layout (site 08 §2, §5).',
          prove: 'The same mart built on DuckDB and on Databricks, with run time and cost compared.' },
        { id: 'dbx8', start: '2027-01-25', weeks: 1, title: 'Incremental ingestion', strands: ['data'],
          q: 'Full, incremental or CDC: which load does each source deserve?',
          learn: 'Incremental loads, file ingestion, change data capture, the medallion layers on Databricks (site 08 §4, §6).',
          prove: 'Bronze to gold for one source, loaded incrementally and rerun safely.' },
        { id: 'dbx9', start: '2027-02-01', weeks: 1, title: 'Pipelines and jobs', strands: ['data'],
          q: 'Declarative pipeline or hand-written job: what do you give up?',
          learn: 'Declarative pipelines with expectations, jobs and scheduling, monitoring a run.',
          prove: 'The week 8 flow as a scheduled pipeline with data-quality expectations.' },
        { id: 'dbx10', start: '2027-02-08', weeks: 1, title: 'Governance on the platform', strands: ['data', 'security'],
          q: 'Who can see which data, and how is that enforced?',
          learn: 'Unity Catalog: catalogs, permissions, lineage; masking and row filters; POPIA (Data Governance chapter 7; site 08 §13 and the data governance case study).',
          prove: 'Row-level access for two test users, driven by one entitlement table.' },
        { id: 'dbx11', start: '2027-02-15', weeks: 1, title: 'Identity and security for data', strands: ['security', 'data'],
          q: 'How do pipelines and people reach the data without a shared key?',
          learn: 'Entra identities, managed identities and service principals, secrets, private access to storage.',
          prove: 'A pipeline that reads and writes with no stored credential.' },
        { id: 'dbx12', start: '2027-02-22', weeks: 2, title: 'Practice tests → sit Databricks Data Engineer Associate', strands: ['exam'],
          q: 'Are the practice scores telling you to sit, or to move the date?',
          learn: 'Full practice tests; every wrong answer becomes a one-line note.',
          prove: 'Sit the exam by Friday 5 March.' }
      ]
    },
    {
      id: 'q1', anchor: 'q1-review', name: 'Q1 · AI security and delivery',
      items: [
        { id: 'q1s1', start: '2027-03-08', weeks: 1, title: 'AI security and guardrails', strands: ['security', 'ai'],
          q: 'What can an AI agent do, as whom, and how would you know?',
          learn: 'Threat modelling an AI system (STRIDE, trust boundaries), prompt injection through data, tool permissions (AI Engineering chapter 5; site Applied D §5-6).',
          prove: 'A threat model of the AI harness, and one injection case that fails.' },
        { id: 'q1s2', start: '2027-03-15', weeks: 1, title: 'Secure delivery', strands: ['security', 'delivery'],
          q: 'How does code reach production without anyone holding a key?',
          learn: 'Environments and promotion, CI/CD with OIDC, release strategies.',
          prove: 'A pipeline that deploys to Azure with no stored credential.' },
        { id: 'q1s3', start: '2027-03-22', weeks: 1, title: 'Reliability and cost', strands: ['delivery', 'cloud'],
          q: 'What reliability is worth paying for, and what does it cost?',
          learn: 'SLOs and error budgets, failure-mode analysis, Well-Architected reviews; FinOps and cost models.',
          prove: 'An SLO and a cost model for one workload.' },
        { id: 'q1s4', start: '2027-03-29', weeks: 1, title: 'Buffer (Easter)', strands: [], light: true,
          q: 'Catch up, or start the AZ-305 reading early?',
          learn: 'Whatever is behind.',
          prove: 'Nothing new.' }
      ]
    },
    {
      id: 's3', anchor: 'sprint-3', name: 'Sprint 3 · Architecture design',
      exam: { code: 'AZ-305', name: 'Azure Solutions Architect', date: '2027-06-25' },
      note: 'AZ-104 plus AZ-305 award Microsoft Certified: Azure Solutions Architect Expert.',
      items: [
        { id: 's3a', start: '2027-04-05', weeks: 2, title: 'Identity, governance and monitoring design', strands: ['cloud', 'security'],
          q: 'What does the landing zone look like, and why?',
          learn: 'Sprints 1-2 revisited as designs: landing zones, policy strategy, monitoring strategy.',
          prove: 'A landing-zone design and its ADRs.' },
        { id: 's3b', start: '2027-04-19', weeks: 2, title: 'Data platform architecture', strands: ['data'],
          q: 'Lake, warehouse or lakehouse; batch or stream; build or buy?',
          learn: 'Batch vs CDC, modelling and correctness, serving; stream vs micro-batch vs batch from the freshness SLO, event time, windows and watermarks (Stream Analytics, Fabric Real-Time Intelligence); data observability: freshness, volume, schema, distribution, lineage; self-run vs Fabric vs Databricks (site 08 §11-12).',
          prove: 'A build-vs-buy comparison with numbers; a batch-or-stream decision per dataset from its SLO; the observability signals and owners for the tier-1 tables.' },
        { id: 's3c', start: '2027-05-03', weeks: 1, title: 'Business continuity design', strands: ['cloud'],
          q: 'Which tier gets which RPO and RTO?',
          learn: 'Zones vs regions, backup vs replication, failover patterns.',
          prove: 'An RPO/RTO table for the design.' },
        { id: 's3d', start: '2027-05-10', weeks: 1, title: 'AI architecture', strands: ['ai'],
          q: 'Tools, RAG or both, and how are answers trusted?',
          learn: 'Azure AI Search, grounding, evaluation, ML in the platform.',
          prove: 'An evaluation set run against two designs.' },
        { id: 's3e', start: '2027-05-17', weeks: 2, title: 'Capstone: Applied C, lakehouse platform', strands: ['data'],
          q: 'One problem, three sets of constraints: which answer, when?',
          learn: 'The site\'s Applied C page, rebuilt from your own ADRs.',
          prove: 'A presentable design for lean, scale and managed versions.' },
        { id: 's3f', start: '2027-05-31', weeks: 1, title: 'Capstone: Applied D, AI operations assistant', strands: ['ai', 'security'],
          q: 'Can you defend the assistant design to security and to the business?',
          learn: 'The site\'s Applied D page, rebuilt from your own ADRs: identity, tools, retrieval, guardrails, evaluation, cost.',
          prove: 'An interview-grade design you can whiteboard in 35 minutes.' },
        { id: 's3g', start: '2027-06-07', weeks: 3, title: 'Practice tests → sit AZ-305', strands: ['exam'],
          q: 'Are the case-study scores ready?',
          learn: 'Case-study practice: AZ-305 is a design exam.',
          prove: 'Sit the exam by Friday 25 June.' }
      ]
    },
    {
      id: 's4', anchor: 'sprint-4', name: 'Sprint 4 · AI apps and agents on Azure',
      exam: { code: 'AI-103', name: 'Azure AI Apps and Agents Developer', date: '2027-09-24' },
      note: 'Build the minimal Applied D as you go, on Microsoft Foundry: the same retrieval, tools and evaluation, on your own sample data. AI-103 replaced AI-102 in 2026. Microsoft renames AI services often: check names against the current AI-103 study guide when the sprint starts.',
      items: [
        { id: 'f1', start: '2027-07-05', weeks: 2, title: 'Plan and manage an Azure AI solution', strands: ['ai', 'cloud', 'security'],
          q: 'Which resources, which models, and how does code reach them without a key?',
          learn: 'Foundry projects and model deployments, Entra and managed identities instead of keys, quotas and cost, monitoring.',
          prove: 'A Foundry setup from Bicep that the app reaches with no stored key.' },
        { id: 'f2', start: '2027-07-19', weeks: 2, title: 'RAG on your own data', strands: ['ai', 'data'],
          q: 'Which documents, which chunks, and how do you know retrieval works?',
          learn: 'Azure AI Search: keyword plus vector search, semantic ranking, citations (AI Engineering chapter 6; Applied D §3).',
          prove: 'Hybrid retrieval over sample procedures, with recall@6 measured.' },
        { id: 'f3', start: '2027-08-02', weeks: 2, title: 'Agents and tools', strands: ['ai'],
          q: 'Which steps does the model choose, and which does your code control?',
          learn: 'Foundry agents, tool calling, MCP, multi-agent orchestration, confirmed writes (Applied D §2, §4).',
          prove: 'One read tool and one confirmed write tool, with an idempotency key.' },
        { id: 'f4', start: '2027-08-16', weeks: 1, title: 'Evaluation, safety and cost', strands: ['ai', 'security'],
          q: 'How do you know a change made answers better, and what does each answer cost?',
          learn: 'Evaluations, content safety, tracing, cost per question (AI Engineering chapters 3-4 and 9; Applied D §6-8).',
          prove: 'An eval gate in CI that fails on a leak or a drop in groundedness.' },
        { id: 'f5', start: '2027-08-23', weeks: 2, title: 'Vision, language and document extraction', strands: ['ai', 'data'],
          q: 'Which documents can be read by a service instead of a person?',
          learn: 'Document Intelligence for delivery notes and invoices, PII detection and text analysis, vision basics: to exam depth.',
          prove: 'Fields extracted from a sample delivery note; PII detection feeding the governance scanner.' },
        { id: 'f6', start: '2027-09-06', weeks: 4, title: 'Practice tests → sit AI-103', strands: ['exam'],
          q: 'Sit, or move the date?',
          learn: 'Full practice tests; every wrong answer becomes a one-line note. One buffer week.',
          prove: 'Sit the exam by Friday 24 September.' }
      ]
    }
  ];

  /* ------------------------------------------------------------ helpers */

  var DAY = 86400000;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function parse(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { return new Date(d.getTime() + n * DAY); }
  function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function fmtY(d) { return fmt(d) + ' ' + d.getFullYear(); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function svg(tag, attrs, text) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function store(key, val) {
    try {
      if (typeof val === 'undefined') return window.localStorage.getItem(key);
      if (val === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }
  function status(cls, text) { return el('span', 'hf-status hf-status--' + cls + ' hf-status--nodot', text); }

  var today = new Date(); today.setHours(0, 0, 0, 0);

  // Item spans and state.
  ROADMAP.forEach(function (s) {
    s.items.forEach(function (it) {
      it.from = parse(it.start);
      it.to = addDays(it.from, it.weeks * 7);           // exclusive
      it.done = store('rm.item.' + it.id) === '1';
      it.current = today >= it.from && today < it.to;
    });
    s.from = s.items[0].from;
    s.to = s.items[s.items.length - 1].to;
    if (s.exam) { s.exam.when = parse(s.exam.date); s.exam.passed = store('rm.exam.' + s.exam.code) === '1'; }
  });
  var START = ROADMAP[0].from, END = ROADMAP[ROADMAP.length - 1].to;

  // Before the start, the first item is "next" rather than nothing.
  var anyCurrent = ROADMAP.some(function (s) { return s.items.some(function (i) { return i.current; }); });
  var nextItem = null;
  if (!anyCurrent) {
    ROADMAP.some(function (s) { return s.items.some(function (i) { if (i.from > today) { nextItem = i; return true; } return false; }); });
  }

  /* ------------------------------------------------------- 1 exam cards */

  function renderExams() {
    var host = document.getElementById('rm-exams');
    if (!host) return;
    host.textContent = '';
    var exams = ROADMAP.filter(function (s) { return s.exam; }).map(function (s) { return s.exam; });
    var next = exams.filter(function (e) { return !e.passed && e.when >= today; })[0];

    exams.forEach(function (e) {
      var card = el('div', 'hf-stat kt-rm-exam' + (e.passed ? ' is-passed' : (e === next ? ' is-next' : '')));
      card.appendChild(el('span', 'hf-stat__label', e.code + ' · ' + e.name));
      var days = Math.ceil((e.when - today) / DAY);
      card.appendChild(el('span', 'hf-stat__value', e.passed ? 'Passed' : (days >= 0 ? days + ' days' : 'Date passed')));
      card.appendChild(el('span', 'hf-meta', 'Target: ' + fmtY(e.when)));

      var foot = el('div', 'kt-rm-exam__foot');
      foot.appendChild(e.passed ? status('success', 'Passed') : (e === next ? status('solid', 'Next exam') : status('neutral', 'Upcoming')));
      var btn = el('button', 'btn btn-secondary btn-sm', e.passed ? 'Undo' : 'Mark passed');
      btn.type = 'button';
      btn.addEventListener('click', function () {
        e.passed = !e.passed;
        store('rm.exam.' + e.code, e.passed ? '1' : null);
        renderAll();
      });
      foot.appendChild(btn);
      card.appendChild(foot);
      host.appendChild(card);
    });
  }

  /* ---------------------------------------------------------- 2 timeline */

  function renderTimeline() {
    var host = document.getElementById('rm-timeline');
    if (!host) return;
    host.textContent = '';
    // Drawn close to its on-screen width so the type stays readable; on a
    // phone the card scrolls sideways instead of shrinking the drawing.
    var W = 680, H = 132, L = 8, R = 8;
    var span = END - START;
    var x = function (d) { return L + (W - L - R) * Math.max(0, Math.min(1, (d - START) / span)); };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Roadmap timeline, ' + fmtY(START) + ' to ' + fmtY(END) });

    // Month ticks.
    var m = new Date(START.getFullYear(), START.getMonth() + 1, 1);
    while (m < END) {
      var mx = x(m);
      s.appendChild(svg('line', { x1: mx, y1: 18, x2: mx, y2: 92, stroke: 'var(--hf-hairline-soft)', 'stroke-width': 1 }));
      s.appendChild(svg('text', { x: mx + 4, y: 14, fill: 'var(--hf-ink-muted)', 'font-family': 'var(--hf-font)', 'font-size': 11 },
        MONTHS[m.getMonth()] + (m.getMonth() === 0 ? ' ' + m.getFullYear() : '')));
      m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    }

    // Sprint segments.
    ROADMAP.forEach(function (sp) {
      var total = sp.items.length, done = sp.items.filter(function (i) { return i.done; }).length;
      var isCurrent = today >= sp.from && today < sp.to;
      var isDone = done === total || today >= sp.to && (!sp.exam || sp.exam.passed);
      var fill = isDone ? 'var(--hf-success-bg)' : (isCurrent ? 'var(--hf-ink)' : 'var(--hf-surface-alt)');
      var stroke = isDone ? 'var(--hf-success-line)' : (isCurrent ? 'var(--hf-ink)' : 'var(--hf-hairline)');
      var ink = isCurrent ? 'var(--hf-on-primary)' : (isDone ? 'var(--hf-success-fg)' : 'var(--hf-ink)');
      var x1 = x(sp.from), x2 = x(sp.to);

      var g = svg('g', { class: 'kt-rm-seg', tabindex: 0, role: 'link', 'aria-label': sp.name });
      g.appendChild(svg('rect', { x: x1 + 1, y: 28, width: Math.max(2, x2 - x1 - 2), height: 34, rx: 2, fill: fill, stroke: stroke, 'stroke-width': 1 }));
      var label = sp.exam ? sp.exam.code : 'Review';
      g.appendChild(svg('text', { x: x1 + 8, y: 49, fill: ink, 'font-family': 'var(--hf-font)', 'font-size': 12, 'font-weight': 600 }, label));
      // Progress tick-bar under the segment.
      g.appendChild(svg('rect', { x: x1 + 1, y: 66, width: Math.max(2, x2 - x1 - 2), height: 4, rx: 2, fill: 'var(--hf-surface-alt)' }));
      if (done) g.appendChild(svg('rect', { x: x1 + 1, y: 66, width: Math.max(2, (x2 - x1 - 2) * done / total), height: 4, rx: 2, fill: 'var(--hf-success-fg)' }));
      g.addEventListener('click', function () { document.getElementById(sp.anchor).scrollIntoView({ behavior: 'smooth' }); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById(sp.anchor).scrollIntoView({ behavior: 'smooth' }); });
      s.appendChild(g);

      // Exam marker: a diamond on its date.
      if (sp.exam) {
        var ex = x(sp.exam.when), c = sp.exam.passed ? 'var(--hf-success-fg)' : 'var(--hf-ink)';
        s.appendChild(svg('path', { d: 'M' + ex + ' 76 l6 6 l-6 6 l-6 -6 z', fill: c }));
        s.appendChild(svg('text', { x: ex, y: 104, 'text-anchor': 'middle', fill: c, 'font-family': 'var(--hf-font-mono)', 'font-size': 10 },
          fmt(sp.exam.when)));
      }
    });

    // Today line.
    if (today >= START && today <= END) {
      var tx = x(today);
      s.appendChild(svg('line', { x1: tx, y1: 20, x2: tx, y2: 112, stroke: 'var(--hf-danger-fg)', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }));
      s.appendChild(svg('text', { x: tx, y: 126, 'text-anchor': 'middle', fill: 'var(--hf-danger-fg)', 'font-family': 'var(--hf-font)', 'font-size': 11, 'font-weight': 600 }, 'Today'));
    } else if (today < START) {
      s.appendChild(svg('text', { x: L, y: 126, fill: 'var(--hf-ink-muted)', 'font-family': 'var(--hf-font)', 'font-size': 11 },
        'Starts ' + fmtY(START) + ' · ' + Math.ceil((START - today) / DAY) + ' days'));
    }
    host.appendChild(s);
  }

  /* ----------------------------------------------------------- 3 filters */

  var active = store('rm.filter') || 'all';

  function renderFilters() {
    var host = document.getElementById('rm-filters');
    if (!host) return;
    host.textContent = '';
    host.appendChild(el('span', 'hf-caps', 'Show'));
    [['all', 'All']].concat(Object.keys(STRANDS).map(function (k) { return [k, STRANDS[k]]; })).forEach(function (f) {
      var b = el('button', 'btn hf-btn-pill' + (active === f[0] ? ' is-active' : ''), f[1]);
      b.type = 'button';
      b.setAttribute('aria-pressed', active === f[0] ? 'true' : 'false');
      b.addEventListener('click', function () { active = f[0]; store('rm.filter', active); renderAll(); });
      host.appendChild(b);
    });
  }

  /* ------------------------------------------------------- 4 week rows */

  function renderSprints() {
    ROADMAP.forEach(function (sp) {
      var host = document.getElementById(sp.anchor);
      if (!host) return;
      host.textContent = '';
      var total = sp.items.length, done = sp.items.filter(function (i) { return i.done; }).length;
      var isCurrent = today >= sp.from && today < sp.to;
      host.className = 'card kt-rm-sprint' + (isCurrent ? ' is-current' : '');

      var head = el('div', 'card-header');
      var title = el('div', 'kt-rm-sprint__title');
      title.appendChild(el('span', 'kt-rm-sprint__name', sp.name));
      title.appendChild(el('span', 'hf-meta', fmt(sp.from) + ' – ' + fmtY(addDays(sp.to, -3)) +
        (sp.exam ? ' · exam ' + sp.exam.code + ' by ' + fmt(sp.exam.when) : '')));
      head.appendChild(title);
      var prog = el('div', 'kt-rm-sprint__progress');
      var meter = el('progress', 'kt-meter');
      meter.max = total; meter.value = done;
      meter.setAttribute('aria-label', done + ' of ' + total + ' done');
      prog.appendChild(meter);
      prog.appendChild(el('span', 'hf-meta', done + ' / ' + total));
      head.appendChild(prog);
      host.appendChild(head);

      if (sp.note) {
        var note = el('div', 'hf-alert hf-alert--info');
        note.appendChild(el('i', 'bi bi-info-circle hf-alert__icon'));
        note.appendChild(el('div', null, sp.note));
        host.appendChild(note);
      }

      var shown = 0;
      sp.items.forEach(function (it) {
        var visible = active === 'all' || it.strands.indexOf(active) >= 0;
        var d = el('details', 'kt-rm-item' + (it.done ? ' is-done' : '') + (it.current || it === nextItem ? ' is-current' : ''));
        d.hidden = !visible;
        if (visible) shown++;

        var sum = el('summary');
        var box = el('button', 'check-box' + (it.done ? ' checked' : ''));
        box.type = 'button';
        box.setAttribute('role', 'checkbox');
        box.setAttribute('aria-checked', it.done ? 'true' : 'false');
        box.setAttribute('aria-label', 'Mark "' + it.title + '" done');
        box.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          it.done = !it.done;
          store('rm.item.' + it.id, it.done ? '1' : null);
          renderAll();
        });
        sum.appendChild(box);
        sum.appendChild(el('span', 'kt-rm-item__when', fmt(it.from) + (it.weeks > 1 ? ' · ' + it.weeks + ' wks' : '')));

        var main = el('span', 'kt-rm-item__main');
        main.appendChild(el('span', 'kt-rm-item__title', it.title));
        main.appendChild(el('span', 'kt-rm-item__q', it.q));
        sum.appendChild(main);

        var tags = el('span', 'kt-rm-item__tags');
        if (it.current) tags.appendChild(status('solid', 'This week'));
        else if (it === nextItem) tags.appendChild(status('solid', 'Starts ' + fmt(it.from)));
        if (it.done) tags.appendChild(status('success', 'Done'));
        if (it.light) tags.appendChild(status('warning', 'Light week'));
        if (it.checkpoint) tags.appendChild(status('warning', 'Checkpoint ' + fmt(parse(it.checkpoint.date))));
        it.strands.forEach(function (k) { tags.appendChild(status(k === 'exam' ? 'info' : 'neutral', STRANDS[k])); });
        sum.appendChild(tags);
        d.appendChild(sum);

        var body = el('div', 'kt-rm-item__body');
        var a = el('div'); a.appendChild(el('h4', null, 'Understand')); a.appendChild(el('p', null, it.learn));
        var b = el('div'); b.appendChild(el('h4', null, 'Prove')); b.appendChild(el('p', null, it.prove));
        body.appendChild(a); body.appendChild(b);
        if (it.extra) {
          var x = el('div', 'kt-rm-item__extra');
          x.appendChild(el('h4', null, 'Extra time'));
          x.appendChild(el('p', null, it.extra));
          body.appendChild(x);
        }
        if (it.checkpoint) {
          var cp = el('div', 'kt-rm-item__extra');
          cp.appendChild(el('h4', null, it.checkpoint.title + ' · ' + fmt(parse(it.checkpoint.date))));
          var cpText = el('p', null, it.checkpoint.text + ' ');
          if (it.checkpoint.link) {
            var cpLink = el('a', null, it.checkpoint.link.text);
            cpLink.href = it.checkpoint.link.href; cpLink.target = '_blank'; cpLink.rel = 'noopener';
            cpText.appendChild(cpLink);
          }
          cp.appendChild(cpText);
          body.appendChild(cp);
        }
        if (sp.routine && it.strands.indexOf('exam') < 0 && !it.light) {
          var r = el('div', 'kt-rm-item__routine');
          r.appendChild(el('h4', null, 'How to work it'));
          var ol = el('ol');
          sp.routine.forEach(function (st) {
            var li = el('li');
            li.appendChild(el('strong', null, st.step + '. '));
            li.appendChild(document.createTextNode(st.text));
            if (st.link) {
              var ln = el('a', null, st.link.text);
              ln.href = st.link.href; ln.target = '_blank'; ln.rel = 'noopener';
              li.appendChild(ln);
            }
            if (st.after) li.appendChild(document.createTextNode(st.after));
            ol.appendChild(li);
          });
          r.appendChild(ol);
          body.appendChild(r);
        }
        d.appendChild(body);
        if (it.current || it === nextItem) d.open = true;
        host.appendChild(d);
      });

      if (!shown) host.appendChild(el('p', 'hf-meta kt-rm-empty', 'Nothing in this stretch for that filter.'));
    });
  }

  /* --------------------------------------------------------- 5 overview */

  function renderFacts() {
    var all = [], weeks = 0;
    ROADMAP.forEach(function (s) { s.items.forEach(function (i) { all.push(i); weeks += i.weeks; }); });
    var done = all.filter(function (i) { return i.done; }).length;
    var set = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    set('rm-fact-weeks', weeks);
    set('rm-fact-progress', Math.round(100 * done / all.length) + '%');
    var passed = ROADMAP.filter(function (s) { return s.exam && s.exam.passed; }).length;
    set('rm-fact-exams', passed + ' / 4');
  }

  function renderAll() {
    renderFacts();
    renderExams();
    renderTimeline();
    renderFilters();
    renderSprints();
  }

  renderAll();
}());
