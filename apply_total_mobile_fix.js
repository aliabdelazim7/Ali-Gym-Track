import fs from 'fs';

// 1. Update index.html
const indexHtmlContent = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏋️‍♂️</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="description" content="تطبيق علي جيم تراك المطور لمتابعة التمارين، البدائل، التغذية، والأوزان" />
    <meta name="theme-color" content="#020617" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Ali Gym" />
    <link rel="manifest" href="/manifest.json" />
    <title>Ali Gym Track | تطبيق بشمهندس علي للجيم</title>
    <!-- Google Fonts: Cairo & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-950 text-slate-100 font-arabic antialiased selection:bg-orange-500 selection:text-white overscroll-y-none select-none min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script>
      // Self-healing: Unregister any stale ServiceWorker caches on mobile devices to guarantee 100% immediate Vercel load
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        }).catch(function(e){});
        if (window.caches) {
          caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
          }).catch(function(e){});
        }
      }
    </script>
  </body>
</html>`;

fs.writeFileSync('e:\\ali-Gym-Track\\index.html', indexHtmlContent, 'utf8');

// 2. Update public/sw.js
const swContent = `self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
`;
fs.writeFileSync('e:\\ali-Gym-Track\\public\\sw.js', swContent, 'utf8');

// 3. Update App.jsx Recharts height
let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');
appCode = appCode.replace(
  '<ResponsiveContainer width="100%" height="100%">',
  '<ResponsiveContainer width="100%" height={240}>'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');

console.log('Successfully applied total mobile fix (ServiceWorker unregister + Recharts height fix + index.html self-healing)!');
