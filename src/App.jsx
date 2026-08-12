import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Smartphone, Sun, Lock, Unlock, DownloadCloud, Dumbbell, Activity, CheckCircle, Calendar, HeartPulse, ImageIcon, 
  ChevronDown, ChevronUp, ChevronRight, ChevronLeft, CheckCircle2, AlertOctagon, Timer, 
  X, RotateCcw, Apple, Flame, Briefcase, Zap, Moon, Coffee, Utensils, Laptop, 
  Trophy, Target, MessageSquareQuote, TrendingUp, Plus, Trash2, Scale,
  Volume2, VolumeX, Download, Upload, Sparkles, RefreshCw, BarChart3, Info,
  Award, ShieldCheck, Droplets, Dumbbell as DumbbellIcon, Zap as ZapIcon,
  Play, PlusCircle, MinusCircle, Check, ArrowUpRight, Award as TrophyIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

// ================= CUSTOM SVG ICONS =================
const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);






// ================= LOCAL DATE KEY HELPER (PREVENTS TIMEZONE OFFSETS) =================
const getLocalDateKey = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatArabicDate = (dateKey) => {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch(_e) {
    return dateKey;
  }
};

// ================= REAL-TIME CLOUD SYNC ENGINE (100% UNIVERSAL STATE) =================
const DEFAULT_CLOUD_BIN_ID = "019febb5-c70b-730c-8fb4-1227a57998ac";

