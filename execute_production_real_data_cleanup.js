import fs from 'fs';

// --- 1. Clean initialWorkoutPlan.js default weights ---
let planCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\initialWorkoutPlan.js', 'utf8');

// Replace defaultWeight: <any non-zero number> with defaultWeight: 0
planCode = planCode.replace(/defaultWeight:\s*\d+/g, 'defaultWeight: 0');

fs.writeFileSync('e:\\ali-Gym-Track\\src\\initialWorkoutPlan.js', planCode, 'utf8');
console.log('Successfully reset all defaultWeight presets to 0 in initialWorkoutPlan.js');

// --- 2. Clean App.jsx initial logs and badges ---
let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// A. Empty initialWeightLogs
const oldInitialWeightLogs = `const initialWeightLogs = [
  { id: 1, date: "01/08", exerciseName: "Bench Press", weight: 70, reps: 10 },
  { id: 2, date: "03/08", exerciseName: "Squats", weight: 85, reps: 8 },
  { id: 3, date: "05/08", exerciseName: "Romanian Deadlift", weight: 75, reps: 10 },
  { id: 4, date: "07/08", exerciseName: "Bench Press", weight: 72.5, reps: 9 },
  { id: 5, date: "09/08", exerciseName: "Squats", weight: 90, reps: 8 }
];`;

const newInitialWeightLogs = `const initialWeightLogs = [];`;

appCode = appCode.replace(oldInitialWeightLogs, newInitialWeightLogs);

// B. Update useState fallback for weightLogs
appCode = appCode.replace(
  'return Array.isArray(parsed) ? parsed : initialWeightLogs;',
  'return Array.isArray(parsed) ? parsed : [];'
);
appCode = appCode.replace(
  '} catch(e) { return initialWeightLogs; }',
  '} catch(e) { return []; }'
);

// C. Update Badges in AchievementsView
const oldBadges = `  const badges = [
    { id: 1, title: "1000kg Club", desc: "رفع أكثر من 1000 كجم إجمالي", icon: Trophy, unlocked: totalVolumeThisWeek >= 1000 },
    { id: 2, title: "Discipline 100%", desc: "إكمال جميع تمارين اليوم", icon: ShieldCheck, unlocked: completedTasksCount >= 10 },
    { id: 3, title: "Macro Precision", desc: "التزام كامل بالوجبات والتغذية", icon: Flame, unlocked: completedTasksCount >= 5 },
    { id: 4, title: "Hydration King", desc: "شرب 8 كوب مية", icon: Droplets, unlocked: true }
  ];`;

const newBadges = `  const badges = [
    { id: 1, title: "1000kg Club", desc: "رفع أكثر من 1000 كجم إجمالي حقيقي", icon: Trophy, unlocked: totalVolumeThisWeek >= 1000 },
    { id: 2, title: "Discipline 100%", desc: "إكمال جميع تمارين اليوم الحقيقية", icon: ShieldCheck, unlocked: completedTasksCount >= 8 && completedTasksCount > 0 },
    { id: 3, title: "Macro Precision", desc: "التزام بكافة وجبات التغذية اليومية", icon: Flame, unlocked: completedTasksCount >= 5 },
    { id: 4, title: "Hydration King", desc: "شرب 8 أكواب مية كاملة", icon: Droplets, unlocked: typeof waterGlasses === 'number' && waterGlasses >= 8 }
  ];`;

appCode = appCode.replace(oldBadges, newBadges);

// Pass waterGlasses prop into AchievementsView
appCode = appCode.replace(
  'const AchievementsView = ({ completedTasksCount, totalVolumeThisWeek, exportData, importData }) => {',
  'const AchievementsView = ({ completedTasksCount, totalVolumeThisWeek, waterGlasses, exportData, importData }) => {'
);

appCode = appCode.replace(
  'completedTasksCount={completedTasksCount} totalVolumeThisWeek={totalVolumeThisWeek}',
  'completedTasksCount={completedTasksCount} totalVolumeThisWeek={totalVolumeThisWeek} waterGlasses={waterGlasses}'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully updated App.jsx with 100% honest badges and clean zero-state defaults!');
