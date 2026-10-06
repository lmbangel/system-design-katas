# Design system — HumeFinbiz

**Site:** System design katas (`backend.systems`)
**Design system:** HumeFinbiz v1.0.0
**Reference implementation:** `sc.humeint.africa` (also used by `reports.fbserv.africa`)
**Retrofitted:** 2026-10-06

Until this retrofit the katas used their own dark theme: navy gradients, a film
grain overlay, Fraunces / Inter Tight / JetBrains Mono from Google Fonts, and
eight decorative accent colours. They now use HumeFinbiz, so the guide is the
same application to look at as the reports portal. `sc.humeint.africa` is the
reference: when the two disagree, it is right and this is wrong.

---

## 1. The rules

The same ones `sc.humeint.africa` and `reports.fbserv.africa` follow:

1. **Reference `var(--hf-*)` tokens only.** No literal colours, radii, shadows
   or font sizes in project CSS. The handful of `--kt-*` tokens in
   `assets/css/katas.css` are geometry, composed from `--hf-*` where the
   system has a value.
2. **No `!important`.** There are none.
3. **No inline styles.** There are none. A value that is data (the coverage
   percentages on the checklist) lives in an attribute — `<progress value>` —
   not in a `style=""`.
4. **Colour is for semantic status only** — success, warning, danger, info,
   neutral. Never for decoration. The brand colour is black.
5. **Three navigation tiers maximum.** The sidebar uses two.
6. **Never edit `assets/hume-finbiz/*` or `assets/vendor/*`.** They are
   vendored. A gap goes in `assets/css/katas.css`, composed from tokens.

`node tools/verify-design.js` enforces 1–3, the load order, the sidebar toggle, the
single font, the nav-tier limit, token-only diagrams and the vendored-file
hashes (`tools/vendored.json`, taken from `sc.humeint.africa`). It cannot check
visual regression or cross-browser rendering — those still need a person.

---

## 2. Load order — mandatory

```
1. assets/vendor/bootstrap/bootstrap.min.css
2. assets/vendor/bootstrap-icons/bootstrap-icons.min.css
3. assets/vendor/archivo/archivo.css
4. assets/hume-finbiz/hume-finbiz.css
5. assets/css/katas.css
```

`hume-finbiz.css` re-points Bootstrap's own custom properties, so it must load
after Bootstrap, and `katas.css` after it. Reordering silently un-themes every
page without erroring.

Scripts, at the end of `<body>`: `hume-finbiz.js` → `katas.js` (which calls
`HumeFinbiz.init()`). Bootstrap's JS is not loaded: no page has a dropdown,
modal or tooltip.

Everything is vendored and relative, so the guide still opens from disk with
no network — previously it needed Google Fonts to render at all.

---

## 3. The shell

Every page carries `.hf-shell`: sidebar, header, content.

**Sidebar.** Brand (links home, same deviation and reason as the reports
portal), then one tier-1 item per page, grouped by tier. The current page is a
tier-1 *parent*: its tier-2 children are that page's concepts, and `katas.js`
scroll-spies them, so the sidebar doubles as the page contents. Tier 1 carries
icons; tier 2 does not.

**Header.** The three § 9.9 elements, adapted to a site with no sign-in:

| # | Element | Here |
|---|---|---|
| 1 | Sidebar toggle | As the system ships it. Collapse state persists. |
| 2 | Freshness indicator | **Omitted, deliberately.** The first version showed when the content was last revised; removed at the owner's request on 2026-10-06. The site has no data feed, so nothing is lost. |
| 3 | User menu | **Omitted, deliberately.** There is no user. The reports portal's sign-in page drops the shell controls for the same reason: a control that can do nothing is worse than none. Its slot holds previous / next page links. |

---

## 4. What was deliberately NOT changed

**The content.** Every concept, diagram, explanation and code sample is as it
was. This retrofit is a skin, plus the fixes in § 6.

**The kata class names.** `.pattern`, `.callout-box`, `.code-pane`, `.toc`,
`.principle` and the rest keep their names and are restyled onto `--hf-*`
tokens in `katas.css`, following the rule `sc.humeint.africa` records: *a class
a script depends on keeps its name and gets restyled*. New components are
prefixed `.kt-`.

---

## 5. Mapping

