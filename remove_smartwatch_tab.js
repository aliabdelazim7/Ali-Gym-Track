import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Remove SmartWatchFullTab component definition
appCode = appCode.replace(/\/\/ ================= FULL SMARTWATCH TELEMETRY TAB \(NATIVE & CLOUD HUB\) =================[\s\S]*?\/\/ ================= WORKOUT & NUTRITION DATA =================/, '// ================= WORKOUT & NUTRITION DATA =================');
appCode = appCode.replace(/\/\/ ================= FULL SMARTWATCH TELEMETRY TAB =================[\s\S]*?\/\/ ================= WORKOUT & NUTRITION DATA =================/, '// ================= WORKOUT & NUTRITION DATA =================');

// 2. Clean up useCloudSync hook parameter list
const oldCloudSyncDef = `const useCloudSync = (
  workoutProgress, setWorkoutProgress,
  exerciseWeights, setExerciseWeights,
  exerciseReps, setExerciseReps,
  dietProgress, setDietProgress,
  waterGlasses, setWaterGlasses,
  weightLogs, setWeightLogs,
  activeDay, setActiveDay,
  watchSteps, setWatchSteps,
  watchCal, setWatchCal,
  watchHR, setWatchHR,
  watchMaxHR, setWatchMaxHR,
  watchConnected, setWatchConnected,
  watchName, setWatchName,
  triggerHaptic
) => {`;

const newCloudSyncDef = `const useCloudSync = (
  workoutProgress, setWorkoutProgress,
  exerciseWeights, setExerciseWeights,
  exerciseReps, setExerciseReps,
  dietProgress, setDietProgress,
  waterGlasses, setWaterGlasses,
  weightLogs, setWeightLogs,
  activeDay, setActiveDay,
  triggerHaptic
) => {`;

appCode = appCode.replace(oldCloudSyncDef, newCloudSyncDef);

// 3. Clean up payload and dependencies inside useCloudSync
const oldPayload = `        workoutProgress: workoutProgress || {},
        exerciseWeights: exerciseWeights || {},
        exerciseReps: exerciseReps || {},
        dietProgress: dietProgress || {},
        waterGlasses: waterGlasses || 0,
        weightLogs: Array.isArray(weightLogs) ? weightLogs : [],
        activeDay: activeDay || 1,
        watchSteps: watchSteps || 0,
        watchCal: watchCal || 0,
        watchHR: watchHR || 0,
        watchMaxHR: watchMaxHR || 0,
        watchConnected: !!watchConnected,
        watchName: watchName || ''`;

const newPayload = `        workoutProgress: workoutProgress || {},
        exerciseWeights: exerciseWeights || {},
        exerciseReps: exerciseReps || {},
        dietProgress: dietProgress || {},
        waterGlasses: waterGlasses || 0,
        weightLogs: Array.isArray(weightLogs) ? weightLogs : [],
        activeDay: activeDay || 1`;

appCode = appCode.replace(oldPayload, newPayload);

const oldDeps = `  }, [
    workoutProgress, exerciseWeights, exerciseReps, dietProgress,
    waterGlasses, weightLogs, activeDay, watchSteps, watchCal,
    watchHR, watchMaxHR, watchConnected, watchName
  ]);`;

const newDeps = `  }, [
    workoutProgress, exerciseWeights, exerciseReps, dietProgress,
    waterGlasses, weightLogs, activeDay
  ]);`;

appCode = appCode.replace(oldDeps, newDeps);

// 4. Remove smartwatch states from MainApp
const oldWatchStates = `  const [watchSteps, setWatchSteps] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchSteps');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchCal, setWatchCal] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchCal');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchHR, setWatchHR] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchHR');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchMaxHR, setWatchMaxHR] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchMaxHR');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchConnected, setWatchConnected] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchConnected') === 'true';
  });
  const [watchName, setWatchName] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchName') || '';
  });

  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    watchSteps, setWatchSteps,
    watchCal, setWatchCal,
    watchHR, setWatchHR,
    watchMaxHR, setWatchMaxHR,
    watchConnected, setWatchConnected,
    watchName, setWatchName,
    triggerHaptic
  );`;

const newWatchStates = `  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    triggerHaptic
  );`;

appCode = appCode.replace(oldWatchStates, newWatchStates);

// 5. Remove smartwatch tab button from Desktop Navbar
const oldDesktopTab = `        <button
          onClick={() => setMainTab('smartwatch')}
          className={\`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all \${
            mainTab === 'smartwatch' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50 border border-blue-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }\`}
        >
          <Smartphone className="w-4 h-4" /> الساعة
        </button>`;

appCode = appCode.replace(oldDesktopTab, '');

// 6. Remove smartwatch tab view from Main
const oldMainTabView = `        {mainTab === 'smartwatch' && (
          <SmartWatchFullTab 
            soundEnabled={soundEnabled} 
            triggerHaptic={triggerHaptic}
            isConnected={watchConnected}
            setIsConnected={setWatchConnected}
            deviceName={watchName}
            setDeviceName={setWatchName}
            heartRate={watchHR}
            setHeartRate={setWatchHR}
            maxHR={watchMaxHR}
            setMaxHR={setWatchMaxHR}
            activeCalories={watchCal}
            setActiveCalories={setWatchCal}
            stepCount={watchSteps}
            setStepCount={setWatchSteps}
          />
        )}`;

appCode = appCode.replace(oldMainTabView, '');

// 7. Remove smartwatch button from Mobile BottomNav
const oldMobileBottomNavBtn = `          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('smartwatch'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'smartwatch' ? 'text-cyan-400 font-extrabold bg-cyan-500/10 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[10px]">الساعة</span>
          </button>`;

appCode = appCode.replace(oldMobileBottomNavBtn, '');

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully removed SmartWatch tab completely!');
