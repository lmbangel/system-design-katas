#!/usr/bin/env node
/* Writes the "Read" line into every concept: which book chapters go deeper.

     node tools/build-reading.js           rewrite every page in place
     node tools/build-reading.js --check   exit 1 if a page is out of date, a
                                           concept has no reading, or a
                                           reference names an unknown chapter

   data/reading.json holds the books (title, short name, their card on
   books.html), each book's verified table of contents, and, per concept, the
   chapters to read. DDIA chapters carry their 1st-edition number too; the
   free Google books link each chapter to its online page.

   The line is a <div class="reading"> placed after the concept's Docs
   reference (or its Connects-to line). Only that div is ever touched. */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'reading.json');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function load() {
  return JSON.parse(fs.readFileSync(DATA, 'utf8'));
}

/* One concept's references as structured items, for pages and the map. */
function itemsFor(data, id, problems) {
  const refs = data.refs[id] || [];
  const items = [];
  for (const [key, ...chapters] of refs) {
    const book = data.books[key];
    if (!book) { problems.push(`${id}: unknown book "${key}"`); continue; }
    const parts = [];
    for (const ch of chapters) {
      const entry = book.toc[String(ch)];
      if (!entry) { problems.push(`${id}: ${key} has no chapter ${ch}`); continue; }
      parts.push({ ch, title: entry.title, first: entry.first, url: entry.url });
    }
    items.push({ key, short: book.short, title: book.title, card: book.card, chapters: parts });
  }
  return items;
}

function render(items) {
  const books = items.map(it => {
    const chs = it.chapters.map(c => {
      const name = c.url
        ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a>`
        : `${esc(c.title)}`;
      const first = c.first ? ` (1st ed. ch. ${c.first})` : '';
      return `ch. ${c.ch} ${name}${first}`;
    }).join(', ');
    return `<a href="${it.card}" title="${esc(it.title)}">${esc(it.short)}</a> ${chs}`;
  });
  return `<div class="reading"><i class="bi bi-journal-bookmark" aria-hidden="true"></i> <strong>Read:</strong> ${books.join(' · ')}</div>`;
}

const PAGES = () => require('./build-learning-map.js').PAGES.map(p => p[0]);

function build(file, data, problems) {
  const full = path.join(ROOT, file);
  const raw = fs.readFileSync(full, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let html = raw.replace(/\r\n/g, '\n');

  const parts = html.split(/(?=<section class="pattern" id=")/);
  for (let i = 1; i < parts.length; i++) {
    let sec = parts[i];
    const anchor = sec.slice('<section class="pattern" id="'.length, sec.indexOf('"', '<section class="pattern" id="'.length));
    const id = `${file}#${anchor}`;
    if (!data.refs[id] || !data.refs[id].length) { problems.push(`${id}: no reading in data/reading.json`); continue; }
    const line = render(itemsFor(data, id, problems));

    sec = sec.replace(/\n[ \t]*<div class="reading">.*<\/div>/, '');
    // After the Docs line, else the Connects-to line, else the end of the
    // use / avoid callout (page 04's patterns have neither of the first two).
    let at = -1, indent = '';
    const one = sec.match(/\n([ \t]*)<div class="reference">.*<\/div>/) || sec.match(/\n([ \t]*)<div class="connects">.*<\/div>/);
    if (one) {
      at = one.index + one[0].length; indent = one[1];
    } else {
      const open = sec.match(/\n([ \t]*)<div class="callout">/);
      const close = open && sec.slice(open.index + 1).match(new RegExp(`\\n${open[1]}</div>`));
      if (close) { at = open.index + 1 + close.index + close[0].length; indent = open[1]; }
    }
    if (at < 0) { problems.push(`${id}: no Docs, Connects-to or callout to place the reading after`); continue; }
    sec = `${sec.slice(0, at)}\n${indent}${line}${sec.slice(at)}`;
    parts[i] = sec;
  }
  html = parts.join('');
  return { full, raw, out: html.replace(/\n/g, eol) };
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const data = load();
  const problems = [];
  const stale = [];
  const ids = new Set();
  for (const file of PAGES()) {
    const { full, raw, out } = build(file, data, problems);
    for (const m of raw.matchAll(/<section class="pattern" id="([^"]+)"/g)) ids.add(`${file}#${m[1]}`);
    if (out === raw) continue;
    stale.push(file);
    if (!check) fs.writeFileSync(full, out);
  }
  for (const id of Object.keys(data.refs)) if (!ids.has(id)) problems.push(`in data/reading.json but not on any page: ${id}`);

  problems.forEach(p => console.log(`  ${p}`));
  if (check) {
    stale.forEach(f => console.log(`  reading out of date: ${f} -- run node tools/build-reading.js`));
    process.exit(stale.length || problems.length ? 1 : 0);
  }
  console.log(stale.length ? `updated ${stale.length} page(s): ${stale.join(', ')}` : 'reading already up to date');
  process.exit(problems.length ? 1 : 0);
}

module.exports = { load, itemsFor };