| Old | HumeFinbiz |
|---|---|
| `.topnav` | `.hf-header` (toggle, title, crumbs, prev / next) |
| `.masthead` | `.kt-hero`: `.hf-eyebrow`, a thin display headline, `.hf-lede`, `.hf-stat` tiles |
| Emphasis in headlines (yellow italic serif) | Semibold, upright — hierarchy from weight, not colour |
| `.principle` (coloured top borders) | Flat card, hairline border |
| `.toc` | Card with a caps header and rows, like a report index |
| `.tag.hot/.cool/.warm/...` | All `.hf-status--neutral`: they were categories, not states |
| `.tagmini.advanced` / `.bonus` | `--warning` / `--info` — a real signal for planning time |
| `.pattern-num` (120px outlined numeral) | Solid black square, the sidebar brand mark |
| `.callout-box.use` / `.avoid` | `.hf-alert--success` / `--danger` in all but name |
| `▲ ▼ 📖 📍` glyphs | Bootstrap Icons (`check2-circle`, `x-circle`, `book`, `geo-alt`) — one icon set |
| `.code-block` (Dracula on navy) | Card, `.hf-tabs`-style tabs, sunken pane, near-monochrome syntax (`--kt-code-*`) |
| `.bonus-divider`, `.section-divider` | Section head: label, title, rule |
| `.pageend-nav` | Two flat cards; hover lifts to `--hf-e1` |
| Index topic cards, fake book covers | The reports-portal landing: eyebrow per group, cards with chips and an OPEN button |
| `.check-tag` | `.hf-status--success / --warning / --danger` |
| `.score-card` | `.hf-stat` with a status top rule and a `<progress>` bar |

### Diagram colours

The SVGs referenced dark-theme hex values directly (~2,000 of them). They now
reference tokens — `fill="var(--hf-success-fg)"` — so a palette change is a
token change.

| Dark theme | Token | Why |
|---|---|---|
| `#ffd23f` yellow (old brand accent) | `--hf-ink` | The brand colour is black |
| `#4fd1a1` mint | `--hf-success-fg` | Used for healthy / correct paths |
| `#ff6b6b`, `#ff9eb1` | `--hf-danger-fg` | Failures, anti-patterns |
| `#5eb5ff` sky | `--hf-info-fg` | Neutral information |
| `#a78bfa` violet | `--hf-ink-secondary` | A fourth category; decorative hue removed |
| `#f472b6`, `#f7a23b` | `--hf-warning-fg` | |
| `#e8edf7`, `#9aa3b2`, `#93a4c4`, `#6b7c9c` | `--hf-ink` / `-secondary` / `-muted` | Text ramp |
| `#1c2a47`, `#0a1020`, `#0f172a` … | `--hf-surface-alt` / `--hf-surface` / `--hf-canvas-soft` | Navy surfaces → light surfaces |
| `#34466b`, `#1f2a44` | `--hf-hairline-strong` / `--hf-hairline` | Lines |
| Dark text on a solid accent fill | `--hf-on-primary` | Stays legible on the new fills |

Translucent tints (`opacity="0.1"` on a status fill) are kept: on white they
produce the system's own pale status backgrounds.

---

## 6. Fixed along the way

- **The prep checklist's boxes never ticked.** Each box had an `onclick`
  toggle *and* a script listener, so every click toggled twice. They are now
  `<button role="checkbox">` with one handler. Saved progress uses the same
  `localStorage` keys, so nothing already ticked is lost.
- **Prev / next skipped pages.** Pillar 03's "next" went to 05 and 05's
  "previous" to 03, missing 04. Both the header arrows and the page-end cards
  are now generated from one ordered list.
- **Index counts disagreed with the pages** (e.g. "14 concepts" for pages
  with 10, and different reading times). The overview now uses the pages'
  own numbers.
- **The prep checklist was not linked from the index.** It is now in the
  sidebar and has a card on the overview.

## 7. Still outstanding

- Visual check against `reports.fbserv.africa` side by side at 1280 / 768 /
  375 — needs a person with both open.
- Print preview of a long pillar page.
- Diagrams position text with fixed x offsets measured for Inter Tight and
  JetBrains Mono. Archivo and the system mono stack are close, but labels
  split across two `<text>` elements (e.g. the ACID diagram's "A" + "tomicity")
  may sit slightly apart. Worth a pass per page.
