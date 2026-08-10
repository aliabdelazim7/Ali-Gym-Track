import fs from 'fs';

const newIndexHtml = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="description" content="Ali Gym Tracker - نظام تتبع التمرين البدائل والأوزان المطور للبشمهندس علي" />
    <meta name="theme-color" content="#020617" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Ali Gym Tracker" />
    <link rel="manifest" href="/manifest.json" />
    <title>Ali Gym Tracker | علي جيم تراك - البشمهندس</title>
    <!-- Google Fonts: Cairo & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script>
      // 🛡️ Automatic Chunk Load Error Recovery
      window.addEventListener('error', function(e) {
        if (e && e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
          console.warn("Detected stale chunk load failure. Auto-healing...", e);
          if (!window.location.search.includes('v=')) {
            window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
          }
        }
      }, true);

      // Self-healing: Unregister all ServiceWorker caches on mobile
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
  </head>
  <body class="bg-slate-950 text-slate-100 font-arabic antialiased selection:bg-orange-500 selection:text-white overscroll-y-none select-none min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

fs.writeFileSync('e:\\ali-Gym-Track\\index.html', newIndexHtml, 'utf8');
console.log('Successfully updated index.html with bulletproof auto-healing cache-busting scripts!');
