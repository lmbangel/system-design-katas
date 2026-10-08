#!/usr/bin/env node
/* Writes the shell navigation -- sidebar and header -- into every page from
   one site map, so adding or renaming a page is one edit here, not twelve.

     node tools/build-nav.js           rewrite every page in place
     node tools/build-nav.js --check   exit 1 if any page is out of date

   The sidebar is the site's navigation. Each page is a tier-1 item; the page
   you are on expands into its own sections (tier 2), which katas.js
   scroll-spies, so it doubles as the page's contents. The header carries the
   page title, where it sits, and previous / next in reading order.

   Tier-2 items come from the page itself:
     - every <section class="pattern" id="..."> uses its <h2> as the label
     - any element with id="..." and data-nav="Label" is listed in page order

   Only the <aside class="hf-sidebar"> and <header class="hf-header"> blocks
   are touched. Line endings are preserved. */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* The site map: reading order, top to bottom. `section` starts a sidebar
   group; `num` prefixes the label; `crumb` is the header's location line. */
const SITE = [
  { file: 'index.html', title: 'Overview', icon: 'grid' },

  { section: 'Tier 1 · Foundations', crumb: 'Tier one · Foundations' },
  { file: '01-distributed-systems.html', num: '01', title: 'Distributed systems', icon: 'diagram-3' },
  { file: '02-data-storage.html', num: '02', title: 'Data & storage', icon: 'database' },

  { section: 'Tier 2 · Building blocks', crumb: 'Tier two · Building blocks' },
  { file: '03-apis-contracts.html', num: '03', title: 'APIs & contracts', icon: 'plug' },
  { file: '04-microservices-patterns.html', num: '04', title: 'Microservices patterns', icon: 'boxes' },

  { section: 'Tier 3 · Production', crumb: 'Tier three · Operating in production' },
  { file: '05-reliability-observability.html', num: '05', title: 'Reliability & observability', icon: 'activity' },
  { file: '06-performance-scale.html', num: '06', title: 'Performance & scale', icon: 'speedometer2' },

  { section: 'Tier 4 · Cross-cutting', crumb: 'Tier four · Cross-cutting' },
  { file: '07-security.html', num: '07', title: 'Security', icon: 'shield-lock' },

  { section: 'Tier 5 · Data platforms', crumb: 'Tier five · Data platforms' },
  { file: '08-data-platforms.html', num: '08', title: 'Data platform architecture', icon: 'stack' },

  { section: 'Applied design', crumb: 'Applied system design' },
  { file: 'payment-system.html', title: 'Payment processing', icon: 'credit-card' },
  { file: 'order-fulfilment.html', title: 'Order fulfilment', icon: 'truck' },
  { file: 'lakehouse-platform.html', title: 'Lakehouse platform', icon: 'bricks' },

  { section: 'Interview prep', crumb: 'Interview prep' },
  { file: 'prep-checklist.html', title: 'Interview checklist', icon: 'list-check' },

  { section: 'Reading list', crumb: 'Reading list' },
  { file: 'books.html', title: 'Recommended books', icon: 'journal-bookmark' },
];

// Resolve each page's group once.
const PAGES = [];
{
  let group = null;
  for (const e of SITE) {
    if (e.section) group = e;
    else PAGES.push({ ...e, group });
  }
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const label = p => (p.num ? p.num + ' · ' : '') + p.title;
const text = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/* Tier-2 items, in document order. Labels are already HTML (entities kept). */
function sectionsOf(html) {
  const found = [];
  for (const m of html.matchAll(/<section class="pattern"[^>]*\bid="([^"]+)"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/g)) {
    found.push({ at: m.index, id: m[1], label: text(m[2]) });
  }
  for (const m of html.matchAll(/<[a-z0-9]+\b[^>]*>/g)) {
    const tag = m[0];
    const id = (tag.match(/\bid="([^"]+)"/) || [])[1];
    const nav = (tag.match(/\bdata-nav="([^"]+)"/) || [])[1];
    if (id && nav) found.push({ at: m.index, id, label: nav });
  }
  return found.sort((a, b) => a.at - b.at);
}

