import fs from 'fs';

// 1. Upgrade public/sw.js to handle PWA push notifications and notification click focus
const swCode = `// Ali Gym Track Service Worker for iOS & Android Web Push Notifications
const CACHE_NAME = 'ali-gym-track-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = { title: '🏋️ حان وقت الجيم يا بشمهندس علي!', body: 'معاد تمرين اليوم 8:00 مساءً! جاهز لكسر الأرقام؟ 🚀' };
  try {
    if (event.data) payload = event.data.json();
  } catch(_e){}

  const options = {
    body: payload.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [300, 100, 300],
    data: { url: '/' },
    tag: 'gym-reminder-8pm'
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
`;

fs.writeFileSync('e:\\ali-Gym-Track\\public\\sw.js', swCode, 'utf8');
console.log('Upgraded public/sw.js successfully!');

// 2. Add Notification Hook & 8:00 PM Gym Alarm Engine in App.jsx
let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Insert Notification state and Alarm check effect into MainApp component
const notificationHookCode = `
  const [notificationPermission, setNotificationPermission] = useState(() => {
    return (typeof window !== 'undefined' && 'Notification' in window) ? Notification.permission : 'denied';
  });
  const [lastNotificationDate, setLastNotificationDate] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_LastNotifDate') || '';
  });

  // Register Service Worker for PWA Notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(_err => {});
    }
  }, []);

  // Request Notification Permission on iOS PWA / Browser
  const requestNotificationPermission = async () => {
    triggerHaptic();
    if (!('Notification' in window)) {
      showToast("الإشعارات غير مدعومة في المتصفح الحالي.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === 'granted') {
        showToast("تم تفعيل إشعارات الجيم 8:00 مساءً بنجاح! 🔔");
        triggerTestNotification();
      } else if (result === 'denied') {
        showToast("تم رفض الإشعارات. يرجى تفعيلها من إعدادات الآيفون.");
      }
    } catch (_e) {
      showToast("يرجى التأكد من إضافة التطبيق للشاشة الرئيسية (Add to Home Screen) في الآيفون لتفعيل الإشعارات.");
    }
  };

  // Trigger Local System Notification
  const triggerSystemNotification = (title, body) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          vibrate: [300, 100, 300],
          tag: 'gym-8pm-alarm'
        });
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag: 'gym-8pm-alarm'
      });
    }
  };

  const triggerTestNotification = () => {
    triggerSystemNotification(
      "🏋️ إشعار تمرين الجيم (تجربة 8:00 مساءً)",
      "عاش يا بشمهندس علي! الإشعارات شغالة الآن كأنك فتح أبل ستور أبليكيشن 🚀"
    );
  };

  // 8:00 PM (20:00) Gym Alarm Scheduler for Workout Days
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const checkGymTimeAlarm = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const todayStr = getLocalDateKey(now);

      // Workout days are Days 1, 2, 4, 5
      const isWorkoutDay = [1, 2, 4, 5].includes(activeDay);

      // Alarm triggers at 20:00 (8:00 PM) on workout days once per day
      if (isWorkoutDay && hours === 20 && lastNotificationDate !== todayStr) {
        setLastNotificationDate(todayStr);
        localStorage.setItem('gymProgress_Ali_LastNotifDate', todayStr);

        triggerSystemNotification(
          \`🏋️ حان وقت الجيم يا بشمهندس علي! (8:00 مساءً)\`,
          \`معاد تمرين اليوم (\${currentWorkout.arabicTitle}) جه! خش على التطبيق وسجل مجاميعك واكسر أرقامك اليوم 🚀\`
        );
      }
    };

    checkGymTimeAlarm();
    const interval = setInterval(checkGymTimeAlarm, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [notificationPermission, activeDay, lastNotificationDate, currentWorkout]);
`;

// Insert notificationHookCode right at the start of MainApp
appCode = appCode.replace(
  "const MainApp = () => {",
  "const MainApp = () => {" + notificationHookCode
);

// Add Notification Bell Button to Header and Settings Drawer
const headerNotificationButton = `
            <button 
              type="button"
              aria-label="تفعيل إشعارات الجيم 8 مساءً"
              onClick={requestNotificationPermission} 
              className={\`p-2 rounded-xl transition-all border font-bold text-xs min-h-[44px] min-w-[44px] flex items-center justify-center \${
                notificationPermission === 'granted' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }\`}
              title="إشعار الجيم 8:00 مساءً 🔔"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
            </button>`;

appCode = appCode.replace(
  `title="إبقاء الشاشة مضاءة 💡"
            >`,
  `title="إبقاء الشاشة مضاءة 💡"
            >` + headerNotificationButton
);

// Add Notification Control to Settings Drawer
const settingsNotificationControl = `
              {/* iOS PWA Notification Settings */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      إشعارات الجيم 8:00 مساءً (iOS / PWA)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">تذكير تلقائي يومي في موعد تمرينك 8:00 م</p>
                  </div>
                  <button
                    type="button"
                    onClick={requestNotificationPermission}
                    className={\`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all \${
                      notificationPermission === 'granted' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400'
                    }\`}
                  >
                    {notificationPermission === 'granted' ? 'مفعل 🔔' : 'تفعيل الإشعارات'}
                  </button>
                </div>
                {notificationPermission === 'granted' && (
                  <button
                    type="button"
                    onClick={triggerTestNotification}
                    className="w-full text-xs font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 py-2 rounded-xl min-h-[44px]"
                  >
                    🧪 تجربة إشعار التذكير الآن
                  </button>
                )}
              </div>`;

appCode = appCode.replace(
  `{/* Backup & Data Export/Import */}`,
  settingsNotificationControl + '\n\n              {/* Backup & Data Export/Import */}'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully integrated iOS PWA Notification Engine in App.jsx!');
