/* ==========================================================================
   System design katas - page behaviour
   Loads after hume-finbiz.js. Vanilla, no dependencies.

   1. Shell        HumeFinbiz.init(): sidebar toggle, collapse, flyouts.
   2. Code tabs    One code block, three languages. Scoped per block.
   3. Scroll spy   Marks the tier-2 nav link of the concept on screen.
   4. Checklist    prep-checklist.html. State persists per item in localStorage.

   Replaces the three inline <script> variants the pages used to carry. The
   prep checklist's old version toggled each box twice per click (an onclick
   attribute AND a listener), so a click never visibly did anything.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------- 1 shell */

  if (window.HumeFinbiz) {
    // No freshness indicator on these pages, so no sync ticker either.
    window.HumeFinbiz.init({
      storageKey: 'hf.shell.katas',
      sync: { tickMs: 0 }
    });
  }

  // The current page's tier-1 item is a parent (its tier-2 children are the
  // concepts on this page), so per the system it is bolded, not filled.
  // init() finds no active leaf link on such a page, falls through to
  // setActive(), and setActive() clears every .is-current-parent -- put it back.
  document.querySelectorAll('.hf-nav__item--parent > .hf-nav__link[aria-current="page"]').forEach(function (b) {
    b.classList.add('is-current-parent');
  });

  // The sidebar is the site's navigation, so "where am I" must be visible in
  // it. Scroll the nav -- only the nav, never the page -- to bring an item in.
  var nav = document.querySelector('.hf-nav');
  function revealInNav(el, align) {
    if (!nav || !el) return;
    var n = nav.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (align === 'top') {
      nav.scrollTop += r.top - n.top - 8;
    } else if (r.top < n.top) {
      nav.scrollTop -= n.top - r.top + 8;
    } else if (r.bottom > n.bottom) {
      nav.scrollTop += r.bottom - n.bottom + 8;
    }
  }
  var here = document.querySelector('.hf-nav [aria-current="page"]');
  if (here) {
    var rect = here.getBoundingClientRect(), box = nav.getBoundingClientRect();
    // Pages low in the list open with their item at the top of the nav, so
    // their expanded sections are on screen; pages already visible stay put.
    if (rect.bottom > box.bottom - box.height / 3) revealInNav(here, 'top');
  }

  /* -------------------------------------------------------- 2 code tabs */

  document.querySelectorAll('.code-block').forEach(function (block) {
    var tabs = block.querySelectorAll('.tab');
    var bar = block.querySelector('.code-tabs');
    if (bar) bar.setAttribute('role', 'tablist');

    tabs.forEach(function (tab) {
      var pane = document.getElementById(tab.getAttribute('data-target'));
      tab.setAttribute('type', 'button');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      if (pane) {
        tab.setAttribute('aria-controls', pane.id);
        pane.setAttribute('role', 'tabpanel');
      }

      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        block.querySelectorAll('.code-pane').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        if (pane) pane.classList.add('active');
      });
    });
  });

  /* ------------------------------------------------------- 3 scroll spy */

  var spyLinks = {};
  document.querySelectorAll('.hf-nav__link--t2[href^="#"]').forEach(function (a) {
    spyLinks[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && Object.keys(spyLinks).length) {
    var current = null;
    var setCurrent = function (id) {
      if (id === current) return;
      if (current && spyLinks[current]) {
        spyLinks[current].classList.remove('is-active');
        spyLinks[current].removeAttribute('aria-current');
      }
      current = id;
      if (spyLinks[id]) {
        spyLinks[id].classList.add('is-active');
        spyLinks[id].setAttribute('aria-current', 'location');
        revealInNav(spyLinks[id]);
      }
    };

    // A section counts as "on screen" once its top passes the upper third.
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: '-20% 0px -70% 0px' });

    Object.keys(spyLinks).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* -------------------------------------------------------- 4 checklist */

  function store(key, val) {
    try {
      if (typeof val === 'undefined') return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  document.querySelectorAll('.check-box').forEach(function (box, i) {
    var key = 'check-' + i;          // the key the old script used: progress survives
    var item = box.closest('.check-item');

    var render = function (on) {
      box.classList.toggle('checked', on);
      box.setAttribute('aria-checked', on ? 'true' : 'false');
      if (item) item.classList.toggle('is-done', on);
    };

    render(store(key) === 'true');

    box.addEventListener('click', function () {
      var on = !box.classList.contains('checked');
      render(on);
      store(key, on ? 'true' : 'false');
    });
  });
}());