function sidebar(page, items) {
  const lines = [];
  lines.push(`<aside class="hf-sidebar">
    <a class="hf-sidebar__brand" href="index.html" aria-label="Overview">
      <span class="hf-sidebar__mark"><span class="kt-mark" aria-hidden="true"></span></span>
      <span class="hf-sidebar__wordmark">System design<small>Backend katas</small></span>
    </a>

    <nav class="hf-nav" aria-label="Main navigation">`);

  let group = null;
  for (const p of PAGES) {
    if (p.group && p.group !== group) {
      lines.push(`      <div class="hf-nav__section">${esc(p.group.section)}</div>`);
      group = p.group;
    }
    const icon = `<i class="bi bi-${p.icon} hf-nav__icon"></i>`;

    if (p === page && items.length) {
      lines.push(`      <div class="hf-nav__item hf-nav__item--parent is-open">
        <button class="hf-nav__link is-current-parent" type="button" data-hf-toggle data-hf-key="${p.file}" aria-current="page">
          ${icon}<span class="hf-nav__text">${esc(label(p))}</span><i class="bi bi-chevron-right hf-nav__chev"></i>
        </button>
        <div class="hf-nav__sub">`);
      for (const it of items) {
        lines.push(`          <div class="hf-nav__item"><a class="hf-nav__link hf-nav__link--t2" href="#${it.id}" title="${it.label}"><span class="hf-nav__text">${it.label}</span></a></div>`);
      }
      lines.push(`        </div>
      </div>`);
    } else {
      const current = p === page ? ' is-active" aria-current="page' : '';
      lines.push(`      <div class="hf-nav__item"><a class="hf-nav__link${current}" href="${p.file}">${icon}<span class="hf-nav__text">${esc(label(p))}</span></a></div>`);
    }
  }

  lines.push(`    </nav>

    <div class="hf-sidebar__foot">
      <div class="hf-sidebar__env"><span class="hf-sync__dot"></span><span>Study guide · v1</span></div>
    </div>
  </aside>`);
  return lines.join('\n');
}

function header(page) {
  const i = PAGES.indexOf(page);
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  const crumbs = page.group ? `Backend katas / ${esc(page.group.crumb)}` : 'Backend katas';
  const arrow = (p, dir, icon) => p
    ? `\n        <a class="hf-iconbtn" href="${p.file}" aria-label="${dir}: ${esc(label(p))}" title="${dir}: ${esc(label(p))}"><i class="bi bi-${icon}"></i></a>`
    : '';
  return `<header class="hf-header">
      <button class="hf-header__toggle" data-hf-sidebar-toggle aria-label="Toggle navigation" aria-expanded="true">
        <i class="bi bi-list"></i>
      </button>

      <div class="hf-header__titles">
        <div class="hf-header__title">${esc(page.title)}</div>
        <div class="hf-header__crumbs">${crumbs}</div>
      </div>

      <div class="hf-header__spacer"></div>

      <div class="hf-header__actions">${arrow(prev, 'Previous', 'arrow-left')}${arrow(next, 'Next', 'arrow-right')}
      </div>
    </header>`;
}

function build(page) {
  const file = path.join(ROOT, page.file);
  const raw = fs.readFileSync(file, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let html = raw.replace(/\r\n/g, '\n');

  const aside = /<aside class="hf-sidebar">[\s\S]*?<\/aside>/;
  const head = /<header class="hf-header">[\s\S]*?<\/header>/;
  if (!aside.test(html) || !head.test(html)) throw new Error(`${page.file}: shell markers not found`);

  html = html.replace(aside, () => sidebar(page, sectionsOf(html)));
  html = html.replace(head, () => header(page));
  return { file, raw, out: html.replace(/\n/g, eol) };
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const p of PAGES) {
    const { file, raw, out } = build(p);
    if (out === raw) continue;
    stale.push(p.file);
    if (!check) fs.writeFileSync(file, out);
  }
  const listed = new Set(PAGES.map(p => p.file));
  const orphans = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !listed.has(f));
  orphans.forEach(f => console.log(`  page not in the site map: ${f}`));

  if (check) {
    stale.forEach(f => console.log(`  navigation out of date: ${f} -- run node tools/build-nav.js`));
    process.exit(stale.length || orphans.length ? 1 : 0);
  }
  console.log(stale.length ? `updated ${stale.length} page(s): ${stale.join(', ')}` : 'navigation already up to date');
}

module.exports = { PAGES, sectionsOf };
