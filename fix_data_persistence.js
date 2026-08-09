import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Update waterGlasses state with localStorage reader
const oldWaterState = `  const [waterGlasses, setWaterGlasses] = useState(0);`;
const newWaterState = `  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Water');
      return saved ? parseInt(saved, 10) : 0;
    } catch(e) { return 0; }
  });`;

appCode = appCode.replace(oldWaterState, newWaterState);

// 2. Fix the useEffect date reset bug & add water persistence + storage event listener
const oldUseEffectTarget = `  useEffect(() => {
    const savedDate = localStorage.getItem('gymLastActiveDate');
    if (savedDate !== todayKey) {
      setWorkoutProgress({});
      setDietProgress({});
      setWaterGlasses(0);
      localStorage.setItem('gymLastActiveDate', todayKey);
    }
  }, [todayKey]);

  useEffect(() => localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(workoutProgress)), [workoutProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(exerciseWeights)), [exerciseWeights]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(exerciseReps)), [exerciseReps]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(dietProgress)), [dietProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(weightLogs)), [weightLogs]);`;

const newUseEffectReplacement = `  // Safe Daily Reset Guard - Preserves progress across refreshes
  useEffect(() => {
    const savedDate = localStorage.getItem('gymLastActiveDate');
    if (!savedDate) {
      localStorage.setItem('gymLastActiveDate', todayKey);
    } else if (savedDate !== todayKey) {
      setWorkoutProgress({});
      setDietProgress({});
      setWaterGlasses(0);
      localStorage.setItem('gymLastActiveDate', todayKey);
    }
  }, [todayKey]);

  // Persistent localStorage writers
  useEffect(() => localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(workoutProgress)), [workoutProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(exerciseWeights)), [exerciseWeights]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(exerciseReps)), [exerciseReps]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(dietProgress)), [dietProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(weightLogs)), [weightLogs]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Water', waterGlasses.toString()), [waterGlasses]);

  // Live Cross-Tab & Refresh Sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'gymProgress_Ali_Diet' && e.newValue) setDietProgress(JSON.parse(e.newValue));
        if (e.key === 'gymProgress_Ali_Workout' && e.newValue) setWorkoutProgress(JSON.parse(e.newValue));
        if (e.key === 'gymProgress_Ali_Water' && e.newValue) setWaterGlasses(parseInt(e.newValue, 10));
      } catch(err){}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);`;

appCode = appCode.replace(oldUseEffectTarget, newUseEffectReplacement);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully fixed data persistence & water glasses storage bug in App.jsx!');
