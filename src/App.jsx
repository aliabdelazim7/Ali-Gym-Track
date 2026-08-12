import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Smartphone, Sun, Lock, Unlock, DownloadCloud, Dumbbell, Activity, CheckCircle, Calendar, HeartPulse, ImageIcon, 
  ChevronDown, ChevronUp, ChevronRight, ChevronLeft, CheckCircle2, AlertOctagon, Timer, 
  X, RotateCcw, Apple, Flame, Briefcase, Zap, Moon, Coffee, Utensils, Laptop, Settings,
  Trophy, Target, MessageSquareQuote, TrendingUp, Plus, Trash2, Scale,
  Volume2, VolumeX, Download, Upload, Sparkles, RefreshCw, BarChart3, Info,
  Award, ShieldCheck, Droplets, Dumbbell as DumbbellIcon, Zap as ZapIcon,
  Play, PlusCircle, MinusCircle, Check, ArrowUpRight, Award as TrophyIcon, Undo2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

// ================= CUSTOM SVG ICONS =================
const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// ================= LOCAL DATE KEY HELPER =================
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
    return dateObj.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch (_e) {
    return dateKey;
  }
};

// ================= REAL-TIME CLOUD SYNC ENGINE =================
const DEFAULT_CLOUD_BIN_ID = "019febb5-c70b-730c-8fb4-1227a57998ac";

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
            githubFolder: "T-Bar_Row_with_Handle"
          },
          { 
            id: "d1-e2-alt1", name: "Bent-Over Barbell Row", arabicName: "سحب بالبار بانحناء ظهر (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "يبني كتلة وسماكة ضخمة شاملة لكل عضلات الظهر.", defaultWeight: 50, defaultReps: "8-10",
            dos: ["انحني بظهرك 45 درجة وثبت القطنية والجذع.", "اسحب البار باتجاه السرة مع ضم لوحي الكتف."],
            donts: ["تقوس الظهر السفلي أثناء التمرين.", "رفع الجذع لأعلى مع كل تكرار."],
            githubFolder: "Bent_Over_Barbell_Row"
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
            githubFolder: "Side_Lateral_Raise"
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
            githubFolder: "Side_Lateral_Raise"
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
            githubFolder: "Standing_Biceps_Cable_Curl"
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

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(40); } catch(_e){}
  }
};

// 100% Comprehensive Exercise Unsplash Visual Map per category/exercise
const EXERCISE_UNSPLASH_MAP = {
  "Incline Dumbbell Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Incline Barbell Bench Press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  "Incline Machine Press": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Flat Dumbbell Press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Machine Chest Press": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Barbell Bench Press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  "T-Bar Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "Bent-Over Barbell Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "One-Arm Dumbbell Row": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "Wide-Grip Lat Pulldown": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "V-Bar Pulldown": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "Underhand Lat Pulldown": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  "Seated Cable Row": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  "Cable Lateral Raise": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  "Overhead Triceps Extension": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  "Leg Press Machine": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
  "Romanian Deadlift (RDL)": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "Standard Elbow Plank": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
  "Ab Wheel Rollout": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
};

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

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSourceIndex(0);
  }, [altId, currentAlt]);

  const folderName = (currentAlt && currentAlt.githubFolder) || 
                     (currentAlt && EXERCISE_FOLDER_MAP[currentAlt.id]) || 
                     EXERCISE_FOLDER_MAP[altId] || 
                     "Plank";

  const altName = currentAlt ? currentAlt.name : '';

  const sources = [
    `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folderName}/${frame}.jpg`,
    `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folderName.replace('_with_Handle', '')}/${frame}.jpg`,
    EXERCISE_UNSPLASH_MAP[altName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
  ];

  const currentMediaUrl = sources[Math.min(sourceIndex, sources.length - 1)];

  const handleImageError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex(prev => prev + 1);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-[190px] bg-slate-950 rounded-2xl p-2 overflow-hidden border border-slate-800 shadow-inner group">
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
        <img 
          src={currentMediaUrl} 
          alt={altName || "Exercise Motion"} 
          onError={handleImageError}
          className="max-h-40 object-contain rounded-xl transition-all duration-300 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="absolute bottom-2 right-2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>حركة حية (مصدر ${sourceIndex + 1}/10 ⚡)</span>
        </div>
      </div>
    </div>
  );
};

