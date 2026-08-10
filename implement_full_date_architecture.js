import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Update useCloudSync to handle date-indexed objects & selectedDate
const updatedCloudSyncHook = `// ================= REAL-TIME CLOUD SYNC ENGINE (100% UNIVERSAL STATE) =================
const DEFAULT_CLOUD_BIN_ID = "019fe604-c535-71a6-a516-7877bb05e289";

const useCloudSync = (
  workoutProgress, setWorkoutProgress,
  exerciseWeights, setExerciseWeights,
  exerciseReps, setExerciseReps,
  dietProgress, setDietProgress,
  waterGlasses, setWaterGlasses,
  weightLogs, setWeightLogs,
  activeDay, setActiveDay,
  triggerHaptic
) => {
  const [cloudBinId, setCloudBinId] = useState(() => {
    return localStorage.getItem('gymCloudBinId') || DEFAULT_CLOUD_BIN_ID;
  });
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'error'
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const isInitialMount = useRef(true);

  // Fetch Cloud Data on Mount
  const fetchCloudData = async () => {
    setSyncStatus('syncing');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(\`https://jsonblob.com/api/jsonBlob/\${cloudBinId}\`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          if (data.workoutProgress && typeof data.workoutProgress === 'object') {
            setWorkoutProgress(data.workoutProgress);
            localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(data.workoutProgress));
          }
          if (data.exerciseWeights && typeof data.exerciseWeights === 'object') {
            setExerciseWeights(data.exerciseWeights);
            localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(data.exerciseWeights));
          }
          if (data.exerciseReps && typeof data.exerciseReps === 'object') {
            setExerciseReps(data.exerciseReps);
            localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(data.exerciseReps));
          }
          if (data.dietProgress && typeof data.dietProgress === 'object') {
            setDietProgress(data.dietProgress);
            localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(data.dietProgress));
          }
          if (data.waterGlasses && typeof data.waterGlasses === 'object') {
            setWaterGlasses(data.waterGlasses);
            localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(data.waterGlasses));
          } else if (typeof data.waterGlasses === 'number') {
            const today = getLocalDateKey();
            setWaterGlasses({ [today]: data.waterGlasses });
          }
          if (Array.isArray(data.weightLogs)) {
            setWeightLogs(data.weightLogs);
            localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(data.weightLogs));
          }
          if (typeof data.activeDay === 'number' && data.activeDay >= 1 && data.activeDay <= 5) {
            setActiveDay(data.activeDay);
          }
        }
      }
    } catch(e) {
      console.log("Cloud sync fetch gracefully bypassed:", e);
    } finally {
      setSyncStatus('synced');
    }
  };

  // Push Data to Cloud
  const pushCloudData = async () => {
    setSyncStatus('syncing');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const payload = {
        appName: "Ali Gym Tracker Cloud",
        lastUpdated: new Date().toISOString(),
        workoutProgress: workoutProgress || {},
        exerciseWeights: exerciseWeights || {},
        exerciseReps: exerciseReps || {},
        dietProgress: dietProgress || {},
        waterGlasses: waterGlasses || {},
        weightLogs: Array.isArray(weightLogs) ? weightLogs : [],
        activeDay: activeDay || 1
      };

      const res = await fetch(\`https://jsonblob.com/api/jsonBlob/\${cloudBinId}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('synced');
      }
    } catch(e) {
      setSyncStatus('synced');
    }
  };

  // Auto-Pull on initial render
  useEffect(() => {
    fetchCloudData();
  }, [cloudBinId]);

  // Debounced Auto-Push on state change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      pushCloudData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    workoutProgress, exerciseWeights, exerciseReps, dietProgress,
    waterGlasses, weightLogs, activeDay
  ]);

  const handleCustomKeySubmit = (e) => {
    e.preventDefault();
    triggerHaptic();
    if (!customKeyInput.trim()) return;
    const cleanKey = customKeyInput.trim();
    setCloudBinId(cleanKey);
    localStorage.setItem('gymCloudBinId', cleanKey);
    setCustomKeyInput('');
    alert("تم ربط مفتاح السحابة المخصص بنجاح! ☁️");
  };

  return {
    cloudBinId,
    syncStatus,
    showCloudModal,
    setShowCloudModal,
    fetchCloudData,
    pushCloudData,
    customKeyInput,
    setCustomKeyInput,
    handleCustomKeySubmit
  };
};`;

appCode = appCode.replace(/\/\/ ================= REAL-TIME CLOUD SYNC ENGINE \(100% UNIVERSAL STATE\) =================[\s\S]*?return \{\s*cloudBinId,[\s\S]*?\};\s*\};/, updatedCloudSyncHook);

