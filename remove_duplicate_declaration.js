import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Remove duplicate currentWorkout declaration
appCode = appCode.replace(
  `  // Current Workout Session\n  const currentWorkout = useMemo(() => {\n    return initialWorkoutPlan.find(d => d.day === activeDay) || initialWorkoutPlan[0];\n  }, [activeDay]);\n\n  const currentDayWorkoutProgress`,
  `  const currentDayWorkoutProgress`
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Removed duplicate declaration!');
