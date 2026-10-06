#!/usr/bin/env node
/* Design-system checks for the katas -- the same rules sc.humeint.africa and
   reports.fbserv.africa enforce with tools/verify_design_tokens.php, written
   for a static site with no PHP.

     node tools/verify-design.js

   Exits non-zero on any failure. It cannot check visual regression or
   cross-browser rendering; those still need a person.

   1  Project CSS references tokens only: no literal colours.
   2  No !important in project CSS.
   3  No inline style="" attributes in any page.
   4  No second font: nothing loads from Google Fonts or names another family.
   5  Stylesheet load order on every page.
   6  Every page carries the shell: sidebar toggle, and the scripts in order.
   7  No fourth navigation tier.
   8  Diagrams use tokens: no hex colours in SVG attributes.
   9  Vendored files are byte-identical to the system (hashes below).        */

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const rel = p => path.join(ROOT, p);
const read = p => fs.readFileSync(rel(p), 'utf8');

const ORDER = [
  'assets/vendor/bootstrap/bootstrap.min.css',
  'assets/vendor/bootstrap-icons/bootstrap-icons.min.css',
  'assets/vendor/archivo/archivo.css',
  'assets/hume-finbiz/hume-finbiz.css',
  'assets/css/katas.css',
];

// sha256 of the HumeFinbiz v1.0.0 files as vendored from sc.humeint.africa.
const VENDORED = require('./vendored.json');

let failures = 0;
const fail = (rule, msg) => { failures++; console.log(`  FAIL  [${rule}] ${msg}`); };

/* 1, 2 -------------------------------------------------------------------- */
const css = read('assets/css/katas.css').replace(/\/\*[\s\S]*?\*\//g, '');
(css.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) || [])
  .forEach(m => fail(1, `literal colour in katas.css: ${m}`));
if (/!important/.test(css)) fail(2, 'katas.css uses !important');

/* 3-8 per page ------------------------------------------------------------ */
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
for (const f of pages) {
  const html = read(f);

  if (/\sstyle="/.test(html)) fail(3, `${f}: inline style attribute`);
  if (/<style[\s>]/.test(html)) fail(3, `${f}: <style> block`);

  if (/fonts\.googleapis|fonts\.gstatic/.test(html)) fail(4, `${f}: loads Google Fonts`);
  if (/Fraunces|Inter Tight|JetBrains Mono|Georgia/.test(html)) fail(4, `${f}: names a second font family`);

  const links = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
  if (links.join('|') !== ORDER.join('|')) fail(5, `${f}: stylesheet order is ${links.join(' -> ')}`);

  if (!/data-hf-sidebar-toggle/.test(html)) fail(6, `${f}: no sidebar toggle`);
  if (!/hume-finbiz\.js[\s\S]*katas\.js/.test(html)) fail(6, `${f}: scripts missing or out of order`);

  if (/hf-nav__link--t4/.test(html)) fail(7, `${f}: fourth nav tier`);

  for (const svg of html.match(/<svg[\s\S]*?<\/svg>/g) || []) {
    const hex = svg.match(/\b(?:fill|stroke|stop-color)="#[0-9a-fA-F]{3,8}"/g);
    if (hex) { fail(8, `${f}: hex colour in a diagram: ${hex[0]}`); break; }
  }
}

/* 9 ----------------------------------------------------------------------- */
for (const [p, want] of Object.entries(VENDORED)) {
  if (!fs.existsSync(rel(p))) { fail(9, `${p} is missing`); continue; }
  const got = crypto.createHash('sha256').update(fs.readFileSync(rel(p))).digest('hex');
  if (got !== want) fail(9, `${p} was modified in place -- vendored files are never edited`);
}

console.log(failures
  ? `\n${failures} failure(s) across ${pages.length} pages.`
  : `OK -- ${pages.length} pages, ${Object.keys(VENDORED).length} vendored files.`);
process.exit(failures ? 1 : 0);