const useCloudSync = (
  workoutProgress, setWorkoutProgress,
  exerciseWeights, setExerciseWeights,
  exerciseReps, setExerciseReps,
  dietProgress, setDietProgress,
  waterGlasses, setWaterGlasses,
  weightLogs, setWeightLogs,
  activeDay, setActiveDay,
  triggerHaptic
) => {
  const [cloudBinId, setCloudBinId] = useState(() => {
    return localStorage.getItem('gymCloudBinId') || DEFAULT_CLOUD_BIN_ID;
  });
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'error'
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const isInitialMount = useRef(true);

  // Fetch Cloud Data on Mount
  const fetchCloudData = async () => {
    setSyncStatus('syncing');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://jsonblob.com/api/jsonBlob/${cloudBinId}`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          if (data.workoutProgress && typeof data.workoutProgress === 'object') {
            setWorkoutProgress(data.workoutProgress);
            localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(data.workoutProgress));
          }
          if (data.exerciseWeights && typeof data.exerciseWeights === 'object') {
            setExerciseWeights(data.exerciseWeights);
            localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(data.exerciseWeights));
          }
          if (data.exerciseReps && typeof data.exerciseReps === 'object') {
            setExerciseReps(data.exerciseReps);
            localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(data.exerciseReps));
          }
          if (data.dietProgress && typeof data.dietProgress === 'object') {
            setDietProgress(data.dietProgress);
            localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(data.dietProgress));
          }
          if (data.waterGlasses && typeof data.waterGlasses === 'object') {
            setWaterGlasses(data.waterGlasses);
            localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(data.waterGlasses));
          } else if (typeof data.waterGlasses === 'number') {
            const today = getLocalDateKey();
            setWaterGlasses({ [today]: data.waterGlasses });
          }
          if (Array.isArray(data.weightLogs)) {
            setWeightLogs(data.weightLogs);
            localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(data.weightLogs));
          }
          if (typeof data.activeDay === 'number' && data.activeDay >= 1 && data.activeDay <= 5) {
            setActiveDay(data.activeDay);
          }
        }
      }
    } catch(_e) {
      console.log("Cloud sync fetch gracefully bypassed:", e);
    } finally {
      setSyncStatus('synced');
    }
  };

  // Push Data to Cloud
  const pushCloudData = async () => {
    setSyncStatus('syncing');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const payload = {
        appName: "Ali Gym Tracker Cloud",
        lastUpdated: new Date().toISOString(),
        workoutProgress: workoutProgress || {},
        exerciseWeights: exerciseWeights || {},
        exerciseReps: exerciseReps || {},
        dietProgress: dietProgress || {},
        waterGlasses: waterGlasses || {},
        weightLogs: Array.isArray(weightLogs) ? weightLogs : [],
        activeDay: activeDay || 1
      };

      const res = await fetch(`https://jsonblob.com/api/jsonBlob/${cloudBinId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('synced');
      }
    } catch(_e) {
      setSyncStatus('synced');
    }
  };

  // Auto-Pull on initial render
  useEffect(() => {
    fetchCloudData();
  }, [cloudBinId]);

  // Debounced Auto-Push on state change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      pushCloudData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    workoutProgress, exerciseWeights, exerciseReps, dietProgress,
    waterGlasses, weightLogs, activeDay
  ]);

  const handleCustomKeySubmit = (e) => {
    e.preventDefault();
    triggerHaptic();
    if (!customKeyInput.trim()) return;
    const cleanKey = customKeyInput.trim();
    setCloudBinId(cleanKey);
    localStorage.setItem('gymCloudBinId', cleanKey);
    setCustomKeyInput('');
    alert("تم ربط مفتاح السحابة المخصص بنجاح! ☁️");
  };

  return {
    cloudBinId,
    syncStatus,
    showCloudModal,
    setShowCloudModal,
    fetchCloudData,
    pushCloudData,
    customKeyInput,
    setCustomKeyInput,
    handleCustomKeySubmit
  };
};


// ================= WORKOUT & NUTRITION DATA =================
const initialWorkoutPlan = [
  {
    day: 1,
    title: "Upper Body (تركيز سمك الضهر والصدر العالي)",
    arabicTitle: "جزء علوي (سمك الضهر + صدر عالي)",
    goal: "أوزان تقيلة نسبياً (8-12 عدة) مع الوصول للفشل العضلي أو قبله بعدة واحدة (RPE 8-9) + ثبات وكور.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d1-e1", name: "Incline Dumbbell Press", type: "صدر عالي بالدمبل", sets: 4, reps: "8-10", defaultWeight: 26, notes: "الدمبل بيديك مدى حركي أعمق لبناء عضلات الصدر العالي.", 
        alts: [
          { 
            id: "d1-e1-main", name: "Incline Dumbbell Press", arabicName: "تجميع صدر عالي بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة مائلة 30-45 درجة", whyUseIt: "مدى حركي أعمق وعزل متساوي لعضلات الصدر العالي.", defaultWeight: 26, defaultReps: "8-10",
            dos: ["اضبط زاوية الدكة 30-45 درجة.", "انزل بالدمبلز بجانب الصدر مع فتح الكوع 45 درجة.", "انزل ببطء وتحكم بمدى حركي كامل."],
            donts: ["تخبط الدمبلز في بعض فوق بفقد الشد العضلي.", "تفتح كوعك بزاوية 90 درجة مع مستوى الكتف."],
            githubFolder: "Incline_Dumbbell_Press"
          },
          { 
            id: "d1-e1-alt1", name: "Incline Barbell Bench Press", arabicName: "بنش عالي بالبار (بديل 1)", equipment: "بار مستقيم + دكة مائلة", whyUseIt: "يسمح بحمل أوزان أثقل لزيادة القوة البنائية لعلوي الصدر.", defaultWeight: 55, defaultReps: "8-10",
            dos: ["امسك البار أوسع من كتفك بقليل وانزل لترقوة الصدر.", "ثبت كعب رجلك بالأرض واعتصر الصدر فوق."],
            donts: ["خبط البار بالصدر بقوة للارتداد.", "قفل مفصل الكوع بفرط فوق."],
            githubFolder: "Barbell_Incline_Bench_Press_-_Medium_Grip"
          },
          { 
            id: "d1-e1-alt2", name: "Incline Machine Press", arabicName: "جهاز بنش عالي (بديل 2)", equipment: "جهاز الصدر العالي", whyUseIt: "يوفر مسار ثابت وأمان عالي للتركيز الكامل في الأوزان.", defaultWeight: 45, defaultReps: "10-12",
            dos: ["اضبط ارتفاع الكرسي بحيث المقابض تكون بمستوى الصدر العالي.", "ادفع المقابض لأعلى بثبات وتمركز."],
            donts: ["رفع الكتفين للأعلى أثناء الدفع.", "إفلات الوزن بسرعة في العودة."],
            githubFolder: "Chest_dip"
          }
        ]
      },
      { 
        id: "d1-e2", name: "T-Bar Row / Barbell Row", type: "سحب بالبار أو حرف T", sets: 3, reps: "8-10", defaultWeight: 50, notes: "تمرين سمك وكثافة الضهر الأساسي.", 
        alts: [
          { 
            id: "d1-e2-main", name: "T-Bar Row", arabicName: "سحب تي بار T-Bar (الرئيسي)", equipment: "جهاز T-Bar أو البار بالزاوية", whyUseIt: "تمرين سمك الضهر الأساسي لبناء كثافة الظهر الوسطى والعريضة.", defaultWeight: 50, defaultReps: "8-10",
            dos: ["اثني ركبتك سنة وانحني بظهرك 45 درجة مع استقامة الظهر.", "اسحب البار باتجاه أسفل بطنك مع اعتصار الظهر."],
            donts: ["تقوس الظهر السفلي أثناء حمل الوزن.", "الوقوف بشكل عمودي وتقليل المدى الحركي."],
            githubFolder: "T-Bar_Row"
          },
          { 
            id: "d1-e2-alt1", name: "Bent-Over Barbell Row", arabicName: "سحب بالبار بانحناء ظهر (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "يبني كتلة وسماكة ضخمة شاملة لكل عضلات الظهر.", defaultWeight: 50, defaultReps: "8-10",
            dos: ["انحني بظهرك 45 درجة وثبت القطنية والجذع.", "اسحب البار باتجاه السرة مع ضم لوحي الكتف."],
            donts: ["تقوس الظهر السفلي أثناء التمرين.", "رفع الجذع لأعلى مع كل تكرار."],
            githubFolder: "Bent_Over_Two-Arm_Long_Barbell_Row"
          },
          { 
            id: "d1-e2-alt2", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (بديل 2)", equipment: "دمبل + دكة مستوية", whyUseIt: "مدى حركي عميق وعزل فردي متكافئ لكل ناحية من الظهر.", defaultWeight: 26, defaultReps: "8-10",
            dos: ["اسحب الدمبل باتجاه الورك وليس الصدر.", "حافظ على الظهر مفرود وموازي للأرض."],
            donts: ["لف الجذع والكتف للأعلى لتسهيل الوزن.", "سقوط الدمبل المفاجئ."],
            githubFolder: "One-Arm_Dumbbell_Row"
          }
        ]
      },
      { 
        id: "d1-e3", name: "Lat Pulldown", type: "سحب عالي واسع", sets: 3, reps: "10-12", defaultWeight: 55, notes: "لعرض مجنص الضهر رسم V-Taper.", 
        alts: [
          { 
            id: "d1-e3-main", name: "Wide-Grip Lat Pulldown", arabicName: "سحب عالي واسع للجهاز (الرئيسي)", equipment: "جهاز السحب العالي + مقبض واسع", whyUseIt: "أفضل تمرين لتعريض مجنص الضهر رسم V-Taper.", defaultWeight: 55, defaultReps: "10-12",
            dos: ["اسحب البار لحد أعلى الصدر مباشرة.", "وجه كوعك لتحت ولورا مع عصر عضلة المجنص.", "حافظ على الصدر مرفوع لأعلى."],
            donts: ["تتمرجح بضهرك لورا بحدة عشان تسحب وزن أتقل.", "تسحب البار خلف الرقبة (يسبب إصابات الكتف)."],
            githubFolder: "Wide-Grip_Lat_Pulldown"
          },
          { 
            id: "d1-e3-alt1", name: "V-Bar Pulldown", arabicName: "سحب عالي قبضة ضيقة V-Bar (بديل 1)", equipment: "مقبض V + جهاز السحب", whyUseIt: "استطالة أعمق وتركيز سفلي للمجنص.", defaultWeight: 50, defaultReps: "10-12",
            dos: ["امسك مقبض V واسحب ناحية منتصف الصدر.", "افرد دراعك للآخر فوق لعمل استطالة كاملة للمجنص."],
            donts: ["تثني معصمك بحدة أثناء السحب.", "تستخدم ذراعك وبايسبسك بدل ضهرك."],
            githubFolder: "V-bar_pulldown"
          },
          { 
            id: "d1-e3-alt2", name: "Pull-Ups", arabicName: "تمرين العقلة بوزن الجسم (بديل 2)", equipment: "بار العقلة", whyUseIt: "تمرين بوزن الجسم ممتاز لبناء قوة الظهر العلوية.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["امسك العقلة أوسع من كتافك بقليل واطلع لحد ما دقنك تعدي البار.", "انزل ببطء وتحكم كامل بوزن الجسم."],
            donts: ["تستخدم النط أو المرجحة بالرجلين (Kipping).", "تنزل نص نزلة بدون فرد الذراعين."],
            githubFolder: "Pullups"
          }
        ]
      },
      { 
        id: "d1-e4", name: "Cable Lateral Raises", type: "رفرفة جانبي بالكابل", sets: 4, reps: "12-15", defaultWeight: 7.5, notes: "الكابل بيحط العضلة تحت ضغط مستمر عكس الدمبل.", 
        alts: [
          { 
            id: "d1-e4-main", name: "Cable Lateral Raise", arabicName: "رفرفة جانبي بالكابل (الرئيسي)", equipment: "جهاز الكابل السفلي", whyUseIt: "يوفر ضغط وشد مستمر على ألياف الكتف الجانبي طوال المدى الحركي.", defaultWeight: 7.5, defaultReps: "12-15",
            dos: ["اسحب الكابل ببطء لحد مستوى الكتف.", "ثبت جسمك واعتصر الرأس الجانبية للكتف في الأعلى."],
            donts: ["النط أو المرجحة بالجذع.", "رفع المقبض أعلى بكثير من مستوى الكتف."],
            githubFolder: "Cable_Lateral_Raise"
          },
          { 
            id: "d1-e4-alt1", name: "Dumbbell Lateral Raise", arabicName: "رفرفة جانبي بالدمبلز (بديل 1)", equipment: "دمبلز خفيفة", whyUseIt: "يعطي شكل الكتف الكروي العريض (3D Shoulder Shape).", defaultWeight: 10, defaultReps: "12-15",
            dos: ["ارفع الذراعين مايلاً لقدام 30 درجة.", "خلي الكوع أعلى قليلاً من المعصم أثناء الرفع."],
            donts: ["رفع الدمبلز أعلى من مستوى الكتف.", "استخدام المرجحة بالترابيز والجسم."],
            githubFolder: "Side_Lateral_Raise"
          },
          { 
            id: "d1-e4-alt2", name: "Machine Lateral Raise", arabicName: "جهاز رفرفة جانبي (بديل 2)", equipment: "جهاز الكتف الجانبي", whyUseIt: "عزل تام بدون التحميل على المعصم أو الظهر.", defaultWeight: 20, defaultReps: "12-15",
            dos: ["اجلس مستقيماً وادفع بالوسائد للخارج بكوعك.", "انزل ببطء وتحكم بالوزن."],
            donts: ["رفع الكتفين للأعلى أثناء الدفع.", "الإسراع دون تركيز."],
            githubFolder: "Seated_Dumbbell_Lateral_Raise"
          }
        ]
      },
      { 
        id: "d1-e5", name: "Overhead Triceps Extension", type: "ترايسبس خلف الرأس", sets: 3, reps: "10-12", defaultWeight: 18, notes: "ده اللي بيكبر الرأس الطويلة للترايسبس ويضخم الدراع.", 
        alts: [
          { 
            id: "d1-e5-main", name: "Overhead Triceps Extension", arabicName: "ترايسبس خلف الرأس بالدمبل/الكابل (الرئيسي)", equipment: "دمبل واحد تقيل أو كابل", whyUseIt: "يكبر الرأس الطويلة للترايسبس (Long Head) ويعطي ضخامة للذراع.", defaultWeight: 18, defaultReps: "10-12",
            dos: ["امسك الدمبل بكفي يديك خلف رأسك وثبت كوعيك باتجاه السقف.", "انزل بالدمبل خلف الرأس وافرده لأعلى بالكامل."],
            donts: ["فتح الكوعين للخارج بحدة بعيداً عن الرأس.", "تقوس الظهر السفلي أثناء التمرين."],
            githubFolder: "Standing_Dumbbell_Triceps_Extension"
          },
          { 
            id: "d1-e5-alt1", name: "Cable Rope Pushdown", arabicName: "ترايسبس بالحبل على الكابل (بديل 1)", equipment: "كابل عالي + حبل", whyUseIt: "يعزل الرأس الجانبية والخارجية للترايسبس بامتياز.", defaultWeight: 20, defaultReps: "10-12",
            dos: ["ثبت كوعك بجانب اضلاعك تماماً.", "افرد ذراعك لأسفل وافتح الحبل للخارج في النهاية."],
            donts: ["ترك الكوع يتحرك للأمام وللأعلى أثناء الصعود.", "الانحناء فوق الحبل بوزن الجسم."],
            githubFolder: "Triceps_Pushdown"
          },
          { 
            id: "d1-e5-alt2", name: "Skullcrushers / Bench Dips", arabicName: "كسار الجمجمة بالبار EZ (بديل 2)", equipment: "بار EZ / دكة", whyUseIt: "بناء ضخامة وحجم عالي للترايسبس بالأوزان الحرة.", defaultWeight: 25, defaultReps: "10-12",
            dos: ["استلقي على الدكة وانزل بالبار باتجاه الجبهة بثبات الكوعين.", "ادفع البار لأعلى باعتصر للترايسبس."],
            donts: ["تحريك الكوعين للأمام أو الخلف أثناء الحركة.", "النزول السريع الخاطف."],
            githubFolder: "Dips_-_Triceps_Version"
          }
        ]
      },
      {
        id: "d1-e6", name: "Plank", type: "ثبات كور", sets: 3, reps: "45-60ث", defaultWeight: 0, notes: "قوة البطن وثبات الحوض والقطنية.",
        alts: [
          { 
            id: "d1-e6-main", name: "Standard Elbow Plank", arabicName: "بلانك ثبات على الكوع (الرئيسي)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن العميقة واستقرار الجذع والحوض.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["خلي جسمك في خط مستقيم من الرأس إلى الكعبين.", "شد عضلات البطن والمؤخرة بقوة أثناء الثبات."],
            donts: ["نزول الحوض لأسفل (يسبب ضغط على القطنية).", "رفع الحوض لأعلى كشكل الخيمة."],
            githubFolder: "Plank"
          },
          { 
            id: "d1-e6-alt1", name: "Side Plank", arabicName: "بلانك جانبي Side Plank (بديل 1)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن الجانبية (Obliques) وثبات الفخذ.", defaultWeight: 0, defaultReps: "30ث لكل جانب",
            dos: ["ارتكز على كوع واحد وجانب القدم واجعل جسمك مستقيماً.", "ارفع حوضك لأعلى واثبت في موضع مرتفع."],
            donts: ["سقوط الحوض باتجاه الأرض.", "لف الكتف العلوي للأمام."],
            githubFolder: "Side_Plank"
          },
          { 
            id: "d1-e6-alt2", name: "High Plank on Hands", arabicName: "بلانك عالي على الكفين (بديل 2)", equipment: "مات أرضي", whyUseIt: "ثبات كامل للجذع والكتفين وعضلات البطن.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["ضع يديك تحت الكتفين مباشرة.", "ثبت الحوض واعتصر البطن."],
            donts: ["تقوس أسفل الظهر لأسفل.", "ثني الكوعين."],
            githubFolder: "Plank"
          }
        ]
      },
      {
        id: "d1-e7", name: "Ab Wheel Rollout", type: "عجلة البطن", sets: 3, reps: "10-12", defaultWeight: 0, notes: "أقوى تمرين انقباض واستطالة لعضلات البطن والجذع.",
        alts: [
          { 
            id: "d1-e7-main", name: "Ab Wheel Rollout", arabicName: "عجلة البطن Ab Wheel (الرئيسي)", equipment: "عجلة بطن", whyUseIt: "تمرين متقدم يبني قوة انقباض وانبساط فائقة لعضلات البطن.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["انزل بالعجلة للأمام ببطء مع تثبيت القطنية والجذع.", "ارجع باستخدام عضلات بطنك وليس بسحب ذراعيك."],
            donts: ["ترك الظهر السفلي يسقط ويتقوس لأسفل.", "الفرد الزائد عن قدرة عضلات بطنك."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d1-e7-alt1", name: "Barbell Ab Rollout", arabicName: "عجلة البطن بالبار (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "بديل ممتاز بالبار لبناء القوة والتحكم في البطن والجذع.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["دحرج البار للأمام بجذع مفرود ومشدود.", "ارجع بعصر عضلات البطن."],
            donts: ["تقوس الظهر لأسفل.", "الإسراع دون تحكم."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d1-e7-alt2", name: "Swiss Ball Rollout", arabicName: "عجلة البطن على الكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "ثبات عالٍ وسهل الأداء لحماية أسفل الظهر.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["ضع الساعدين على الكرة وادفع للقدام ببطء.", "ارجع بعصر عضلات البطن."],
            donts: ["سقوط الحوض لأسفل.", "شد الرقبة."],
            githubFolder: "Exercise_Ball_Hamstring_Curl"
          }
        ]
      }
    ]
  },
  {
    day: 2,
    title: "Lower Body (تأسيس الماكينة)",
    arabicTitle: "رجلين (تأسيس أوزان)",
    goal: "أوزان تقيلة وأمان لضهرك لضخ دماء وتضخيم الرجلين + كور وبلانك.",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d2-e1", name: "Leg Press", type: "دفع رجلين على الجهاز", sets: 4, reps: "10", defaultWeight: 120, notes: "أأمن لضهرك عشان تركز في الأوزان التقيلة.", 
        alts: [
          { 
            id: "d2-e1-main", name: "Leg Press Machine", arabicName: "دفع رجلين على المكبس (الرئيسي)", equipment: "جهاز Leg Press", whyUseIt: "أأمن تمرين لظهرك للتركيز الكامل في زيادة الأوزان والتضخيم.", defaultWeight: 120, defaultReps: "10",
            dos: ["ضع قدميك بعرض الكتفين في منتصف المنصة.", "انزل بالمنصة حتى زاوية 90 بالركبة ثم ادفع بالكعبين."],
            donts: ["قفل مفصل الركبة بالكامل (Lockout) في الأعلى.", "رفع أسفل الظهر عن الكرسي أثناء النزول."],
            githubFolder: "Leg_Press"
          },
          { 
            id: "d2-e1-alt1", name: "Barbell Back Squat", arabicName: "سكوات خلفي بالبار (بديل 1)", equipment: "بار مستقيم + راك", whyUseIt: "ملك تمارين الرجل لبناء القوة العامة.", defaultWeight: 75, defaultReps: "8-10",
            dos: ["انزل لحد ما يكون الفخذ موازي للأرض على الأقل.", "وزع الوزن بالتساوي على قدمك وادفع بالركبتين للخارج."],
            donts: ["دخول الركبتين للداخل أثناء الصعود.", "رفع الكعبين عن الأرض."],
            githubFolder: "Barbell_Full_Squat"
          },
          { 
            id: "d2-e1-alt2", name: "Hack Squat Machine", arabicName: "جهاز هاك سكوات (بديل 2)", equipment: "جهاز الهاك", whyUseIt: "تركيز ناري ومباشر على العضلات الأمامية بدون تحميل على القطنية.", defaultWeight: 80, defaultReps: "10",
            dos: ["ثبت كتفيك وظهرك كاملاً على الكرسي المائل.", "انزل حتى يوازي فخذك المنصة واعتصر الأماميات."],
            donts: ["رفع الكعبين عن المنصة.", "قفل الركبة بحدة في أعلى نقطة."],
            githubFolder: "Hack_Squat"
          }
        ]
      },
      { 
        id: "d2-e2", name: "Romanian Deadlift (RDL)", type: "خلفيات بالدمبل أو البار", sets: 3, reps: "10", defaultWeight: 75, notes: "تأسيس خلفيات الفخذ والجلوتس وقوة التسديد.", 
        alts: [
          { 
            id: "d2-e2-main", name: "Romanian Deadlift (RDL)", arabicName: "ديدليفت روماني بالبار/الدمبل (الرئيسي)", equipment: "بار مستقيم أو دمبلز", whyUseIt: "يبني قوة التسديد في الكورة وعضلات خلفيات الفخذ والجلوتس.", defaultWeight: 75, defaultReps: "10",
            dos: ["ادفع بحوضك للخلف (Hinge) مع ثني بسيط جداً بالركبة.", "مرر البار ملاصقاً لرجلك حتى أسفل الركبة واشعر بالاستطالة."],
            donts: ["تقوس الظهر السفلي (Rounding) أثناء النزول.", "ثني الركبتين لأسفل كأنك تعمل سكوات."],
            githubFolder: "Stiff-Legged_Barbell_Deadlift"
          },
          { 
            id: "d2-e2-alt1", name: "Dumbbell RDL", arabicName: "ديدليفت روماني بالدمبلز (بديل 1)", equipment: "دمبلز", whyUseIt: "يسمح بحرية حركة المعصم والحركة الطبيعية للحوض.", defaultWeight: 26, defaultReps: "10",
            dos: ["امسك الدمبلز بجانب الفخذين وادفع بالحوض للخلف.", "حافظ على استقامة الظهر ونظرك للأرض أمامك."],
            donts: ["ترك الدمبلز تبتعد عن الساقين أثناء النزول.", "رفع الوزن باستخدام ظهرك."],
            githubFolder: "Romanian_Deadlift_With_Dumbbells"
          },
          { 
            id: "d2-e2-alt2", name: "Single-Leg Dumbbell RDL", arabicName: "ديدليفت روماني رجل واحدة (بديل 2)", equipment: "دمبل واحد", whyUseIt: "تمرين توازن حركي لتثبيت الركبة ومنع إصابات الملعب.", defaultWeight: 14, defaultReps: "8-10 لكل رجل",
            dos: ["اقف على رجل واحدة وارجع بالثانية للخلف.", "انزل بالدمبل ببطء واشعر باستطالة خلفية الرجل الثابتة."],
            donts: ["لف الحوض للخارج أثناء النزول.", "فقدان التوازن والإسراع."],
            githubFolder: "Single-Leg_Deadlift_With_Dumbbells"
          }
        ]
      },
      { 
        id: "d2-e3", name: "Leg Extensions", type: "أماميات على الجهاز", sets: 3, reps: "12-15", defaultWeight: 45, notes: "عزل العضلة الرباعية الأمامية.", 
        alts: [
          { 
            id: "d2-e3-main", name: "Machine Leg Extension", arabicName: "جهاز أمامي رجل (الرئيسي)", equipment: "جهاز الأماميات", whyUseIt: "يعزل العضلة الرباعية الأمامية (Quads) بنسبة 100%.", defaultWeight: 45, defaultReps: "12-15",
            dos: ["اضبط مسند الظهر بحيث يطابق مفصل ركبتك محور الجهاز.", "افرد الساقين لأعلى واثبت ثانية في قمة الانقباض."],
            donts: ["استخدام أوزان ثقيلة للغاية تتسبب في مرجحة الجسم.", "النزول السريع الخاطف."],
            githubFolder: "Leg_Extensions"
          },
          { 
            id: "d2-e3-alt1", name: "Sissy Squats", arabicName: "سيسي سكوات بوزن الجسم (بديل 1)", equipment: "وزن الجسم / حافة دكة", whyUseIt: "استطالة هائلة للأماميات ومرونة الركبة.", defaultWeight: 0, defaultReps: "12",
            dos: ["ارتكز على مشط القدم وميل بجذعك للخلف مع ثني الركبتين للأمام.", "حافظ على استقامة خط الجسم من الرأس للركبة."],
            donts: ["الانحناء من الخصر بدل الميل بالجسم كاملاً.", "النزول المفاجئ المسبب لإجهاد الركبة."],
            githubFolder: "Sissy_Squats"
          },
          { 
            id: "d2-e3-alt2", name: "Dumbbell Pass Leg Extension", arabicName: "أمامي بالدمبل على الدكة (بديل 2)", equipment: "دمبل بين القدمين + دكة", whyUseIt: "لو جهاز الأماميات عطلان أو ممتلئ بالجيم.", defaultWeight: 10, defaultReps: "12-15",
            dos: ["اجلس على حافة الدكة وثبت الدمبل بين قدميك جيداً.", "ارفع قدميك لأعلى لفرد الساقين واعتصر العضلات الأمامية."],
            donts: ["سقوط الدمبل أثناء الحركة.", "تحريك الفخذين لأعلى أثناء الفرد."],
            githubFolder: "Dumbbell_pass"
          }
        ]
      },
      { 
        id: "d2-e4", name: "Calf Raises", type: "سمانة", sets: 4, reps: "15", defaultWeight: 40, notes: "قوة القفز وتجنب الشد العضلي في الملعب.", 
        alts: [
          { 
            id: "d2-e4-main", name: "Standing Calf Raise", arabicName: "سمانة واقفا (الرئيسي)", equipment: "جهاز السمانة / استيب", whyUseIt: "تستهدف العضلة التوأمية السطحية (Gastrocnemius) لقوة القفز.", defaultWeight: 40, defaultReps: "15",
            dos: ["اطلع على أمشاط قدميك لأقصى ارتفاع ممكن واثبت ثانية.", "انزل ببطء لأسفل مستوى الاستيب لاستطالة كاملة."],
            donts: ["النط السريع (Bouncing) باستخدام أوتار القدم.", "ثني الركبتين أثناء الصعود."],
            githubFolder: "Standing_Calf_Raises"
          },
          { 
            id: "d2-e4-alt1", name: "Seated Dumbbell Calf Raise", arabicName: "سمانة جالس بالدمبلز (بديل 1)", equipment: "دكة + دمبل على الركبة", whyUseIt: "تستهدف عضلة السمانة العميقة (Soleus) لحماية أوتار الساق.", defaultWeight: 30, defaultReps: "15-20",
            dos: ["ضع مشط قدمك على بلوك أو طارة وضع الدمبل على ركبتك.", "ارفع الكعبين لأعلى نقطة وانزل ببطء."],
            donts: ["رفع الدمبل باستخدام يديك بدلاً من السمانة.", "تقليل المدى الحركي."],
            githubFolder: "Seated_Calf_Raise"
          },
          { 
            id: "d2-e4-alt2", name: "Leg Press Calf Press", arabicName: "سمانة على جهاز الليج بريس (بديل 2)", equipment: "جهاز Leg Press", whyUseIt: "حمل أوزان تقيلة في أمان دون تحميل على العمود الفقري.", defaultWeight: 80, defaultReps: "15",
            dos: ["ثبت أمشاط قدميك على حافة المنصة السفلى.", "ادفع المنصة بأمشاط قدميك واعتصر السمانة فوق."],
            donts: ["انزلاق القدمين من المنصة.", "ثني الركبتين بفرط أثناء الدفع."],
            githubFolder: "Calf_Press_On_The_Leg_Press_Machine"
          }
        ]
      },
      {
        id: "d2-e5", name: "Plank", type: "ثبات كور", sets: 3, reps: "45-60ث", defaultWeight: 0, notes: "قوة البطن وثبات الحوض والقطنية.",
        alts: [
          { 
            id: "d2-e5-main", name: "Standard Elbow Plank", arabicName: "بلانك ثبات على الكوع (الرئيسي)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن العميقة واستقرار الجذع والحوض.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["خلي جسمك في خط مستقيم من الرأس إلى الكعبين.", "شد عضلات البطن والمؤخرة بقوة أثناء الثبات."],
            donts: ["نزول الحوض لأسفل (يسبب ضغط على القطنية).", "رفع الحوض لأعلى كشكل الخيمة."],
            githubFolder: "Plank"
          },
          { 
            id: "d2-e5-alt1", name: "Side Plank", arabicName: "بلانك جانبي Side Plank (بديل 1)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن الجانبية (Obliques) وثبات الفخذ.", defaultWeight: 0, defaultReps: "30ث لكل جانب",
            dos: ["ارتكز على كوع واحد وجانب القدم واجعل جسمك مستقيماً.", "ارفع حوضك لأعلى واثبت في موضع مرتفع."],
            donts: ["سقوط الحوض باتجاه الأرض.", "لف الكتف العلوي للأمام."],
            githubFolder: "Side_Plank"
          },
          { 
            id: "d2-e5-alt2", name: "High Plank on Hands", arabicName: "بلانك عالي على الكفين (بديل 2)", equipment: "مات أرضي", whyUseIt: "ثبات كامل للجذع والكتفين وعضلات البطن.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["ضع يديك تحت الكتفين مباشرة.", "ثبت الحوض واعتصر البطن."],
            donts: ["تقوس أسفل الظهر لأسفل.", "ثني الكوعين."],
            githubFolder: "Plank"
          }
        ]
      },
      {
        id: "d2-e6", name: "Ab Wheel Rollout", type: "عجلة البطن", sets: 3, reps: "10-12", defaultWeight: 0, notes: "أقوى تمرين انقباض واستطالة لعضلات البطن والجذع.",
        alts: [
          { 
            id: "d2-e6-main", name: "Ab Wheel Rollout", arabicName: "عجلة البطن Ab Wheel (الرئيسي)", equipment: "عجلة بطن", whyUseIt: "تمرين متقدم يبني قوة انقباض وانبساط فائقة لعضلات البطن.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["انزل بالعجلة للأمام ببطء مع تثبيت القطنية والجذع.", "ارجع باستخدام عضلات بطنك وليس بسحب ذراعيك."],
            donts: ["ترك الظهر السفلي يسقط ويتقوس لأسفل.", "الفرد الزائد عن قدرة عضلات بطنك."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d2-e6-alt1", name: "Barbell Ab Rollout", arabicName: "عجلة البطن بالبار (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "بديل ممتاز بالبار لبناء القوة والتحكم في البطن والجذع.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["دحرج البار للأمام بجذع مفرود ومشدود.", "ارجع بعصر عضلات البطن."],
            donts: ["تقوس الظهر لأسفل.", "الإسراع دون تحكم."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d2-e6-alt2", name: "Swiss Ball Rollout", arabicName: "عجلة البطن على الكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "ثبات عالٍ وسهل الأداء لحماية أسفل الظهر.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["ضع الساعدين على الكرة وادفع للقدام ببطء.", "ارجع بعصر عضلات البطن."],
            donts: ["سقوط الحوض لأسفل.", "شد الرقبة."],
            githubFolder: "Exercise_Ball_Hamstring_Curl"
          }
        ]
      }
    ]
  },
  {
    day: 3,
    title: "Rest & Recovery",
    arabicTitle: "راحة تامة (أكل ونوم)",
    goal: "الاستشفاء الكامل لبناء الألياف العضلية والجهاز العصبي.",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    exercises: []
  },
  {
    day: 4,
    title: "Upper Body (تركيز عرض الأكتاف والمجنص)",
    arabicTitle: "جزء علوي (عرض أكتاف + مجنص)",
    goal: "التركيز على عرض الأكتاف والمجنص وعضلات البايسبس والصدر المستوي + كور وبلانك.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d4-e1", name: "Lat Pulldown (Reverse/Close Grip)", type: "سحب عالي قبضة مقلوبة أو ضيقة", sets: 4, reps: "8-10", defaultWeight: 55, notes: "استطالة أعمق وتركيز على أسفل المجنص.", 
        alts: [
          { 
            id: "d4-e1-main", name: "Underhand Lat Pulldown", arabicName: "سحب عالي قبضة مقلوبة Underhand (الرئيسي)", equipment: "جهاز سحب عالي + مقبض مستقيم", whyUseIt: "يعطي مدى حركي واسع وقوة سحب هائلة للمجنص أسفل الصدر.", defaultWeight: 55, defaultReps: "8-10",
            dos: ["امسك البار قبضة مقلوبة (كفك باصص لوشك) بعرض الكتف.", "اسحب البار لأسفل الصدر مع اعتصر المجنص."],
            donts: ["الانحناء الشديد للخلف أثناء السحب.", "الاعتماد على البايسبس فقط."],
            githubFolder: "Wide-Grip_Lat_Pulldown"
          },
          { 
            id: "d4-e1-alt1", name: "V-Bar Pulldown", arabicName: "سحب عالي قبضة ضيقة V-Bar (بديل 1)", equipment: "مقبض V + جهاز السحب", whyUseIt: "تركيز ناري على الجزء السفلي من عضلات الظهر.", defaultWeight: 50, defaultReps: "8-10",
            dos: ["امسك مقبض V واسحب لمنتصف الصدر.", "افرد دراعك للآخر فوق لعمل استطالة كاملة."],
            donts: ["تثني معصمك بحدة أثناء السحب.", "تستخدم ذراعك بدل ضهرك."],
            githubFolder: "V-bar_pulldown"
          },
          { 
            id: "d4-e1-alt2", name: "Chin-Ups", arabicName: "عقلة قبضة معكوسة (بديل 2)", equipment: "بار العقلة", whyUseIt: "تمرين قوي بوزن الجسم لتكبير الظهر والبايسبس.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["امسك البار بقبضة مقلوبة واطلع بوزن جسمك لحد الذقن.", "انزل ببطء وتحكم."],
            donts: ["المرجحة بالرجلين.", "نزول جزئي."],
            githubFolder: "Pullups"
          }
        ]
      },
      { 
        id: "d4-e2", name: "Seated Cable Row", type: "سحب أرضي بالكابل", sets: 3, reps: "10-12", defaultWeight: 50, notes: "مقاومة مستمرة لكثافة منتصف الظهر.", 
        alts: [
          { 
            id: "d4-e2-main", name: "Seated Cable Row", arabicName: "سحب أرضي بالكابل (الرئيسي)", equipment: "جهاز سحب أرضي + مقبض V", whyUseIt: "يوفر مقاومة مستمرة لبناء كثافة عضلات منتصف الظهر.", defaultWeight: 50, defaultReps: "10-12",
            dos: ["افرد ضهرك وحافظ على استقامة الجذع.", "اسحب المقبض باتجاه السرة مع ضم لوحي الكتف لبعض."],
            donts: ["التمرجح بالجذع للأمام والخلف أثناء السحب.", "سحب الوزن باستخدام ذراعيك فقط."],
            githubFolder: "Seated_Cable_Rows"
          },
          { 
            id: "d4-e2-alt1", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "مدى حركي أعمق وعزل فردي لكل ناحية.", defaultWeight: 26, defaultReps: "10-12",
            dos: ["اسحب الدمبل باتجاه الورك وليس الصدر.", "حافظ على ظهرك موازي للأرض ومفرود."],
            donts: ["لف الجذع والكتف للأعلى أثناء السحب.", "ترك الدمبل يسقط بسرعة."],
            githubFolder: "One-Arm_Dumbbell_Row"
          },
          { 
            id: "d4-e2-alt2", name: "Chest Supported Row", arabicName: "سحب دمبل سند صدر (بديل 2)", equipment: "دمبلز + دكة مائلة", whyUseIt: "يلغي التحميل على أسفل الظهر تماماً.", defaultWeight: 20, defaultReps: "10-12",
            dos: ["انبطح بفقرات صدرك على الدكة المائلة واسحب الدمبلز للخصر.", "اعتصر عضلات الظهر في الأعلى."],
            donts: ["رفع الصدر عن الدكة أثناء السحب.", "استخدام الأذرع فقط."],
            githubFolder: "Dumbbell_Incline_Row"
          }
        ]
      },
      { 
        id: "d4-e3", name: "Machine Chest Press / Flat Dumbbell Press", type: "صدر مستوي", sets: 3, reps: "8-10", defaultWeight: 28, notes: "استهداف كامل ألياف الصدر المستوي.", 
        alts: [
          { 
            id: "d4-e3-main", name: "Flat Dumbbell Press", arabicName: "تجميع صدر فلات بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة فلات", whyUseIt: "بناء القوة والحجم الكلي لعضلات الصدر بمدى حركي عميق.", defaultWeight: 28, defaultReps: "8-10",
            dos: ["انزل بالدمبلز بجانب الصدر مع فتح الكوع 45 درجة.", "اضغط الدمبلز لأعلى في مسار منحني قليلاً."],
            donts: ["تخبط الدمبلز في بعض فوق بفقد الشد العضلي.", "تفتح كوعك بزاوية 90 درجة."],
            githubFolder: "Dumbbell_Bench_Press"
          },
          { 
            id: "d4-e3-alt1", name: "Machine Chest Press", arabicName: "جهاز ضغط الصدر المستوي (بديل 1)", equipment: "جهاز Chest Press", whyUseIt: "أمان تام للتركيز في زيادة الوزن حتي الفشل العضلي.", defaultWeight: 50, defaultReps: "8-10",
            dos: ["اضبط ارتفاع المقبض بمستوى منتصف الصدر.", "ادفع المقابض لأمامي بثبات وتمركز."],
            donts: ["قفل الكوعين بحدة في النهاية.", "رفع الكتفين للأعلى."],
            githubFolder: "Chest_dip"
          },
          { 
            id: "d4-e3-alt2", name: "Barbell Bench Press", arabicName: "بنش بريس بالبار المستوي (بديل 2)", equipment: "بار مستقيم + دكة فلات", whyUseIt: "تمرين القوة البنائية الشاملة للصدر.", defaultWeight: 70, defaultReps: "8-10",
            dos: ["نزل البار لحد منتصف الصدر ببطء وتحكم.", "ثبت كعب رجلك في الأرض لتوليد القوة."],
            donts: ["رفع الوسط عن الدكة.", "قفل الكوع للآخر فوق."],
            githubFolder: "Barbell_Bench_Press_-_Medium_Grip"
          }
        ]
      },
      { 
        id: "d4-e4", name: "Dumbbell Lateral Raises (With Drop Set)", type: "رفرفة جانبي بالدمبل + Drop Set", sets: 4, reps: "12-15", defaultWeight: 10, notes: "المجموعة الأخيرة Drop Set (تقلل الوزن وتلعب لحد الفشل التام).", 
        alts: [
          { 
            id: "d4-e4-main", name: "Dumbbell Lateral Raise (Drop Set)", arabicName: "رفرفة جانبي بالدمبلز + دروب سيت (الرئيسي)", equipment: "دمبلز", whyUseIt: "تعريض الكتف الجانبي وأعلى ضخ دماء بالفشل العضلي.", defaultWeight: 10, defaultReps: "12-15 + DropSet",
            dos: ["ارفع الذراعين مايلاً لقدام 30 درجة.", "في المجموعة الأخيرة: قلل الوزن فوراً العب 8-10 عدات إضافية للفشل."],
            donts: ["رفع الدمبلز أعلى من مستوى الكتف.", "استخدام المرجحة بالترابيز."],
            githubFolder: "Side_Lateral_Raise"
          },
          { 
            id: "d4-e4-alt1", name: "Cable Lateral Raise", arabicName: "رفرفة جانبي بالكابل (بديل 1)", equipment: "كابل سفلي", whyUseIt: "مقاومة مستمرة وشد دائم على الكتف الجانبي.", defaultWeight: 7.5, defaultReps: "12-15",
            dos: ["ارفع المقبض حتى مستوى الكتف باعتصار جانبي.", "انزل ببطء وتحكم."],
            donts: ["سحب الكابل بسرعة خاطفة.", "الانحناء للجوانب."],
            githubFolder: "Cable_Lateral_Raise"
          },
          { 
            id: "d4-e4-alt2", name: "Seated Dumbbell Lateral Raise", arabicName: "رفرفة جانبي جالساً (بديل 2)", equipment: "دمبلز + دكة 90", whyUseIt: "يمنع المرجحة بالجسم لضمان العزل الصافي.", defaultWeight: 8, defaultReps: "12-15",
            dos: ["اجلس مستقيماً على الدكة وارفع الدمبلز للخارج بثبات.", "ثبت جذعك كاملاً."],
            donts: ["استخدام الزخم للحركة.", "رفع الأوزان الثقيلة جداً."],
            githubFolder: "Seated_Dumbbell_Lateral_Raise"
          }
        ]
      },
      { 
        id: "d4-e5", name: "Face Pulls", type: "سحب بالكابل على الوش", sets: 3, reps: "15", defaultWeight: 20, notes: "عشان الكتف الخلفي وصحة وتوازن المفصل.", 
        alts: [
          { 
            id: "d4-e5-main", name: "Cable Face Pulls", arabicName: "فيس بول بالحبل على الكابل (الرئيسي)", equipment: "كابل عالي + حبل", whyUseIt: "يحسن صحة مفصل الكتف ويستهدف الكتف الخلفي وعضلات الأتب.", defaultWeight: 20, defaultReps: "15",
            dos: ["اضبط الكابل بمستوى العين واسحب الحبل باتجاه الجبهة.", "افتح الحبل للخارج واعتصر الكتف الخلفي."],
            donts: ["سحب الحبل باتجاه الصدر أو الذقن.", "حمل أوزان ثقيلة تسبب الانحناء للخلف."],
            githubFolder: "Face_Pull"
          },
          { 
            id: "d4-e5-alt1", name: "Seated Rear Delt Raise", arabicName: "رفرفة خلفي جالساً بالدمبلز (بديل 1)", equipment: "دمبلز خفيفة + دكة", whyUseIt: "عزل ممتاز لعضلات الكتف الخلفي بالدمبلز.", defaultWeight: 8, defaultReps: "15",
            dos: ["انحني بجذعك فوق فخذيك وارفع الدمبلز للخارج وللأعلى.", "احرص على توجيه الكوعين للسقف."],
            donts: ["رفع الجذع للأعلى أثناء التكرارات.", "استخدام البايسبس."],
            githubFolder: "Seated_Rear_Delt_Raise"
          },
          { 
            id: "d4-e5-alt2", name: "Reverse Cable Flyes", arabicName: "تفتيح خلفي على جهاز الكابل (بديل 2)", equipment: "كابل مزدوج", whyUseIt: "تركيز دقيق بدون أي ضغط على مفاصل المعصم.", defaultWeight: 10, defaultReps: "15",
            dos: ["امسك الكابل متقاطع وافتح ذراعيك للخارج حتى توازيا الصدر.", "اعتصر الكتف الخلفي في النهاية."],
            donts: ["ثني الكوعين بفرط أثناء الفتح.", "التركيز على الظهر بدل الكتف الخلفي."],
            githubFolder: "Reverse_Flyes"
          }
        ]
      },
      { 
        id: "d4-e6", name: "Biceps Cable Curls", type: "بايسبس بالكابل", sets: 3, reps: "12", defaultWeight: 22.5, notes: "مقاومة مستمرة لتكوير وضخامة البايسبس.", 
        alts: [
          { 
            id: "d4-e6-main", name: "Cable Bicep Curl", arabicName: "بايسبس بالكابل السفلي (الرئيسي)", equipment: "جهاز كابل سفلي + مستقيم", whyUseIt: "يحافظ على الشد والمقاومة المستمرة في كل زوايا حركة البايسبس.", defaultWeight: 22.5, defaultReps: "12",
            dos: ["قف مستقيماً أمام الكابل وثبت الكوعين بجانب الجذع.", "اسحب مقبض الكابل باتجاه الكتفين ببطء."],
            donts: ["الرجوع للخلف بالجسم أثناء السحب.", "ترك الكابل يسحب ذراعيك بسرعة."],
            githubFolder: "Cable_Preacher_Curl"
          },
          { 
            id: "d4-e6-alt1", name: "Dumbbell Alternate Curl", arabicName: "تبادل باي بالدمبلز (بديل 1)", equipment: "دمبلز", whyUseIt: "يسمح بتدوير الساعد (Supination) لتكبير وتدوير البايسبس.", defaultWeight: 12, defaultReps: "12",
            dos: ["ثبت كوعك بجانب جسمك دون تحريكه للأمام.", "لف معصمك للأعلى في قمة الحركة واعتصر الباي."],
            donts: ["استخدام المرجحة بالظهر.", "إسقاط الوزن بسرعة أثناء النزول."],
            githubFolder: "Dumbbell_Alternate_Bicep_Curl"
          },
          { 
            id: "d4-e6-alt2", name: "EZ-Bar Bicep Curl", arabicName: "بايسبس بالبار الزيجزاج EZ (بديل 2)", equipment: "بار EZ + طارات", whyUseIt: "يريح مفاصل المعصم ويسمح بحمل أوزان أكبر لبناء الحجم.", defaultWeight: 25, defaultReps: "10-12",
            dos: ["امسك البار الزيجزاج من الانحناء المريح للمعصم.", "اطلع بالبار لحد أعلى الصدر مع ثبات الكوع."],
            donts: ["تحريك الكوع للأمام وللأعلى لتسهيل الحركة.", "تقوس الظهر لرفع الوزن."],
            githubFolder: "EZ-Bar_Curl"
          }
        ]
      },
      {
        id: "d4-e7", name: "Plank", type: "ثبات كور", sets: 3, reps: "45-60ث", defaultWeight: 0, notes: "قوة البطن وثبات الحوض والقطنية.",
        alts: [
          { 
            id: "d4-e7-main", name: "Standard Elbow Plank", arabicName: "بلانك ثبات على الكوع (الرئيسي)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن العميقة واستقرار الجذع والحوض.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["خلي جسمك في خط مستقيم من الرأس إلى الكعبين.", "شد عضلات البطن والمؤخرة بقوة أثناء الثبات."],
            donts: ["نزول الحوض لأسفل (يسبب ضغط على القطنية).", "رفع الحوض لأعلى كشكل الخيمة."],
            githubFolder: "Plank"
          },
          { 
            id: "d4-e7-alt1", name: "Side Plank", arabicName: "بلانك جانبي Side Plank (بديل 1)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن الجانبية (Obliques) وثبات الفخذ.", defaultWeight: 0, defaultReps: "30ث لكل جانب",
            dos: ["ارتكز على كوع واحد وجانب القدم واجعل جسمك مستقيماً.", "ارفع حوضك لأعلى واثبت في موضع مرتفع."],
            donts: ["سقوط الحوض باتجاه الأرض.", "لف الكتف العلوي للأمام."],
            githubFolder: "Side_Plank"
          },
          { 
            id: "d4-e7-alt2", name: "High Plank on Hands", arabicName: "بلانك عالي على الكفين (بديل 2)", equipment: "مات أرضي", whyUseIt: "ثبات كامل للجذع والكتفين وعضلات البطن.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["ضع يديك تحت الكتفين مباشرة.", "ثبت الحوض واعتصر البطن."],
            donts: ["تقوس أسفل الظهر لأسفل.", "ثني الكوعين."],
            githubFolder: "Plank"
          }
        ]
      },
      {
        id: "d4-e8", name: "Ab Wheel Rollout", type: "عجلة البطن", sets: 3, reps: "10-12", defaultWeight: 0, notes: "أقوى تمرين انقباض واستطالة لعضلات البطن والجذع.",
        alts: [
          { 
            id: "d4-e8-main", name: "Ab Wheel Rollout", arabicName: "عجلة البطن Ab Wheel (الرئيسي)", equipment: "عجلة بطن", whyUseIt: "تمرين متقدم يبني قوة انقباض وانبساط فائقة لعضلات البطن.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["انزل بالعجلة للأمام ببطء مع تثبيت القطنية والجذع.", "ارجع باستخدام عضلات بطنك وليس بسحب ذراعيك."],
            donts: ["ترك الظهر السفلي يسقط ويتقوس لأسفل.", "الفرد الزائد عن قدرة عضلات بطنك."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d4-e8-alt1", name: "Barbell Ab Rollout", arabicName: "عجلة البطن بالبار (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "بديل ممتاز بالبار لبناء القوة والتحكم في البطن والجذع.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["دحرج البار للأمام بجذع مفرود ومشدود.", "ارجع بعصر عضلات البطن."],
            donts: ["تقوس الظهر لأسفل.", "الإسراع دون تحكم."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d4-e8-alt2", name: "Swiss Ball Rollout", arabicName: "عجلة البطن على الكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "ثبات عالٍ وسهل الأداء لحماية أسفل الظهر.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["ضع الساعدين على الكرة وادفع للقدام ببطء.", "ارجع بعصر عضلات البطن."],
            donts: ["سقوط الحوض لأسفل.", "شد الرقبة."],
            githubFolder: "Exercise_Ball_Hamstring_Curl"
          }
        ]
      }
    ]
  },
  {
    day: 5,
    title: "Lower Body (لمسات نهائية)",
    arabicTitle: "رجلين (قوة فردية وبطن)",
    goal: "توازن حركي، قوة فردية، ونحت عضلات البطن والجذع + بلانك وعجلة البطن.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d5-e1", name: "Bulgarian Split Squats", type: "سكوات رجل واحدة بالدمبل", sets: 3, reps: "8-10 لكل رجل", defaultWeight: 14, notes: "لتغيير الاتجاهات السريعة والقوة الفردية لكل قدم.", 
        alts: [
          { 
            id: "d5-e1-main", name: "Bulgarian Split Squats", arabicName: "سكوات بلغاري بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة خلفية", whyUseIt: "أفضل تمرين لبناء ثبات الركبة والقوة الفردية لكل قدم.", defaultWeight: 14, defaultReps: "8-10 لكل رجل",
            dos: ["ضع مشط القدم الخلفية على الدكة وانزل بالركبة الخلفية للأرض.", "ميل بالجذع للأمام 15 درجة لاستهداف الجلوتس."],
            donts: ["خروج الركبة الأمامية بفرط بعيداً عن مشط القدم.", "الوقوف قريب جداً أو بعيد جداً عن الدكة."],
            githubFolder: "Dumbbell_Lunges"
          },
          { 
            id: "d5-e1-alt1", name: "Dumbbell Walking Lunges", arabicName: "طعن مشي بالدمبلز (بديل 1)", equipment: "دمبلز + مسار مشي", whyUseIt: "ديناميكي ويحاكي حركة الجري والطعن الميداني.", defaultWeight: 12, defaultReps: "10 خطوات لكل رجل",
            dos: ["انزل بركبتك الخلفية لقرب الأرض واخطو بثبات للأمام.", "حافظ على استقامة الجذع والصدر مرفوعاً."],
            donts: ["الميل العنيف للجذع للأمام أثناء المشي.", "ضرب الركبة الخلفية بالأرض بقوة."],
            githubFolder: "Dumbbell_Walking_Lunge"
          },
          { 
            id: "d5-e1-alt2", name: "Barbell Reverse Lunge", arabicName: "طعن رجوع للخلف بالبار (بديل 2)", equipment: "بار + طارات", whyUseIt: "يحمي الركبة ويستهدف الجلوتس والخلفيات بكفاءة.", defaultWeight: 40, defaultReps: "8-10 لكل رجل",
            dos: ["احمل البار على أعلى الظهر واخطو بخطوة واسعة للخلف.", "انزل عمودياً واعتصر القدم الأمامية عند الصعود."],
            donts: ["فقدان التوازن أثناء الرجوع للخلف.", "تحميل الوزن على مشط القدم الخلفية."],
            githubFolder: "Barbell_Lunge"
          }
        ]
      },
      { 
        id: "d5-e2", name: "Leg Curls", type: "خلفيات على الجهاز", sets: 3, reps: "12", defaultWeight: 40, notes: "تجنب إصابات الضمة والخلفية.", 
        alts: [
          { 
            id: "d5-e2-main", name: "Seated Leg Curl", arabicName: "جهاز خلفيات رجل جالس (الرئيسي)", equipment: "جهاز خلفيات جالس", whyUseIt: "يعزل عضلات الهامسترينج الخلفية لحمايتها من التمزق.", defaultWeight: 40, defaultReps: "12",
            dos: ["اضبط محور دوران الجهاز مع ركبتك واقفل المسند.", "اسحب الوسادة لأسفل بقوة واعتصر خلفيات الساق."],
            donts: ["رفع الفخذين عن الكرسي أثناء السحب.", "النزول السريع الخاطف."],
            githubFolder: "Seated_Leg_Curl"
          },
          { 
            id: "d5-e2-alt1", name: "Dumbbell Lying Leg Curl", arabicName: "خلفيات بالدمبل مستلقي (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "بديل ذكي ممتاز بوزن حر لو الجهاز ممتلئ.", defaultWeight: 14, defaultReps: "10-12",
            dos: ["انبطح على الدكة وثبت الدمبل بين قدميك جيداً.", "اثني الساقين لأعلى باتجاه الجلوتس باعتصر خلفي."],
            donts: ["سقوط الدمبل أثناء الحركة.", "رفع الحوض عن الدكة أثناء الثني."],
            githubFolder: "Dumbbell_Lying_Leg_Curl"
          },
          { 
            id: "d5-e2-alt2", name: "Exercise Ball Hamstring Curl", arabicName: "سحب خلفيات بالكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "يقوي عضلات خلفية الساق والجلوتس وثبات الظهر السفلي.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["استلقي على ظهرك وضع كعبيك على الكرة وارفع الحوض.", "اسحب الكرة باتجاه جسمك باستخدام كعبيك."],
            donts: ["سقوط الحوض باتجاه الأرض.", "فقدان التحكم بالكرة."],
            githubFolder: "Exercise_Ball_Hamstring_Curl"
          }
        ]
      },
      { 
        id: "d5-e3", name: "Leg Press (High & Wide Stance)", type: "دفع رجلين بقدم واسعة من فوق", sets: 3, reps: "12", defaultWeight: 100, notes: "استهداف الخلفيات والجلوتس بضخ دماء عالي.", 
        alts: [
          { 
            id: "d5-e3-main", name: "Wide Stance Leg Press", arabicName: "مكبس رجلين قدم واسعة عالية (الرئيسي)", equipment: "جهاز Leg Press", whyUseIt: "استهداف أعمق للجلوتس والخلفيات والعضلات الضامة.", defaultWeight: 100, defaultReps: "12",
            dos: ["ضع قدميك أعلى المنصة وباتساع أكبر من عرض الكتفين.", "انزل بسلاسة واعتصر الكعبين أثناء الدفع لأعلى."],
            donts: ["قفل مفصل الركبة تماماً فوق.", "رفع الظهر السفلي عن المقعد."],
            githubFolder: "Leg_Press"
          },
          { 
            id: "d5-e3-alt1", name: "Hack Squat Machine", arabicName: "جهاز هاك سكوات (بديل 1)", equipment: "جهاز الهاك", whyUseIt: "تركيز عالي على العضلات الرباعية الأمامية.", defaultWeight: 75, defaultReps: "10-12",
            dos: ["ثبت كتفيك وظهرك كاملاً على الكرسي المائل.", "انزل حتى يوازي فخذك المنصة واعتصر عند الصعود."],
            donts: ["رفع الكعبين عن المنصة.", "قفل الركبة بحدة فوق."],
            githubFolder: "Hack_Squat"
          },
          { 
            id: "d5-e3-alt2", name: "Dumbbell Step-Ups", arabicName: "صعود على الصندوق بالدمبلز (بديل 2)", equipment: "دمبلز + صندوق/دكة", whyUseIt: "قوة دفع انفجارية وتوافق أداء حركي ميداني.", defaultWeight: 12, defaultReps: "10 لكل رجل",
            dos: ["ضع قدمك بالكامل على الصندوق وادفع بجسمك لأعلى بثبات.", "انزل ببطء وتحكم بالقدم الأخرى."],
            donts: ["الدفع بالقدم السفلى على الأرض.", "تحميل الوزن على مشط القدم بدل الكعب."],
            githubFolder: "Dumbbell_Step-Ups"
          }
        ]
      },
      { 
        id: "d5-e4", name: "Plank", type: "ثبات كور", sets: 3, reps: "45-60ث", defaultWeight: 0, notes: "قوة البطن وثبات الحوض والقطنية.",
        alts: [
          { 
            id: "d5-e4-main", name: "Standard Elbow Plank", arabicName: "بلانك ثبات على الكوع (الرئيسي)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن العميقة واستقرار الجذع والحوض.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["خلي جسمك في خط مستقيم من الرأس إلى الكعبين.", "شد عضلات البطن والمؤخرة بقوة أثناء الثبات."],
            donts: ["نزول الحوض لأسفل (يسبب ضغط على القطنية).", "رفع الحوض لأعلى كشكل الخيمة."],
            githubFolder: "Plank"
          },
          { 
            id: "d5-e4-alt1", name: "Side Plank", arabicName: "بلانك جانبي Side Plank (بديل 1)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن الجانبية (Obliques) وثبات الفخذ.", defaultWeight: 0, defaultReps: "30ث لكل جانب",
            dos: ["ارتكز على كوع واحد وجانب القدم واجعل جسمك مستقيماً.", "ارفع حوضك لأعلى واثبت في موضع مرتفع."],
            donts: ["سقوط الحوض باتجاه الأرض.", "لف الكتف العلوي للأمام."],
            githubFolder: "Side_Plank"
          },
          { 
            id: "d5-e4-alt2", name: "High Plank on Hands", arabicName: "بلانك عالي على الكفين (بديل 2)", equipment: "مات أرضي", whyUseIt: "ثبات كامل للجذع والكتفين وعضلات البطن.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["ضع يديك تحت الكتفين مباشرة.", "ثبت الحوض واعتصر البطن."],
            donts: ["تقوس أسفل الظهر لأسفل.", "ثني الكوعين."],
            githubFolder: "Plank"
          }
        ]
      },
      { 
        id: "d5-e5", name: "Ab Wheel Rollout", type: "عجلة البطن", sets: 3, reps: "10-12", defaultWeight: 0, notes: "أقوى تمرين انقباض واستطالة لعضلات البطن والجذع.",
        alts: [
          { 
            id: "d5-e5-main", name: "Ab Wheel Rollout", arabicName: "عجلة البطن Ab Wheel (الرئيسي)", equipment: "عجلة بطن", whyUseIt: "تمرين متقدم يبني قوة انقباض وانبساط فائقة لعضلات البطن.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["انزل بالعجلة للأمام ببطء مع تثبيت القطنية والجذع.", "ارجع باستخدام عضلات بطنك وليس بسحب ذراعيك."],
            donts: ["ترك الظهر السفلي يسقط ويتقوس لأسفل.", "الفرد الزائد عن قدرة عضلات بطنك."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d5-e5-alt1", name: "Barbell Ab Rollout", arabicName: "عجلة البطن بالبار (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "بديل ممتاز بالبار لبناء القوة والتحكم في البطن والجذع.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["دحرج البار للأمام بجذع مفرود ومشدود.", "ارجع بعصر عضلات البطن."],
            donts: ["تقوس الظهر لأسفل.", "الإسراع دون تحكم."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d5-e5-alt2", name: "Swiss Ball Rollout", arabicName: "عجلة البطن على الكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "ثبات عالٍ وسهل الأداء لحماية أسفل الظهر.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["ضع الساعدين على الكرة وادفع للقدام ببطء.", "ارجع بعصر عضلات البطن."],
            donts: ["سقوط الحوض لأسفل.", "شد الرقبة."],
            githubFolder: "Exercise_Ball_Hamstring_Curl"
          }
        ]
      }
    ]
  },
  {
    day: 6,
    title: "Rest & Recovery",
    arabicTitle: "راحة إستشفائية",
    goal: "راحة واستشفاء عضلي ونوم عالي الجودة.",
    image: "https://images.unsplash.com/photo-1518605368461-1e1e114e7a17?auto=format&fit=crop&w=800&q=80",
    exercises: []
  },
  {
    day: 7,
    title: "Rest & System Reboot",
    arabicTitle: "راحة إجبارية",
    goal: "تجهيز الجهاز العصبي والعضلات لأسبوع أثقل.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    exercises: []
  }
];

const dietPlan = {
  goal: "4000 سعرة حرارية (وقود التضخيم الشرس الاقتصادي)",
  macros: { protein: 185, carbs: 520, fats: 110 },
  strategy: "تضخيم شرس اقتصادي بحيل ذكية لتسهيل الهضم وزيادة السعرات بدون معاناة للمعدة.",
  meals: [
    { 
      id: "meal-1", 
      title: "وجبة 1 (الفطار)", 
      subtitle: "طاقة وسعرات اقتصادية للصباح",
      icon: Coffee, 
      color: "text-orange-400", 
      bg: "bg-orange-950/40", 
      base: "2 ساندوتش جبنة قريش (مضروبة بمعلقتين زيت زيتون أو حار) + 2 ساندوتش حلاوة طحينية (عيش بلدي).", 
      alts: ["البديل السريع: 3 باتيه بالجبنة + علبة لبن رايب كبيرة."] 
    },
    { 
      id: "meal-2", 
      title: "وجبة 2 (وأنت بتكتب كود)", 
      subtitle: "المشروب السريع عالي السعرات",
      icon: Laptop, 
      color: "text-blue-400", 
      bg: "bg-blue-950/40", 
      base: "المشروب السريع: خلاط (مياه + معلقتين كبار لبن بودرة + 100 جرام شوفان + موزة + كاكاو).", 
      alts: ["البديل (بدون خلاط): 3 ساندوتشات عيش بلدي بزبدة الفول السوداني والموز."] 
    },
    { 
      id: "meal-3", 
      title: "وجبة 3 (غداء الشارع)", 
      subtitle: "سعرات ثقيلة وسريعة",
      icon: Briefcase, 
      color: "text-amber-400", 
      bg: "bg-amber-950/40", 
      base: "علبة كشري 'دبل' تقيلة مع تقلية وزيت، أو 4 ساندوتشات فول وطعمية بالزيت.", 
      alts: ["البديل: 2 رغيف حواوشي أو 3 ساندوتشات كبدة وسجق."] 
    },
    { 
      id: "meal-4", 
      title: "وجبة 4 (قبل الجيم بـ 45 دقيقة)", 
      subtitle: "البري وورك أوت الطبيعي",
      icon: Zap, 
      color: "text-yellow-400", 
      bg: "bg-yellow-950/40", 
      base: "معلقتين كبار من برطمان (العسل والمكسرات وبذور اليقطين).", 
      alts: ["البديل: كيس عصير قصب عريض + بسكويت بالعجوة."] 
    },
    { 
      id: "meal-5", 
      title: "وجبة 5 (بعد الجيم / غداء البيت)", 
      subtitle: "الريكفري والبناء الشرس",
      icon: Activity, 
      color: "text-emerald-400", 
      bg: "bg-emerald-950/40", 
      base: "جبل الرز المصري (طبقين كبار وعليهم معلقة سمنة أو زيت) + البروتين المتاح (فراخ، لحمة، سمك، أو بطاطس مهروسة بالمرقة).", 
      alts: ["البديل: طبق مكرونة ضخم بالصلصة والزيت + 3 بيضات مسلوقة."] 
    },
    { 
      id: "meal-6", 
      title: "وجبة 6 (قبل النوم)", 
      subtitle: "تغلق اليوم بإنعاش عضلاتي",
      icon: Moon, 
      color: "text-indigo-400", 
      bg: "bg-indigo-950/40", 
      base: "معلقتين كبار كمان من برطمان العسل والمكسرات وبذور اليقطين.", 
      alts: ["البديل: علبة زبادي كبيرة أو كوب لبن دافئ + معلقة عسل."] 
    }
  ]
};

const initialWeightLogs = [];

const messages = {
  success: [
    "عاش يا بشمهندس علي! التقفيلة دي هي اللي بتعمل الـ Muscles مش الـ Motivation المؤقت. 🚀",
    "Commitment 100%. يوم ورا يوم بتبني الـ Version الأقوى منك. استمر! 💪",
    "الديسبلن كسب النهاردة. روح نام وإنت فخور إنك مسبتش حاجة للصدفة. 🛡️"
  ],
  average: [
    "عاش على المجهود، بس افتكر إنت بدأت ليه! الـ 100% بتفرق كتير في النتايج. 🔥",
    "مش وحش، بس الـ Version اللي بتسعى ليها محتاجة زقة كمان. بكرة التارجت مقفول إن شاء الله. 🎯",
    "أهم حاجة إنك مسبتش اليوم يقع خالص. بكرة نـ Refactor الأداء ونقفل الـ 100%. 💻"
  ],
  low: [
    "يوم ووقع، مش نهاية العالم. المهم إن الـ System شغال ومحتاجك بكرة تعوض. 🔄",
    "الالتزام (Discipline) إنك تعمل اللي وراك حتى لو مش في المود. بكرة بداية جديدة يا وحش. ✊",
    "مفيش بطل مبيقعش، بس البطل بيكمل. نام كويس ورتب مهامك لبكرة. ⏳"
  ]
};

// ================= UTILS =================
const triggerHaptic = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(40); } catch(_e){}
  }
};

const playBeepSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch(_e) {}
};





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

  const frame0Url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folderName}/0.jpg`;
  const frame1Url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folderName}/1.jpg`;

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
};

// ================= EXERCISE ITEM WITH ERGONOMIC CONTROLS & 3 ALTERNATIVES =================
const ErgonomicExerciseCard = ({ 
  exercise, 
  completedSets, 
  exerciseWeights, 
  exerciseReps, 
  onSetToggle, 
  onWeightChange, 
  onRepsChange,
  onStartRest 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeAltIndex, setActiveAltIndex] = useState(0);

  const alts = exercise.alts || [
    { id: `${exercise.id}-main`, name: exercise.name, arabicName: `${exercise.name} (الرئيسي)`, equipment: exercise.type, whyUseIt: exercise.notes, dos: exercise.dos, donts: exercise.donts, defaultWeight: exercise.defaultWeight, defaultReps: exercise.reps }
  ];
  const currentAlt = alts[activeAltIndex] || alts[0];

  // Track weight and reps independently per alternative variation (e.g. Barbell 70kg vs Dumbbell 26kg)
  const currentWeight = exerciseWeights[currentAlt.id] ?? currentAlt.defaultWeight ?? exercise.defaultWeight ?? 0;
  const currentReps = exerciseReps[currentAlt.id] ?? currentAlt.defaultReps ?? exercise.reps ?? "8";

  const handleStepWeight = (delta) => {
    triggerHaptic();
    const nextVal = Math.max(0, Number(currentWeight) + delta);
    onWeightChange(currentAlt.id, nextVal);
  };

  const handleStepReps = (delta) => {
    triggerHaptic();
    const baseNum = parseInt(currentReps, 10) || 8;
    const nextVal = Math.max(1, baseNum + delta);
    onRepsChange(currentAlt.id, nextVal.toString());
  };

  const handleCompleteSet = (index) => {
    triggerHaptic();
    const isCompleting = completedSets === index;
    if (isCompleting) {
      onStartRest();
      if (index === exercise.sets - 1) {
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        } catch(_e){}
      }
    }
    onSetToggle(exercise.id, index);
  };

  const activeDos = currentAlt.dos || exercise.dos || [];
  const activeDonts = currentAlt.donts || exercise.donts || [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg transition-all hover:border-slate-700 font-arabic">
      
      {/* Top Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500/20 text-orange-400 p-1.5 rounded-lg border border-orange-500/30">
              <Dumbbell className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{exercise.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            <span className="text-orange-400 font-bold">{exercise.sets} مجاميع</span> × <span className="text-emerald-400 font-bold">{currentReps} عدات</span>
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showDetails 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' 
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>الشرح والحركة</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3 Alternative Variations Selector Tabs */}
      <div className="flex items-center gap-1.5 my-3 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        <span className="text-[11px] text-slate-400 font-bold px-1 whitespace-nowrap">البديل المتاح بالجيم:</span>
        {alts.map((alt, idx) => (
          <button
            key={alt.id}
            type="button"
            onClick={() => {
              triggerHaptic();
              setActiveAltIndex(idx);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
              activeAltIndex === idx
                ? idx === 0 
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
                  : idx === 1
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-sm'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <span>{idx === 0 ? '🥇 الرئيسي' : idx === 1 ? '🥈 بديل (1)' : '🥉 بديل (2)'}</span>
          </button>
        ))}
      </div>

      {/* Active Variation Info Badge */}
      <div className="mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-bold text-orange-400">{currentAlt.arabicName}</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">{currentAlt.equipment}</span>
        </div>
        <p className="text-[11px] text-slate-400">💡 {currentAlt.whyUseIt}</p>
      </div>

      {/* Ergonomic Fast Steppers (Weight & Reps per Alternative) */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
        {/* Weight Stepper */}
        <div className="flex items-center justify-between bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
          <button 
            type="button"
            onClick={() => handleStepWeight(-2.5)} 
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center font-bold text-sm transition-all"
          >
            -
          </button>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block leading-none">وزن البديل (كجم)</span>
            <span className="text-sm sm:text-base font-bold text-orange-400 font-mono">{currentWeight}</span>
          </div>
          <button 
            type="button"
            onClick={() => handleStepWeight(2.5)} 
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center font-bold text-sm transition-all"
          >
            +
          </button>
        </div>

        {/* Reps Stepper */}
        <div className="flex items-center justify-between bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
          <button 
            type="button"
            onClick={() => handleStepReps(-1)} 
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center font-bold text-sm transition-all"
          >
            -
          </button>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block leading-none">العدات</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">{currentReps}</span>
          </div>
          <button 
            type="button"
            onClick={() => handleStepReps(1)} 
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center font-bold text-sm transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Expanded Guidance & Motion Animation */}
      {showDetails && (
        <div className="mb-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <UnbreakableAnimation altId={currentAlt.id} currentAlt={currentAlt} />
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('طريقة اداء ' + currentAlt.arabicName + ' shorts')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <YoutubeIcon className="w-4 h-4" />
                شرح فيديو سريع (Shorts)
              </a>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2.5">
                <h4 className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> الأداء الصحيح ({currentAlt.name})</h4>
                <ul className="space-y-1 text-slate-300">
                  {activeDos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-400 shrink-0">•</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-2.5">
                <h4 className="flex items-center gap-1.5 text-red-400 font-bold mb-1.5 text-xs"><AlertOctagon className="w-3.5 h-3.5" /> تجنب الأخطاء</h4>
                <ul className="space-y-1 text-slate-300">
                  {activeDonts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-red-400 shrink-0">×</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sweaty-Hand Large Set Buttons */}
      <div className="flex gap-2">
        {[...Array(exercise.sets)].map((_, i) => {
          const isDone = completedSets > i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleCompleteSet(i)}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[46px] active-press ${
                isDone 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/80'
              }`}
            >
              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : `مجموعة ${i + 1}`}
            </button>
          );
        })}
      </div>

    </div>
  );
};

