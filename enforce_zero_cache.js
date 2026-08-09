import fs from 'fs';

// 1. Update vercel.json with no-cache headers for index.html
const vercelConfig = {
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "Expires",
          "value": "0"
        }
      ]
    },
    {
      "source": "/exercises/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
};

fs.writeFileSync('e:\\ali-Gym-Track\\vercel.json', JSON.stringify(vercelConfig, null, 2), 'utf8');

// 2. Add clearBrowserCache button in App.jsx header controls
let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const clearCacheFunc = `
  const handleClearBrowserCache = async () => {
    triggerHaptic();
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let r of regs) await r.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (let k of keys) await caches.delete(k);
      }
    } catch(e){}
    window.location.reload(true);
  };
`;

if (!appCode.includes('handleClearBrowserCache')) {
  appCode = appCode.replace('const exportData = () => {', clearCacheFunc + '\n  const exportData = () => {');
  
  const headerBtnTarget = `<button 
              type="button"
              onClick={exportData} 
              className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
              title="تصدير النسخة الاحتياطية"
            >
              <Download className="w-4 h-4" />
            </button>`;
            
  const headerBtnReplacement = `<button 
              type="button"
              onClick={handleClearBrowserCache} 
              className="p-2 text-slate-400 hover:text-amber-400 rounded-xl transition-colors"
              title="مسح كاش المتصفح والتحديث الفوري"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={exportData} 
              className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
              title="تصدير النسخة الاحتياطية"
            >
              <Download className="w-4 h-4" />
            </button>`;
            
  appCode = appCode.replace(headerBtnTarget, headerBtnReplacement);
  fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
}

console.log('Successfully updated vercel.json and App.jsx with zero-cache enforcement!');
