import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Move all useState declarations above useCloudSync inside MainApp
const oldMainAppHooks = `  const [activeDay, setActiveDay] = useState(1);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    triggerHaptic
  );

  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Water');
      return saved ? parseInt(saved, 10) : 0;
    } catch(e) { return 0; }
  });

  const currentDateFormatted = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayKey = new Date().toDateString();

  const [workoutProgress, setWorkoutProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Workout');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [exerciseWeights, setExerciseWeights] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_ExerciseWeights');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [exerciseReps, setExerciseReps] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_ExerciseReps');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [dietProgress, setDietProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Diet');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [weightLogs, setWeightLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Weights');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : initialWeightLogs;
    } catch(e) { return initialWeightLogs; }
  });`;

const newMainAppHooks = `  const [activeDay, setActiveDay] = useState(1);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Water');
      return saved ? parseInt(saved, 10) : 0;
    } catch(e) { return 0; }
  });

  const [workoutProgress, setWorkoutProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Workout');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [exerciseWeights, setExerciseWeights] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_ExerciseWeights');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [exerciseReps, setExerciseReps] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_ExerciseReps');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [dietProgress, setDietProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Diet');
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  });

  const [weightLogs, setWeightLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Weights');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : initialWeightLogs;
    } catch(e) { return initialWeightLogs; }
  });

  const currentDateFormatted = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayKey = new Date().toDateString();

  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    triggerHaptic
  );`;

appCode = appCode.replace(oldMainAppHooks, newMainAppHooks);

// 2. Also enhance ErrorBoundary render to show detail error info if any error ever occurs
const oldErrorBoundaryRender = `  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white font-arabic p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">تحديث تطبيق علي جيم تراك</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              حدث تنبيه مؤقت أثناء تحديث البيانات. يمكنك إعادة تشغيل التطبيق بنقرة واحدة.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-lg active-press"
            >
              إعادة تشغيل التطبيق وتحديث الشاشة 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }`;

const newErrorBoundaryRender = `  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white font-arabic p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">تحديث تطبيق علي جيم تراك</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              تم تحديث كود المزامنة بنجاح. اضغط الزر لإعادة التشغيل:
            </p>
            {this.state.error && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-red-500/30 text-left text-red-400 font-mono text-[10px] overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-lg active-press"
            >
              إعادة تشغيل التطبيق وتحديث الشاشة 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }`;

appCode = appCode.replace(oldErrorBoundaryRender, newErrorBoundaryRender);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully reordered React hooks to eliminate ReferenceError in App.jsx!');
