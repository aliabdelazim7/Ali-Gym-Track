import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Build folder mapping helper for every single exercise alternative
const folderMappingCode = `
// Universal Exercise Folder Dictionary for 100% Live Motion Animation
const EXERCISE_FOLDER_MAP = {
  // Chest
  "d1-e1-main": "Incline_Dumbbell_Press",
  "d1-e1-alt1": "Barbell_Incline_Bench_Press_-_Medium_Grip",
  "d1-e1-alt2": "Chest_dip",
  "d4-e3-main": "Dumbbell_Bench_Press",
  "d4-e3-alt1": "Chest_dip",
  "d4-e3-alt2": "Barbell_Bench_Press_-_Medium_Grip",

  // Back
  "d1-e2-main": "T-Bar_Row_with_Handle",
  "d1-e2-alt1": "Bent_Over_Barbell_Row",
  "d1-e2-alt2": "One-Arm_Dumbbell_Row",
  "d1-e3-main": "Wide-Grip_Lat_Pulldown",
  "d1-e3-alt1": "V-bar_pulldown",
  "d1-e3-alt2": "Pullups",
  "d4-e1-main": "Wide-Grip_Lat_Pulldown",
  "d4-e1-alt1": "V-bar_pulldown",
  "d4-e1-alt2": "Pullups",
  "d4-e2-main": "Seated_Cable_Rows",
  "d4-e2-alt1": "One-Arm_Dumbbell_Row",
  "d4-e2-alt2": "Dumbbell_Incline_Row",

  // Shoulders
  "d1-e4-main": "Side_Lateral_Raise",
  "d1-e4-alt1": "Side_Lateral_Raise",
  "d1-e4-alt2": "Seated_Dumbbell_Lateral_Raise",
  "d4-e4-main": "Side_Lateral_Raise",
  "d4-e4-alt1": "Side_Lateral_Raise",
  "d4-e4-alt2": "Seated_Dumbbell_Lateral_Raise",
  "d4-e5-main": "Face_Pull",
  "d4-e5-alt1": "Seated_Rear_Delt_Raise",
  "d4-e5-alt2": "Reverse_Flyes",

  // Arms
  "d1-e5-main": "Standing_Dumbbell_Triceps_Extension",
  "d1-e5-alt1": "Triceps_Pushdown",
  "d1-e5-alt2": "Dips_-_Triceps_Version",
  "d4-e6-main": "Cable_Preacher_Curl",
  "d4-e6-alt1": "Dumbbell_Alternate_Bicep_Curl",
  "d4-e6-alt2": "EZ-Bar_Curl",

  // Legs
  "d2-e1-main": "Leg_Press",
  "d2-e1-alt1": "Barbell_Full_Squat",
  "d2-e1-alt2": "Hack_Squat",
  "d2-e2-main": "Stiff-Legged_Barbell_Deadlift",
  "d2-e2-alt1": "Romanian_Deadlift_With_Dumbbells",
  "d2-e2-alt2": "Single-Leg_Deadlift_With_Dumbbells",
  "d2-e3-main": "Leg_Extensions",
  "d2-e3-alt1": "Sissy_Squats",
  "d2-e3-alt2": "Dumbbell_pass",
  "d2-e4-main": "Standing_Calf_Raises",
  "d2-e4-alt1": "Seated_Calf_Raise",
  "d2-e4-alt2": "Calf_Press_On_The_Leg_Press_Machine",
  "d5-e1-main": "Dumbbell_Lunges",
  "d5-e1-alt1": "Dumbbell_Walking_Lunge",
  "d5-e1-alt2": "Barbell_Lunge",
  "d5-e2-main": "Seated_Leg_Curl",
  "d5-e2-alt1": "Dumbbell_Lying_Leg_Curl",
  "d5-e2-alt2": "Exercise_Ball_Hamstring_Curl",
  "d5-e3-main": "Leg_Press",
  "d5-e3-alt1": "Hack_Squat",
  "d5-e3-alt2": "Dumbbell_Step-Ups",

  // Core & Abs
  "d1-e6-main": "Plank",
  "d1-e6-alt1": "Side_Plank",
  "d1-e6-alt2": "Plank",
  "d1-e7-main": "Ab_Roller",
  "d1-e7-alt1": "Ab_Roller",
  "d1-e7-alt2": "Exercise_Ball_Hamstring_Curl",

  "d2-e5-main": "Plank",
  "d2-e5-alt1": "Side_Plank",
  "d2-e5-alt2": "Plank",
  "d2-e6-main": "Ab_Roller",
  "d2-e6-alt1": "Ab_Roller",
  "d2-e6-alt2": "Exercise_Ball_Hamstring_Curl",

  "d4-e7-main": "Plank",
  "d4-e7-alt1": "Side_Plank",
  "d4-e7-alt2": "Plank",
  "d4-e8-main": "Ab_Roller",
  "d4-e8-alt1": "Ab_Roller",
  "d4-e8-alt2": "Exercise_Ball_Hamstring_Curl",

  "d5-e4-main": "Plank",
  "d5-e4-alt1": "Side_Plank",
  "d5-e4-alt2": "Plank",
  "d5-e5-main": "Ab_Roller",
  "d5-e5-alt1": "Ab_Roller",
  "d5-e5-alt2": "Exercise_Ball_Hamstring_Curl"
};
`;

// Replace UnbreakableAnimation with 100% Live Motion Animation Engine
const newAnimationComponent = `
${folderMappingCode}

// ================= 100% LIVE ANIMATED EXERCISE MOTION PLAYER =================
const UnbreakableAnimation = ({ altId, currentAlt }) => {
  const [frame, setFrame] = useState(0);

  // Fast smooth 450ms exercise motion loop
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 450);
    return () => clearTimeout(timer);
  }, [altId, currentAlt]);

  // Resolve folder name
  const folderName = (currentAlt && currentAlt.githubFolder) || 
                     (currentAlt && EXERCISE_FOLDER_MAP[currentAlt.id]) || 
                     EXERCISE_FOLDER_MAP[altId] || 
                     "Plank";

  const frame0Url = \`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/\${folderName}/0.jpg\`;
  const frame1Url = \`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/\${folderName}/1.jpg\`;

  const currentFrameUrl = frame === 0 ? frame0Url : frame1Url;

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-[200px] bg-slate-950 rounded-2xl p-2 overflow-hidden border border-slate-800 shadow-inner group">
      {/* Preload both frames for zero flickering */}
      <img src={frame0Url} className="hidden" alt="" />
      <img src={frame1Url} className="hidden" alt="" />

      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
        <img 
          src={currentFrameUrl} 
          alt={currentAlt ? currentAlt.name : "Exercise Motion"} 
          className="max-h-44 object-contain rounded-xl transition-opacity duration-150 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute bottom-2 right-2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>حركة حية متحركة (Live GIF)</span>
        </div>
      </div>
    </div>
  );
};`;

appCode = appCode.replace(
  /\/\/ High Definition Visual Media & Illustration mapping per exercise[\s\S]*?const ErgonomicExerciseCard =/,
  newAnimationComponent + '\n\n// ================= EXERCISE ITEM WITH ERGONOMIC CONTROLS & 3 ALTERNATIVES =================\nconst ErgonomicExerciseCard ='
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully upgraded UnbreakableAnimation to 100% Live Motion Animation Player in App.jsx!');
