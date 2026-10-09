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
  // weeks, title, q (the architect's decision), learn, prove, strands.
  var ROADMAP = [
    {
      id: 's1', anchor: 'sprint-1', name: 'Sprint 1 · Azure foundations',
      exam: { code: 'AZ-104', name: 'Azure Administrator', date: '2026-12-04' },
      note: 'The company AI harness runs on work time in weeks 1-4. The week 1, 2 and 5 proofs reuse its pieces, so both sides help each other.',
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
          prove: 'A zone-redundant VM pair from Bicep; break one zone\'s VM.' },
        { id: 's1w5', start: '2026-11-09', weeks: 1, title: 'Compute II: where code runs', strands: ['cloud'],
          q: 'Where does code run: VMs, App Service, Container Apps or Functions?',
          learn: 'App Service, Container Apps, ACI, ACR: cost, scale, operations, cold starts, limits.',
          prove: 'The same small API on App Service and Container Apps, compared.' },
        { id: 's1w6', start: '2026-11-16', weeks: 1, title: 'Networking I', strands: ['cloud', 'security'],
          q: 'How is the network shaped: flat or hub-spoke?',
          learn: 'VNets, peering, NSGs and ASGs, routing, DNS.',
          prove: 'Hub-spoke with peering; prove an NSG blocks what it should.' },
        { id: 's1w7', start: '2026-11-23', weeks: 1, title: 'Networking II + monitoring', strands: ['cloud'],
          q: 'How will you know it broke, and how fast can you recover?',
          learn: 'Private endpoints, load balancing, VPN basics; Azure Monitor, Log Analytics, alerts, Backup, Site Recovery.',
          prove: 'A private endpoint to a database; an outcome-based alert; a timed restore.' },
        { id: 's1w8', start: '2026-11-30', weeks: 1, title: 'Practice tests → sit AZ-104', strands: ['exam'],
          q: 'Are the practice scores telling you to sit, or to move the date?',
          learn: 'Full practice tests; every wrong answer becomes a one-line note.',
          prove: 'Sit the exam by Friday 4 December.' }
      ]
    },
    {
      id: 's2', anchor: 'sprint-2', name: 'Sprint 2 · Security architecture',
      exam: { code: 'SC-500', name: 'Cloud and AI Security Engineer', date: '2027-02-05' },
      note: 'AI security gets 25-30% of study time: it is the newest content and the most relevant to the harness. Stretch option: sit in December only if AZ-104 is passed by ~20 November and practice scores are 80%+.',
      items: [
        { id: 's2w1', start: '2026-12-07', weeks: 1, title: 'Threat modelling', strands: ['security', 'ai'],
          q: 'What could go wrong, and what matters most?',
          learn: 'Data-flow diagrams, trust boundaries, STRIDE, ranking risk.',
          prove: 'A threat model of the AI harness.' },
        { id: 's2w2', start: '2026-12-14', weeks: 1, title: 'Identity and access', strands: ['security'],
          q: 'Which OAuth flow, and how much standing access?',
          learn: 'Conditional access, ID Protection, PIM, app and workload identities, OAuth/OIDC flows.',
          prove: 'A sequence diagram per flow you use; just-in-time admin with PIM.' },
        { id: 's2w3', start: '2026-12-21', weeks: 1, title: 'Governance at scale (holiday: light)', strands: ['security', 'cloud'], light: true,
          q: 'How do you keep a fleet compliant without reviewing every change?',
          learn: 'Azure Policy initiatives, Defender for Cloud regulatory compliance.',
          prove: 'A policy initiative assigned and its compliance report read.' },
        { id: 's2w4', start: '2026-12-28', weeks: 1, title: 'Catch-up (holiday)', strands: [], light: true,
          q: 'What slipped, and what needs a second pass?',
          learn: 'Whatever the practice questions say is weak.',
          prove: 'Nothing new. Rest counts.' },
        { id: 's2w5', start: '2027-01-04', weeks: 1, title: 'Storage and databases', strands: ['security', 'data'],
          q: 'Who can see which data, and how is that enforced?',
          learn: 'Key Vault, encryption and keys, SQL security, masking, row-level security, POPIA.',
          prove: 'An app with no secrets in config; RLS and masking for one consumer and for the harness.' },
        { id: 's2w6', start: '2027-01-11', weeks: 1, title: 'Network security', strands: ['security'],
          q: 'Private by default: what does it cost and what does it buy?',
          learn: 'Azure Firewall, WAF, private endpoints, DDoS, egress control.',
          prove: 'The Sprint 1 network re-reviewed against the threat model.' },
        { id: 's2w7', start: '2027-01-18', weeks: 1, title: 'Compute security and secure delivery', strands: ['security', 'delivery'],
          q: 'How does code reach production without anyone holding a key?',
          learn: 'VM, container and App Service security; managed identities; CI/CD with OIDC.',
          prove: 'A pipeline that deploys to Azure with no stored credential.' },
        { id: 's2w8', start: '2027-01-25', weeks: 1, title: 'AI security and posture', strands: ['security', 'ai'],
          q: 'What can an AI agent do, as whom, and how would you know?',
          learn: 'Entra Agent ID, Defender for AI, AI gateway, prompt injection through data, tool permissions; secure score, Sentinel basics.',
          prove: 'The harness threat model revisited for AI; an alert on a suspicious agent action.' },
        { id: 's2w9', start: '2027-02-01', weeks: 1, title: 'Practice tests → sit SC-500', strands: ['exam'],
          q: 'Sit, or move the date?',
          learn: 'Full practice tests, AI-security questions twice.',
          prove: 'Sit the exam by Friday 5 February.' }
      ]
    },
    {
      id: 'q1', anchor: 'q1-review', name: 'Q1 · Security review and delivery',
      items: [
        { id: 'q1a', start: '2027-02-08', weeks: 2, title: 'Security review and governance', strands: ['security'],
          q: 'How do you run a security architecture review people trust?',
          learn: 'Review method, risk registers, CIS and ISO 27001 controls at stakeholder depth.',
          prove: 'A review template you can use at work, applied to the harness.' },
        { id: 'q1b', start: '2027-02-22', weeks: 2, title: 'Delivery architecture', strands: ['delivery'],
          q: 'How does change reach production safely?',
          learn: 'Environments and promotion, release strategies, feature flags; IaC as a team practice.',
          prove: 'A promotion flow with blue/green for one service.' },
        { id: 'q1c', start: '2027-03-08', weeks: 2, title: 'Reliability and cost', strands: ['delivery', 'cloud'],
          q: 'What reliability is worth paying for, and what does it cost?',
          learn: 'SLOs and error budgets, failure-mode analysis, Well-Architected reviews; FinOps and cost models.',
          prove: 'An SLO and a cost model for one workload.' },
        { id: 'q1d', start: '2027-03-22', weeks: 2, title: 'Buffer (Easter)', strands: [], light: true,
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
          q: 'Lake, warehouse or lakehouse, and build or buy?',
          learn: 'Batch vs CDC, modelling and correctness, serving; self-run vs Fabric vs Databricks.',
          prove: 'A build-vs-buy comparison with numbers.' },
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
        { id: 's3f', start: '2027-05-31', weeks: 1, title: 'Capstone: Applied D, AI harness', strands: ['ai', 'security'],
          q: 'Can you defend the harness design to security and to the business?',
          learn: 'Identity, curated tools, RLS, audit, evaluation, threat model.',
          prove: 'An interview-grade write-up of the harness.' },
        { id: 's3g', start: '2027-06-07', weeks: 3, title: 'Practice tests → sit AZ-305', strands: ['exam'],
          q: 'Are the case-study scores ready?',
          learn: 'Case-study practice: AZ-305 is a design exam.',
          prove: 'Sit the exam by Friday 25 June.' }
      ]
    },
    {
      id: 's4', anchor: 'sprint-4', name: 'Sprint 4 · AWS by translation',
      exam: { code: 'AWS SAA', name: 'AWS Solutions Architect Associate', date: '2027-09-24' },
      note: 'Learn AWS by redoing Azure decisions you have already made. That comparison is also interview material.',
      items: [
        { id: 's4a', start: '2027-07-05', weeks: 2, title: 'Identity and access', strands: ['cloud', 'security'],
          q: 'IAM, Organizations and SCPs vs Entra, RBAC and Policy: what maps, what doesn\'t?',
          learn: 'AWS identity model through the Azure one you know.',
          prove: 'The Sprint 1 access design, redone in AWS.' },
        { id: 's4b', start: '2027-07-19', weeks: 2, title: 'Networking', strands: ['cloud'],
          q: 'VPCs and security groups vs VNets and NSGs?',
          learn: 'VPC, subnets, security groups, PrivateLink vs private endpoints.',
          prove: 'The hub-spoke network, redone in AWS.' },
        { id: 's4c', start: '2027-08-02', weeks: 2, title: 'Compute and storage', strands: ['cloud'],
          q: 'EC2, Lambda, ECS vs VMs, Functions, Container Apps; S3 vs Blob?',
          learn: 'AWS compute and storage choices against Azure\'s.',
          prove: 'The same API on Lambda and on ECS.' },
        { id: 's4d', start: '2027-08-16', weeks: 2, title: 'Data, resilience and cost', strands: ['data', 'cloud'],
          q: 'RDS, Aurora, DynamoDB; multi-AZ and multi-region; what does it cost?',
          learn: 'AWS data services, resilience patterns and cost tools.',
          prove: 'The continuity design, redone in AWS.' },
        { id: 's4e', start: '2027-08-30', weeks: 5, title: 'Practice tests → sit AWS SAA', strands: ['exam'],
          q: 'Sit, or move the date?',
          learn: 'Full practice tests, one buffer week.',
          prove: 'Sit the exam mid-to-late September.' }
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
        it.strands.forEach(function (k) { tags.appendChild(status(k === 'exam' ? 'info' : 'neutral', STRANDS[k])); });
        sum.appendChild(tags);
        d.appendChild(sum);

        var body = el('div', 'kt-rm-item__body');
        var a = el('div'); a.appendChild(el('h4', null, 'Understand')); a.appendChild(el('p', null, it.learn));
        var b = el('div'); b.appendChild(el('h4', null, 'Prove')); b.appendChild(el('p', null, it.prove));
        body.appendChild(a); body.appendChild(b);
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
