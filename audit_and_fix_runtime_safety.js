import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

console.log('Auditing App.jsx for unsafe property accesses...');

// 1. Safe Object.values(dietProgress)
appCode = appCode.replace(
  'const completedMeals = Object.values(dietProgress).filter(Boolean).length;',
  'const completedMeals = Object.values(dietProgress || {}).filter(Boolean).length;'
);

// 2. Safe totalVolumeThisWeek reduce
appCode = appCode.replace(
  'return weightLogs.reduce((acc, l) => acc + (l.weight * l.reps), 0);',
  'return (Array.isArray(weightLogs) ? weightLogs : []).reduce((acc, l) => acc + ((l?.weight || 0) * (l?.reps || 0)), 0);'
);

// 3. Safe workoutProgress access in completedWorkoutSets
appCode = appCode.replace(
  'const completedWorkoutSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + (workoutProgress[ex.id] || 0), 0) || 0;',
  'const completedWorkoutSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + ((workoutProgress || {})[ex.id] || 0), 0) || 0;'
);

// 4. Safe stepCount and activeCalories in SmartWatchFullTab
appCode = appCode.replace(
  "stepCount.toLocaleString('ar-EG')",
  "(stepCount || 0).toLocaleString('ar-EG')"
);

// 5. Update ErrorBoundary handleReset to clear corrupted keys AND safely reload
const oldErrorBoundary = `  handleReset = () => {
    try {
      localStorage.clear();
    } catch(e){}
    window.location.reload();
  };`;

const newErrorBoundary = `  handleReset = () => {
    try {
      localStorage.removeItem('gymProgress_Ali_Workout');
      localStorage.removeItem('gymProgress_Ali_ExerciseWeights');
      localStorage.removeItem('gymProgress_Ali_ExerciseReps');
      localStorage.removeItem('gymProgress_Ali_Diet');
      localStorage.removeItem('gymProgress_Ali_Weights');
      localStorage.removeItem('gymProgress_Ali_Water');
      localStorage.removeItem('gymCloudBinId');
    } catch(e){}
    window.location.reload();
  };`;

appCode = appCode.replace(oldErrorBoundary, newErrorBoundary);

// 6. Fix Cloud Sync fetchCloudData to validate data before setting state
const oldFetchCloud = `        if (data.workoutProgress) setWorkoutProgress(data.workoutProgress);
        if (data.exerciseWeights) setExerciseWeights(data.exerciseWeights);
        if (data.exerciseReps) setExerciseReps(data.exerciseReps);
        if (data.dietProgress) setDietProgress(data.dietProgress);
        if (data.waterGlasses !== undefined) setWaterGlasses(data.waterGlasses);
        if (Array.isArray(data.weightLogs) && data.weightLogs.length > 0) setWeightLogs(data.weightLogs);`;

const newFetchCloud = `        if (data.workoutProgress && typeof data.workoutProgress === 'object') setWorkoutProgress(data.workoutProgress);
        if (data.exerciseWeights && typeof data.exerciseWeights === 'object') setExerciseWeights(data.exerciseWeights);
        if (data.exerciseReps && typeof data.exerciseReps === 'object') setExerciseReps(data.exerciseReps);
        if (data.dietProgress && typeof data.dietProgress === 'object') setDietProgress(data.dietProgress);
        if (typeof data.waterGlasses === 'number') setWaterGlasses(data.waterGlasses);
        if (Array.isArray(data.weightLogs) && data.weightLogs.length > 0) setWeightLogs(data.weightLogs);`;

appCode = appCode.replace(oldFetchCloud, newFetchCloud);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully audited and fortified App.jsx against runtime type errors!');
