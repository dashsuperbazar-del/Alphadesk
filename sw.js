// AlphaDesk Service Worker v2
// Save this file alongside AlphaDesk.html for offline PWA support
const C = 'alphadesk-v2';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./'])));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const u = e.request.url;
  // Always network-first for live data sources
  if (u.includes('yahoo') || u.includes('allorigins') || u.includes('corsproxy') ||
      u.includes('thingproxy') || u.includes('codetabs') ||
      u.includes('script.google') || u.includes('api.dhan') ||
      u.includes('supabase') || u.includes('github') ||
      u.includes('gist.githubusercontent')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for app shell
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