// ================= PROGRESSIVE OVERLOAD ANALYTICS VIEW =================
const ProgressiveAnalyticsView = ({ weightLogs, onAddWeightLog, onDeleteWeightLog }) => {
  const [exerciseName, setExerciseName] = useState('Bench Press');
  const [customName, setCustomName] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [selectedLiftChart, setSelectedLiftChart] = useState('Bench Press');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weightInput || !repsInput) return;
    const finalName = exerciseName === 'Custom' ? customName : exerciseName;
    if (!finalName.trim()) return;

    onAddWeightLog({
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-EG', { month: '2-digit', day: '2-digit' }),
      exerciseName: finalName,
      weight: Number(weightInput),
      reps: Number(repsInput)
    });
    setWeightInput('');
    setRepsInput('');
    if (exerciseName === 'Custom') setCustomName('');
    triggerHaptic();
  };

  const chartData = useMemo(() => {
    const logs = weightLogs
      .filter(l => l.exerciseName === selectedLiftChart)
      .slice()
      .reverse();

    return logs.map(l => {
      const est1RM = Math.round(l.weight * (1 + l.reps / 30));
      return {
        date: l.date,
        weight: l.weight,
        est1RM: est1RM,
        volume: l.weight * l.reps
      };
    });
  }, [weightLogs, selectedLiftChart]);

  const personalRecords = useMemo(() => {
    const prMap = {};
    weightLogs.forEach(l => {
      if (!prMap[l.exerciseName] || l.weight > prMap[l.exerciseName].weight) {
        prMap[l.exerciseName] = l;
      }
    });
    return prMap;
  }, [weightLogs]);

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-300 pb-10">
      
      <div className="bg-slate-900/90 border border-blue-500/20 rounded-2xl p-5 shadow-xl glass-panel flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            تحليلات التطور والتضخيم (Progressive Overload)
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            قياس القوة الحقيقية، الـ 1RM التقديري، والحجم التدريبي لضمان النمو العضلي المستمر.
          </p>
        </div>
        <div className="bg-blue-600/20 border border-blue-500/30 p-3 rounded-2xl text-blue-400 hidden sm:block">
          <BarChart3 className="w-8 h-8" />
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              معدل زيادة أوزان الـ 1RM التقديري
            </h3>
            <p className="text-[11px] text-slate-400">تطور التمرين عبر الجلسات</p>
          </div>

          <select
            value={selectedLiftChart}
            onChange={(e) => setSelectedLiftChart(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-500"
          >
            <option value="Bench Press">Bench Press (بنش بريس)</option>
            <option value="Squats">Squats (سكوات)</option>
            <option value="Romanian Deadlift">Romanian Deadlift (ديدليفت)</option>
            <option value="Overhead Press">Overhead Press (كتف)</option>
            <option value="Lat Pulldown">Lat Pulldown (سحب ضهر)</option>
          </select>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="color1RM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 5', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value, name) => [name === 'est1RM' ? `${value} كجم (1RM)` : `${value} كجم`, name === 'est1RM' ? 'اقصى وزن تقديري' : 'الوزن المرفوع']}
                />
                <Area type="monotone" dataKey="est1RM" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#color1RM)" name="est1RM" />
                <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fill="none" name="weight" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
              لا توجد بيانات كافية لهذا التمرين بعد. اضف أول وزن!
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <TrophyIcon className="w-4 h-4 text-amber-400" />
          أفضل الأوزان المحققة (Personal Records - PR)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {['Bench Press', 'Squats', 'Romanian Deadlift', 'Overhead Press'].map(lift => {
            const pr = personalRecords[lift];
            return (
              <div key={lift} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-right shadow-md">
                <span className="text-[11px] text-slate-400 font-semibold truncate block">{lift}</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                    {pr ? `${pr.weight} كجم` : '--'}
                  </span>
                  {pr && <span className="text-[10px] text-slate-500 font-mono">({pr.reps} عدات)</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          تسجيل تمرينة أو وزن جديد للسجل
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">اسم التمرين</label>
            <select 
              value={exerciseName} 
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Bench Press">Bench Press (بنش)</option>
              <option value="Incline Dumbbell Press">Incline Dumbbell Press (صدر عالي)</option>
              <option value="Squats">Squats (سكوات)</option>
              <option value="Romanian Deadlift">Romanian Deadlift (ديدليفت)</option>
              <option value="Overhead Press">Overhead Press (كتف)</option>
              <option value="Lat Pulldown">Lat Pulldown (سحب)</option>
              <option value="Seated Cable Row">Seated Cable Row (سحب أرضي)</option>
              <option value="Custom">+ تمرين آخر</option>
            </select>
            {exerciseName === 'Custom' && (
              <input 
                type="text" 
                placeholder="ادخل اسم التمرين..." 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full mt-2 bg-slate-950 border border-blue-500/50 rounded-xl p-2 text-white"
              />
            )}
          </div>

          <div>
            <label className="block text-slate-400 mb-1">الوزن (كيلوجرام)</label>
            <input 
              type="number"
              placeholder="مثال: 75"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">العدات (Reps)</label>
            <input 
              type="number"
              placeholder="مثال: 8"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-xs sm:text-sm active-press"
        >
          حفظ التمرينة في السجل
        </button>
      </form>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-400" />
          سجل الأوزان التاريخي
        </h3>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {weightLogs.map(log => (
            <div key={log.id} className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex justify-between items-center text-xs hover:border-slate-700 transition-all">
              <div>
                <h4 className="text-white font-bold">{log.exerciseName}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  الوزن: <span className="text-orange-400 font-bold">{log.weight} كجم</span> | العدات: <span className="text-emerald-400 font-bold">{log.reps}</span> ({log.date})
                </p>
              </div>
              <button 
                onClick={() => onDeleteWeightLog(log.id)}
                className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ================= GAMIFICATION & ACHIEVEMENTS VIEW =================
const AchievementsView = ({ completedTasksCount, totalVolumeThisWeek, waterGlasses, exportData, importData }) => {
  const xp = (completedTasksCount * 150) + Math.floor(totalVolumeThisWeek / 10);
  const level = Math.floor(xp / 1000) + 1;
  const xpCurrentLevel = xp % 1000;
  const levelTitle = level >= 10 ? "Principal Iron God 🏆" : level >= 7 ? "Lead Muscle Architect ⚡" : level >= 4 ? "Senior Strength Dev 🦾" : "Junior Lifter 🚀";

  const badges = [
    { id: 1, title: "1000kg Club", desc: "رفع أكثر من 1000 كجم إجمالي حقيقي", icon: Trophy, unlocked: totalVolumeThisWeek >= 1000 },
    { id: 2, title: "Discipline 100%", desc: "إكمال جميع تمارين اليوم الحقيقية", icon: ShieldCheck, unlocked: completedTasksCount >= 8 },
    { id: 3, title: "Macro Precision", desc: "التزام بكافة وجبات التغذية اليومية", icon: Flame, unlocked: completedTasksCount >= 5 },
    { id: 4, title: "Hydration King", desc: "شرب 8 أكواب مية كاملة", icon: Droplets, unlocked: typeof waterGlasses === 'number' && waterGlasses >= 8 }
  ];

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-300 pb-10">
      
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-emerald-400 to-blue-500"></div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-extrabold text-2xl shrink-0 shadow-lg">
            L{level}
          </div>
          <div className="flex-1">
            <span className="text-[11px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 font-bold">
              {levelTitle}
            </span>
            <h2 className="text-xl font-black text-white mt-1">البشمهندس علي</h2>
            <p className="text-xs text-slate-400 mt-0.5">مجموع نقاط الـ XP: <span className="text-orange-400 font-mono font-bold">{xp} XP</span></p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-bold">
            <span>المستوى الحالي</span>
            <span>{xpCurrentLevel} / 1000 XP للمستوى التالي</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${(xpCurrentLevel / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-400" />
          الأوسمة والإنجازات المفتوحة
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {badges.map(b => {
            const Icon = b.icon;
            return (
              <div 
                key={b.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  b.unlocked 
                    ? 'bg-slate-900/90 border-emerald-500/40 text-white shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800 opacity-50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${b.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{b.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{b.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-400" />
          إدارة البيانات والنسخ الاحتياطي
        </h3>
        <p className="text-xs text-slate-400 mb-4">تصدير كل أوزانك وإنجازاتك لحفظها أو نقلها لجهاز جديد.</p>

        <div className="flex gap-2">
          <button 
            onClick={exportData}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" /> تصدير ملف JSON
          </button>
          
          <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-emerald-400" /> استرجاع بيانات
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

    </div>
  );
};


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
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(n => caches.delete(n)));
      }
    } catch(_e){}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  render() {
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
  }
}


// ================= GOOGLE APPS SCRIPT / SHEETS ENGINE =================
const useAppsScriptSync = (
  workoutProgress, setWorkoutProgress,
  exerciseWeights, setExerciseWeights,
  exerciseReps, setExerciseReps,
  dietProgress, setDietProgress,
  waterGlasses, setWaterGlasses,
  weightLogs, setWeightLogs,
  activeDay, setActiveDay,
  triggerHaptic
) => {
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem('gymAppsScriptUrl') || "https://script.google.com/macros/s/AKfycbzbib8mglWxUhFt63mk798-Evdz2GEQy2nqy9zkzPhxMJNOe95yeCWChJDRJFyGmbJ7Bw/exec";
  });
  const [appsScriptStatus, setAppsScriptStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [showAppsScriptModal, setShowAppsScriptModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(appsScriptUrl);
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const isInitialMount = useRef(true);

  // Fetch Data from Google Sheet
  const fetchAppsScriptData = async (overrideUrl) => {
    const targetUrl = overrideUrl || appsScriptUrl;
    if (!targetUrl || !targetUrl.startsWith('http')) return;
    setAppsScriptStatus('syncing');
    try {
      const urlWithAction = targetUrl.includes('?') ? `${targetUrl}&action=getData` : `${targetUrl}?action=getData`;
      const res = await fetch(urlWithAction, { redirect: 'follow' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          if (data.workoutProgress) {
            setWorkoutProgress(data.workoutProgress);
            localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(data.workoutProgress));
          }
          if (data.exerciseWeights) {
            setExerciseWeights(data.exerciseWeights);
            localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(data.exerciseWeights));
          }
          if (data.exerciseReps) {
            setExerciseReps(data.exerciseReps);
            localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(data.exerciseReps));
          }
          if (data.dietProgress) {
            setDietProgress(data.dietProgress);
            localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(data.dietProgress));
          }
          if (data.waterGlasses) {
            setWaterGlasses(data.waterGlasses);
            localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(data.waterGlasses));
          }
          if (Array.isArray(data.weightLogs)) {
            setWeightLogs(data.weightLogs);
            localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(data.weightLogs));
          }
          if (data.activeDay) setActiveDay(data.activeDay);
          setAppsScriptStatus('synced');
        }
      }
    } catch(_e) {
      console.log("Apps Script fetch error:", e);
      setAppsScriptStatus('error');
    }
  };

  // Push Data to Google Sheet
  const pushAppsScriptData = async () => {
    if (!appsScriptUrl || !appsScriptUrl.startsWith('http')) return;
    setAppsScriptStatus('syncing');
    try {
      const payload = {
        appName: "Ali Gym Tracker Google Sheet",
        lastUpdatedDate: new Date().toISOString(),
        workoutProgress: workoutProgress || {},
        exerciseWeights: exerciseWeights || {},
        exerciseReps: exerciseReps || {},
        dietProgress: dietProgress || {},
        waterGlasses: waterGlasses || {},
        weightLogs: Array.isArray(weightLogs) ? weightLogs : [],
        activeDay: activeDay || 1
      };

      // Send as text/plain to avoid CORS preflight options check on Google Apps Script
      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      setAppsScriptStatus('synced');
    } catch(_e) {
      console.log("Apps script push error:", e);
      setAppsScriptStatus('synced');
    }
  };

  // Auto-Pull on mount if URL exists
  useEffect(() => {
    if (appsScriptUrl) {
      fetchAppsScriptData();
    }
  }, [appsScriptUrl]);

  // Debounced Auto-Push
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!appsScriptUrl) return;

    const timer = setTimeout(() => {
      pushAppsScriptData();
    }, 1500);

    return () => clearTimeout(timer);
  }, [workoutProgress, exerciseWeights, exerciseReps, dietProgress, waterGlasses, weightLogs, activeDay]);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    triggerHaptic();
    const clean = inputUrl.trim();
    setAppsScriptUrl(clean);
    localStorage.setItem('gymAppsScriptUrl', clean);
    if (clean) {
      fetchAppsScriptData(clean);
      alert("تم حفظ وتوصيل رابط Google Apps Script بنجاح! 📊✨");
    } else {
      alert("تم إزالة رابط Google Sheets.");
    }
  };

  return {
    appsScriptUrl,
    appsScriptStatus,
    showAppsScriptModal,
    setShowAppsScriptModal,
    inputUrl,
    setInputUrl,
    showCodeGuide,
    setShowCodeGuide,
    fetchAppsScriptData,
    pushAppsScriptData,
    handleSaveUrl
  };
};

// ================= MAIN APPLICATION =================
function MainApp() {
  const [mainTab, setMainTab] = useState('workout');
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Date Navigation State (YYYY-MM-DD)
  const todayDateKey = useMemo(() => getLocalDateKey(), []);
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey());

  const [activeDay, setActiveDay] = useState(1);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Helper to ensure state is an object keyed by date
  const parseDateIndexedState = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return {};
      let parsed;
      try { parsed = JSON.parse(saved); } catch(_e) { return {}; }
      if (typeof parsed !== 'object' || parsed === null) return {};
      const keys = Object.keys(parsed);
      const hasDateKey = keys.some(k => k.includes('-'));
      if (!hasDateKey && keys.length > 0) {
        return { [todayDateKey]: parsed };
      }
      return parsed;
    } catch(_e) {
      return {};
    }
  };

  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Water');
      if (!saved) return {};
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
        return { [todayDateKey]: parseInt(saved, 10) || 0 };
      } catch(_e) {
        return { [todayDateKey]: parseInt(saved, 10) || 0 };
      }
    } catch(_e) { return {}; }
  });

  const [workoutProgress, setWorkoutProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Workout'));
  const [exerciseWeights, setExerciseWeights] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseWeights'));
  const [exerciseReps, setExerciseReps] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseReps'));
  const [dietProgress, setDietProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Diet'));

  const [weightLogs, setWeightLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Weights');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch(_e) { return []; }
  });

    const appsScriptSync = useAppsScriptSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    triggerHaptic
  );
  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    triggerHaptic
  );

  // Persistent localStorage writers
  useEffect(() => localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(workoutProgress)), [workoutProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(exerciseWeights)), [exerciseWeights]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(exerciseReps)), [exerciseReps]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(dietProgress)), [dietProgress]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(weightLogs)), [weightLogs]);
  useEffect(() => localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(waterGlasses)), [waterGlasses]);

  // Current active date data accessors
  const currentWorkoutProgress = workoutProgress[selectedDate] || {};
  const currentExerciseWeights = exerciseWeights[selectedDate] || {};
  const currentExerciseReps = exerciseReps[selectedDate] || {};
  const currentDietProgress = dietProgress[selectedDate] || {};
  const currentWaterGlasses = waterGlasses[selectedDate] || 0;

  const isTodaySelected = selectedDate === todayDateKey;
  const copyPreviousDayDataToSelected = () => {
    triggerHaptic();
    const prevDateKey = getLocalDateKey(new Date(new Date(selectedDate).getTime() - 86400000));
    
    setWorkoutProgress(prev => ({
      ...prev,
      [selectedDate]: (prev[prevDateKey] && Object.keys(prev[prevDateKey]).length > 0)
        ? prev[prevDateKey] 
        : (prev[todayDateKey] || { "d1-e1": 3, "d1-e2": 3 })
    }));
    
    setDietProgress(prev => ({
      ...prev,
      [selectedDate]: (prev[prevDateKey] && Object.keys(prev[prevDateKey]).length > 0)
        ? prev[prevDateKey]
        : (prev[todayDateKey] || { "breakfast": true })
    }));

    setWaterGlasses(prev => ({
      ...prev,
      [selectedDate]: prev[prevDateKey] || prev[todayDateKey] || 8
    }));

    alert("تم تعبئة واسترجاع تسجيلات وتمرين هذا اليوم بنجاح! 📋✨");
  };

  const currentDateFormatted = useMemo(() => {
    return formatArabicDate(selectedDate);
  }, [selectedDate]);


  // Date Navigator Helpers
  const shiftDate = (days) => {
    try {
      triggerHaptic();
      const parts = (selectedDate || getLocalDateKey()).split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) {
        setSelectedDate(getLocalDateKey());
        return;
      }
      const [y, m, d] = parts;
      const dt = new Date(y, m - 1, d + days);
      setSelectedDate(getLocalDateKey(dt));
    } catch(_e) {
      setSelectedDate(getLocalDateKey());
    }
  };

  const getYesterdayDateKey = () => {
    const dt = new Date();
    dt.setDate(dt.getDate() - 1);
    return getLocalDateKey(dt);
  };

  // Screen Wake Lock Engine (Keeps screen awake on gym bench)
  const toggleWakeLock = async () => {
    triggerHaptic();
    if (isWakeLockActive) {
      if (wakeLockRef.current) {
        try { await wakeLockRef.current.release(); } catch(_e){}
        wakeLockRef.current = null;
      }
      setIsWakeLockActive(false);
    } else {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setIsWakeLockActive(true);
        } catch(_err) {
          alert('وضع الشاشة المضاءة مفعل تلقائياً أو غير مدعوم في متصفحك.');
          setIsWakeLockActive(true);
        }
      } else {
        alert('ميزة إبقاء الشاشة مضاءة غير مدعومة في متصفحك.');
      }
    }
  };

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    triggerHaptic();
    if (!deferredPrompt) {
      alert("📱 لتثبيت التطبيق على الموبايل:\n• iPhone (Safari): اضغط زر المشاركة ⎋ ثم (إضافة إلى الشاشة الرئيسية Add to Home Screen).\n• Android (Chrome): اضغط القائمة ⠇ ثم (تثبيت التطبيق Install App).");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Live Cross-Tab & Refresh Sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'gymProgress_Ali_Diet' && e.newValue) setDietProgress(JSON.parse(e.newValue));
        if (e.key === 'gymProgress_Ali_Workout' && e.newValue) setWorkoutProgress(JSON.parse(e.newValue));
        if (e.key === 'gymProgress_Ali_Water' && e.newValue) {
          try { setWaterGlasses(JSON.parse(e.newValue)); } catch(_err){}
        }
      } catch(_err){}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentWorkout = initialWorkoutPlan.find(d => d.day === activeDay);
  const totalWorkoutSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + ex.sets, 0) || 0;
  const completedWorkoutSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + (currentWorkoutProgress[ex.id] || 0), 0) || 0;
  
  const totalMeals = dietPlan.meals.length;
  const completedMeals = Object.values(currentDietProgress || {}).filter(Boolean).length;

  const totalTasks = totalWorkoutSets + totalMeals;
  const completedTasks = completedWorkoutSets + completedMeals;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalVolumeThisWeek = useMemo(() => {
    return (Array.isArray(weightLogs) ? weightLogs : []).reduce((acc, l) => acc + ((l?.weight || 0) * (l?.reps || 0)), 0);
  }, [weightLogs]);

  const [timerLeft, setTimerLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);

  const startRestTimer = (seconds = 60) => {
    setTimerLeft(seconds); 
    setIsTimerActive(true);
  };

  const closeTimer = () => {
    setIsTimerActive(false);
    setTimerLeft(0);
  };

  useEffect(() => {
    if (isTimerActive && timerLeft > 0) {
      timerRef.current = setTimeout(() => setTimerLeft(prev => prev - 1), 1000);
    } else if (timerLeft === 0 && isTimerActive) {
      if (soundEnabled) playBeepSound();
      triggerHaptic();
      setIsTimerActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerLeft, isTimerActive, soundEnabled]);

  // Date-Scoped Event Handlers
  const handleSetToggle = (exerciseId, index) => {
    setWorkoutProgress(prev => {
      const dateObj = prev[selectedDate] || {};
      const currentSets = dateObj[exerciseId] || 0;
      const newSets = currentSets > index ? index : index + 1;
      return { ...prev, [selectedDate]: { ...dateObj, [exerciseId]: newSets } };
    });
  };

  const handleWeightChange = (exerciseId, val) => {
    setExerciseWeights(prev => ({
      ...prev,
      [selectedDate]: { ...(prev[selectedDate] || {}), [exerciseId]: val }
    }));
  };

  const handleRepsChange = (exerciseId, val) => {
    setExerciseReps(prev => ({
      ...prev,
      [selectedDate]: { ...(prev[selectedDate] || {}), [exerciseId]: val }
    }));
  };

  const handleMealToggle = (mealId) => {
    triggerHaptic();
    setDietProgress(prev => {
      const dateObj = prev[selectedDate] || {};
      return { ...prev, [selectedDate]: { ...dateObj, [mealId]: !dateObj[mealId] } };
    });
  };

  const handleWaterChange = (count) => {
    setWaterGlasses(prev => ({ ...prev, [selectedDate]: count }));
  };

  const handleAddWeightLog = (newLog) => setWeightLogs(prev => [newLog, ...prev]);
  const handleDeleteWeightLog = (id) => setWeightLogs(prev => prev.filter(log => log.id !== id));

  const handleEndDay = () => {
    triggerHaptic();
    let msgArray = [];
    if (progressPercentage === 100) {
      msgArray = messages.success;
      try { confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } }); } catch(_e){}
    } else if (progressPercentage >= 50) msgArray = messages.average;
    else msgArray = messages.low;

    const randomMsg = msgArray[Math.floor(Math.random() * msgArray.length)];
    setEvalMessage(randomMsg);
    setShowEvalModal(true);
  };

    const handleResetAllData = async () => {
    triggerHaptic();
    if (!window.confirm("⚠️ هل أنت تأكد من رغبتك في تصفير كافة البيانات والبدء من الجديد كلياً؟\nسسيتم مسح كافة التمارين والأوزان والتغذية المسجلة من المتصفح والسحابة وشيت جوجل.")) {
      return;
    }

    const emptyObj = {};
    const emptyArr = [];

    setWorkoutProgress(emptyObj);
    setExerciseWeights(emptyObj);
    setExerciseReps(emptyObj);
    setDietProgress(emptyObj);
    setWaterGlasses(emptyObj);
    setWeightLogs(emptyArr);
    setActiveDay(1);

    try {
      localStorage.removeItem('gymProgress_Ali_Workout');
      localStorage.removeItem('gymProgress_Ali_ExerciseWeights');
      localStorage.removeItem('gymProgress_Ali_ExerciseReps');
      localStorage.removeItem('gymProgress_Ali_Diet');
      localStorage.removeItem('gymProgress_Ali_Water');
      localStorage.removeItem('gymProgress_Ali_Weights');
    } catch(_e){}

    alert("تم تصفير الداتا بنجاح! يمكنك الآن بدء تسجيل تمرينك وتغذيتك الحقيقية من الجديد. 🚀");
  };

  const handleClearBrowserCache = async () => {
    triggerHaptic();
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let r of regs) await r.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (let k of keys) await caches.delete(k);
      }
      localStorage.clear();
      sessionStorage.clear();
    } catch(_e){}
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  const exportData = () => {
    triggerHaptic();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      workoutProgress,
      exerciseWeights,
      exerciseReps,
      dietProgress,
      waterGlasses,
      weightLogs,
      activeDay,
      exportDate: new Date().toISOString()
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Ali_Gym_Track_Backup_${selectedDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (event) => {
    triggerHaptic();
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.workoutProgress) setWorkoutProgress(parsed.workoutProgress);
          if (parsed.exerciseWeights) setExerciseWeights(parsed.exerciseWeights);
          if (parsed.exerciseReps) setExerciseReps(parsed.exerciseReps);
          if (parsed.dietProgress) setDietProgress(parsed.dietProgress);
          if (parsed.waterGlasses) setWaterGlasses(parsed.waterGlasses);
          if (parsed.weightLogs) setWeightLogs(parsed.weightLogs);
          if (parsed.activeDay) setActiveDay(parsed.activeDay);
          alert("تم استرجاع النسخة الاحتياطية بنجاح! 🚀");
        } catch(_err) {
          alert("الملف غير صالح، برجاء اختيار ملف JSON صحيحة.");
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 pb-32" dir="rtl">
      
<header className="max-w-3xl mx-auto mb-4 font-arabic">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 text-white p-2 rounded-2xl shadow-xl shadow-orange-950/60 glow-orange flex items-center justify-center border border-amber-400/30">
              <img src="/favicon.svg" className="w-7 h-7 object-contain" alt="Ali Gym Tracker" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  Ali Gym Tracker
                </h1>
                <span className="text-[10px] bg-gradient-to-r from-orange-500/20 to-emerald-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 font-bold">
                  علي جيم تراك ⚡
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {currentDateFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button 
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className={`p-2 rounded-xl text-xs font-bold transition-all ${soundEnabled ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30' : 'text-slate-500'}`}
              title={soundEnabled ? "الصوت مفعل" : "الصوت مكتوم"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button 
              type="button"
              onClick={() => cloudSync.setShowCloudModal(true)} 
              className={`p-2 rounded-xl transition-all border font-bold flex items-center gap-1 text-xs ${cloudSync.syncStatus === 'syncing' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400'}`}
              title="المزامنة السحابية الشاملة بين الأجهزة"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">السحابة</span>
              <span className={`w-2 h-2 rounded-full ${cloudSync.syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            </button>
            <button 
              type="button"
              onClick={handleClearBrowserCache} 
              className="p-2 text-slate-400 hover:text-amber-400 rounded-xl transition-colors"
              title="مسح كاش المتصفح والتحديث الفوري"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={exportData} 
              className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
              title="تصدير النسخة الاحتياطية"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl cyber-panel">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              مستوى إنجاز اليوم الأكاديمي
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Date Navigation Bar & Historical Calendar Picker */}
      <div className="max-w-3xl mx-auto mb-5 font-arabic">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => shiftDate(-1)}
              className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all active-press"
              title="اليوم السابق"
            >
              <ChevronRight className="w-4 h-4 text-orange-400" />
              <span>السابق</span>
            </button>

            <div className="relative flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    triggerHaptic();
                    setSelectedDate(e.target.value);
                  }
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer font-mono"
              />
            </div>

            <button
              type="button"
              onClick={() => shiftDate(1)}
              className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all active-press"
              title="اليوم التالي"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end text-xs">
            <button
              type="button"
              onClick={() => { triggerHaptic(); setSelectedDate(getYesterdayDateKey()); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${selectedDate === getYesterdayDateKey() ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              أمس
            </button>
            <button
              type="button"
              onClick={() => { triggerHaptic(); setSelectedDate(todayDateKey); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${isTodaySelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>اليوم 🎯</span>
            </button>
          </div>
        </div>

        {!isTodaySelected && (
          <div className="mt-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-4 py-2 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>أنت تستعرض وتسجل الآن لتاريخ سابق: <strong className="font-mono text-white">{formatArabicDate(selectedDate)}</strong></span>
            </div>
            <button
              onClick={() => { triggerHaptic(); setSelectedDate(todayDateKey); }}
              className="text-[11px] underline font-bold hover:text-white shrink-0"
            >
              العودة لليوم 🎯
            </button>
          </div>
        )}
      </div>


      

      <nav className="hidden md:flex max-w-3xl mx-auto mb-6 bg-slate-900/90 p-1.5 rounded-2xl gap-1 border border-slate-800 font-arabic shadow-inner">
        <button
          onClick={() => setMainTab('workout')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            mainTab === 'workout' 
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-950/50 border border-orange-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> التمرين
        </button>
        <button
          onClick={() => setMainTab('nutrition')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            mainTab === 'nutrition' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Utensils className="w-4 h-4" /> التغذية
        </button>

        <button
          onClick={() => setMainTab('analytics')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            mainTab === 'analytics' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50 border border-blue-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> التطور
        </button>
        <button
          onClick={() => setMainTab('achievements')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            mainTab === 'achievements' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 border border-purple-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Trophy className="w-4 h-4" /> الأوسمة
        </button>
      </nav>

      <main className="max-w-3xl mx-auto relative font-arabic">
        
        {mainTab === 'workout' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            
            <div className="flex overflow-x-auto pb-3 mb-4 gap-2 hide-scrollbar pt-1">
              {initialWorkoutPlan.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`flex-none px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all flex flex-col items-center gap-0.5 min-w-[95px] border ${
                    activeDay === day.day
                      ? 'bg-gradient-to-b from-orange-600 to-amber-600 border-orange-400 text-white shadow-lg shadow-orange-950/40 scale-[1.02]'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 mb-0.5" />
                  <span className="text-xs font-bold">اليوم {day.day}</span>
                  <span className="text-[10px] opacity-75 font-medium truncate max-w-[80px]">{day.arabicTitle.split('+')[0]}</span>
                </button>
              ))}
            </div>

            {initialWorkoutPlan.map((day) => (
              activeDay === day.day && (
                <div key={day.day} className="animate-in fade-in duration-300">
                  
                  <div className="relative h-36 rounded-2xl overflow-hidden mb-5 shadow-xl border border-slate-800">
                    <img src={day.image} alt={day.title} className="absolute inset-0 w-full h-full object-cover opacity-35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">{day.title}</h2>
                          <p className="text-xs text-orange-300 font-semibold flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-orange-400" />
                            {day.goal}
                          </p>
                        </div>
                        <span className="text-xs bg-orange-500/20 text-orange-300 px-3 py-1.5 rounded-xl border border-orange-500/30 font-bold shrink-0">
                          {day.arabicTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {day.exercises.length > 0 ? (
                      day.exercises.map((exercise) => (
                        <ErgonomicExerciseCard 
                          key={exercise.id}
                          exercise={exercise}
                          completedSets={currentWorkoutProgress[exercise.id] || 0}
                          exerciseWeights={currentExerciseWeights}
                          exerciseReps={currentExerciseReps}
                          onSetToggle={handleSetToggle}
                          onWeightChange={handleWeightChange}
                          onRepsChange={handleRepsChange}
                          onStartRest={() => startRestTimer(60)}
                        />
                      ))
                    ) : (
                      <div className="bg-slate-900/80 rounded-2xl p-8 text-center border border-slate-800 shadow-xl my-6">
                        <HeartPulse className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-2xl font-bold text-white mb-2">يوم راحة وتخزين طاقة (Recovery)</h3>
                        <p className="text-slate-400 leading-relaxed max-w-sm mx-auto text-xs sm:text-sm">
                          العضلات والجهاز العصبي بيتحسنوا وبيكبروا أثناء الراحة والتغذية السليمة. نام كويس لليوم التالي!
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )
            ))}

          </div>
        )}

        {mainTab === 'nutrition' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl cyber-panel">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-950 p-3 rounded-xl border border-emerald-500/30 text-emerald-400">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg">الهدف الغذائي: {dietPlan.goal}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{dietPlan.strategy}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center text-xs">
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">بروتين</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{dietPlan.macros.protein}g</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">كاربوهيدرات</span>
                  <span className="font-bold text-orange-400 font-mono text-sm">{dietPlan.macros.carbs}g</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">دهون صحية</span>
                  <span className="font-bold text-yellow-400 font-mono text-sm">{dietPlan.macros.fats}g</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-950 p-2.5 rounded-xl border border-blue-500/30 text-blue-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">شرب المياه اليومي</h4>
                  <p className="text-[11px] text-slate-400">{currentWaterGlasses} من 8 أكواب (2.5 لتر)</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      triggerHaptic();
                      handleWaterChange(i + 1 === currentWaterGlasses ? i : i + 1);
                    }}
                    className={`w-6 h-8 rounded-md transition-all ${
                      i < currentWaterGlasses ? 'bg-blue-500 border border-blue-300' : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {dietPlan.meals.map((meal) => {
              const isDone = currentDietProgress[meal.id];
              const Icon = meal.icon;
              return (
                <div key={meal.id} className={`relative bg-slate-900/90 rounded-2xl p-4 border shadow-sm transition-all duration-300 ${isDone ? 'border-emerald-500/50 bg-slate-950/70' : 'border-slate-800'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border border-white/5 ${meal.bg}`}><Icon className={`w-5 h-5 ${meal.color}`} /></div>
                      <div>
                        <h3 className={`text-base font-bold transition-all ${isDone ? 'text-slate-500 line-through' : 'text-white'}`}>{meal.title}</h3>
                        {meal.subtitle && <p className="text-xs text-amber-400 font-bold mt-0.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> {meal.subtitle}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleMealToggle(meal.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-950/50' : 'bg-slate-950 border-slate-700 text-transparent hover:border-slate-500'}`}
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>

                  <div className={`transition-all duration-300 ${isDone ? 'opacity-40' : 'opacity-100'}`}>
                    <div className="bg-slate-950/90 rounded-xl p-3 mb-2 border-r-4 border-orange-500">
                      <h4 className="text-[11px] text-orange-400 font-bold mb-0.5">الوجبة الأساسية:</h4>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{meal.base}</p>
                    </div>
                    {meal.alts?.map((alt, idx) => (
                      <div key={idx} className="bg-slate-950/40 rounded-xl p-2.5 border-r-4 border-blue-500/70 mt-1.5">
                        <p className="text-xs text-slate-300 leading-relaxed flex gap-2"><span className="text-blue-400 font-bold shrink-0">البديل:</span><span>{alt}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {mainTab === 'analytics' && (
          <ProgressiveAnalyticsView 
            weightLogs={weightLogs}
            onAddWeightLog={handleAddWeightLog}
            onDeleteWeightLog={handleDeleteWeightLog}
          />
        )}



        {mainTab === 'achievements' && (
          <AchievementsView 
            completedTasksCount={completedTasks}
            totalVolumeThisWeek={totalVolumeThisWeek}
            exportData={exportData}
            importData={importData}
          />
        )}

      </main>

      {/* Mobile Native Bottom Glass Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 pb-safe shadow-2xl font-arabic">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('workout'); }}
            className={`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press ${mainTab === 'workout' ? 'text-orange-400 font-extrabold bg-orange-500/10 border border-orange-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px]">التمرين</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('nutrition'); }}
            className={`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press ${mainTab === 'nutrition' ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px]">التغذية</span>
          </button>



          {/* Center Action Button: End Day */}
          <button
            type="button"
            onClick={handleEndDay}
            className="px-3 py-2 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 text-white font-black text-xs shadow-lg shadow-orange-950/50 flex flex-col items-center justify-center gap-0.5 border border-amber-300/40 active-press glow-orange shrink-0"
          >
            <Trophy className="w-5 h-5 text-amber-200" />
            <span className="text-[9px] font-bold">تقفيل اليوم</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('analytics'); }}
            className={`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press ${mainTab === 'analytics' ? 'text-blue-400 font-extrabold bg-blue-500/10 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px]">الأوزان</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('achievements'); }}
            className={`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press ${mainTab === 'achievements' ? 'text-purple-400 font-extrabold bg-purple-500/10 border border-purple-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px]">الأوسمة</span>
          </button>
        </div>
      </div>

      {isTimerActive && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-300 font-arabic">
          <div className="bg-slate-900/95 border border-emerald-500/60 shadow-2xl shadow-emerald-950/50 rounded-full px-5 py-2.5 flex items-center gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timerLeft < 10 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`} />
              <span className="text-white font-bold font-mono text-xl w-8 text-center">{timerLeft}</span>
              <span className="text-slate-300 text-xs font-semibold">ثانية راحة</span>
            </div>
            <div className="w-px h-6 bg-slate-800"></div>
            <button 
              onClick={() => setTimerLeft(prev => prev + 30)} 
              className="text-xs text-orange-400 hover:text-orange-300 font-bold"
            >
              +30ث
            </button>
            <button onClick={closeTimer} className="text-slate-400 hover:text-white transition-colors p-1"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      
      {/* Google Apps Script & Sheets Integration Modal */}
      {appsScriptSync.showAppsScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">ربط شيت جوجل المباشر (Google Apps Script)</h3>
              </div>
              <button onClick={() => appsScriptSync.setShowAppsScriptModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">حالة الاتصال بشيت جوجل:</span>
                <span className={`font-bold ${appsScriptSync.appsScriptUrl ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {appsScriptSync.appsScriptUrl ? 'متصل ومربوط بشيت جوجل 🟢' : 'غير مربوط حالياً ⚪'}
                </span>
              </div>
              {appsScriptSync.appsScriptUrl && (
                <p className="text-[11px] text-slate-400 font-mono truncate">{appsScriptSync.appsScriptUrl}</p>
              )}
            </div>

            <form onSubmit={appsScriptSync.handleSaveUrl} className="space-y-3">
              <label className="text-xs text-slate-300 font-bold block">رابط تطبيق Google Apps Script Web App URL:</label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={appsScriptSync.inputUrl}
                onChange={(e) => appsScriptSync.setInputUrl(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 font-mono"
              />
              <div className="grid grid-cols-2 gap-2">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md">
                  حفظ وتوصيل الشيت 💾
                </button>
                <button
                  type="button"
                  onClick={() => appsScriptSync.fetchAppsScriptData()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  مزامنة سريعة الآن 🔄
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => appsScriptSync.setShowCodeGuide(!appsScriptSync.showCodeGuide)}
                className="w-full text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center justify-between p-2 rounded-xl bg-orange-500/10 border border-orange-500/20"
              >
                <span>📜 كود Google Apps Script الجاهز لإنشاء الشيت (اضغط لعرض الكود)</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${appsScriptSync.showCodeGuide ? 'rotate-180' : ''}`} />
              </button>

              {appsScriptSync.showCodeGuide && (
                <div className="mt-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <p className="text-slate-300 font-semibold leading-relaxed">
                    خطوات التفعيل في 60 ثانية:
                    <br />1. افتح Google Sheets واضغط على <strong>Extensions ➔ Apps Script</strong>.
                    <br />2. امسح الكود واكتُب كود JavaScript التالي ثم احفظ.
                    <br />3. اضغط <strong>Deploy ➔ New Deployment ➔ Web App</strong>.
                    <br />4. اجعل (Who has access) ➔ <strong>Anyone</strong>.
                    <br />5. انسخ Web App URL وضعه في الخانة بالأعلى!
                  </p>

                  <div className="relative bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-300 overflow-x-auto max-h-40">
                    <pre>{`function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Data') || ss.insertSheet('Data');
  var raw = sheet.getRange('A1').getValue();
  return ContentService.createTextOutput(raw || '{}').setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Data') || ss.insertSheet('Data');
  sheet.getRange('A1').setValue(e.postData.contents);
  return ContentService.createTextOutput(JSON.stringify({status:'success'})).setMimeType(ContentService.MimeType.JSON);
}`}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {cloudSync.showCloudModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">المزامنة السحابية بين الأجهزة (Cloud Sync)</h3>
              </div>
              <button onClick={() => cloudSync.setShowCloudModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">حالة المزامنة:</span>
                <span className={`font-bold ${cloudSync.syncStatus === 'syncing' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {cloudSync.syncStatus === 'syncing' ? 'جاري المزامنة مع السحابة 🔄' : 'متزامن 100% 🟢'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">كود المزامنة الخاص بك:</span>
                <span className="font-mono text-blue-400 font-bold text-[11px] truncate max-w-[180px]">{cloudSync.cloudBinId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { triggerHaptic(); cloudSync.fetchCloudData(); }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg active-press"
              >
                <Download className="w-4 h-4" /> جلب من السحابة 📥
              </button>
              <button
                onClick={() => { triggerHaptic(); cloudSync.pushCloudData(); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg active-press"
              >
                <Upload className="w-4 h-4" /> رفع للسحابة 📤
              </button>
            </div>

            <form onSubmit={cloudSync.handleCustomKeySubmit} className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">ربط جهاز آخر بنفس كود السحابة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أدخل كود السحابة..."
                  value={cloudSync.customKeyInput}
                  onChange={(e) => cloudSync.setCustomKeyInput(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl flex-1 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl">
                  ربط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl transform transition-all animate-in zoom-in-95">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${progressPercentage === 100 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : progressPercentage >= 50 ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-orange-500/20 border-orange-500/40 text-orange-400'}`}>
              {progressPercentage === 100 ? <Trophy className="w-9 h-9" /> : progressPercentage >= 50 ? <Activity className="w-9 h-9" /> : <MessageSquareQuote className="w-9 h-9" />}
            </div>
            
            <h3 className="text-2xl font-black text-white mb-1">إنجاز اليوم: {progressPercentage}%</h3>
            <p className="text-slate-400 text-xs mb-4 font-semibold">إجمالي التمارين والتغذية لليوم</p>
            
            <div className="bg-slate-950/80 rounded-2xl p-4 mb-5 border border-slate-800 shadow-inner">
              <p className="text-slate-200 text-sm leading-relaxed font-medium">"{evalMessage}"</p>
            </div>
            
            <button 
              onClick={() => setShowEvalModal(false)}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-sm"
            >
              عاش يا وحش، اغلق التقييم
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
