/*
 * LT-674: Meta's pixel on the marketing site, for measuring Lightor's own ads.
 * It reports one thing: this page was opened. Meta's automatic collection
 * (button clicks, page details) is off, and no name, email or phone is handed
 * to it. The finished signup is reported from register.lightor.app.
 *
 * The id below is filled in at build time from VITE_META_PIXEL_ID
 * (scripts/meta-pixel.mjs). With no id, in a local run, or inside a frame,
 * this file does nothing.
 */
(function () {
  var id = '%VITE_META_PIXEL_ID%';
  if (!/^\d+$/.test(id) || window.parent !== window || window.fbq) return;

  var fbq = function () {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  fbq('set', 'autoConfig', false, id);
  fbq('init', id);
  fbq('track', 'PageView');
})();