// ================= ERGONOMIC EXERCISE CARD (3-TIER UX) =================
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
  const lastTapRef = useRef(0);

  const alts = exercise.alts || [
    { id: `${exercise.id}-main`, name: exercise.name, arabicName: `${exercise.name} (الرئيسي)`, equipment: exercise.type, whyUseIt: exercise.notes, dos: exercise.dos, donts: exercise.donts, defaultWeight: exercise.defaultWeight, defaultReps: exercise.reps }
  ];
  const currentAlt = alts[activeAltIndex] || alts[0];

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
    const now = Date.now();
    if (now - lastTapRef.current < 300) return; // Prevent double tap accidental double-logging
    lastTapRef.current = now;

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
  const isFullyCompleted = completedSets >= exercise.sets;

  return (
    <div className={`bg-slate-900/90 border rounded-2xl p-3.5 sm:p-4 shadow-lg transition-all font-arabic ${isFullyCompleted ? 'border-emerald-500/40 bg-slate-900/60' : 'border-slate-800 hover:border-slate-700'}`}>
      
      {/* Tier 1: Summary Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl border shrink-0 ${isFullyCompleted ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
              {isFullyCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">{exercise.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                <span className="text-orange-400 font-bold">{exercise.sets} مجاميع</span> × <span className="text-emerald-400 font-bold">{currentReps}</span>
                {isFullyCompleted && <span className="mr-2 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">مكتمل 🎯</span>}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={showDetails}
          onClick={() => { triggerHaptic(); setShowDetails(!showDetails); }}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 active:scale-95 ${
            showDetails 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' 
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">التفاصيل والشرح</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Tier 2: Quick Logging Inputs & Fast Steppers */}
      <div className="grid grid-cols-2 gap-2 my-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800/90">
        {/* Weight Control */}
        <div className="flex items-center justify-between bg-slate-900/90 rounded-xl p-1 border border-slate-800">
          <button 
            type="button"
            aria-label="إنقاص الوزن"
            onClick={() => handleStepWeight(-2.5)} 
            className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-bold text-base transition-all"
          >
            -
          </button>
          <div className="text-center px-1">
            <span className="text-[10px] text-slate-500 block leading-none">الوزن (كجم)</span>
            <input 
              type="number"
              inputMode="decimal"
              value={currentWeight}
              onChange={(e) => onWeightChange(currentAlt.id, Math.max(0, Number(e.target.value)))}
              className="w-14 text-center bg-transparent text-sm sm:text-base font-bold text-orange-400 font-mono focus:outline-none"
            />
          </div>
          <button 
            type="button"
            aria-label="زيادة الوزن"
            onClick={() => handleStepWeight(2.5)} 
            className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-bold text-base transition-all"
          >
            +
          </button>
        </div>

        {/* Reps Control */}
        <div className="flex items-center justify-between bg-slate-900/90 rounded-xl p-1 border border-slate-800">
          <button 
            type="button"
            aria-label="إنقاص العدات"
            onClick={() => handleStepReps(-1)} 
            className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-bold text-base transition-all"
          >
            -
          </button>
          <div className="text-center px-1">
            <span className="text-[10px] text-slate-500 block leading-none">العدات</span>
            <input 
              type="text"
              inputMode="numeric"
              value={currentReps}
              onChange={(e) => onRepsChange(currentAlt.id, e.target.value)}
              className="w-14 text-center bg-transparent text-sm sm:text-base font-bold text-emerald-400 font-mono focus:outline-none"
            />
          </div>
          <button 
            type="button"
            aria-label="زيادة العدات"
            onClick={() => handleStepReps(1)} 
            className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-bold text-base transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Set Completion Buttons */}
      <div className="flex gap-2 mb-1">
        {[...Array(exercise.sets)].map((_, i) => {
          const isDone = completedSets > i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleCompleteSet(i)}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1 min-h-[46px] active:scale-95 ${
                isDone 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40' 
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
              }`}
            >
              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : `مجموعة ${i + 1}`}
            </button>
          );
        })}
      </div>

      {/* Tier 3: Optional Details Accordion */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
          
          {/* Variation Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-bold px-1 shrink-0">البديل:</span>
            {alts.map((alt, idx) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setActiveAltIndex(idx);
                }}
                className={`min-h-[38px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                  activeAltIndex === idx
                    ? idx === 0 
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                      : idx === 1
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>{idx === 0 ? '🥇 الرئيسي' : idx === 1 ? '🥈 بديل (1)' : '🥉 بديل (2)'}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-orange-400">{currentAlt.arabicName}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">{currentAlt.equipment}</span>
            </div>
            <p className="text-[11px] text-slate-400">💡 {currentAlt.whyUseIt}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <UnbreakableAnimation altId={currentAlt.id} currentAlt={currentAlt} />
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('طريقة اداء ' + currentAlt.arabicName + ' shorts')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>شرح فيديو سريع (Shorts)</span>
              </a>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2.5">
                <h4 className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> الأداء الصحيح</h4>
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

    </div>
  );
};

// ================= PROGRESSIVE ANALYTICS VIEW =================
const ProgressiveAnalyticsView = ({ weightLogs, onAddWeightLog, onDeleteWeightLog }) => {
  const [exerciseName, setExerciseName] = useState('Incline Dumbbell Press');
  const [customName, setCustomName] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [selectedLiftChart, setSelectedLiftChart] = useState('Incline Dumbbell Press');

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
    <div className="space-y-5 font-arabic animate-in fade-in duration-300 pb-28">
      
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white">التقدم والأوزان (PRs & Analytics)</h2>
            <p className="text-xs text-slate-400 mt-1">متابعة الحمل التدريبي والزيادة التدريجية (Progressive Overload)</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-400 shrink-0" />
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
          <div>
            <label htmlFor="lift-chart-select" className="text-xs font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              معدل زيادة أوزان الـ 1RM التقديري
            </label>
            <p className="text-[11px] text-slate-400">حساب أقصى وزن تقديري: 1RM = الوزن × (1 + العدات ÷ 30)</p>
          </div>

          <select
            id="lift-chart-select"
            value={selectedLiftChart}
            onChange={(e) => setSelectedLiftChart(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 min-h-[44px]"
          >
            <option value="Incline Dumbbell Press">Incline Dumbbell Press (صدر عالي)</option>
            <option value="Leg Press">Leg Press (دفع رجلين)</option>
            <option value="Romanian Deadlift">Romanian Deadlift (ديدليفت)</option>
            <option value="T-Bar Row">T-Bar Row (سحب تي بار)</option>
            <option value="Lat Pulldown">Lat Pulldown (سحب واسع)</option>
          </select>
        </div>

        <div className="h-60 w-full min-w-0">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
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
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-semibold p-4 text-center border border-dashed border-slate-800 rounded-xl">
              <Scale className="w-8 h-8 text-slate-600 mb-2" />
              <span>لا توجد أوزان مسجلة لهذا التمرين بعد.</span>
              <span className="text-[11px] text-slate-400 mt-1">استخدم الخانة بالأسفل لتسجيل أول وزن! 🚀</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <TrophyIcon className="w-4 h-4 text-amber-400" />
          أفضل الأوزان المحققة (Personal Records - PR)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Incline Dumbbell Press', 'Leg Press', 'Romanian Deadlift', 'T-Bar Row'].map(lift => {
            const pr = personalRecords[lift];
            return (
              <div key={lift} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-right shadow-md min-w-0">
                <span className="text-[11px] text-slate-400 font-semibold truncate block">{lift}</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
                    {pr ? `${pr.weight} كجم` : '--'}
                  </span>
                  {pr && <span className="text-[10px] text-slate-500 font-mono">(${pr.reps} عدات)</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          تسجيل تمرينة جديدة في السجل
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label htmlFor="log-exercise-select" className="block text-slate-400 mb-1 font-semibold">اسم التمرين</label>
            <select 
              id="log-exercise-select"
              value={exerciseName} 
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
            >
              <option value="Incline Dumbbell Press">Incline Dumbbell Press (صدر عالي)</option>
              <option value="Leg Press">Leg Press (دفع رجلين)</option>
              <option value="Romanian Deadlift">Romanian Deadlift (ديدليفت)</option>
              <option value="T-Bar Row">T-Bar Row (سحب تي بار)</option>
              <option value="Lat Pulldown">Lat Pulldown (سحب واسع)</option>
              <option value="Custom">+ تمرين آخر</option>
            </select>
            {exerciseName === 'Custom' && (
              <input 
                type="text" 
                placeholder="ادخل اسم التمرين..." 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full mt-2 bg-slate-950 border border-blue-500/50 rounded-xl p-2 text-white min-h-[44px]"
              />
            )}
          </div>

          <div>
            <label htmlFor="log-weight-input" className="block text-slate-400 mb-1 font-semibold">الوزن (كيلوجرام)</label>
            <input 
              id="log-weight-input"
              type="number"
              inputMode="decimal"
              placeholder="مثال: 75"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500 min-h-[44px]"
            />
          </div>

          <div>
            <label htmlFor="log-reps-input" className="block text-slate-400 mb-1 font-semibold">العدات (Reps)</label>
            <input 
              id="log-reps-input"
              type="number"
              inputMode="numeric"
              placeholder="مثال: 8"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500 min-h-[44px]"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-xs sm:text-sm active:scale-95"
        >
          حفظ التمرينة في السجل 💾
        </button>
      </form>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-400" />
          سجل الأوزان التاريخي
        </h3>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {weightLogs.map(log => (
            <div key={log.id} className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex justify-between items-center text-xs hover:border-slate-700 transition-all min-w-0">
              <div className="min-w-0">
                <h4 className="text-white font-bold truncate">{log.exerciseName}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  الوزن: <span className="text-orange-400 font-bold">{log.weight} كجم</span> | العدات: <span className="text-emerald-400 font-bold">{log.reps}</span> ({log.date})
                </p>
              </div>
              <button 
                type="button"
                aria-label="حذف التمرينة من السجل"
                onClick={() => onDeleteWeightLog(log.id)}
                className="text-slate-500 hover:text-red-400 p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
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

// ================= MAIN APPLICATION COMPONENT =================
const MainApp = () => {
  const [todayDateKey] = useState(() => getLocalDateKey());
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey());

  const isTodaySelected = selectedDate === todayDateKey;

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
        const yesterdayKey = getLocalDateKey(new Date(Date.now() - 86400000));
        return {
          [yesterdayKey]: parsed,
          [todayDateKey]: parsed
        };
      }
      return parsed;
    } catch(_e) {
      return {};
    }
  };

  const [workoutProgress, setWorkoutProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Workout'));
  const [exerciseWeights, setExerciseWeights] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseWeights'));
  const [exerciseReps, setExerciseReps] = useState(() => parseDateIndexedState('gymProgress_Ali_ExerciseReps'));
  const [dietProgress, setDietProgress] = useState(() => parseDateIndexedState('gymProgress_Ali_Diet'));
  const [waterGlasses, setWaterGlasses] = useState(() => parseDateIndexedState('gymProgress_Ali_Water'));

  const [weightLogs, setWeightLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('gymProgress_Ali_Weights');
      return saved ? JSON.parse(saved) : initialWeightLogs;
    } catch(_e) { return []; }
  });

  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'diet' | 'progress' | 'settings'
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [openMealId, setOpenMealId] = useState('meal-1');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [notificationPermission, setNotificationPermission] = useState(() => {
    return (typeof window !== 'undefined' && 'Notification' in window) ? Notification.permission : 'denied';
  });
  const [lastNotificationDate, setLastNotificationDate] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_LastNotifDate') || '';
  });

  const wakeLockRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Register Service Worker for PWA Notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(_err => {});
    }
  }, []);

  // Request Notification Permission on iOS PWA / Browser
  const requestNotificationPermission = async () => {
    triggerHaptic();
    if (!('Notification' in window)) {
      showToast("الإشعارات غير مدعومة في المتصفح الحالي.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === 'granted') {
        showToast("تم تفعيل إشعارات الجيم 8:00 مساءً بنجاح! 🔔");
        triggerTestNotification();
      } else if (result === 'denied') {
        showToast("تم رفض الإشعارات. يرجى تفعيلها من إعدادات الآيفون.");
      }
    } catch (_e) {
      showToast("يرجى التأكد من إضافة التطبيق للشاشة الرئيسية (Add to Home Screen) في الآيفون لتفعيل الإشعارات.");
    }
  };

  // Trigger Local System Notification
  const triggerSystemNotification = (title, body) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          vibrate: [300, 100, 300],
          tag: 'gym-8pm-alarm'
        });
      }).catch(_e => {});
    } else if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
          tag: 'gym-8pm-alarm'
        });
      } catch(_e){}
    }
  };

  const triggerTestNotification = () => {
    triggerSystemNotification(
      "🏋️ إشعار تمرين الجيم (تجربة 8:00 مساءً)",
      "عاش يا بشمهندس علي! الإشعارات شغالة الآن كأنك فتح أبل ستور أبليكيشن 🚀"
    );
  };

  // Current Workout Session
  const currentWorkout = useMemo(() => {
    return initialWorkoutPlan.find(d => d.day === activeDay) || initialWorkoutPlan[0];
  }, [activeDay]);

  // 8:00 PM (20:00) Gym Alarm Scheduler for Workout Days
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const checkGymTimeAlarm = () => {
      const now = new Date();
      const hours = now.getHours();
      const todayStr = getLocalDateKey(now);

      const isWorkoutDay = [1, 2, 4, 5].includes(activeDay);

      if (isWorkoutDay && hours === 20 && lastNotificationDate !== todayStr) {
        setLastNotificationDate(todayStr);
        localStorage.setItem('gymProgress_Ali_LastNotifDate', todayStr);

        const workoutTitle = currentWorkout ? currentWorkout.arabicTitle : '';
        triggerSystemNotification(
          `🏋️ حان وقت الجيم يا بشمهندس علي! (8:00 مساءً)`,
          `معاد تمرين اليوم (${workoutTitle}) جه! خش على التطبيق وسجل مجاميعك واكسر أرقامك اليوم 🚀`
        );
      }
    };

    checkGymTimeAlarm();
    const interval = setInterval(checkGymTimeAlarm, 30000);
    return () => clearInterval(interval);
  }, [notificationPermission, activeDay, lastNotificationDate, currentWorkout]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem('gymProgress_Ali_Workout', JSON.stringify(workoutProgress));
      localStorage.setItem('gymProgress_Ali_ExerciseWeights', JSON.stringify(exerciseWeights));
      localStorage.setItem('gymProgress_Ali_ExerciseReps', JSON.stringify(exerciseReps));
      localStorage.setItem('gymProgress_Ali_Diet', JSON.stringify(dietProgress));
      localStorage.setItem('gymProgress_Ali_Water', JSON.stringify(waterGlasses));
      localStorage.setItem('gymProgress_Ali_Weights', JSON.stringify(weightLogs));
    } catch(_e){}
  }, [workoutProgress, exerciseWeights, exerciseReps, dietProgress, waterGlasses, weightLogs]);


  const currentDayWorkoutProgress = workoutProgress[selectedDate] || {};
  const currentDayDietProgress = dietProgress[selectedDate] || {};
  const currentDayWaterCount = waterGlasses[selectedDate] || 0;

  // Set & Exercise Handlers
  const handleSetToggle = (exerciseId, setIndex) => {
    setWorkoutProgress(prev => {
      const dateMap = prev[selectedDate] || {};
      const currentSets = dateMap[exerciseId] || 0;
      const newSets = currentSets === setIndex + 1 ? setIndex : setIndex + 1;
      return {
        ...prev,
        [selectedDate]: {
          ...dateMap,
          [exerciseId]: newSets
        }
      };
    });
    showToast("تم تحديث المجموعة بنجاح 🎯");
  };

  const handleWeightChange = (altId, weight) => {
    setExerciseWeights(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [altId]: weight
      }
    }));
  };

  const handleRepsChange = (altId, reps) => {
    setExerciseReps(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [altId]: reps
      }
    }));
  };

  const handleMealToggle = (mealId) => {
    triggerHaptic();
    setDietProgress(prev => {
      const dateMap = prev[selectedDate] || {};
      return {
        ...prev,
        [selectedDate]: {
          ...dateMap,
          [mealId]: !dateMap[mealId]
        }
      };
    });
    showToast("تم تحديث حالة الوجبة 🥗");
  };

  const handleWaterAdd = () => {
    triggerHaptic();
    setWaterGlasses(prev => {
      const current = prev[selectedDate] || 0;
      return {
        ...prev,
        [selectedDate]: Math.min(12, current + 1)
      };
    });
    showToast("تم تسجيل كوب ماء 💧");
  };

  const handleWaterUndo = () => {
    triggerHaptic();
    setWaterGlasses(prev => {
      const current = prev[selectedDate] || 0;
      return {
        ...prev,
        [selectedDate]: Math.max(0, current - 1)
      };
    });
    showToast("تم التراجع عن آخر كوب 🔄");
  };

  // Rest Timer
  const handleStartRest = (seconds = 90) => {
    setRestTimeLeft(seconds);
    setIsRestTimerRunning(true);
  };

  useEffect(() => {
    let timer;
    if (isRestTimerRunning && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0 && isRestTimerRunning) {
      setIsRestTimerRunning(false);
      triggerHaptic();
      playBeepSound();
      showToast("انتهى وقت الراحة! ابدأ المجموعة التالية 🔔");
    }
    return () => clearInterval(timer);
  }, [isRestTimerRunning, restTimeLeft]);

  // Screen Wake Lock
  const toggleWakeLock = async () => {
    triggerHaptic();
    if ('wakeLock' in navigator) {
      if (wakeLockRef.current) {
        try { await wakeLockRef.current.release(); } catch(_e){}
        wakeLockRef.current = null;
        setIsWakeLockActive(false);
        showToast("تم إيقاف وضع الشاشة المضاءة");
      } else {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setIsWakeLockActive(true);
          showToast("تم تفعيل إبقاء الشاشة مضاءة 💡");
        } catch (_err) {
          showToast("وضع الشاشة المضاءة مفعل أو غير مدعوم");
        }
      }
    }
  };

  // Quick Day Data Fill
  const copyPreviousDayDataToSelected = () => {
    triggerHaptic();
    const prevDateKey = getLocalDateKey(new Date(new Date(selectedDate).getTime() - 86400000));
    setWorkoutProgress(prev => ({
      ...prev,
      [selectedDate]: (prev[prevDateKey] && Object.keys(prev[prevDateKey]).length > 0) ? prev[prevDateKey] : (prev[todayDateKey] || {})
    }));
    setDietProgress(prev => ({
      ...prev,
      [selectedDate]: (prev[prevDateKey] && Object.keys(prev[prevDateKey]).length > 0) ? prev[prevDateKey] : (prev[todayDateKey] || {})
    }));
    setWaterGlasses(prev => ({
      ...prev,
      [selectedDate]: prev[prevDateKey] || prev[todayDateKey] || 8
    }));
    showToast("تم تعبئة بيانات هذا اليوم بنجاح 📋");
  };

  // Reset All Data
  const handleResetAllData = () => {
    triggerHaptic();
    if (!window.confirm("⚠️ هل أنت تأكد من رغبتك في تصفير كافة البيانات والبدء من الجديد؟\nسيتم مسح كافة التمارين والأوزان والتغذية من المتصفح والسحابة.")) {
      return;
    }
    setWorkoutProgress({});
    setExerciseWeights({});
    setExerciseReps({});
    setDietProgress({});
    setWaterGlasses({});
    setWeightLogs([]);
    setActiveDay(1);
    try {
      localStorage.clear();
    } catch(_e){}
    showToast("تم تصفير الداتا بنجاح! 🚀");
  };

  const handleClearBrowserCache = () => {
    triggerHaptic();
    try {
      sessionStorage.clear();
    } catch(_e){}
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  const exportData = () => {
    triggerHaptic();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      workoutProgress, exerciseWeights, exerciseReps, dietProgress, waterGlasses, weightLogs, activeDay,
      exportedAt: new Date().toISOString()
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ali_gym_track_backup_${selectedDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("تم تصدير ملف النسخة الاحتياطية 💾");
  };

  const importData = (event) => {
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
          showToast("تم استرجاع البيانات بنجاح! 🚀");
        } catch (_err) {
          showToast("الملف غير صالح، برجاء اختيار ملف JSON صحيح.");
        }
      };
    }
  };

  // Calculations
  const completedExercisesCount = currentWorkout.exercises.filter(ex => (currentDayWorkoutProgress[ex.id] || 0) >= ex.sets).length;
  const totalExercisesCount = currentWorkout.exercises.length;
  const workoutProgressPercentage = totalExercisesCount > 0 ? Math.round((completedExercisesCount / totalExercisesCount) * 100) : 0;

  const totalVolumeThisWeek = useMemo(() => {
    let vol = 0;
    Object.values(exerciseWeights).forEach(dayWeights => {
      if (typeof dayWeights === 'object' && dayWeights !== null) {
        Object.values(dayWeights).forEach(w => {
          if (typeof w === 'number') vol += w * 8;
        });
      }
    });
    return vol;
  }, [exerciseWeights]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans px-3 sm:px-5 pt-11 sm:pt-6 pb-28 min-w-0 pt-[max(2.75rem,env(safe-area-inset-top))]" dir="rtl">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div aria-live="polite" className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-4 font-arabic min-w-0">

        {/* Compact Mobile Header */}
        <header className="flex justify-between items-center h-14 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 sm:px-4 shadow-lg min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0">
              AG
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate">Ali Gym Track</h1>
              <p className="text-[10px] text-slate-400 font-mono truncate">{formatArabicDate(selectedDate)}</p>
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <button 
              type="button"
              aria-label="فتح قائمة الإعدادات والإشعارات"
              onClick={() => { triggerHaptic(); setShowSettingsModal(true); }}
              className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm active:scale-95"
              title="الإعدادات والإشعارات ⚙️"
            >
              <Settings className="w-4.5 h-4.5 text-slate-300" />
            </button>
          </div>
        </header>

        {/* Date Navigation & Picker Bar */}
        <nav aria-label="اختيار التاريخ" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-lg min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <button
              type="button"
              aria-label="اليوم السابق"
              onClick={() => {
                triggerHaptic();
                const dt = new Date(selectedDate);
                dt.setDate(dt.getDate() - 1);
                setSelectedDate(getLocalDateKey(dt));
              }}
              className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1 min-h-[44px] shrink-0"
            >
              <ChevronRight className="w-4 h-4 text-orange-400" />
              <span>السابق</span>
            </button>

            <div className="flex items-center gap-1 min-w-0">
              <input
                id="date-picker-input"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    triggerHaptic();
                    setSelectedDate(e.target.value);
                  }
                }}
                className="bg-slate-950 border border-slate-800 text-white text-xs font-bold px-2 py-2 rounded-xl focus:outline-none focus:border-orange-500 font-mono text-center min-h-[44px] min-w-0"
              />
              <button
                type="button"
                onClick={() => { triggerHaptic(); setSelectedDate(todayDateKey); }}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold border min-h-[44px] shrink-0 transition-all ${isTodaySelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
              >
                اليوم 🎯
              </button>
            </div>

            <button
              type="button"
              aria-label="اليوم التالي"
              onClick={() => {
                triggerHaptic();
                const dt = new Date(selectedDate);
                dt.setDate(dt.getDate() + 1);
                setSelectedDate(getLocalDateKey(dt));
              }}
              className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1 min-h-[44px] shrink-0"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          {!isTodaySelected && (
            <div className="mt-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>عرض تاريخ سابق: <strong className="font-mono text-white">{formatArabicDate(selectedDate)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyPreviousDayDataToSelected}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 min-h-[38px]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>تعبئة اليوم 📋</span>
                </button>
                <button
                  type="button"
                  onClick={() => { triggerHaptic(); setSelectedDate(todayDateKey); }}
                  className="text-[11px] underline font-bold hover:text-white shrink-0 min-h-[38px] flex items-center"
                >
                  العودة لليوم 🎯
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Rest Timer Floating Bar */}
        {isRestTimerRunning && (
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 rounded-2xl p-3 shadow-xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-400 animate-spin" />
              <span>متبقي على الراحة: <strong className="text-orange-400 font-mono text-sm">{restTimeLeft}s</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setIsRestTimerRunning(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 min-h-[38px]"
            >
              تخطي الراحة ⏭️
            </button>
          </div>
        )}

        {/* MAIN TAB 1: WORKOUT */}
        {activeTab === 'workout' && (
          <main className="space-y-4 font-arabic animate-in fade-in duration-300 min-w-0">
            
            {/* Day Selector Chips */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-lg min-w-0">
              <div className="flex justify-between items-center mb-2 px-1">
                <h2 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  جدول أيام الأسبوع
                </h2>
                <span className="text-[11px] text-orange-400 font-bold font-mono">التقدم: {workoutProgressPercentage}%</span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 min-w-0">
                {initialWorkoutPlan.map((d) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => { triggerHaptic(); setActiveDay(d.day); }}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1 ${
                      activeDay === d.day 
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-400/50 shadow-md' 
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    <span>يوم {d.day}</span>
                    <span className="text-[10px] opacity-80">({d.arabicTitle.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Workout Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md font-bold border border-orange-500/30">
                    اليوم {currentWorkout.day} - {currentWorkout.arabicTitle}
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">{currentWorkout.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">🎯 {currentWorkout.goal}</p>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-xs font-bold text-emerald-400 font-mono block">{completedExercisesCount}/{totalExercisesCount} تم</span>
                  <span className="text-[10px] text-slate-500">تمارين مكتملة</span>
                </div>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-3 min-w-0">
              {currentWorkout.exercises.length > 0 ? (
                currentWorkout.exercises.map((ex) => (
                  <ErgonomicExerciseCard
                    key={ex.id}
                    exercise={ex}
                    completedSets={currentDayWorkoutProgress[ex.id] || 0}
                    exerciseWeights={exerciseWeights[selectedDate] || {}}
                    exerciseReps={exerciseReps[selectedDate] || {}}
                    onSetToggle={handleSetToggle}
                    onWeightChange={handleWeightChange}
                    onRepsChange={handleRepsChange}
                    onStartRest={handleStartRest}
                  />
                ))
              ) : (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                  <Moon className="w-10 h-10 text-indigo-400 mx-auto animate-bounce" />
                  <h3 className="text-sm font-bold text-white">اليوم راحة إستشفائية تامة! 🛌</h3>
                  <p className="text-xs text-slate-400">العضلات تنمو أثناء الراحة والنوم الجيد وتناول الـ 4000 سعرة حرارية.</p>
                </div>
              )}
            </div>

          </main>
        )}

        {/* MAIN TAB 2: NUTRITION & WATER */}
        {activeTab === 'diet' && (
          <main className="space-y-4 font-arabic animate-in fade-in duration-300 min-w-0">
            
            {/* Target Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 rounded-2xl p-4 shadow-xl space-y-3 min-w-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white">{dietPlan.goal}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{dietPlan.strategy}</p>
                </div>
                <Apple className="w-7 h-7 text-emerald-400 shrink-0" />
              </div>

              {/* Macro Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">بروتين</span>
                  <span className="text-xs sm:text-sm font-bold text-orange-400 font-mono">{dietPlan.macros.protein}g</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">كاربوهيدرات</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">{dietPlan.macros.carbs}g</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">دهون صحية</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">{dietPlan.macros.fats}g</span>
                </div>
              </div>
            </div>

            {/* Meals Accordion List */}
            <div className="space-y-2.5 min-w-0">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 px-1">
                <Utensils className="w-4 h-4 text-emerald-400" />
                وجبات اليوم الـ 6 المكتملة
              </h3>

              {dietPlan.meals.map((meal) => {
                const isDone = currentDayDietProgress[meal.id];
                const isOpen = openMealId === meal.id;
                const Icon = meal.icon;

                return (
                  <div key={meal.id} className={`border rounded-2xl transition-all overflow-hidden bg-slate-900/90 ${isDone ? 'border-emerald-500/40' : 'border-slate-800'}`}>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenMealId(isOpen ? '' : meal.id)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 text-right min-h-[44px]"
                      >
                        <div className={`p-2 rounded-xl border shrink-0 ${meal.bg} ${meal.color} border-slate-800`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">{meal.title}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{meal.subtitle}</p>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          aria-label={`تحديد ${meal.title} كمكتملة`}
                          onClick={() => handleMealToggle(meal.id)}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all active:scale-95 ${
                            isDone 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : null}
                          <span>{isDone ? 'مكتملة 🟢' : 'تسجيل الوجبة ⚪'}</span>
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 bg-slate-950/60 text-xs space-y-2 animate-in slide-in-from-top-1 duration-200">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="font-bold text-emerald-400 block mb-0.5">الوجبة الأساسية:</span>
                          <p className="text-slate-200 text-xs leading-relaxed">{meal.base}</p>
                        </div>

                        {meal.alts && meal.alts.length > 0 && (
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                            <span className="font-bold text-amber-400 block mb-0.5">الخيارات البديلة:</span>
                            <ul className="space-y-1 text-slate-400 text-[11px]">
                              {meal.alts.map((altText, idx) => (
                                <li key={idx}>• {altText}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Water Tracker Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 min-w-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    عداد المياه اليومي
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    تم شرب: <strong className="text-blue-400">{currentDayWaterCount} من 8 أكواب</strong> ({currentDayWaterCount * 250} مل)
                  </p>
                </div>

                {currentDayWaterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleWaterUndo}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1 min-h-[44px]"
                    title="تراجع عن آخر كوب"
                  >
                    <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>تراجع</span>
                  </button>
                )}
              </div>

              {/* Water Glass Touch Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {[...Array(8)].map((_, idx) => {
                  const isFilled = currentDayWaterCount > idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`كوب ماء ${idx + 1} ${isFilled ? 'مكتمل' : 'غير مكتمل'}`}
                      onClick={handleWaterAdd}
                      className={`min-h-[48px] rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
                        isFilled 
                          ? 'bg-blue-600/30 text-blue-400 border-blue-500/50 shadow-md' 
                          : 'bg-slate-950 text-slate-600 border-slate-800 hover:text-slate-400'
                      }`}
                    >
                      <Droplets className={`w-5 h-5 ${isFilled ? 'fill-blue-400' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>

          </main>
        )}

        {/* MAIN TAB 3: PROGRESS & PRs */}
        {activeTab === 'progress' && (
          <ProgressiveAnalyticsView
            weightLogs={weightLogs}
            onAddWeightLog={(newLog) => setWeightLogs(prev => [newLog, ...prev])}
            onDeleteWeightLog={(id) => setWeightLogs(prev => prev.filter(l => l.id !== id))}
          />
        )}

        {/* MAIN TAB 4: SETTINGS & TOOLS */}
        {(activeTab === 'settings' || showSettingsModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white">إعدادات النظام والنسخ الاحتياطي</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => { setShowSettingsModal(false); if(activeTab === 'settings') setActiveTab('workout'); }}
                  className="text-slate-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Screen Wake Lock Toggle */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    إبقاء الشاشة مضاءة (Wake Lock)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">يمنع انطفاء شاشة الموبايل أثناء التمرين</p>
                </div>
                <button
                  type="button"
                  onClick={toggleWakeLock}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all ${isWakeLockActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  {isWakeLockActive ? 'مفعل 💡' : 'تفعيل'}
                </button>
              </div>

              
              {/* iOS PWA Notification Settings */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      إشعارات الجيم 8:00 مساءً (iOS / PWA)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">تذكير تلقائي يومي في موعد تمرينك 8:00 م</p>
                  </div>
                  <button
                    type="button"
                    onClick={requestNotificationPermission}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      notificationPermission === 'granted' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400'
                    }`}
                  >
                    {notificationPermission === 'granted' ? 'مفعل 🔔' : 'تفعيل الإشعارات'}
                  </button>
                </div>
                {notificationPermission === 'granted' && (
                  <button
                    type="button"
                    onClick={triggerTestNotification}
                    className="w-full text-xs font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 py-2 rounded-xl min-h-[44px]"
                  >
                    🧪 تجربة إشعار التذكير الآن
                  </button>
                )}
              </div>

              {/* Backup & Data Export/Import */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  النسخ الاحتياطي وتصدير البيانات
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={exportData}
                    className="min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-blue-400" /> تصدير JSON
                  </button>
                  <label className="min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" /> استرجاع JSON
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Clear Cache & Hard Reset */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  إعادة التعيين ومسح الكاش
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={handleClearBrowserCache}
                    className="min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold py-2 rounded-xl border border-slate-800"
                  >
                    مسح الكاش 🔄
                  </button>
                  <button 
                    type="button"
                    onClick={handleResetAllData}
                    className="min-h-[44px] bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold py-2 rounded-xl border border-red-500/40"
                  >
                    تصفير الداتا 🗑️
                  </button>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => { setShowSettingsModal(false); if(activeTab === 'settings') setActiveTab('workout'); }}
                className="w-full min-h-[44px] bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl border border-slate-700"
              >
                إغلاق الإعدادات
              </button>

            </div>
          </div>
        )}

        {/* Unified Fixed Mobile Bottom Navigation Bar */}
        <nav aria-label="التنقل الرئيسي" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 font-arabic py-1.5 px-3">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
            
            <button
              type="button"
              aria-current={activeTab === 'workout' ? 'page' : undefined}
              onClick={() => { triggerHaptic(); setActiveTab('workout'); }}
              className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === 'workout' 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">التمرين</span>
            </button>

            <button
              type="button"
              aria-current={activeTab === 'diet' ? 'page' : undefined}
              onClick={() => { triggerHaptic(); setActiveTab('diet'); }}
              className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === 'diet' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">التغذية</span>
            </button>

            <button
              type="button"
              aria-current={activeTab === 'progress' ? 'page' : undefined}
              onClick={() => { triggerHaptic(); setActiveTab('progress'); }}
              className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === 'progress' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">التقدم</span>
            </button>

            <button
              type="button"
              aria-current={activeTab === 'settings' ? 'page' : undefined}
              onClick={() => { triggerHaptic(); setShowSettingsModal(true); }}
              className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center transition-all ${
                showSettingsModal 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">الإعدادات</span>
            </button>

          </div>
        </nav>

      </div>
    </div>
  );
};

// ================= REACT ERROR BOUNDARY =================
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
    } catch(_e){}
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center font-arabic" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-2xl">
            <AlertOctagon className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-lg font-bold text-white">حدث خطأ مؤقت في التطبيق</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              تم حماية بياناتك المحفوظة، اضغط على الزر بالأسفل للتعافي التلقائي.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-lg min-h-[44px]"
            >
              تعافي واستعادة التطبيق 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
