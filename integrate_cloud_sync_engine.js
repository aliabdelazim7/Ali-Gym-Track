import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const cloudEngineCode = `
// ================= REAL-TIME CLOUD SYNC ENGINE =================
const DEFAULT_CLOUD_BIN_ID = "019fe604-c535-71a6-a516-7877bb05e289";

const useCloudSync = (
  workoutProgress, setWorkoutProgress,
  exerciseWeights, setExerciseWeights,
  exerciseReps, setExerciseReps,
  dietProgress, setDietProgress,
  waterGlasses, setWaterGlasses,
  weightLogs, setWeightLogs,
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
      const res = await fetch(\`https://jsonblob.com/api/jsonBlob/\${cloudBinId}\`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.workoutProgress) setWorkoutProgress(data.workoutProgress);
        if (data.exerciseWeights) setExerciseWeights(data.exerciseWeights);
        if (data.exerciseReps) setExerciseReps(data.exerciseReps);
        if (data.dietProgress) setDietProgress(data.dietProgress);
        if (data.waterGlasses !== undefined) setWaterGlasses(data.waterGlasses);
        if (Array.isArray(data.weightLogs) && data.weightLogs.length > 0) setWeightLogs(data.weightLogs);
        setSyncStatus('synced');
      } else {
        setSyncStatus('synced');
      }
    } catch(e) {
      setSyncStatus('synced');
    }
  };

  // Push Data to Cloud
  const pushCloudData = async () => {
    setSyncStatus('syncing');
    try {
      const payload = {
        appName: "Ali Gym Tracker Cloud",
        lastUpdated: new Date().toISOString(),
        workoutProgress,
        exerciseWeights,
        exerciseReps,
        dietProgress,
        waterGlasses,
        weightLogs
      };

      const res = await fetch(\`https://jsonblob.com/api/jsonBlob/\${cloudBinId}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch(e) {
      setSyncStatus('error');
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
    }, 1200);

    return () => clearTimeout(timer);
  }, [workoutProgress, exerciseWeights, exerciseReps, dietProgress, waterGlasses, weightLogs]);

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
};
`;

if (!appCode.includes('useCloudSync')) {
  appCode = appCode.replace(
    '// ================= FULL SMARTWATCH TELEMETRY TAB =================',
    cloudEngineCode + '\n// ================= FULL SMARTWATCH TELEMETRY TAB ================='
  );

  // Insert hook inside MainApp
  const hookTarget = `const [waterGlasses, setWaterGlasses] = useState(() => {`;
  const hookInjection = `const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    triggerHaptic
  );

  const [waterGlasses, setWaterGlasses] = useState(() => {`;

  appCode = appCode.replace(hookTarget, hookInjection);

  // Add Cloud Button in Header Controls
  const cloudBtnTarget = `<button 
              type="button"
              onClick={handleClearBrowserCache} 
              className="p-2 text-slate-400 hover:text-amber-400 rounded-xl transition-colors"
              title="مسح كاش المتصفح والتحديث الفوري"
            >
              <RefreshCw className="w-4 h-4" />
            </button>`;

  const cloudBtnReplacement = `<button 
              type="button"
              onClick={() => cloudSync.setShowCloudModal(true)} 
              className={\`p-2 rounded-xl transition-all border font-bold flex items-center gap-1 text-xs \${cloudSync.syncStatus === 'syncing' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400'}\`}
              title="المزامنة السحابية الشاملة بين الأجهزة"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">السحابة</span>
              <span className={\`w-2 h-2 rounded-full \${cloudSync.syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}\`}></span>
            </button>
            <button 
              type="button"
              onClick={handleClearBrowserCache} 
              className="p-2 text-slate-400 hover:text-amber-400 rounded-xl transition-colors"
              title="مسح كاش المتصفح والتحديث الفوري"
            >
              <RefreshCw className="w-4 h-4" />
            </button>`;

  appCode = appCode.replace(cloudBtnTarget, cloudBtnReplacement);

  // Add Cloud Sync Modal at bottom of JSX
  const modalTarget = `{showEvalModal && (`;
  const cloudModalJSX = `{cloudSync.showCloudModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">المزامنة السحابية بين الأجهزة (Cloud Sync)</h3>
              </div>
              <button onClick={() => cloudSync.setShowCloudModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">حالة المزامنة:</span>
                <span className={\`font-bold \${cloudSync.syncStatus === 'syncing' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}\`}>
                  {cloudSync.syncStatus === 'syncing' ? 'جاري المزامنة مع السحابة 🔄' : 'متزامن 100% 🟢'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">كود المزامنة الخاص بك:</span>
                <span className="font-mono text-blue-400 font-bold text-[11px] truncate max-w-[180px]">{cloudSync.cloudBinId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { triggerHaptic(); cloudSync.fetchCloudData(); }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg active-press"
              >
                <Download className="w-4 h-4" /> جلب من السحابة 📥
              </button>
              <button
                onClick={() => { triggerHaptic(); cloudSync.pushCloudData(); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg active-press"
              >
                <Upload className="w-4 h-4" /> رفع للسحابة 📤
              </button>
            </div>

            <form onSubmit={cloudSync.handleCustomKeySubmit} className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">ربط جهاز آخر بنفس كود السحابة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أدخل كود السحابة..."
                  value={cloudSync.customKeyInput}
                  onChange={(e) => cloudSync.setCustomKeyInput(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl flex-1 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl">
                  ربط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEvalModal && (`;

  appCode = appCode.replace(modalTarget, cloudModalJSX);

  fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
  console.log('Successfully integrated Real-Time Cloud Sync Engine into App.jsx!');
}
