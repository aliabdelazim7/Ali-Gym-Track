import fs from 'fs';

const updatedWorkoutPlanCode = `const initialWorkoutPlan = [
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
];`;

// Update App.jsx
let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

appCode = appCode.replace(
  /const initialWorkoutPlan = \[\s*\{[\s\S]*?\];\s*const dietPlan =/,
  updatedWorkoutPlanCode + '\n\nconst dietPlan ='
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('App.jsx updated with Plank & Ab Wheel on all 4 workout days!');

// Update src/initialWorkoutPlan.js
const standaloneFileCode = updatedWorkoutPlanCode + '\n\nexport default initialWorkoutPlan;\n';
fs.writeFileSync('e:\\ali-Gym-Track\\src\\initialWorkoutPlan.js', standaloneFileCode, 'utf8');
console.log('src/initialWorkoutPlan.js updated!');
