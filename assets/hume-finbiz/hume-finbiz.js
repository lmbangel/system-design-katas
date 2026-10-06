/* ==========================================================================
   HumeFinbiz Design System - Shell Behaviour
   Version : 1.0.0
   Depends : nothing (vanilla ES5+). Works alongside jQuery and Bootstrap 5
             but does not require either. Bootstrap's own JS still handles
             dropdowns, modals and tooltips.

   USAGE
     <script src="hume-finbiz.js"></script>
     <script>HumeFinbiz.init();</script>

     Or with options:
     HumeFinbiz.init({
       storageKey  : 'hf.shell.myapp',   // per-app persistence namespace
       persist     : true,
       autoOpenActive : true,
       sync : { staleAfter: 900, errorAfter: 3600, tickMs: 30000 }
     });

   PUBLIC API
     HumeFinbiz.init(options)
     HumeFinbiz.toggleSidebar(force)          -> boolean (collapsed?)
     HumeFinbiz.openMobileNav() / closeMobileNav()
     HumeFinbiz.sync.set(el, isoString)       -> stamp a sync element
     HumeFinbiz.sync.setState(el, state)      -> 'syncing'|'error'|'auto'
     HumeFinbiz.sync.refreshAll()
     HumeFinbiz.setActive(href)               -> re-mark active nav by href

   EVENTS (dispatched on document)
     hf:sidebar:toggle    detail { collapsed }
     hf:nav:toggle        detail { item, open }
     hf:sync:refresh      detail { el }        <- YOUR app listens and refetches
   ========================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.HumeFinbiz = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MOBILE_BP = 992; // must match the CSS lg breakpoint

  var defaults = {
    shell            : '.hf-shell',
    storageKey       : 'hf.shell',
    persist          : true,
    autoOpenActive   : true,   // expand ancestors of .is-active on load
    accordion        : false,  // true = only one tier-1 branch open at a time
    flyout           : true,   // show child flyouts when the rail is collapsed
    closeOnNavigate  : true,   // close the mobile drawer after a link click
    sync : {
      staleAfter : 900,        // seconds until 'stale'
      errorAfter : 3600,       // seconds until 'error'
      tickMs     : 30000,      // relative label refresh interval
      locale     : undefined   // undefined = browser locale
    }
  };

  var opts = null;
  var shell = null;
  var syncTimer = null;
  var flyoutEl = null;
  var flyoutOwner = null;
  var flyoutHideTimer = null;

  /* ---------------------------------------------------------------- utils */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function extend() {
    var out = {}, i, k;
    for (i = 0; i < arguments.length; i++) {
      var src = arguments[i] || {};
      for (k in src) {
        if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
        if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && !(src[k] instanceof Date)) {
          out[k] = extend(out[k] || {}, src[k]);
        } else { out[k] = src[k]; }
      }
    }
    return out;
  }

  function store(key, val) {
    try {
      if (typeof val === 'undefined') return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { /* storage blocked: degrade silently, state is per-session */ }
    return null;
  }

  function emit(name, detail) {
    var ev;
    try { ev = new CustomEvent(name, { detail: detail, bubbles: true }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, true, false, detail); }
    document.dispatchEvent(ev);
  }

  function isMobile() { return window.innerWidth < MOBILE_BP; }

  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if (el.matches ? el.matches(sel) : el.msMatchesSelector(sel)) return el;
      el = el.parentElement;
    }
    return null;
  }

  /* ------------------------------------------------------------- sidebar */

  function applyCollapsed(collapsed) {
    if (!shell) return;
    shell.classList.toggle('is-collapsed', !!collapsed);
    $$('[data-hf-sidebar-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
    if (collapsed) hideFlyout(true);
  }

  function toggleSidebar(force) {
    if (!shell) return false;
    if (isMobile()) {
      var open = typeof force === 'boolean' ? force : !shell.classList.contains('is-mobile-open');
      shell.classList.toggle('is-mobile-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      emit('hf:sidebar:toggle', { collapsed: false, mobileOpen: open });
      return false;
    }
    var collapsed = typeof force === 'boolean' ? force : !shell.classList.contains('is-collapsed');
    applyCollapsed(collapsed);
    if (opts.persist) store(opts.storageKey + '.collapsed', collapsed ? '1' : '0');
    emit('hf:sidebar:toggle', { collapsed: collapsed });
    return collapsed;
  }

  function openMobileNav()  { toggleSidebar(true); }
  function closeMobileNav() {
    if (!shell) return;
    shell.classList.remove('is-mobile-open');
    document.body.style.overflow = '';
  }

  /* ------------------------------------------------------- nav (3 tiers) */

  function branchKey(item) {
    var link = item.querySelector(':scope > .hf-nav__link');
    if (!link) return null;
    return link.getAttribute('data-hf-key') ||
           (link.querySelector('.hf-nav__text') || {}).textContent ||
           link.textContent.trim();
  }

  function setBranch(item, open) {
    if (!item) return;
    item.classList.toggle('is-open', open);
    var link = item.querySelector(':scope > .hf-nav__link');
    if (link) link.setAttribute('aria-expanded', open ? 'true' : 'false');
    var sub = item.querySelector(':scope > .hf-nav__sub');
    if (sub) sub.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (opts.persist) {
      var k = branchKey(item);
      if (k) store(opts.storageKey + '.branch.' + k, open ? '1' : '0');
    }
    emit('hf:nav:toggle', { item: item, open: open });
  }

  function toggleBranch(item) {
    var open = !item.classList.contains('is-open');
    if (open && opts.accordion) {
      var parent = item.parentElement;
      $$(':scope > .hf-nav__item--parent.is-open', parent).forEach(function (sib) {
        if (sib !== item) setBranch(sib, false);
      });
    }
    setBranch(item, open);
  }

  function markAncestors() {
    $$('.hf-nav__link.is-active').forEach(function (link) {
      var item = closest(link.parentElement, '.hf-nav__item--parent');
      while (item) {
        var pl = item.querySelector(':scope > .hf-nav__link');
        if (pl) pl.classList.add('is-current-parent');
        if (opts.autoOpenActive) setBranch(item, true);
        item = closest(item.parentElement, '.hf-nav__item--parent');
      }
    });
  }

  function restoreBranches() {
    if (!opts.persist) return;
    $$('.hf-nav__item--parent').forEach(function (item) {
      var k = branchKey(item);
      if (!k) return;
      var v = store(opts.storageKey + '.branch.' + k);
      if (v === '1') setBranch(item, true);
      else if (v === '0' && !item.querySelector('.hf-nav__link.is-active')) setBranch(item, false);
    });
  }

  /* Mark the nav item whose href best matches a URL. Longest match wins. */
  function setActive(href) {
    var target = href || window.location.pathname + window.location.search;
    var best = null, bestLen = -1;
    $$('.hf-nav a.hf-nav__link[href]').forEach(function (a) {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');
      var h = a.getAttribute('href');
      if (!h || h === '#' || h.charAt(0) === '#') return;
      if (target.indexOf(h) === 0 && h.length > bestLen) { best = a; bestLen = h.length; }
    });
    $$('.hf-nav__link.is-current-parent').forEach(function (l) { l.classList.remove('is-current-parent'); });
    if (best) {
      best.classList.add('is-active');
      best.setAttribute('aria-current', 'page');
      markAncestors();
    }
    return best;
  }

  /* --------------------------------------------------- flyout (collapsed) */

  function ensureFlyout() {
    if (flyoutEl) return flyoutEl;
    flyoutEl = document.createElement('div');
    flyoutEl.className = 'hf-flyout';
    flyoutEl.setAttribute('role', 'menu');
    document.body.appendChild(flyoutEl);
    flyoutEl.addEventListener('mouseenter', function () { clearTimeout(flyoutHideTimer); });
    flyoutEl.addEventListener('mouseleave', function () { hideFlyout(); });
    return flyoutEl;
  }

  function showFlyout(item) {
    if (!opts.flyout || !shell.classList.contains('is-collapsed') || isMobile()) return;
    var sub = item.querySelector(':scope > .hf-nav__sub');
    var link = item.querySelector(':scope > .hf-nav__link');
    if (!link) return;
    clearTimeout(flyoutHideTimer);
    var fl = ensureFlyout();
    flyoutOwner = item;

    var label = (link.querySelector('.hf-nav__text') || {}).textContent || link.getAttribute('title') || '';
    fl.innerHTML = '';
    if (label) {
      var t = document.createElement('div');
      t.className = 'hf-flyout__title';
      t.textContent = label.trim();
      fl.appendChild(t);
    }
    if (sub) {
      fl.appendChild(sub.cloneNode(true));
    } else {
      // leaf item: flyout acts as a label tooltip
      var a = document.createElement('a');
      a.className = 'hf-nav__link';
      a.href = link.getAttribute('href') || '#';
      a.textContent = 'Open';
      fl.appendChild(a);
    }

    var r = link.getBoundingClientRect();
    fl.style.visibility = 'hidden';
    fl.classList.add('is-open');
    var h = fl.offsetHeight;
    var top = Math.min(Math.max(8, r.top), window.innerHeight - h - 8);
    fl.style.top = top + 'px';
    fl.style.left = (r.right + 6) + 'px';
    fl.style.visibility = '';
  }

  function hideFlyout(now) {
    if (!flyoutEl) return;
    clearTimeout(flyoutHideTimer);
    var kill = function () { flyoutEl.classList.remove('is-open'); flyoutOwner = null; };
    if (now) kill(); else flyoutHideTimer = setTimeout(kill, 140);
  }

  /* ---------------------------------------------------- sync / freshness */

  function relTime(seconds, locale) {
    var abs = Math.abs(seconds);
    if (abs < 45)    return 'just now';
    if (abs < 90)    return '1 min ago';
    if (abs < 3600)  return Math.round(abs / 60) + ' min ago';
    if (abs < 7200)  return '1 hr ago';
    if (abs < 86400) return Math.round(abs / 3600) + ' hrs ago';
    if (abs < 172800) return 'yesterday';
    return Math.round(abs / 86400) + ' days ago';
  }

  function absTime(d, locale) {
    try {
      return d.toLocaleString(locale, {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      });
    } catch (e) { return d.toString(); }
  }

  function readNum(el, attr, fallback) {
    var v = parseInt(el.getAttribute(attr), 10);
    return isNaN(v) ? fallback : v;
  }

  function renderSync(el) {
    var forced = el.getAttribute('data-state');       // syncing | error | ''
    var iso    = el.getAttribute('data-synced-at');
    var valEl  = el.querySelector('.hf-sync__value');
    var staleAfter = readNum(el, 'data-stale-after', opts.sync.staleAfter);
    var errorAfter = readNum(el, 'data-error-after', opts.sync.errorAfter);

    el.classList.remove('hf-sync--fresh', 'hf-sync--stale', 'hf-sync--error', 'hf-sync--syncing');

    if (forced === 'syncing') {
      el.classList.add('hf-sync--syncing');
      if (valEl) valEl.textContent = 'Syncing…';
      el.setAttribute('title', 'Synchronising now');
      return;
    }
    if (forced === 'error') {
      el.classList.add('hf-sync--error');
      if (valEl) valEl.textContent = el.getAttribute('data-error-text') || 'Sync failed';
      el.setAttribute('title', el.getAttribute('data-error-detail') || 'The last sync attempt failed');
      return;
    }
    if (!iso) {
      el.classList.add('hf-sync--error');
      if (valEl) valEl.textContent = 'Never synced';
      el.setAttribute('title', 'No successful sync recorded');
      return;
    }

    var d = new Date(iso);
    if (isNaN(d.getTime())) {
      el.classList.add('hf-sync--error');
      if (valEl) valEl.textContent = 'Unknown';
      return;
    }
    var age = (Date.now() - d.getTime()) / 1000;
    var cls = age >= errorAfter ? 'hf-sync--error' : (age >= staleAfter ? 'hf-sync--stale' : 'hf-sync--fresh');
    el.classList.add(cls);
    if (valEl) valEl.textContent = relTime(age, opts.sync.locale);
    el.setAttribute('title', 'Last successful sync: ' + absTime(d, opts.sync.locale));
    el.setAttribute('datetime', iso);
  }

  function refreshAllSync() { $$('[data-hf-sync]').forEach(renderSync); }

  var syncApi = {
    /* Stamp an element as synced now (or at a given ISO time) */
    set: function (el, iso) {
      el = typeof el === 'string' ? $(el) : el;
      if (!el) return;
      el.removeAttribute('data-state');
      el.setAttribute('data-synced-at', iso || new Date().toISOString());
      renderSync(el);
    },
    /* state: 'syncing' | 'error' | 'auto' */
    setState: function (el, state, detail) {
      el = typeof el === 'string' ? $(el) : el;
      if (!el) return;
      if (state === 'auto' || !state) el.removeAttribute('data-state');
      else el.setAttribute('data-state', state);
      if (detail) el.setAttribute('data-error-detail', detail);
      renderSync(el);
    },
    render: renderSync,
    refreshAll: refreshAllSync
  };

  /* ------------------------------------------------------------- binding */

  function bind() {
    /* Sidebar toggle buttons */
    document.addEventListener('click', function (e) {
      var t;

      if ((t = closest(e.target, '[data-hf-sidebar-toggle]'))) {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      if ((t = closest(e.target, '.hf-backdrop'))) { closeMobileNav(); return; }

      /* Nav branch toggle */
      if ((t = closest(e.target, '[data-hf-toggle]'))) {
        var item = closest(t, '.hf-nav__item--parent');
        if (item) {
          if (shell.classList.contains('is-collapsed') && !isMobile()) {
            showFlyout(item);           // rail mode: reveal children as a flyout
          } else {
            e.preventDefault();
            toggleBranch(item);
          }
        }
        return;
      }

      /* Sync manual refresh */
      if ((t = closest(e.target, '[data-hf-sync-refresh]'))) {
        e.preventDefault();
        var syncEl = closest(t, '[data-hf-sync]');
        if (syncEl) { syncApi.setState(syncEl, 'syncing'); emit('hf:sync:refresh', { el: syncEl }); }
        return;
      }

      /* Close mobile drawer after navigating */
      if (opts.closeOnNavigate && isMobile() && (t = closest(e.target, '.hf-nav a.hf-nav__link'))) {
        closeMobileNav();
      }
    });

    /* Flyout hover on the collapsed rail */
    document.addEventListener('mouseover', function (e) {
      if (!opts.flyout || isMobile() || !shell.classList.contains('is-collapsed')) return;
      var item = closest(e.target, '.hf-sidebar .hf-nav__item');
      if (!item) { if (!closest(e.target, '.hf-flyout')) hideFlyout(); return; }
      // only top-tier items own a flyout
      if (closest(item.parentElement, '.hf-nav__item')) return;
      if (item !== flyoutOwner) showFlyout(item);
    });

    document.addEventListener('mouseout', function (e) {
      if (!flyoutEl || !flyoutEl.classList.contains('is-open')) return;
      var to = e.relatedTarget;
      if (to && (closest(to, '.hf-flyout') || closest(to, '.hf-sidebar'))) return;
      hideFlyout();
    });

    /* Escape closes drawer / flyout */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' && e.keyCode !== 27) return;
      hideFlyout(true);
      if (shell.classList.contains('is-mobile-open')) closeMobileNav();
    });

    /* Keyboard: Enter/Space on a branch button */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.keyCode !== 13 && e.keyCode !== 32) return;
      var t = closest(e.target, '[data-hf-toggle]');
      if (!t) return;
      e.preventDefault();
      var item = closest(t, '.hf-nav__item--parent');
      if (item) toggleBranch(item);
    });

    /* Resize: leaving mobile clears the drawer state */
    var wasMobile = isMobile();
    window.addEventListener('resize', function () {
      var now = isMobile();
      if (now !== wasMobile) {
        wasMobile = now;
        if (!now) { closeMobileNav(); }
        hideFlyout(true);
      }
      if (flyoutOwner) hideFlyout(true);
    });

    /* Tab visibility: re-render freshness immediately on return */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) refreshAllSync();
    });
  }

  /* ---------------------------------------------------------------- init */

  function init(userOpts) {
    opts = extend(defaults, userOpts || {});
    shell = $(opts.shell);
    if (!shell) { return null; }

    /* ARIA scaffolding */
    $$('.hf-nav__item--parent > .hf-nav__link[data-hf-toggle]').forEach(function (link, i) {
      var sub = link.parentElement.querySelector(':scope > .hf-nav__sub');
      if (sub) {
        if (!sub.id) sub.id = 'hf-nav-sub-' + i;
        link.setAttribute('aria-controls', sub.id);
        link.setAttribute('aria-expanded', link.parentElement.classList.contains('is-open') ? 'true' : 'false');
        sub.setAttribute('role', 'group');
      }
    });
    var navEl = $('.hf-nav');
    if (navEl && !navEl.getAttribute('aria-label')) navEl.setAttribute('aria-label', 'Main navigation');

    /* Backdrop for the mobile drawer */
    if (!$('.hf-backdrop', shell)) {
      var bd = document.createElement('div');
      bd.className = 'hf-backdrop';
      bd.setAttribute('aria-hidden', 'true');
      shell.appendChild(bd);
    }

    /* Restore collapsed state (desktop only) */
    if (opts.persist && !isMobile()) {
      applyCollapsed(store(opts.storageKey + '.collapsed') === '1');
    }

    restoreBranches();
    if (!$('.hf-nav__link.is-active')) setActive(); else markAncestors();

    refreshAllSync();
    if (syncTimer) clearInterval(syncTimer);
    if (opts.sync.tickMs > 0) syncTimer = setInterval(refreshAllSync, opts.sync.tickMs);

    bind();
    return api;
  }

  var api = {
    init            : init,
    toggleSidebar   : toggleSidebar,
    openMobileNav   : openMobileNav,
    closeMobileNav  : closeMobileNav,
    setActive       : setActive,
    sync            : syncApi,
    version         : '1.0.0'
  };

  return api;
}));
