import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Cleanly refactor MainApp to ensure 100% correct hook ordering and zero crashes
const fixedMainAppCode = `const MainApp = () => {
  const [todayDateKey] = useState(() => getLocalDateKey());
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey());

  const isTodaySelected = selectedDate === todayDateKey;

  const parseDateIndexedState = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return {};
      let parsed;
      try { parsed = JSON.parse(saved); } catch(_e) { return {}; }
      if (typeof parsed !== 'object' || parsed === null) return {};
      const keys = Object.keys(parsed);
      const hasDateKey = keys.some(k => k.includes('-'));
      if (!hasDateKey && keys.length > 0) {
        const yesterdayKey = getLocalDateKey(new Date(Date.now() - 86400000));
        return {
          [yesterdayKey]: parsed,
          [todayDateKey]: parsed
        };
      }
      return parsed;
    } catch(_e) {
      return {};
    }
  };

  const [workoutProgress, setWorkoutProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Workout'));
  const [exerciseWeights, setExerciseWeights] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseWeights'));
  const [exerciseReps, setExerciseReps] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseReps'));
  const [dietProgress, setDietProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Diet'));
  const [waterGlasses, setWaterGlasses] = useState(() => parseDateIndexedState('gymProgress_Ali_Water'));

  const [weightLogs, setWeightLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Weights');
      return saved ? JSON.parse(saved) : initialWeightLogs;
    } catch(_e) { return []; }
  });

  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'diet' | 'progress' | 'settings'
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [openMealId, setOpenMealId] = useState('meal-1');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [notificationPermission, setNotificationPermission] = useState(() => {
    return (typeof window !== 'undefined' && 'Notification' in window) ? Notification.permission : 'denied';
  });
  const [lastNotificationDate, setLastNotificationDate] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_LastNotifDate') || '';
  });

  const wakeLockRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

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
      }).catch(_e => {});
    } else if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
          tag: 'gym-8pm-alarm'
        });
      } catch(_e){}
    }
  };

  const triggerTestNotification = () => {
    triggerSystemNotification(
      "🏋️ إشعار تمرين الجيم (تجربة 8:00 مساءً)",
      "عاش يا بشمهندس علي! الإشعارات شغالة الآن كأنك فتح أبل ستور أبليكيشن 🚀"
    );
  };

  // Current Workout Session
  const currentWorkout = useMemo(() => {
    return initialWorkoutPlan.find(d => d.day === activeDay) || initialWorkoutPlan[0];
  }, [activeDay]);

  // 8:00 PM (20:00) Gym Alarm Scheduler for Workout Days
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const checkGymTimeAlarm = () => {
      const now = new Date();
      const hours = now.getHours();
      const todayStr = getLocalDateKey(now);

      const isWorkoutDay = [1, 2, 4, 5].includes(activeDay);

      if (isWorkoutDay && hours === 20 && lastNotificationDate !== todayStr) {
        setLastNotificationDate(todayStr);
        localStorage.setItem('gymProgress_Ali_LastNotifDate', todayStr);

        const workoutTitle = currentWorkout ? currentWorkout.arabicTitle : '';
        triggerSystemNotification(
          \`🏋️ حان وقت الجيم يا بشمهندس علي! (8:00 مساءً)\`,
          \`معاد تمرين اليوم (\${workoutTitle}) جه! خش على التطبيق وسجل مجاميعك واكسر أرقامك اليوم 🚀\`
        );
      }
    };

    checkGymTimeAlarm();
    const interval = setInterval(checkGymTimeAlarm, 30000);
    return () => clearInterval(interval);
  }, [notificationPermission, activeDay, lastNotificationDate, currentWorkout]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(workoutProgress));
      localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(exerciseWeights));
      localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(exerciseReps));
      localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(dietProgress));
      localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(waterGlasses));
      localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(weightLogs));
    } catch(_e){}
  }, [workoutProgress, exerciseWeights, exerciseReps, dietProgress, waterGlasses, weightLogs]);
`;

// Replace from const MainApp = () => { up to useEffect(() => { localStorage...
appCode = appCode.replace(
  /const MainApp = \(\) => \{\s*const \[notificationPermission[\s\S]*?useEffect\(\(\) => \{\s*try \{\s*localStorage\.setItem\('gymProgress_Ali_Workout'[\s\S]*?\}, \[workoutProgress, exerciseWeights, exerciseReps, dietProgress, waterGlasses, weightLogs\]\);/,
  fixedMainAppCode
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully re-ordered MainApp hooks and eliminated ReferenceError!');
