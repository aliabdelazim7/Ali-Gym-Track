import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Add ErrorBoundary component right above export default function App()
const errorBoundaryCode = `
// ================= REACT ERROR BOUNDARY (PREVENTS WHITE SCREEN CRASHES) =================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch(e){}
    window.location.reload();
  };

  render() {
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
  }
}
`;

if (!appCode.includes('class ErrorBoundary')) {
  appCode = appCode.replace('// ================= MAIN APPLICATION =================', errorBoundaryCode + '\n// ================= MAIN APPLICATION =================');
}

// 2. Safe localStorage initializers
const stateTarget = `  const [workoutProgress, setWorkoutProgress] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_Workout');
    return saved ? JSON.parse(saved) : {};
  });

  const [exerciseWeights, setExerciseWeights] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_ExerciseWeights');
    return saved ? JSON.parse(saved) : {};
  });

  const [exerciseReps, setExerciseReps] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_ExerciseReps');
    return saved ? JSON.parse(saved) : {};
  });

  const [dietProgress, setDietProgress] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_Diet');
    return saved ? JSON.parse(saved) : {};
  });

  const [weightLogs, setWeightLogs] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_Weights');
    return saved ? JSON.parse(saved) : initialWeightLogs;
  });`;

const safeStateReplacement = `  const [workoutProgress, setWorkoutProgress] = useState(() => {
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

appCode = appCode.replace(stateTarget, safeStateReplacement);

// 3. Wrap Export Default with ErrorBoundary
appCode = appCode.replace(
  "export default function App() {",
  "function MainApp() {"
);

const exportWrapper = `
export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
`;

if (!appCode.includes('function MainApp()')) {
  // If already modified or not found
} else {
  appCode += exportWrapper;
}

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully added ErrorBoundary and safe localStorage parsing to App.jsx!');
