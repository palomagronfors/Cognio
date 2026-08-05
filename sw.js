/* Cognio service worker - offline-tuki ja nopeampi lataus */
const VERSIO = 'cognio-v1';
const ESILADATTAVA = ['./', './index.html', './manifest.json', './icon.svg', './logo.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSIO).then((c) => c.addAll(ESILADATTAVA)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((avaimet) =>
      Promise.all(avaimet.filter((k) => k !== VERSIO).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // POST/PUT ym. suoraan verkkoon (esim. Supabase-tallennus)
  const url = new URL(req.url);

  // Sivunavigaatio: verkko ensin (tuoreus) ja päivitä offline-varakopio, offline-tilassa tarjoa tallennettu index.html
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((vastaus) => {
        if (vastaus && vastaus.status === 200) {
          const kopio = vastaus.clone();
          caches.open(VERSIO).then((c) => c.put('./index.html', kopio));
        }
        return vastaus;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Supabase-API: aina verkosta, ei koskaan välimuistista (datan tuoreus)
  if (url.hostname.endsWith('supabase.co')) return;

  const sama = url.origin === self.location.origin;
  const jsdelivr = url.hostname === 'cdn.jsdelivr.net';

  // Oma sisältö + Supabase-kirjasto: tarjoa välimuistista ja päivitä taustalla (stale-while-revalidate)
  if (sama || jsdelivr) {
    e.respondWith(
      caches.open(VERSIO).then((c) =>
        c.match(req).then((valimuisti) => {
          const verkko = fetch(req).then((vastaus) => {
            if (vastaus && vastaus.status === 200) c.put(req, vastaus.clone());
            return vastaus;
          }).catch(() => valimuisti);
          return valimuisti || verkko;
        })
      )
    );
    return;
  }

  // Muut (esim. Google Fonts): verkko, offline-tilassa yritä välimuistia
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});
