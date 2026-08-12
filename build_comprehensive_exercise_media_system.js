import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Define high quality exercise media dictionary based on exercise name / category
const exerciseMediaMap = `
// High Definition Visual Media & Illustration mapping per exercise
const EXERCISE_MEDIA_MAP = {
  // Chest
  "Incline Dumbbell Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Incline Barbell Bench Press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  "Incline Machine Press": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Flat Dumbbell Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Barbell Bench Press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  "Machine Chest Press": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",

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

  // Shoulders
  "Cable Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Lateral Raise (Drop Set)": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Seated Dumbbell Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Machine Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Cable Face Pulls": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "Seated Rear Delt Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Reverse Cable Flyes": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",

  // Arms
  "Overhead Triceps Extension": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Cable Rope Pushdown": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Skullcrushers / Bench Dips": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Cable Bicep Curl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Alternate Curl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "EZ-Bar Bicep Curl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",

  // Legs
  "Leg Press Machine": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Wide Stance Leg Press": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Barbell Back Squat": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Hack Squat Machine": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Romanian Deadlift (RDL)": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Dumbbell RDL": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Single-Leg Dumbbell RDL": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Machine Leg Extension": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Sissy Squats": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Pass Leg Extension": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Standing Calf Raise": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Seated Dumbbell Calf Raise": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Leg Press Calf Press": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Bulgarian Split Squats": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Walking Lunges": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Barbell Reverse Lunge": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Seated Leg Curl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Lying Leg Curl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Exercise Ball Hamstring Curl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
  "Dumbbell Step-Ups": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",

  // Core & Abs
  "Standard Elbow Plank": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
  "Side Plank": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
  "High Plank on Hands": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
  "Ab Wheel Rollout": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  "Barbell Ab Rollout": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  "Swiss Ball Rollout": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  "Hanging Leg Raise": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80",
  "Lying Leg Raise on Bench": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
  "Decline Bench Crunch": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
};
`;

// Replace UnbreakableAnimation component in App.jsx to load correct exercise photo & animation!
const newUnbreakableAnimation = `
${exerciseMediaMap}

// ================= 100% HIGH DEFINITION EXERCISE MOVEMENT PLAYER =================
const UnbreakableAnimation = ({ altId, currentAlt }) => {
  const [frame, setFrame] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Fast smooth exercise pulse animation
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const altName = currentAlt ? currentAlt.name : '';
  const mediaUrl = (currentAlt && EXERCISE_MEDIA_MAP[currentAlt.name]) || EXERCISE_MEDIA_MAP[altName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-[190px] bg-slate-950 rounded-2xl p-2 overflow-hidden border border-slate-800 shadow-inner group">
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
        <img 
          src={mediaUrl} 
          alt={altName || "Exercise"} 
          className={\`w-full h-full object-cover rounded-xl transition-all duration-500 \${frame === 1 ? 'scale-105 brightness-110' : 'scale-100 brightness-95'}\`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-2 right-2 bg-slate-900/90 border border-slate-700/80 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>شرح حركي تفاعلي</span>
        </div>
      </div>
    </div>
  );
};`;

appCode = appCode.replace(
  /\/\/ ================= 100% OFFLINE EXERCISE MOVEMENT ANIMATION PLAYER =================[\s\S]*?const ErgonomicExerciseCard =/,
  newUnbreakableAnimation + '\n\n// ================= EXERCISE ITEM WITH ERGONOMIC CONTROLS & 3 ALTERNATIVES =================\nconst ErgonomicExerciseCard ='
);

// Update ErgonomicExerciseCard render to pass currentAlt to UnbreakableAnimation & upgrade Youtube search query
appCode = appCode.replace(
  '<UnbreakableAnimation altId={currentAlt.id} />',
  '<UnbreakableAnimation altId={currentAlt.id} currentAlt={currentAlt} />'
);

appCode = appCode.replace(
  "href={`https://www.youtube.com/results?search_query=${encodeURIComponent('شرح تمرين ' + currentAlt.arabicName + ' shorts')}`}",
  "href={`https://www.youtube.com/results?search_query=${encodeURIComponent('طريقة اداء ' + currentAlt.arabicName + ' shorts')}`}"
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully upgraded UnbreakableAnimation component and YouTube Shorts link in App.jsx!');
