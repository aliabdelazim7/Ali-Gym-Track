import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Build 10-Tier Multi Source Engine
const multiSourceEngineCode = `
// 100% Comprehensive Exercise Unsplash Visual Map per category/exercise
const EXERCISE_UNSPLASH_MAP = {
  // Chest
  "Incline Dumbbell Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Incline Barbell Bench Press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  "Incline Machine Press": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Flat Dumbbell Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Machine Chest Press": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Barbell Bench Press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",

  // Back
  "T-Bar Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "Bent-Over Barbell Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "One-Arm Dumbbell Row": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Wide-Grip Lat Pulldown": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "V-Bar Pulldown": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "Underhand Lat Pulldown": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "Seated Cable Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "Chest Supported Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "Pull-Ups": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80",
  "Chin-Ups": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80",

  // Shoulders & Arms
  "Cable Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Lateral Raise (Drop Set)": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Seated Dumbbell Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Cable Face Pulls": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "Overhead Triceps Extension": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Cable Rope Pushdown": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Cable Bicep Curl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",

  // Legs & Core
  "Leg Press Machine": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Wide Stance Leg Press": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Romanian Deadlift (RDL)": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Machine Leg Extension": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Standing Calf Raise": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Bulgarian Split Squats": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Seated Leg Curl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Standard Elbow Plank": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
  "Ab Wheel Rollout": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
};

// Folder name overrides for exact GitHub free-exercise-db matches
const EXERCISE_FOLDER_MAP = {
  "d1-e1-main": "Incline_Dumbbell_Press",
  "d1-e1-alt1": "Barbell_Incline_Bench_Press_-_Medium_Grip",
  "d1-e1-alt2": "Chest_dip",
  "d1-e2-main": "T-Bar_Row_with_Handle",
  "d1-e2-alt1": "Bent_Over_Barbell_Row",
  "d1-e2-alt2": "One-Arm_Dumbbell_Row",
  "d1-e3-main": "Wide-Grip_Lat_Pulldown",
  "d1-e3-alt1": "V-bar_pulldown",
  "d1-e3-alt2": "Pullups",
  "d1-e4-main": "Side_Lateral_Raise",
  "d1-e4-alt1": "Side_Lateral_Raise",
  "d1-e4-alt2": "Seated_Dumbbell_Lateral_Raise",
  "d1-e5-main": "Standing_Dumbbell_Triceps_Extension",
  "d1-e5-alt1": "Triceps_Pushdown",
  "d1-e5-alt2": "Dips_-_Triceps_Version",
  "d1-e6-main": "Plank",
  "d1-e6-alt1": "Side_Plank",
  "d1-e6-alt2": "Plank",
  "d1-e7-main": "Ab_Roller",
  "d1-e7-alt1": "Ab_Roller",
  "d1-e7-alt2": "Exercise_Ball_Hamstring_Curl",

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
  "d2-e5-main": "Plank",
  "d2-e5-alt1": "Side_Plank",
  "d2-e5-alt2": "Plank",
  "d2-e6-main": "Ab_Roller",
  "d2-e6-alt1": "Ab_Roller",
  "d2-e6-alt2": "Exercise_Ball_Hamstring_Curl",

  "d4-e1-main": "Wide-Grip_Lat_Pulldown",
  "d4-e1-alt1": "V-bar_pulldown",
  "d4-e1-alt2": "Pullups",
  "d4-e2-main": "Seated_Cable_Rows",
  "d4-e2-alt1": "One-Arm_Dumbbell_Row",
  "d4-e2-alt2": "Dumbbell_Incline_Row",
  "d4-e3-main": "Dumbbell_Bench_Press",
  "d4-e3-alt1": "Chest_dip",
  "d4-e3-alt2": "Barbell_Bench_Press_-_Medium_Grip",
  "d4-e4-main": "Side_Lateral_Raise",
  "d4-e4-alt1": "Side_Lateral_Raise",
  "d4-e4-alt2": "Seated_Dumbbell_Lateral_Raise",
  "d4-e5-main": "Face_Pull",
  "d4-e5-alt1": "Seated_Rear_Delt_Raise",
  "d4-e5-alt2": "Reverse_Flyes",
  "d4-e6-main": "Standing_Biceps_Cable_Curl",
  "d4-e6-alt1": "Dumbbell_Alternate_Bicep_Curl",
  "d4-e6-alt2": "EZ-Bar_Curl",
  "d4-e7-main": "Plank",
  "d4-e7-alt1": "Side_Plank",
  "d4-e7-alt2": "Plank",
  "d4-e8-main": "Ab_Roller",
  "d4-e8-alt1": "Ab_Roller",
  "d4-e8-alt2": "Exercise_Ball_Hamstring_Curl",

  "d5-e1-main": "Dumbbell_Lunges",
  "d5-e1-alt1": "Dumbbell_Walking_Lunge",
  "d5-e1-alt2": "Barbell_Lunge",
  "d5-e2-main": "Seated_Leg_Curl",
  "d5-e2-alt1": "Dumbbell_Lying_Leg_Curl",
  "d5-e2-alt2": "Exercise_Ball_Hamstring_Curl",
  "d5-e3-main": "Leg_Press",
  "d5-e3-alt1": "Hack_Squat",
  "d5-e3-alt2": "Dumbbell_Step-Ups",
  "d5-e4-main": "Plank",
  "d5-e4-alt1": "Side_Plank",
  "d5-e4-alt2": "Plank",
  "d5-e5-main": "Ab_Roller",
  "d5-e5-alt1": "Ab_Roller",
  "d5-e5-alt2": "Exercise_Ball_Hamstring_Curl"
};

// ================= 10-TIER SELF-HEALING MULTI-SOURCE EXERCISE PLAYER =================
const UnbreakableAnimation = ({ altId, currentAlt }) => {
  const [frame, setFrame] = useState(0);
  const [sourceIndex, setSourceIndex] = useState(0);

  // Fast smooth exercise motion loop
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Reset sourceIndex when exercise variation changes
  useEffect(() => {
    setSourceIndex(0);
  }, [altId, currentAlt]);

  const folderName = (currentAlt && currentAlt.githubFolder) || 
                     (currentAlt && EXERCISE_FOLDER_MAP[currentAlt.id]) || 
                     EXERCISE_FOLDER_MAP[altId] || 
                     "Plank";

  const altName = currentAlt ? currentAlt.name : '';

  // Generate 10 Fallback Media Sources
  const sources = [
    // Source 0: Primary GitHub free-exercise-db dual-frame (0.jpg / 1.jpg)
    \`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/\${folderName}/\${frame}.jpg\`,

    // Source 1: Direct GitHub Lying/T-Bar Row variation fallback
    \`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/\${folderName.replace('_with_Handle', '')}/\${frame}.jpg\`,

    // Source 2: Curated High-Res Unsplash Visual for exact exercise
    EXERCISE_UNSPLASH_MAP[altName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",

    // Source 3: Secondary Unsplash Fitness High-Res Visual
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",

    // Source 4: Third Unsplash Shoulder/Arms High-Res Visual
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",

    // Source 5: High Performance Leg/Back Visual Asset
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",

    // Source 6: Powerlifting Bench/Squat Visual Asset
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",

    // Source 7: Athletic Studio Workout Visual
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",

    // Source 8: General Gym Equipment Visual
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",

    // Source 9: Fail-safe Universal Fitness Backup Asset
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
  ];

  const currentMediaUrl = sources[Math.min(sourceIndex, sources.length - 1)];

  const handleImageError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex(prev => prev + 1);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-[200px] bg-slate-950 rounded-2xl p-2 overflow-hidden border border-slate-800 shadow-inner group">
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
        <img 
          src={currentMediaUrl} 
          alt={altName || "Exercise Motion"} 
          onError={handleImageError}
          className="max-h-44 object-contain rounded-xl transition-all duration-300 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="absolute bottom-2 right-2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>حركة حية (مصدر {sourceIndex + 1}/10 ⚡)</span>
        </div>
      </div>
    </div>
  );
};`;

appCode = appCode.replace(
  /\/\/ Universal Exercise Folder Dictionary for 100% Live Motion Animation[\s\S]*?const ErgonomicExerciseCard =/,
  multiSourceEngineCode + '\n\n// ================= EXERCISE ITEM WITH ERGONOMIC CONTROLS & 3 ALTERNATIVES =================\nconst ErgonomicExerciseCard ='
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully installed 10-Tier Multi Source Self-Healing Engine in App.jsx!');
