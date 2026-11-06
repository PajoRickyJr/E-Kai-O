/* ==========================================================================
   E-KAI-O - script.js
   Edit the SITE object to change the text and button links.
   brandName sets the page title and the logo link's screen-reader label.
   The logo image itself is images/logo.png.
   The same text also exists in index.html, so the page still reads
   correctly if this file fails to load.
   The headline and the promise quote stay in index.html because they
   use bold and highlight markup.
   ========================================================================== */
(function () {
  'use strict';

  var SITE = {
    brandName: 'E-KAI-O',
    eyebrow: 'Electrical & electronic servicing',
    lede: 'Repair, installation and maintenance for homes and businesses, handled by one team.',
    ctaPrimary: { label: 'Request a service', href: '#contact' },
    ctaSecondary: { label: 'View our services', href: '#services' }
  };

  document.querySelectorAll('[data-site]').forEach(function (el) {
    var value = SITE[el.getAttribute('data-site')];
    if (typeof value === 'string') {
      el.textContent = value;
    } else if (value && typeof value === 'object') {
      if (value.label) el.textContent = value.label;
      if (value.href) el.setAttribute('href', value.href);
    }
  });

  var logo = document.querySelector('[data-site-logo]');
  if (logo) logo.setAttribute('aria-label', SITE.brandName + ' home');

  document.title = SITE.brandName;

  // Services search: filters the service tiles as you type ("Others" always stays).
  var search = document.getElementById('service-search');
  var list = document.getElementById('service-list');
  var empty = document.getElementById('service-empty');
  if (search && list) {
    var box = search.closest('.svc-search');
    if (box) box.hidden = false;
    var tiles = Array.prototype.slice.call(list.children);
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var matches = 0;
      tiles.forEach(function (tile) {
        var keep = tile.hasAttribute('data-always');
        var hit = !q || tile.textContent.toLowerCase().indexOf(q) !== -1;
        if (hit && !keep) matches++;
        tile.hidden = !(hit || keep);
      });
      if (empty) empty.hidden = !(q && matches === 0);
    });
  }

  // Scroll reveals: fade-and-rise elements in as they enter the viewport.
  // The hidden state lives in styles.css behind html.reveal-ready (set in the
  // page head), so the content stays visible if this script never runs.
  (function () {
    if (!document.documentElement.classList.contains('reveal-ready')) return;

    var selector = [
      '.hero .copy > *', '.hero .art', '.plate-title', '.lead',
      '.features-intro', '.features > li', '.steps > .step', '.worry-panel',
      '.promise-label', '.promise-quote', '.about-statement',
      '.about-tags > div', '.app-copy', '.devices', '.svc-search',
      '.services-grid > .svc-tile', '.sdg-grid > .sdg-card', '.thesis-text',
      '.market-grid > .market-card'
    ].join(',');
    var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!targets.length) return;

    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cascade siblings in these containers instead of popping them in at once.
    ['.hero .copy', '.features', '.steps', '.about-tags', '.services-grid',
      '.sdg-grid', '.market-grid'].forEach(function (groupSel) {
      var group = document.querySelector(groupSel);
      if (!group) return;
      var i = 0;
      Array.prototype.forEach.call(group.children, function (child) {
        if (targets.indexOf(child) === -1) return;
        child.style.setProperty('--reveal-delay', (i * 90) + 'ms');
        i += 1;
      });
    });

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    targets.forEach(function (el) { io.observe(el); });
  })();
})();