import fs from 'fs';

// Define the two core exercises: Plank and Ab Wheel Rollout with full 3 alternative variations
const plankExercise = {
  id: "core-plank",
  name: "Plank",
  type: "ثبات كور",
  sets: 3,
  reps: "45-60ث",
  defaultWeight: 0,
  notes: "قوة البطن وثبات الحوض والقطنية.",
  alts: [
    {
      id: "core-plank-main",
      name: "Standard Elbow Plank",
      arabicName: "بلانك ثبات على الكوع (الرئيسي)",
      equipment: "مات أرضي",
      whyUseIt: "يقوي عضلات البطن العميقة واستقرار الجذع والحوض.",
      defaultWeight: 0,
      defaultReps: "45-60ث",
      dos: ["خلي جسمك في خط مستقيم من الرأس إلى الكعبين.", "شد عضلات البطن والمؤخرة بقوة أثناء الثبات."],
      donts: ["نزول الحوض لأسفل (يسبب ضغط على القطنية).", "رفع الحوض لأعلى كشكل الخيمة."],
      githubFolder: "Plank"
    },
    {
      id: "core-plank-alt1",
      name: "Side Plank",
      arabicName: "بلانك جانبي Side Plank (بديل 1)",
      equipment: "مات أرضي",
      whyUseIt: "يقوي عضلات البطن الجانبية (Obliques) وثبات الفخذ.",
      defaultWeight: 0,
      defaultReps: "30ث لكل جانب",
      dos: ["ارتكز على كوع واحد وجانب القدم واجعل جسمك مستقيماً.", "ارفع حوضك لأعلى واثبت في موضع مرتفع."],
      donts: ["سقوط الحوض باتجاه الأرض.", "لف الكتف العلوي للأمام."],
      githubFolder: "Side_Plank"
    },
    {
      id: "core-plank-alt2",
      name: "High Plank on Hands",
      arabicName: "بلانك عالي على الكفين (بديل 2)",
      equipment: "مات أرضي",
      whyUseIt: "ثبات كامل للجذع والكتفين وعضلات البطن.",
      defaultWeight: 0,
      defaultReps: "45-60ث",
      dos: ["ضع يديك تحت الكتفين مباشرة.", "ثبت الحوض واعتصر البطن."],
      donts: ["تقوس أسفل الظهر لأسفل.", "ثني الكوعين."],
      githubFolder: "Plank"
    }
  ]
};

const abWheelExercise = {
  id: "core-abwheel",
  name: "Ab Wheel Rollout",
  type: "عجلة البطن",
  sets: 3,
  reps: "10-12",
  defaultWeight: 0,
  notes: "أقوى تمرين انقباض واستطالة لعضلات البطن والجذع.",
  alts: [
    {
      id: "core-abwheel-main",
      name: "Ab Wheel Rollout",
      arabicName: "عجلة البطن Ab Wheel (الرئيسي)",
      equipment: "عجلة بطن",
      whyUseIt: "تمرين متقدم يبني قوة انقباض وانبساط فائقة لعضلات البطن.",
      defaultWeight: 0,
      defaultReps: "10-12",
      dos: ["انزل بالعجلة للأمام ببطء مع تثبيت القطنية والجذع.", "ارجع باستخدام عضلات بطنك وليس بسحب ذراعيك."],
      donts: ["ترك الظهر السفلي يسقط ويتقوس لأسفل.", "الفرد الزائد عن قدرة عضلات بطنك."],
      githubFolder: "Ab_Roller"
    },
    {
      id: "core-abwheel-alt1",
      name: "Barbell Ab Rollout",
      arabicName: "عجلة البطن بالبار (بديل 1)",
      equipment: "بار مستقيم + طارات دائرية",
      whyUseIt: "بديل ممتاز بالبار لبناء القوة والتحكم في البطن والجذع.",
      defaultWeight: 0,
      defaultReps: "10-12",
      dos: ["دحرج البار للأمام بجذع مفرود ومشدود.", "ارجع بعصر عضلات البطن."],
      donts: ["تقوس الظهر لأسفل.", "الإسراع دون تحكم."],
      githubFolder: "Ab_Roller"
    },
    {
      id: "core-abwheel-alt2",
      name: "Swiss Ball Rollout",
      arabicName: "عجلة البطن على الكرة السويسرية (بديل 2)",
      equipment: "كرة سويسرية Swiss Ball",
      whyUseIt: "ثبات عالٍ وسهل الأداء لحماية أسفل الظهر.",
      defaultWeight: 0,
      defaultReps: "12-15",
      dos: ["ضع الساعدين على الكرة وادفع للقدام ببطء.", "ارجع بعصر عضلات البطن."],
      donts: ["سقوط الحوض لأسفل.", "شد الرقبة."],
      githubFolder: "Exercise_Ball_Hamstring_Curl"
    }
  ]
};

// Update App.jsx and initialWorkoutPlan.js
let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// We need to make sure Day 1, Day 2, Day 4, Day 5 have Plank and Ab Wheel Rollout as the last 2 exercises.
console.log('Reading App.jsx and updating workout plan array...');