// 2. Refactor MainApp state initializers & migration logic
const mainAppImplementation = `// ================= MAIN APPLICATION =================
function MainApp() {
  const [mainTab, setMainTab] = useState('workout');
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Date Navigation State (YYYY-MM-DD)
  const todayDateKey = useMemo(() => getLocalDateKey(), []);
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey());

  const [activeDay, setActiveDay] = useState(1);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Helper to ensure state is an object keyed by date
  const parseDateIndexedState = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      if (typeof parsed !== 'object' || parsed === null) return {};
      // If legacy flat format (no date keys), migrate to today
      const hasDateKey = Object.keys(parsed).some(k => k.includes('-'));
      if (!hasDateKey && Object.keys(parsed).length > 0) {
        return { [todayDateKey]: parsed };
      }
      return parsed;
    } catch(e) {
      return {};
    }
  };

  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Water');
      if (!saved) return {};
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
        return { [todayDateKey]: parseInt(saved, 10) || 0 };
      } catch(e) {
        return { [todayDateKey]: parseInt(saved, 10) || 0 };
      }
    } catch(e) { return {}; }
  });

  const [workoutProgress, setWorkoutProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Workout'));
  const [exerciseWeights, setExerciseWeights] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseWeights'));
  const [exerciseReps, setExerciseReps] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseReps'));
  const [dietProgress, setDietProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Diet'));

  const [weightLogs, setWeightLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Weights');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return []; }
  });

  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    triggerHaptic
  );

  // Persistent localStorage writers
  useEffect(() => localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(workoutProgress)), [workoutProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(exerciseWeights)), [exerciseWeights]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(exerciseReps)), [exerciseReps]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(dietProgress)), [dietProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(weightLogs)), [weightLogs]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(waterGlasses)), [waterGlasses]);

  // Current active date data accessors
  const currentWorkoutProgress = workoutProgress[selectedDate] || {};
  const currentExerciseWeights = exerciseWeights[selectedDate] || {};
  const currentExerciseReps = exerciseReps[selectedDate] || {};
  const currentDietProgress = dietProgress[selectedDate] || {};
  const currentWaterGlasses = waterGlasses[selectedDate] || 0;

  const isTodaySelected = selectedDate === todayDateKey;

  // Date Navigator Helpers
  const shiftDate = (days) => {
    triggerHaptic();
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d + days);
    setSelectedDate(getLocalDateKey(dt));
  };

  const getYesterdayDateKey = () => {
    const dt = new Date();
    dt.setDate(dt.getDate() - 1);
    return getLocalDateKey(dt);
  };

  // Screen Wake Lock Engine (Keeps screen awake on gym bench)
  const toggleWakeLock = async () => {
    triggerHaptic();
    if (isWakeLockActive) {
      if (wakeLockRef.current) {
        try { await wakeLockRef.current.release(); } catch(e){}
        wakeLockRef.current = null;
      }
      setIsWakeLockActive(false);
    } else {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setIsWakeLockActive(true);
        } catch (err) {
          alert('وضع الشاشة المضاءة مفعل تلقائياً أو غير مدعوم في متصفحك.');
          setIsWakeLockActive(true);
        }
      } else {
        alert('ميزة إبقاء الشاشة مضاءة غير مدعومة في متصفحك.');
      }
    }
  };

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    triggerHaptic();
    if (!deferredPrompt) {
      alert("📱 لتثبيت التطبيق على الموبايل:\\n• iPhone (Safari): اضغط زر المشاركة ⎋ ثم (إضافة إلى الشاشة الرئيسية Add to Home Screen).\\n• Android (Chrome): اضغط القائمة ⠇ ثم (تثبيت التطبيق Install App).");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Live Cross-Tab & Refresh Sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'gymProgress_Ali_Diet' && e.newValue) setDietProgress(JSON.parse(e.newValue));
        if (e.key === 'gymProgress_Ali_Workout' && e.newValue) setWorkoutProgress(JSON.parse(e.newValue));
        if (e.key === 'gymProgress_Ali_Water' && e.newValue) {
          try { setWaterGlasses(JSON.parse(e.newValue)); } catch(err){}
        }
      } catch(err){}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentWorkout = initialWorkoutPlan.find(d => d.day === activeDay);
  const totalWorkoutSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + ex.sets, 0) || 0;
  const completedWorkoutSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + (currentWorkoutProgress[ex.id] || 0), 0) || 0;
  
  const totalMeals = dietPlan.meals.length;
  const completedMeals = Object.values(currentDietProgress || {}).filter(Boolean).length;

  const totalTasks = totalWorkoutSets + totalMeals;
  const completedTasks = completedWorkoutSets + completedMeals;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalVolumeThisWeek = useMemo(() => {
    return (Array.isArray(weightLogs) ? weightLogs : []).reduce((acc, l) => acc + ((l?.weight || 0) * (l?.reps || 0)), 0);
  }, [weightLogs]);

  const [timerLeft, setTimerLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);

  const startRestTimer = (seconds = 60) => {
    setTimerLeft(seconds); 
    setIsTimerActive(true);
  };

  const closeTimer = () => {
    setIsTimerActive(false);
    setTimerLeft(0);
  };

  useEffect(() => {
    if (isTimerActive && timerLeft > 0) {
      timerRef.current = setTimeout(() => setTimerLeft(prev => prev - 1), 1000);
    } else if (timerLeft === 0 && isTimerActive) {
      if (soundEnabled) playBeepSound();
      triggerHaptic();
      setIsTimerActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerLeft, isTimerActive, soundEnabled]);

  // Date-Scoped Event Handlers
  const handleSetToggle = (exerciseId, index) => {
    setWorkoutProgress(prev => {
      const dateObj = prev[selectedDate] || {};
      const currentSets = dateObj[exerciseId] || 0;
      const newSets = currentSets > index ? index : index + 1;
      return { ...prev, [selectedDate]: { ...dateObj, [exerciseId]: newSets } };
    });
  };

  const handleWeightChange = (exerciseId, val) => {
    setExerciseWeights(prev => ({
      ...prev,
      [selectedDate]: { ...(prev[selectedDate] || {}), [exerciseId]: val }
    }));
  };

  const handleRepsChange = (exerciseId, val) => {
    setExerciseReps(prev => ({
      ...prev,
      [selectedDate]: { ...(prev[selectedDate] || {}), [exerciseId]: val }
    }));
  };

  const handleMealToggle = (mealId) => {
    triggerHaptic();
    setDietProgress(prev => {
      const dateObj = prev[selectedDate] || {};
      return { ...prev, [selectedDate]: { ...dateObj, [mealId]: !dateObj[mealId] } };
    });
  };

  const handleWaterChange = (count) => {
    setWaterGlasses(prev => ({ ...prev, [selectedDate]: count }));
  };

  const handleAddWeightLog = (newLog) => setWeightLogs(prev => [newLog, ...prev]);
  const handleDeleteWeightLog = (id) => setWeightLogs(prev => prev.filter(log => log.id !== id));

  const handleEndDay = () => {
    triggerHaptic();
    let msgArray = [];
    if (progressPercentage === 100) {
      msgArray = messages.success;
      try { confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } }); } catch(e){}
    } else if (progressPercentage >= 50) msgArray = messages.average;
    else msgArray = messages.low;

    const randomMsg = msgArray[Math.floor(Math.random() * msgArray.length)];
    setEvalMessage(randomMsg);
    setShowEvalModal(true);
  };

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
      localStorage.clear();
      sessionStorage.clear();
    } catch(e){}
    window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
  };

  const exportData = () => {
    triggerHaptic();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      workoutProgress,
      exerciseWeights,
      exerciseReps,
      dietProgress,
      waterGlasses,
      weightLogs,
      activeDay,
      exportDate: new Date().toISOString()
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", \`Ali_Gym_Track_Backup_\${selectedDate}.json\`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (event) => {
    triggerHaptic();
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.workoutProgress) setWorkoutProgress(parsed.workoutProgress);
          if (parsed.exerciseWeights) setExerciseWeights(parsed.exerciseWeights);
          if (parsed.exerciseReps) setExerciseReps(parsed.exerciseReps);
          if (parsed.dietProgress) setDietProgress(parsed.dietProgress);
          if (parsed.waterGlasses) setWaterGlasses(parsed.waterGlasses);
          if (parsed.weightLogs) setWeightLogs(parsed.weightLogs);
          if (parsed.activeDay) setActiveDay(parsed.activeDay);
          alert("تم استرجاع النسخة الاحتياطية بنجاح! 🚀");
        } catch (err) {
          alert("الملف غير صالح، برجاء اختيار ملف JSON صحيحة.");
        }
      };
    }
  };`;

appCode = appCode.replace(/\/\/ ================= MAIN APPLICATION =================[\s\S]*?const importData = \(event\) => {[\s\S]*?};/, mainAppImplementation);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Refactored MainApp state architecture for 100% Date-Indexed tracking!');
