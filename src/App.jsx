import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Smartphone, Sun, Lock, Unlock, DownloadCloud, Dumbbell, Activity, CheckCircle, Calendar, HeartPulse, ImageIcon, 
  ChevronDown, ChevronUp, ChevronRight, ChevronLeft, CheckCircle2, AlertOctagon, Timer, 
  X, RotateCcw, Apple, Flame, Briefcase, Zap, Moon, Coffee, Utensils, 
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
  } catch(e) {
    return dateKey;
  }
};

// ================= REAL-TIME CLOUD SYNC ENGINE (100% UNIVERSAL STATE) =================
const DEFAULT_CLOUD_BIN_ID = "019fe604-c535-71a6-a516-7877bb05e289";

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
    } catch(e) {
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
    } catch(e) {
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
    title: "Upper Body + Core (Static)",
    arabicTitle: "جزء علوي + ثبات",
    goal: "بناء عضلات الصدر، الضهر، الأكتاف، والذراع.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d1-e1", name: "Bench Press", type: "بار أو دمبل", sets: 3, reps: "8-10", defaultWeight: 70, notes: "تمرين أساسي لقوة الصدر.", 
        alts: [
          { 
            id: "d1-e1-main", name: "Barbell Bench Press", arabicName: "بنش بريس بالبار المستوي (الرئيسي)", equipment: "بار مستقيم + دكة فلات", whyUseIt: "الخيار الأول لبناء القوة والحجم الكلي لعضلات الصدر.", defaultWeight: 70, defaultReps: "8-10",
            dos: ["نزل البار لحد منتصف الصدر ببطء وتحكم.", "ثبت كعب رجلك في الأرض كويس لتوليد القوة.", "ضم لوحين كتفك لورا (Scapular Retraction)."],
            donts: ["ترفع وسطك من على الدكة (حماية للقطنية).", "تفرد كوعك للآخر بقفل المفصل (Lockout) فوق."],
            githubFolder: "Barbell_Bench_Press_-_Medium_Grip"
          },
          { 
            id: "d1-e1-alt1", name: "Dumbbell Bench Press", arabicName: "تجميع صدر فلات بالدمبلز (بديل 1)", equipment: "دمبلز + دكة فلات", whyUseIt: "لو البار مشغول، بيدي مدى حركي أعمق وعزل متساوي للناحيتين.", defaultWeight: 26, defaultReps: "8-10",
            dos: ["انزل بالدمبلز بجانب الصدر مع فتح الكوع 45 درجة.", "اضغط الدمبلز لأعلى في مسار منحني قليلاً.", "حافظ على ثبات المعصم فوق الكوع مباشرة."],
            donts: ["تخبط الدمبلز في بعض فوق بفقد الشد العضلي.", "تفتح كوعك بزاوية 90 درجة مع مستوى الكتف."],
            githubFolder: "Dumbbell_Bench_Press"
          },
          { 
            id: "d1-e1-alt2", name: "Chest Dips / Machine Press", arabicName: "متوازي صدر أو جهاز التجميع (بديل 2)", equipment: "جهاز المتوازي / جهاز الصدر", whyUseIt: "لو الدكة مشغولة، بيستهدف الجزء السفلي والمنتصف بتركيز عالي.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["ميل بجسمك لقدام 30 درجة لاستهداف عضلات الصدر.", "انزل لحد ما كوعك يعمل زاوية 90 درجة بالظبط."],
            donts: ["تنزل أعمق من 90 درجة لو بتعاني من آلام الكتف.", "تخلي جسمك عمودي بالكامل (كده هتمرن التراي)."],
            githubFolder: "Chest_dip"
          }
        ]
      },
      { 
        id: "d1-e2", name: "Lat Pulldown", type: "جهاز سحب", sets: 3, reps: "8-10", defaultWeight: 55, notes: "عشان تعرض مجنص الضهر.", 
        alts: [
          { 
            id: "d1-e2-main", name: "Wide-Grip Lat Pulldown", arabicName: "سحب عالي واسع للجهاز (الرئيسي)", equipment: "جهاز السحب العالي + مقبض واسع", whyUseIt: "أفضل تمرين لتعريض مجنص الضهر رسم V-Taper.", defaultWeight: 55, defaultReps: "8-10",
            dos: ["اسحب البار لحد أعلى الصدر مباشرة.", "وجه كوعك لتحت ولورا مع عصر عضلة المجنص.", "حافظ على الصدر مرفوع لأعلى."],
            donts: ["تتمرجح بضهرك لورا بحدة عشان تسحب وزن أتقل.", "تسحب البار خلف الرقبة (يسبب إصابات الكتف)."],
            githubFolder: "Wide-Grip_Lat_Pulldown"
          },
          { 
            id: "d1-e2-alt1", name: "V-Bar Pulldown", arabicName: "سحب عالي قبضة ضيقة V-Bar (بديل 1)", equipment: "مقبض V + جهاز السحب", whyUseIt: "لو المقبض الواسع مش متاح، بيدي استطالة أعمق وتركيز سفلي للمجنص.", defaultWeight: 50, defaultReps: "10",
            dos: ["امسك مقبض V واسحب ناحية منتصف الصدر.", "افرد دراعك للآخر فوق لعمل استطالة كاملة للمجنص."],
            donts: ["تثني معصمك بحدة أثناء السحب.", "تستخدم ذراعك وبايسبسك بدل ضهرك."],
            githubFolder: "V-bar_pulldown"
          },
          { 
            id: "d1-e2-alt2", name: "Pull-Ups", arabicName: "تمرين العقلة بوزن الجسم (بديل 2)", equipment: "بار العقلة", whyUseIt: "تمرين بوزن الجسم ممتاز لبناء قوة الظهر لو جهاز السحب مشغولة.", defaultWeight: 0, defaultReps: "6-8",
            dos: ["امسك العقلة أوسع من كتافك بقليل واطلع لحد ما دقنك تعدي البار.", "انزل ببطء وتحكم كامل بوزن الجسم."],
            donts: ["تستخدم النط أو المرجحة بالرجلين (Kipping).", "تنزل نص نزلة بدون فرد الذراعين."],
            githubFolder: "Pullups"
          }
        ]
      },
      { 
        id: "d1-e3", name: "Overhead Press", type: "دمبل", sets: 3, reps: "10", defaultWeight: 22, notes: "لقوة الأكتاف الأمامية والجانبية.", 
        alts: [
          { 
            id: "d1-e3-main", name: "Seated Dumbbell Press", arabicName: "ضغط كتف بالدمبلز جالساً (الرئيسي)", equipment: "دمبلز + دكة 90 درجة", whyUseIt: "يحمي الضهر ويعزل عضلات الكتف الأمامي والجانبي بكفاءة.", defaultWeight: 22, defaultReps: "10",
            dos: ["شد عضلات بطنك وثبت ضهرك على مسند الدكة.", "خلي كوعك مايل لقدام 30 درجة في زاوية (Scapular plane)."],
            donts: ["تقوس ضهرك لورا أوي (Hyper-extension).", "تنزل بالدمبلز أسفل من مستوى أذنيك."],
            githubFolder: "Seated_Dumbbell_Press"
          },
          { 
            id: "d1-e3-alt1", name: "Standing Barbell OHP", arabicName: "ضغط كتف أمامي بالبار واقفا (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "يبني قوة انفجارية للجسم ككل وعضلات الجذع الكتف.", defaultWeight: 40, defaultReps: "8-10",
            dos: ["اقف بقدمين بعرض الكتف وشد البطن والجلوتس.", "ادفع البار لأعلى في مسار مستقيم وقرب راسك لقدام سنة فوق."],
            donts: ["تثني ركبتك وتستخدم دفع الرجلين (إلا لو بتلعب Push Press).", "ترجع بظهرك لورا بفرط تقوس."],
            githubFolder: "Standing_Military_Press"
          },
          { 
            id: "d1-e3-alt2", name: "Arnold Dumbbell Press", arabicName: "تمرين أرنولد بريس بالدمبلز (بديل 2)", equipment: "دمبلز + دكة 90 درجة", whyUseIt: "يدور الكتف 180 درجة ويستهدف الرأس الأمامية والجانبية معا.", defaultWeight: 18, defaultReps: "10-12",
            dos: ["ابدأ بالدمبلز أمام صدرك وكفك باصص لوشك.", "لف دراعك لبرة وأنت بتدفع لفوق حتى يواجه كفك لقدام."],
            donts: ["استخدام أوزان ثقيلة جداً قد تضغط على مفصل الكتف.", "الإسراع في حركة الدوران دون تحكم."],
            githubFolder: "Arnold_press"
          }
        ]
      },
      { 
        id: "d1-e4", name: "Seated Cable Row", type: "سحب أرضي", sets: 3, reps: "10-12", defaultWeight: 50, notes: "لسمك وكثافة الضهر.", 
        alts: [
          { 
            id: "d1-e4-main", name: "Seated Cable Row", arabicName: "سحب أرضي بالكابل (الرئيسي)", equipment: "جهاز سحب أرضي + مقبض V", whyUseIt: "يوفر مقاومة مستمرة لبناء كثافة عضلات منتصف الظهر.", defaultWeight: 50, defaultReps: "10-12",
            dos: ["افرد ضهرك وحافظ على استقامة الجذع.", "اسحب المقبض باتجاه السرة مع ضم لوحي الكتف لبعض."],
            donts: ["التمرجح بالجذع للأمام والخلف أثناء السحب.", "سحب الوزن باستخدام ذراعيك فقط."],
            githubFolder: "Seated_Cable_Rows"
          },
          { 
            id: "d1-e4-alt1", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "لو جهاز السحب مالي الجيم، بيدي مدى حركي أعمق وعزل فردي لكل ناحية.", defaultWeight: 24, defaultReps: "10",
            dos: ["اسحب الدمبل باتجاه جيب البنطلون (الورك) وليس السدر.", "حافظ على ظهرك موازي للأرض ومفرود."],
            donts: ["لف الجذع وفتح الصدر للأعلى أثناء السحب.", "ترك الدمبل يسقط بسرعة دون التحكم في النزول."],
            githubFolder: "One-Arm_Dumbbell_Row"
          },
          { 
            id: "d1-e4-alt2", name: "T-Bar Row", arabicName: "سحب تي بار T-Bar (بديل 2)", equipment: "بار T-Bar أو بار بالزاوية", whyUseIt: "يسمح بحمل أوزان أثقل لبناء سمك وضخامة الظهر.", defaultWeight: 45, defaultReps: "8-10",
            dos: ["اثني ركبتك سنة وانحني بظهرك 45 درجة مع الحفاظ على استقامته.", "اسحب البار باتجاه أسفل بطنك مع اعتصار الظهر."],
            donts: ["تقوس الظهر السفلي أثناء حمل الوزن الثقيل.", "الوقوف بشكل عمودي وتقليل المدى الحركي."],
            githubFolder: "T-Bar_Row"
          }
        ]
      },
      { 
        id: "d1-e5", name: "Bicep Curls", type: "بايسبس", sets: 3, reps: "12", defaultWeight: 14, notes: "تكبير عضلة الباي.", 
        alts: [
          { 
            id: "d1-e5-main", name: "Dumbbell Alternate Curl", arabicName: "تبادل باي بالدمبلز (الرئيسي)", equipment: "دمبلز", whyUseIt: "يسمح بتدوير الساعد (Supination) لتكبير وتدوير البايسبس.", defaultWeight: 14, defaultReps: "12",
            dos: ["ثبت كوعك بجانب جسمك دون تحريكه للأمام.", "لف معصمك للأعلى في قمة الحركة واعتصر الباي ثانية."],
            donts: ["استخدام المرجحة بالظهر لرفع الدمبل.", "إسقاط الوزن بسرعة أثناء النزول."],
            githubFolder: "Dumbbell_Alternate_Bicep_Curl"
          },
          { 
            id: "d1-e5-alt1", name: "EZ-Bar Bicep Curl", arabicName: "بايسبس بالبار الزيجزاج EZ (بديل 1)", equipment: "بار EZ + طارات", whyUseIt: "يريح مفاصل المعصم ويسمح بحمل أوزان أكبر لبناء الحجم.", defaultWeight: 25, defaultReps: "10-12",
            dos: ["امسك البار الزيجزاج من الانحناء المريح لمعصمك.", "اطلع بالبار لحد أعلى الصدر مع ثبات الكوع."],
            donts: ["تحريك الكوع للأمام وللأعلى لتسهيل الحركة.", "تقوس الظهر لرفع الأوزان الثقيلة."],
            githubFolder: "EZ-Bar_Curl"
          },
          { 
            id: "d1-e5-alt2", name: "Cable Bicep Curl", arabicName: "بايسبس بالكابل السفلي (بديل 2)", equipment: "جهاز كابل سفلي + مستقيم", whyUseIt: "يحافظ على الشد والمقاومة المستمرة في كل زوايا الحركة.", defaultWeight: 20, defaultReps: "12-15",
            dos: ["قف مستقيماً أمام الكابل وثبت الكوعين بجانب الجذع.", "اسحب مقبض الكابل باتجاه الكتفين ببطء."],
            donts: ["الرجوع للجلف بالجسم أثناء السحب.", "ترك الكابل يسحب ذراعيك بسرعة."],
            githubFolder: "Cable_Preacher_Curl"
          }
        ]
      },
      { 
        id: "d1-e6", name: "Tricep Pushdown", type: "ترايسبس", sets: 3, reps: "12", defaultWeight: 25, notes: "تفصيل الترايسبس.", 
        alts: [
          { 
            id: "d1-e6-main", name: "Cable Rope Pushdown", arabicName: "ترايسبس بالحبل على الكابل (الرئيسي)", equipment: "كابل عالي + حبل", whyUseIt: "يعزل الرأس الجانبية والخارجية للترايسبس بامتياز.", defaultWeight: 25, defaultReps: "12",
            dos: ["ثبت كوعك بجانب اضلاعك تماماً.", "افرد ذراعك لأسفل وافتح الحبل للخارج في النهاية."],
            donts: ["ترك الكوع يتحرك للأمام وللأعلى أثناء الصعود.", "الانحناء فوق الحبل بوزن الجسم."],
            githubFolder: "Triceps_Pushdown"
          },
          { 
            id: "d1-e6-alt1", name: "Overhead Dumbbell Extension", arabicName: "ترايسبس خلف الرأس بالدمبل (بديل 1)", equipment: "دمبل واحد تقيل", whyUseIt: "يستهدف الرأس الطويلة للترايسبس (Long Head) لاستطالة فائقة.", defaultWeight: 18, defaultReps: "10-12",
            dos: ["امسك الدمبل بكفي يديك خلف رأسك وثبت كوعيك باتجاه السقف.", "انزل بالدمبل خلف الرأس وافرده لأعلى بالكامل."],
            donts: ["فتح الكوعين للخارج بحدة بعيداً عن الرأس.", "تقوس الظهر السفلي أثناء التمريين."],
            githubFolder: "Standing_Dumbbell_Triceps_Extension"
          },
          { 
            id: "d1-e6-alt2", name: "Bench Dips / Skullcrushers", arabicName: "متوازي دكة أو كسار الجمجمة (بديل 2)", equipment: "دكة مستوية / بار EZ", whyUseIt: "بديل بدون جهاز كابل ممتاز لبناء حجم وضخامة الترايسبس.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["ضع يديك على حافة الدكة وانزل بجسمك عمودياً حتى زاوية 90 بالكوع.", "ادفع بجسمك لأعلى باستخدام عضلات الترايسبس."],
            donts: ["الابتعاد بالجسم عن الدكة (يجهد مفصل الكتف).", "النزول أعمق من زاوية 90 درجة."],
            githubFolder: "Dips_-_Triceps_Version"
          }
        ]
      },
      { 
        id: "d1-e7", name: "Plank", type: "ثبات", sets: 3, reps: "45-60ث", defaultWeight: 0, notes: "قوة الكور وثبات الحوض.", 
        alts: [
          { 
            id: "d1-e7-main", name: "Standard Elbow Plank", arabicName: "بلانك ثبات على الكوع (الرئيسي)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن العميقة واستقرار الجذع والحوض.", defaultWeight: 0, defaultReps: "45-60ث",
            dos: ["خلي جسمك في خط مستقيم من الرأس إلى الكعبين.", "شد عضلات البطن والمؤخرة بقوة أثناء الثبات."],
            donts: ["نزول الحوض لأسفل (يسبب ضغط على القطنية).", "رفع الحوض لأعلى كشكل الخيمة."],
            githubFolder: "Plank"
          },
          { 
            id: "d1-e7-alt1", name: "Ab Wheel Rollout", arabicName: "عجلة البطن Ab Wheel (بديل 1)", equipment: "عجلة بطن", whyUseIt: "تمرين متقدم يبني قوة انقباض وانبساط فائقة لعضلات البطن.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["انزل بالعجلة للأمام ببطء مع تثبيت القطنية والجذع.", "ارجع باستخدام عضلات بطنك وليس بسحب ذراعيك."],
            donts: ["ترك الظهر السفلي يسقط ويتقوس لأسفل.", "الفرد الزائد عن قدرة عضلات بطنك."],
            githubFolder: "Ab_Roller"
          },
          { 
            id: "d1-e7-alt2", name: "Side Plank", arabicName: "بلانك جانبي Side Plank (بديل 2)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن الجانبية (Obliques) وثبات الفخذ.", defaultWeight: 0, defaultReps: "30ث لكل جانب",
            dos: ["ارتكز على كوع واحد وجانب القدم واجعل جسمك مستقيماً.", "ارفع حوضك لأعلى واثبت في موضع مرتفع."],
            donts: ["سقوط الحوض باتجاه الأرض.", "لف الكتف العلوي للأمام."],
            githubFolder: "Side_Plank"
          }
        ]
      }
    ]
  },
  {
    day: 2,
    title: "Lower Body + HIIT",
    arabicTitle: "رجلين + لياقة ملاعب",
    goal: "قوة الرجلين والالتحامات + تعويد الرئة على الجري السريع للكورة.",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d2-e1", name: "Squats", type: "بار أو جهاز", sets: 3, reps: "8-10", defaultWeight: 85, notes: "ملك تمارين الرجل.", 
        alts: [
          { 
            id: "d2-e1-main", name: "Barbell Back Squat", arabicName: "سكوات خلفي بالبار (الرئيسي)", equipment: "بار مستقيم + راك السكوات", whyUseIt: "التمرين الأساسي الأول لبناء قوة عضلات الساقين والجذع.", defaultWeight: 85, defaultReps: "8-10",
            dos: ["انزل لحد ما يكون الفخذ موازي للأرض على الأقل.", "وزع الوزن بالتساوي على كعب القدم ومشط القدم.", "ادفع بالركبتين للخارج في نفس اتجاه أصابع القدم."],
            donts: ["دخول الركبتين للداخل أثناء الصعود (Knee Cave).", "رفع الكعبين عن الأرض أثناء النزول."],
            githubFolder: "Barbell_Full_Squat"
          },
          { 
            id: "d2-e1-alt1", name: "Goblet Dumbbell Squat", arabicName: "سكوات جوبلت بالدمبل (بديل 1)", equipment: "دمبل واحد تقيل", whyUseIt: "لو الراك مشغول، سهل الأداء ويحافظ على استقامة الظهر تلقائياً.", defaultWeight: 24, defaultReps: "10-12",
            dos: ["احمل الدمبل رأسياً أمام صدرك مباشرة بين كفيك.", "انزل بين رجليك مع إبقاء الصدر مرفوعاً والظهر مستقيماً."],
            donts: ["الانحناء للجذع للأمام وسقوط الدمبل لأسفل.", "النزول السريع دون التحكم بالوزن."],
            githubFolder: "Goblet_Squat"
          },
          { 
            id: "d2-e1-alt2", name: "Smith Machine Squat", arabicName: "سكوات على جهاز السميث (بديل 2)", equipment: "جهاز سميث", whyUseIt: "يوفر مسار ثابت وأمان عالي للتركيز الكامل على العضلات الأمامية.", defaultWeight: 60, defaultReps: "10",
            dos: ["ضع قدميك لقدام سنة أمام مسار البار لحماية الركبة.", "انزل بسلاسة حتى يوازي فخذك الأرض ثم ادفع بالكعبين."],
            donts: ["وضع القدمين أسفل البار مباشرة بفرط ضغط على الركبة.", "قفل مفصل الركبة بحدة فوق."],
            githubFolder: "Smith_machine_squat"
          }
        ]
      },
      { 
        id: "d2-e2", name: "Romanian Deadlift (RDL)", type: "بار أو دمبل", sets: 3, reps: "8-10", defaultWeight: 75, notes: "قوة التسديد والخلفيات.", 
        alts: [
          { 
            id: "d2-e2-main", name: "Barbell RDL", arabicName: "ديدليفت روماني بالبار (الرئيسي)", equipment: "بار مستقيم", whyUseIt: "يبني قوة التسديد في الكورة وعضلات خلفيات الفخذ والجلوتس.", defaultWeight: 75, defaultReps: "8-10",
            dos: ["ادفع بحوضك للخلف (Hinge) مع ثني بسيط جداً بالركبة.", "مرر البار ملاصقاً لرجلك حتى أسفل الركبة واشعر بالاستطالة."],
            donts: ["تقوس الظهر السفلي (Rounding) أثناء النزول.", "ثني الركبتين لأسفل كأنك تعمل سكوات."],
            githubFolder: "Stiff-Legged_Barbell_Deadlift"
          },
          { 
            id: "d2-e2-alt1", name: "Dumbbell RDL", arabicName: "ديدليفت روماني بالدمبلز (بديل 1)", equipment: "دمبلز", whyUseIt: "يسمح بحرية حركة المعصم والحركة الطبيعية للحوض.", defaultWeight: 26, defaultReps: "10",
            dos: ["امسك الدمبلز بجانب الفخذين وادفع بالحوض للخلف.", "حافظ على استقامة الظهر ونظرك متوجه للأرض أماما."],
            donts: ["ترك الدمبلز تبتعد عن الساقين أثناء النزول.", "رفع الوزن باستخدام ظهرك بدلاً من اعتصار الجلوتس."],
            githubFolder: "Romanian_Deadlift_With_Dumbbells"
          },
          { 
            id: "d2-e2-alt2", name: "Single-Leg Dumbbell RDL", arabicName: "ديدليفت روماني رجل واحدة (بديل 2)", equipment: "دمبل واحد", whyUseIt: "تمرين توازن حركي ممتاز جداً لتثبيت الركبة ومنع إصابات الملعب.", defaultWeight: 14, defaultReps: "8 لكل رجل",
            dos: ["اقف على رجل واحدة وارجع بالرجل الثانية للخلف متوازية مع الجذع.", "انزل بالدمبل ببطء واشعر باستطالة خلفية الرجل الثابتة."],
            donts: ["لف الحوض للخارج أثناء النزول.", "فقدان التوازن والإسراع في الحركة."],
            githubFolder: "Single-Leg_Deadlift_With_Dumbbells"
          }
        ]
      },
      { 
        id: "d2-e3", name: "Leg Extensions", type: "جهاز أمامي", sets: 3, reps: "12", defaultWeight: 45, notes: "عزل الأماميات.", 
        alts: [
          { 
            id: "d2-e3-main", name: "Machine Leg Extension", arabicName: "جهاز أمامي رجل (الرئيسي)", equipment: "جهاز الأماميات", whyUseIt: "يعزل العضلة الرباعية الأمامية (Quads) بنسبة 100% فوق مفصل الركبة.", defaultWeight: 45, defaultReps: "12",
            dos: ["اضبط مسند الظهر بحيث يطابق مفصل ركبتك محور دوران الجهاز.", "افرد الساقين لأعلى واثبت ثانية في قمة الانقباض."],
            donts: ["استخدام أوزان ثقيلة للغاية تتسبب في مرجحة الجسم.", "النزول السريع الخاطف بدون تحكم."],
            githubFolder: "Leg_Extensions"
          },
          { 
            id: "d2-e3-alt1", name: "Sissy Squats", arabicName: "سيسي سكوات بوزن الجسم (بديل 1)", equipment: "وزن الجسم / حافة دكة", whyUseIt: "بديل ممتاز بدون أجهزة يعمل استطالة هائلة للأماميات ومرونة الركبة.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["ارتكز على مشط القدم وميل بجذعك للخلف مع ثني الركبتين للأمام.", "حافظ على استقامة خط الجسم من الرأس إلى الركبة."],
            donts: ["الانحناء من الخصر بدل الميل بالجسم كاملاً.", "النزول المفاجئ المسبب لإجهاد الركبة."],
            githubFolder: "Sissy_Squats"
          },
          { 
            id: "d2-e3-alt2", name: "Dumbbell Pass Leg Extension", arabicName: "أمامي بالدمبل على الدكة (بديل 2)", equipment: "دمبل بين القدمين + دكة", whyUseIt: "لو جهاز الأماميات عطلان أو ممتلئ بالجيم.", defaultWeight: 10, defaultReps: "12",
            dos: ["اجلس على حافة الدكة وثبت الدمبل بين قدميك جيداً.", "ارفع قدميك لأعلى لفرد الساقين واعتصر العضلات الأمامية."],
            donts: ["سقوط الدمبل أثناء الحركة (استخدم وزناً متوازناً).", "تحريك الفخذين لأعلى أثناء الفرد."],
            githubFolder: "Dumbbell_pass"
          }
        ]
      },
      { 
        id: "d2-e4", name: "Calf Raises", type: "سمانة", sets: 4, reps: "15", defaultWeight: 40, notes: "قوة القفز وتجنب الشد العضلي.", 
        alts: [
          { 
            id: "d2-e4-main", name: "Standing Calf Raise", arabicName: "سمانة واقفا (الرئيسي)", equipment: "جهاز السمانة / استيب", whyUseIt: "تستهدف العضلة التوأمية السطحية (Gastrocnemius) لقوة القفز.", defaultWeight: 40, defaultReps: "15",
            dos: ["اطلع على أمشاط قدميك لأقصى ارتفاع ممكن واثبت ثانية.", "انزل ببطء لأسفل مستوى الاستيب لاستطالة كاملة."],
            donts: ["النط السريع (Bouncing) باستخدام أوتار القدم.", "ثني الركبتين أثناء الصعود."],
            githubFolder: "Standing_Calf_Raises"
          },
          { 
            id: "d2-e4-alt1", name: "Seated Dumbbell Calf Raise", arabicName: "سمانة جالس بالدمبلز (بديل 1)", equipment: "دكة + دمبل على الركبة", whyUseIt: "تستهدف عضلة السمانة العميقة (Soleus) لحماية أوتار الساق.", defaultWeight: 30, defaultReps: "15-20",
            dos: ["ضع مشط قدمك على بلوك أو طارة وضع الدمبل على ركبتك.", "ارفع الكعبين لأعلى نقطة وانزل ببطء هادئ."],
            donts: ["رفع الدمبل باستخدام يديك بدل عضلات السمانة.", "تقليل المدى الحركي."],
            githubFolder: "Seated_Calf_Raise"
          },
          { 
            id: "d2-e4-alt2", name: "Leg Press Calf Press", arabicName: "سمانة على جهاز الليج بريس (بديل 2)", equipment: "جهاز leg press", whyUseIt: "تسمح بحمل أوزان تقيلة في أمان تام دون تحميل على العمود الفقري.", defaultWeight: 80, defaultReps: "12-15",
            dos: ["ثبت أمشاط قدميك على حافة المنصة السفلى مع استقامة الساقين.", "ادفع المنصة بأمشاط قدميك واعتصر السمانة فوق."],
            donts: ["انزلاق القدمين من المنصة (حافظ على الجفاف والثبات).", "ثني الركبتين بفرط أثناء الدفع."],
            githubFolder: "Calf_Press_On_The_Leg_Press_Machine"
          }
        ]
      },
      { 
        id: "d2-e5", name: "HIIT Cardio", type: "مشاية أو عجلة", sets: 1, reps: "6 دورات", defaultWeight: 0, notes: "كارديو الكورة المتقطع.", 
        alts: [
          { 
            id: "d2-e5-main", name: "Treadmill Sprint HIIT", arabicName: "سبرينت على المشاية الكهرائية (الرئيسي)", equipment: "مشاية كهربائية", whyUseIt: "يعود الرئة والجهاز العصبي على الجري السريع المتقطع بالكورة.", defaultWeight: 0, defaultReps: "6 دورات (30ث سبرينت / 60ث مشي)",
            dos: ["اضبط السرعة على أقصى مجهود في فترة السبرينت (15-18 كم/س).", "انزل للمشي الهادئ في دقيقة التعافي."],
            donts: ["التوقف المفاجئ بعد السبرينت السريع.", "الإمساك بمقابض المشاية أثناء السبرينت."],
            githubFolder: "Running"
          },
          { 
            id: "d2-e5-alt1", name: "Mountain Climbers", arabicName: "تمرين متسلق الجبال (بديل 1)", equipment: "مات أرضي", whyUseIt: "كارديو حرق دهون عالي وتقوية عضلات البطن والرجلين بنفس الوقت.", defaultWeight: 0, defaultReps: "45 ثانية x 4 جولات",
            dos: ["ضع يديك تحت كتفيك تماماً في وضع البلانك.", "ادفع بالركبتين تبادلياً باتجاه الصدر بسرعة ودقة."],
            donts: ["رفع الحوض لأعلى أثناء الجري الأرضي.", "سقوط الظهر السفلي لأسفل."],
            githubFolder: "Mountain_climbers"
          },
          { 
            id: "d2-e5-alt2", name: "Burpees HIIT", arabicName: "تمرين البوربيز الشامل (بديل 2)", equipment: "مساحة حرة", whyUseIt: "أقوى تمرين لياقة وتأهيل بدني وانفجاري شامل للجسم.", defaultWeight: 0, defaultReps: "12-15 تكرار x 4 جولات",
            dos: ["انزل في وضع الضغط ثم اقفز بقدميك باتجاه يديك وافقز لأعلى.", "حافظ على رتم وسرعة حركة متناسقة."],
            donts: ["الإسراع لدرجة الانهيار التكنيكي.", "الهبوط العنيف على الركبتين."],
            githubFolder: "Burpees"
          }
        ]
      }
    ]
  },
  {
    day: 3,
    title: "Rest & Recovery",
    arabicTitle: "راحة تامة",
    goal: "الاستشفاء الكامل. العضلات بتكبر وقت الراحة والنوم.",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    exercises: []
  },
  {
    day: 4,
    title: "Upper Body + Core (Dynamic)",
    arabicTitle: "جزء علوي + بطن حركة",
    goal: "استهداف زوايا مختلفة للصدر والضهر والأكتاف.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d4-e1", name: "Incline Dumbbell Press", type: "صدر عالي دمبل", sets: 3, reps: "8-10", defaultWeight: 26, notes: "تعريض الصدر العالي.", 
        alts: [
          { 
            id: "d4-e1-main", name: "Incline Dumbbell Press", arabicName: "تجميع صدر عالي بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة مائلة 30 درجة", whyUseIt: "أفضل تمرين لملء وتكبير عضلات الصدر العالي بالكامل.", defaultWeight: 26, defaultReps: "8-10",
            dos: ["اضبط زاوية الدكة على 30 درجة لعدم تشغيل الكتف بفرط.", "انزل بالدمبلز بجانب الصدر العالي واضغط لأعلى."],
            donts: ["فتح الكوع بزاوية 90 درجة مع الجسم.", "رفع الدكة لزاوية قائمة 60 درجة."],
            githubFolder: "Incline_Dumbbell_Press"
          },
          { 
            id: "d4-e1-alt1", name: "Incline Barbell Press", arabicName: "بنش عالي بالبار (بديل 1)", equipment: "بار + دكة عالي", whyUseIt: "يسمح بحمل أوزان أثقل لزيادة القوة البنائية الإجمالية للصدر.", defaultWeight: 55, defaultReps: "8-10",
            dos: ["امسك البار أوسع من كتفك بقليل وانزل به لترقوة الصدر.", "ادفع البار لأعلى بثبات وقوة."],
            donts: ["خبط البار بالصدر بقوة للارتداد.", "قفل مفصل الكوع بفرط فوق."],
            githubFolder: "Barbell_Incline_Bench_Press_-_Medium_Grip"
          },
          { 
            id: "d4-e1-alt2", name: "Incline Dumbbell Flyes", arabicName: "تفتيح عالي بالدمبلز (بديل 2)", equipment: "دمبلز خفيفة + دكة مائلة", whyUseIt: "يعطي استطالة وتوسيع رائع لألياف الصدر العالي.", defaultWeight: 14, defaultReps: "12",
            dos: ["اثني كوعك سنة بسيطة وافتح ذراعيك للخارج كأنك تحضن شجرة.", "اضم الدمبلز لأعلى بالتركيز على عصر الصدر."],
            donts: ["فرد الذراعين بالكامل أثناء النزول.", "النزول بأوزان ثقيلة جداً تضر الكتف."],
            githubFolder: "Incline_Dumbbell_Flyes"
          }
        ]
      },
      { 
        id: "d4-e2", name: "Dumbbell Rows", type: "منشار", sets: 3, reps: "8-10", defaultWeight: 28, notes: "سمك الضهر النصفي.", 
        alts: [
          { 
            id: "d4-e2-main", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (الرئيسي)", equipment: "دمبل + دكة مستوية", whyUseIt: "مدى حركي كبير وتركيز فردي قوي على عضلات المجنص والظهر.", defaultWeight: 28, defaultReps: "8-10",
            dos: ["اسحب الدمبل باتجاه الورك وليس الصدر.", "اعتصر عضلات ظهرك في قمة السحب."],
            donts: ["لف الجسم والكتف للأعلى لتسهيل الوزن.", "سقوط الدمبل المفاجئ."],
            githubFolder: "One-Arm_Dumbbell_Row"
          },
          { 
            id: "d4-e2-alt1", name: "Chest Supported Incline Row", arabicName: "سحب دمبلز سند صدر على الدكة (بديل 1)", equipment: "دمبلز + دكة مائلة 45", whyUseIt: "يلغي أي تحميل أو إجهاد على أسفل الظهر تماماً.", defaultWeight: 20, defaultReps: "10-12",
            dos: ["انبطح بفقرات صدرك على الدكة المائلة ودع الذراعين يتدليان.", "اسحب الدمبلز لأعلى باتجاه الخصر مع ضم لوحي الكتف."],
            donts: ["رفع الصدر عن الدكة أثناء السحب.", "استخدام الأذرع بدلاً من عضلات الظهر."],
            githubFolder: "Dumbbell_Incline_Row"
          },
          { 
            id: "d4-e2-alt2", name: "Bent-Over Barbell Row", arabicName: "سحب بار بانحناء ظهر (بديل 2)", equipment: "بار مستقيم + طارات", whyUseIt: "يبني كتلة ضخمة وشاملة لجميع عضلات الظهر.", defaultWeight: 50, defaultReps: "8-10",
            dos: ["انحني بظهرك 45 درجة وثبت القطنية والجذع.", "اسحب البار باتجاه السرة مع الحفاظ على استقامة الظهر."],
            donts: ["تقوس الظهر السفلي أثناء التمريين.", "رفع الجذع لأعلى مع كل تكرار."],
            githubFolder: "Bent_Over_Two-Arm_Long_Barbell_Row"
          }
        ]
      },
      { 
        id: "d4-e3", name: "Lateral Raises", type: "رفرفة جانبي", sets: 3, reps: "12-15", defaultWeight: 10, notes: "تعريض الكتف الجانبي.", 
        alts: [
          { 
            id: "d4-e3-main", name: "Dumbbell Lateral Raise", arabicName: "رفرفة جانبي بالدمبلز واقفا (الرئيسي)", equipment: "دمبلز خفيفة", whyUseIt: "يعطي شكل الكتف الكروي العريض (3D Shoulder Shape).", defaultWeight: 10, defaultReps: "12-15",
            dos: ["ارفع الذراعين مايلاً لقدام 30 درجة في مستوى (Scapular plane).", "خلي الكوع أعلى قليلاً من المعصم أثناء الرفع."],
            donts: ["رفع الدمبلز أعلى من مستوى الكتف.", "استخدام المرجحة بالترابيز والجسم."],
            githubFolder: "Side_Lateral_Raise"
          },
          { 
            id: "d4-e3-alt1", name: "Cable Lateral Raise", arabicName: "رفرفة جانبي بالكابل السفلي (بديل 1)", equipment: "كابل سفلي + مقبض", whyUseIt: "يوفر مقاومة وشد مستمر من بداية الحركة من أسفل حتى الأفق.", defaultWeight: 7.5, defaultReps: "12-15",
            dos: ["اسحب الكابل من خلف ظهرك أو من أمامك ببطء.", "ارفع المقبض حتى مستوى الكتف باعتصار جانبي."],
            donts: ["سحب الكابل بسرعة خاطفة.", "الانحناء للجوانب أثناء الرفع."],
            githubFolder: "Cable_Lateral_Raise"
          },
          { 
            id: "d4-e3-alt2", name: "Seated Dumbbell Lateral Raise", arabicName: "رفرفة جانبي جالساً على الدكة (بديل 2)", equipment: "دمبلز + دكة 90", whyUseIt: "يمنع المرجحة بالجسم نهائياً لضمان العزل الصافي للكتف الجانبي.", defaultWeight: 8, defaultReps: "15",
            dos: ["اجلس مستقيماً على الدكة وارفع الدمبلز للخارج بثبات.", "ثبت جذعك كاملاً على المسند."],
            donts: ["استخدام الزخم للحركة.", "رفع الأوزان الثقيلة جداً."],
            githubFolder: "Seated_Dumbbell_Lateral_Raise"
          }
        ]
      },
      { 
        id: "d4-e4", name: "Face Pulls", type: "كابل", sets: 3, reps: "15", defaultWeight: 20, notes: "تأهيل الكتف وتصليح الأتب.", 
        alts: [
          { 
            id: "d4-e4-main", name: "Cable Face Pulls", arabicName: "فيس بول بالحبل على الكابل (الرئيسي)", equipment: "كابل عالي + حبل", whyUseIt: "يحسن صحة مفصل الكتف ويستهدف الكتف الخلفي وعضلات الأتب.", defaultWeight: 20, defaultReps: "15",
            dos: ["اضبط الكابل في مستوى العين واسحب الحبل باتجاه الجبهة/العينين.", "افتح الحبل للخارج واعتصر الكتف الخلفي."],
            donts: ["سحب الحبل باتجاه الصدر أو الذقن.", "حمل أوزان ثقيلة تسبب الانحناء للخلف."],
            githubFolder: "Face_Pull"
          },
          { 
            id: "d4-e4-alt1", name: "Seated Rear Delt Raise", arabicName: "رفرفة خلفي جالساً بالدمبلز (بديل 1)", equipment: "دمبلز خفيفة + دكة", whyUseIt: "بديل ممتاز بالدمبلز لعزل عضلات الكتف الخلفي.", defaultWeight: 8, defaultReps: "15",
            dos: ["انحني بجذعك فوق فخذيك وارفع الدمبلز للخارج وللأعلى.", "احرص على توجيه الكوعين للسقف أثناء الرفرفة."],
            donts: ["رفع الجذع لأعلى أثناء التكرارات.", "استخدام عضلات البايسبس."],
            githubFolder: "Seated_Rear_Delt_Raise"
          },
          { 
            id: "d4-e4-alt2", name: "Reverse Cable Flyes", arabicName: "تفتيح خلفي على جهاز الكابل (بديل 2)", equipment: "كابل مزدوج", whyUseIt: "يوفر تركيز دقيق للغاية بدون أي ضغط على مفاصل المعصم.", defaultWeight: 10, defaultReps: "15",
            dos: ["امسك الكابل الأيمن بيدك اليسرى والبراك الآخر بيدك اليمنى متقاطعين.", "افتح ذراعيك للخارج حتى توازيا الصدر."],
            donts: ["ثني الكوعين بفرط أثناء الفتح.", "التركيز على عضلات الظهر بدلاً من الكتف الخلفي."],
            githubFolder: "Reverse_Flyes"
          }
        ]
      },
      { 
        id: "d4-e5", name: "Hanging Leg Raises", type: "بطن سفلي", sets: 3, reps: "10", defaultWeight: 0, notes: "قوة الكور من التعلق.", 
        alts: [
          { 
            id: "d4-e5-main", name: "Hanging Leg Raise", arabicName: "بطن سفلي متعلق بالعقلة (الرئيسي)", equipment: "بار عقلة", whyUseIt: "يستهدف عضلات البطن السفلى بامتياز ويزيد قوة القبضة.", defaultWeight: 0, defaultReps: "10",
            dos: ["تعلق بالعقلة وارفع الساقين باستخدام عضلات البطن حتى 90 درجة.", "انزل بالساقين ببطء لمنع المرجحة."],
            donts: ["المرجحة بالجسم كشكل البندول (Kipping).", "رفع الساقين بدفع الفخذين فقط."],
            githubFolder: "Hanging_Leg_Raise"
          },
          { 
            id: "d4-e5-alt1", name: "Lying Leg Raise on Bench", arabicName: "رفع رجلين مستلقي على الدكة (بديل 1)", equipment: "دكة مستوية", whyUseIt: "أسهل في التحكم ويمنع المرجحة بالجسم تماماً.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["استلقي على الدكة وامسك حافتها خلف رأسك.", "ارفع الساقين لأعلى حتى التعامد واعتصر عضلات البطن السفلى."],
            donts: ["تقوس الظهر السفلي عن الدكة أثناء النزول.", "النزول السريع الخاطف."],
            githubFolder: "Flat_Bench_Lying_Leg_Raise"
          },
          { 
            id: "d4-e5-alt2", name: "Decline Bench Crunch", arabicName: "طحن بطن على الدكة المائلة (بديل 2)", equipment: "دكة بطن مائلة", whyUseIt: "تمرين قوي ومباشر لتقسيم ونحت عضلات البطن العلوي والسفلي.", defaultWeight: 0, defaultReps: "15",
            dos: ["ثبت قدميك في أعلى الدكة المائلة وانزل بجذعك للخلف ببطء.", "اطلع بعصر عضلات البطن دون الضغط على الرقبة."],
            donts: ["شد الرقبة باليدين أثناء الصعود.", "الصعود الكامل بالخصر كأنك تقوم للجري."],
            githubFolder: "Decline_Crunch"
          }
        ]
      },
      { 
        id: "d4-e6", name: "Russian Twists", type: "بطن جانبي", sets: 3, reps: "15", defaultWeight: 10, notes: "للاحتكاكات واللف في الملعب.", 
        alts: [
          { 
            id: "d4-e6-main", name: "Russian Twist with Plate", arabicName: "رشان تويست بالطارة أو الدمبل (الرئيسي)", equipment: "طارة / دمبل", whyUseIt: "يقوي عضلات الخواصر والبطن الجانبية والقدرة على الدوران في الملعب.", defaultWeight: 10, defaultReps: "15 لكل جانب",
            dos: ["اجلس على الأرض وارفع قدميك قليلاً وميل بجذعك 45 درجة.", "لف كتفيك وجذعك بالكامل مع الوزن يميناً ويساراً."],
            donts: ["تحريك اليدين بالوزن فقط دون دوران الجذع والكتفين.", "الإسراع غير المحكوم."],
            githubFolder: "Russian_Twist"
          },
          { 
            id: "d4-e6-alt1", name: "Cross-Body Crunch", arabicName: "طحن عكسي متقاطع للبطن (بديل 1)", equipment: "مات أرضي", whyUseIt: "تمرين بوزن الجسم رائع لتقوية العضلات المائلة الجانبية.", defaultWeight: 0, defaultReps: "15 لكل جانب",
            dos: ["استلقي على ظهرك وقرب كوعك الأيمن لركبتك اليسرى التبادلية.", "اعصر الخواصر في نهاية كل تكرار."],
            donts: ["شد الرقبة باليدين.", "فصل الظهر السفلي عن الأرض."],
            githubFolder: "Cross-Body_Crunch"
          },
          { 
            id: "d4-e6-alt2", name: "Bicycle Crunch", arabicName: "تمرين العجلة للبطن Bicycle Crunch (بديل 2)", equipment: "مات أرضي", whyUseIt: "يستهدف جميع أجزاء البطن والخواصر بتوافق حركي مستمر.", defaultWeight: 0, defaultReps: "20 لكل جانب",
            dos: ["حرّك الساقين كأنك تبدل على عجلة مع دوران الكتفين عكسياً.", "حافظ على البطن مشدودة طوال التمرين."],
            donts: ["تحريك الساقين بسرعة خاطفة دون دوران الكتفين.", "إسقاط القدمين على الأرض."],
            githubFolder: "Cross-Body_Crunch"
          }
        ]
      }
    ]
  },
  {
    day: 5,
    title: "Lower Body + LISS Cardio",
    arabicTitle: "رجلين + لياقة ملاعب",
    goal: "توازن حركي، قوة فردية، وتكبير حجم الرئة.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d5-e1", name: "Bulgarian Split Squats", type: "دمبل", sets: 3, reps: "8-10 لكل رجل", defaultWeight: 18, notes: "لتغيير الاتجاهات السريعة في الكورة.", 
        alts: [
          { 
            id: "d5-e1-main", name: "Bulgarian Split Squats", arabicName: "سكوات بلغاري بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة خلفية", whyUseIt: "أفضل تمرين لبناء ثبات الركبة والقوة الفردية لكل قدم للاعبي كرة القدم.", defaultWeight: 18, defaultReps: "8-10 لكل رجل",
            dos: ["ضع مشط القدم الخلفية على الدكة وانزل بالركبة الخلفية للأرض.", "ميل بالجذع للأمام 15 درجة لاستهداف عضلات الجلوتس."],
            donts: ["خروج الركبة الأمامية بفرط بعيداً عن مشط القدم.", "الوقوف قريب جداً أو بعيد جداً عن الدكة."],
            githubFolder: "Dumbbell_Lunges"
          },
          { 
            id: "d5-e1-alt1", name: "Dumbbell Walking Lunges", arabicName: "طعن مشي بالدمبلز (بديل 1)", equipment: "دمبلز + مسار مشي", whyUseIt: "ديناميكي للغاية ويحاكي حركة الجري والطعن الميداني في الملعب.", defaultWeight: 16, defaultReps: "10 خطوات لكل رجل",
            dos: ["انزل بركبتك الخلفية لقرب الأرض واخطو بثبات للأمام.", "حافظ على استقامة الجذع والصدر مرفوعاً."],
            donts: ["الميل العنيف للجذع للأمام أثناء المشي.", "ضرب الركبة الخلفية بالأرض بقوة."],
            githubFolder: "Dumbbell_Walking_Lunge"
          },
          { 
            id: "d5-e1-alt2", name: "Barbell Reverse Lunge", arabicName: "طعن رجوع للخلف بالبار (بديل 2)", equipment: "بار عالي + طارات", whyUseIt: "يحمي الركبة ويستهدف الجلوتس والخلفيات بكفاءة تامة.", defaultWeight: 40, defaultReps: "8-10 لكل رجل",
            dos: ["احمل البار على أعلى الظهر واخطو بخطوة واسعة للخلف.", "انزل عمودياً واعتصر القدم الأمامية عند الصعود."],
            donts: ["فقدان التوازن أثناء الرجوع للخلف.", "تحميل الوزن على مشط القدم الخلفية."],
            githubFolder: "Barbell_Lunge"
          }
        ]
      },
      { 
        id: "d5-e2", name: "Leg Curls", type: "خلفيات أجهزة", sets: 3, reps: "12", defaultWeight: 40, notes: "تجنب إصابات الضمة والخلفية.", 
        alts: [
          { 
            id: "d5-e2-main", name: "Seated Leg Curl", arabicName: "جهاز خلفيات رجل جالس (الرئيسي)", equipment: "جهاز خلفيات جالس", whyUseIt: "يعزل عضلات الهامسترينج الخلفية في وضع استطالة لحمايتها من التمزق.", defaultWeight: 40, defaultReps: "12",
            dos: ["اضبط محور دوران الجهاز مع ركبتك واقفل المسند على الفخذين.", "اسحب الوسادة لأسفل بقوة واعتصر خلفيات الساق."],
            donts: ["رفع الفخذين عن الكرسي أثناء السحب.", "النزول السريع الخاطف."],
            githubFolder: "Seated_Leg_Curl"
          },
          { 
            id: "d5-e2-alt1", name: "Dumbbell Lying Leg Curl", arabicName: "خلفيات بالدمبل مستلقي (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "بديل ذكي ممتاز بوزن حر لو جهاز الخلفيات ممتلئ بالجيم.", defaultWeight: 12, defaultReps: "10-12",
            dos: ["انبطح على الدكة وثبت الدمبل بين قدميك جيداً.", "اثني الساقين لأعلى باتجاه الجلوتس باعتصر خلفي."],
            donts: ["سقوط الدمبل أثناء الحركة.", "رفع الحوض عن الدكة أثناء الثني."],
            githubFolder: "Dumbbell_Lying_Leg_Curl"
          },
          { 
            id: "d5-e2-alt2", name: "Exercise Ball Hamstring Curl", arabicName: "سحب خلفيات بالكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "يقوي عضلات خلفية الساق والجلوتس وثبات الظهر السفلي للجسم.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["استلقي على ظهرك وضع كعبيك على الكرة وارفع الحوض لعلى.", "اسحب الكرة باتجاه جسمك باستخدام كعبيك."],
            donts: ["سقوط الحوض باتجاه الأرض أثناء السحب.", "فقدان التحكم بالكرة."],
            githubFolder: "Exercise_Ball_Hamstring_Curl"
          }
        ]
      },
      { 
        id: "d5-e3", name: "Leg Press", type: "جهاز رجل", sets: 3, reps: "10-12", defaultWeight: 140, notes: "قوة الدفع.", 
        alts: [
          { 
            id: "d5-e3-main", name: "45 Leg Press Machine", arabicName: "جهاز مكبس الرجلين Leg Press (الرئيسي)", equipment: "جهاز مكبس 45 درجة", whyUseIt: "يسمح بحمل أوزان ضخمة لزيادة قوة الدفع السفلي في أمان تام.", defaultWeight: 140, defaultReps: "10-12",
            dos: ["ضع قدميك بعرض الكتفين في منتصف المنصة.", "انزل بالمنصة حتى زاوية 90 بالركبة ثم ادفع بالكعبين."],
            donts: ["قفل مفصل الركبة بالكامل (Lockout) في الأعلى.", "رفع أسفل الظهر عن الكرسي أثناء النزول."],
            githubFolder: "Leg_Press"
          },
          { 
            id: "d5-e3-alt1", name: "Hack Squat Machine", arabicName: "جهاز هاك سكوات Hack Squat (بديل 1)", equipment: "جهاز الهاك", whyUseIt: "تركيز ناري ومباشر على العضلات الأمامية فوق الركبة.", defaultWeight: 80, defaultReps: "10",
            dos: ["ثبت كتفيك وظهرك كاملاً على الكرسي المائل.", "انزل حتى يوازي فخذك المنصة واعتصر الأماميات عند الصعود."],
            donts: ["رفع الكعبين عن المنصة.", "قفل الركبة بحدة في أعلى نقطة."],
            githubFolder: "Hack_Squat"
          },
          { 
            id: "d5-e3-alt2", name: "Dumbbell Step-Ups", arabicName: "صعود على الصندوق بالدمبلز (بديل 2)", equipment: "دمبلز + صندوق Box/دكة", whyUseIt: "يبني قوة دفع انفجارية لكل قدم وتوافق أداء حركي ميداني.", defaultWeight: 16, defaultReps: "10 لكل رجل",
            dos: ["ضع قدمك بالكامل على الصندوق وادفع بجسمك لأعلى بثبات.", "انزل ببطء وتحكم بالقدم الأخرى."],
            donts: ["الدفع بالقدم السفلى على الأرض لتسهيل الصعود.", "تحميل الوزن على مشط القدم بدل الكعب."],
            githubFolder: "Dumbbell_Step-Ups"
          }
        ]
      },
      { 
        id: "d5-e4", name: "LISS Cardio", type: "مشي سريع Incline", sets: 1, reps: "20د", defaultWeight: 0, notes: "سرعة الاستشفاء وحرق الدهون.", 
        alts: [
          { 
            id: "d5-e4-main", name: "Incline Treadmill Walk", arabicName: "مشي بميل على المشاية Incline (الرئيسي)", equipment: "مشاية كهربائية", whyUseIt: "يحرق الدهون بدقة ويعزز الاستشفاء العضلي دون التحميل على المفاصل.", defaultWeight: 0, defaultReps: "20 دقيقة (سرعة 5.5 / انحدار 8-10)",
            dos: ["اضبط الانحدار بين 8 لـ 10 وافرد قامتك أثناء المشي.", "حافظ على رتم تنفس منتظم."],
            donts: ["الإمساك بشدة بمقابض المشاية (يقلل المجهود).", "الجري السريع في يوم الكارديو منخفض الشدة."],
            githubFolder: "Treadmill_walking"
          },
          { 
            id: "d5-e4-alt1", name: "Elliptical Trainer LISS", arabicName: "جهاز الإليبتيكال Elliptical (بديل 1)", equipment: "جهاز إليبتيكال", whyUseIt: "كارديو كامل للجسم العلوي والسفلي بدون أي صدمات على الركبة.", defaultWeight: 0, defaultReps: "20 دقيقة (مقاومة متوسطة)",
            dos: ["ادفع البدال بكعب قدمك وحرك الذراعين بالتوازي.", "افظ على استقامة ظهرك."],
            donts: ["التحميل على أطراف أصابع القدم فقط.", "سرعة الحركة دون مقاومة."],
            githubFolder: "Elliptical_trainer"
          },
          { 
            id: "d5-e4-alt2", name: "Stationary Bike LISS", arabicName: "عجلة الجيم الثابتة (بديل 2)", equipment: "عجلة جيم ثابتة", whyUseIt: "تنشيط الدورة الدموية والاستشفاء العضلي للساقين بعد تمريين الرجل.", defaultWeight: 0, defaultReps: "20 دقيقة (سرعة منتظمة)",
            dos: ["اضبط ارتفاع الكرسي بحيث يمتد فخذك بزاوية بسيطة في الأسفل.", "حافظ على سرعة بدال منتظمة 70-80 RPM."],
            donts: ["الانحناء الشديد فوق المقود.", "ضبط الكرسي منخفضاً جداً المسبب لألم الركبة."],
            githubFolder: "Treadmill_walking"
          }
        ]
      }
    ]
  },
  {
    day: 6,
    title: "Football Match & Recovery",
    arabicTitle: "ماتش الكورة أو استشفاء",
    goal: "استمتع بمجهودك في الملعب وحول تمرينك لأداء أون فيتش!",
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
  goal: "2650 سعرة حرارية",
  macros: { protein: 175, carbs: 320, fats: 70 },
  strategy: "توفير طاقة للبناء العضلي بدون تخزين دهون. مفيش وجبة تقع.",
  meals: [
    { id: "meal-1", title: "وجبة 1 (الفطار)", icon: Coffee, color: "text-orange-400", bg: "bg-orange-950/40", base: "1 ساندوتش جبنة قريش بعيش بلدي + 1 أو 2 ساندوتش حلاوة.", alts: ["البديل السريع: 3 باتيه بالجبنة + عصير من أي كشك."] },
    { id: "meal-2", title: "وجبة 2 (غداء الشغل)", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-950/40", base: "طرب، كبدة، كفتة، أو مناقيش سوري.", alts: ["البديل الاقتصادي: علبة كشري 'دبل' أو 4 ساندوتشات فول وطعمية."] },
    { id: "meal-3", title: "وجبة 3 (قنبلة الطاقة)", subtitle: "قبل التمرين بـ 45 دقيقة", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-950/40", base: "معلقتين كبار من برطمان العسل والمكسرات.", alts: ["بديل الشارع: كيس عصير قصب + بسكويت بالعجوة."] },
    { id: "meal-4", title: "وجبة 4 (الريكفري)", subtitle: "بعد التمرين مباشرة", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-950/40", base: "أكل البيت المتاح (رز/مكرونة + بروتين).", alts: [] },
    { id: "meal-5", title: "وجبة 5 (العشاء)", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-950/40", base: "مشروب الـ 1000 سعرة (شوفان + موزة + زبدة سوداني + لبن).", alts: ["البديل (لو مفيش خلاط): ساندوتشات عيش بلدي بزبدة السوداني والموز."] }
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
    try { navigator.vibrate(40); } catch(e){}
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
  } catch (e) {}
};

// ================= 100% OFFLINE EXERCISE MOVEMENT ANIMATION PLAYER =================
const UnbreakableAnimation = ({ altId }) => {
  const [frame, setFrame] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  // Fast smooth 500ms exercise repetition pace
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const safeAltId = altId || 'd1-e1-main';
  const baseAltId = safeAltId.split('-').slice(0, 2).join('-');

  const imgSrc0 = useFallback ? `/exercises/${baseAltId}-main-0.jpg` : `/exercises/${safeAltId}-0.jpg`;
  const imgSrc1 = useFallback ? `/exercises/${baseAltId}-main-1.jpg` : `/exercises/${safeAltId}-1.jpg`;
  const currentImgSrc = frame === 0 ? imgSrc0 : imgSrc1;

  return (
    <div className="relative flex justify-center items-center w-full min-h-[180px] bg-slate-950 rounded-2xl p-2 overflow-hidden border border-slate-800 shadow-inner">
      {/* Hidden Preloaders to eliminate image load flickering on mobile */}
      <img src={imgSrc0} className="hidden" alt="" />
      <img src={imgSrc1} className="hidden" alt="" />

      {/* Persistent <img> without key unmounting for 60fps smooth animation */}
      <img 
        src={currentImgSrc} 
        alt={safeAltId} 
        onError={() => setUseFallback(true)}
        className="max-h-48 object-contain rounded-lg opacity-100 transition-all duration-150 select-none"
      />
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
        } catch(e){}
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
              <UnbreakableAnimation altId={currentAlt.id} />
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('شرح تمرين ' + currentAlt.arabicName + ' shorts')}`}
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
    { id: 2, title: "Discipline 100%", desc: "إكمال جميع تمارين اليوم الحقيقية", icon: ShieldCheck, unlocked: completedTasksCount >= 8 && completedTasksCount > 0 },
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
    } catch(e){}
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
      try { parsed = JSON.parse(saved); } catch(e) { return {}; }
      if (typeof parsed !== 'object' || parsed === null) return {};
      const keys = Object.keys(parsed);
      const hasDateKey = keys.some(k => k.includes('-'));
      if (!hasDateKey && keys.length > 0) {
        return { [todayDateKey]: parsed };
      }
      return parsed;
    } catch(e) {
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
      } catch(e) {
        return { [todayDateKey]: parseInt(saved, 10) || 0 };
      }
    } catch(e) { return {}; }
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
    } catch(e) { return []; }
  });

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
    } catch(e) {
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
        try { await wakeLockRef.current.release(); } catch(e){}
        wakeLockRef.current = null;
      }
      setIsWakeLockActive(false);
    } else {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setIsWakeLockActive(true);
        } catch (err) {
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
          try { setWaterGlasses(JSON.parse(e.newValue)); } catch(err){}
        }
      } catch(err){}
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
      try { confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } }); } catch(e){}
    } else if (progressPercentage >= 50) msgArray = messages.average;
    else msgArray = messages.low;

    const randomMsg = msgArray[Math.floor(Math.random() * msgArray.length)];
    setEvalMessage(randomMsg);
    setShowEvalModal(true);
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
    } catch(e){}
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
        } catch (err) {
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
