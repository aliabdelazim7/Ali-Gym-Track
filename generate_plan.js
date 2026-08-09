import fs from 'fs';

// Full exercises array with 3 variations per exercise
const initialWorkoutPlanCode = `const initialWorkoutPlan = [
  {
    day: 1,
    title: "Upper Body + Core (Static)",
    arabicTitle: "جزء علوي + ثبات",
    goal: "بناء عضلات الصدر، الضهر، الأكتاف، والذراع.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d1-e1", name: "Bench Press", type: "بار أو دمبل", sets: 3, reps: "8-10", defaultWeight: 70, notes: "تمرين أساسي لقوة الصدر.", 
        arabicSearchTerm: "بنش بريس بار",
        dos: ["نزل البار/الدمبل لحد منتصف الصدر.", "ثبت كعب رجلك في الأرض كويس.", "ضم لوحين كتفك لورا (Scapular Retraction)."],
        donts: ["ترفع وسطك من على الدكة.", "تفرد كوعك للآخر بقفل المفصل (Lockout) فوق."],
        alts: [
          { id: "d1-e1-main", name: "Barbell Bench Press", arabicName: "بنش بريس بالبار المستوي (الرئيسي)", equipment: "بار + دكة مستوية", whyUseIt: "الخيار الأول لقوة وعضلات الصدر الإجمالية.", githubFolder: "Barbell_Bench_Press_-_Medium_Grip" },
          { id: "d1-e1-alt1", name: "Dumbbell Bench Press", arabicName: "تجميع صدر فلات بالدمبلز (بديل 1)", equipment: "دمبلز + دكة مستوية", whyUseIt: "لو البار مشغول، بيدي مدى حركي أعمق وعزل متساوي للناحيتين.", githubFolder: "Dumbbell_Bench_Press" },
          { id: "d1-e1-alt2", name: "Chest Dips / Machine Press", arabicName: "متوازي أو جهاز تجميع الصدر (بديل 2)", equipment: "جهاز المتوازي أو جهاز الصدر", whyUseIt: "لو الدكة مشغولة، بيستهدف الجزء السفلي والمنتصف بقوة.", githubFolder: "Chest_dip" }
        ]
      },
      { 
        id: "d1-e2", name: "Lat Pulldown", type: "جهاز سحب", sets: 3, reps: "8-10", defaultWeight: 55, notes: "عشان تعرض مجنص الضهر.", 
        arabicSearchTerm: "سحب عالي ضهر",
        dos: ["اسحب البار لحد صدرك العالي.", "خلي كوعك ينزل لتحت ولورا.", "افرد صدرك لفوق."],
        donts: ["تتمرجح بضهرك لورا عشان تسحب وزن أتقل.", "تسحب بدراعك بدل ضهرك."],
        alts: [
          { id: "d1-e2-main", name: "Wide-Grip Lat Pulldown", arabicName: "سحب عالي واسع للجهاز (الرئيسي)", equipment: "جهاز السحب العالي", whyUseIt: "أفضل تمرين لتعريض مجنص الضهر (V-Taper).", githubFolder: "Wide-Grip_Lat_Pulldown" },
          { id: "d1-e2-alt1", name: "V-Bar Pulldown", arabicName: "سحب عالي قبضة ضيقة V-Bar (بديل 1)", equipment: "مقبض V + جهاز السحب", whyUseIt: "لو المقبض الواسع مش متاح، بيعطي مدى حركي أعمق وتركيز أعلى.", githubFolder: "V-bar_pulldown" },
          { id: "d1-e2-alt2", name: "Pull-Ups", arabicName: "عقلة قبضة واسعة أو عادية (بديل 2)", equipment: "بار العقلة", whyUseIt: "تمرين بوزن الجسم ممتاز لو جهاز السحب العالي مالي الجيم.", githubFolder: "Pullups" }
        ]
      },
      { 
        id: "d1-e3", name: "Overhead Press", type: "دمبل", sets: 3, reps: "10", defaultWeight: 22, notes: "لقوة الأكتاف الأمامية والجانبية.", 
        arabicSearchTerm: "شولدر بريس دمبل كتف",
        dos: ["شد عضلات بطنك (Core) عشان تحمي القطنية.", "خلي كوعك مايل لقدام شوية (Scapular Plane)."],
        donts: ["تقوس ضهرك لورا أوي (Hyper-extension).", "تخلي كوعك مفتوح لبرة بزاوية 90 درجة."],
        alts: [
          { id: "d1-e3-main", name: "Seated Dumbbell Press", arabicName: "ضغط كتف بالدمبلز جالساً (الرئيسي)", equipment: "دمبلز + دكة 90 درجة", whyUseIt: "يحمي الضهر ويعزل كتفك الأمامي والجانبي.", githubFolder: "Seated_Dumbbell_Press" },
          { id: "d1-e3-alt1", name: "Standing Barbell OHP", arabicName: "ضغط كتف أمامي بالبار واقفا (بديل 1)", equipment: "بار + أوزان", whyUseIt: "يبني قوة انفجارية للجسم كله وعضلات الكتف.", githubFolder: "Standing_Military_Press" },
          { id: "d1-e3-alt2", name: "Arnold Dumbbell Press", arabicName: "تمرين أرنولد بالدمبلز (بديل 2)", equipment: "دمبلز", whyUseIt: "يدور الكتف 180 درجة ويستهدف جميع رؤوس الكتف.", githubFolder: "Arnold_press" }
        ]
      },
      { 
        id: "d1-e4", name: "Seated Cable Row", type: "سحب أرضي", sets: 3, reps: "10-12", defaultWeight: 50, notes: "لسمك وكثافة الضهر.", 
        arabicSearchTerm: "سحب ارضي ضهر",
        dos: ["افرد ضهرك وحافظ على القوس الطبيعي للقطنية.", "اسحب المقبض ناحية بطنك."],
        donts: ["تتمرجح لقدام وورا وتستخدم القطنية بدل المجنص."],
        alts: [
          { id: "d1-e4-main", name: "Seated Cable Row", arabicName: "سحب أرضي بالكابل (الرئيسي)", equipment: "جهاز سحب أرضي", whyUseIt: "يعطي مقاومة مستمرة لكثافة الضهر النصفي.", githubFolder: "Seated_Cable_Rows" },
          { id: "d1-e4-alt1", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (بديل 1)", equipment: "دمبل + دكة", whyUseIt: "لو جهاز السحب مشغولة، بيدي تركيز عالي واستطالة ممتازة.", githubFolder: "One-Arm_Dumbbell_Row" },
          { id: "d1-e4-alt2", name: "T-Bar Row", arabicName: "سحب تي بار T-Bar (بديل 2)", equipment: "بار T-Bar أو بار عادي بالزاوية", whyUseIt: "يسمح بأوزان أثقل لبناء سمك الضهر.", githubFolder: "T-Bar_Row" }
        ]
      },
      { 
        id: "d1-e5", name: "Bicep Curls", type: "بايسبس", sets: 3, reps: "12", defaultWeight: 14, notes: "تكبير عضلة الباي.", 
        arabicSearchTerm: "تبادل بايسبس دمبل",
        dos: ["ثبت كوعك جنبك مبيتحركش.", "اطلع بسرعة وانزل بالوزن بالراحة."],
        donts: ["تتمرجح بوسطك عشان ترفع الوزن."],
        alts: [
          { id: "d1-e5-main", name: "Dumbbell Alternate Curl", arabicName: "تبادل باي بالدمبلز (الرئيسي)", equipment: "دمبلز", whyUseIt: "يسمح بتدوير الساعد (Supination) لتكبير الباي.", githubFolder: "Dumbbell_Alternate_Bicep_Curl" },
          { id: "d1-e5-alt1", name: "EZ-Bar Bicep Curl", arabicName: "بايسبس بالبار الزيجزاج EZ (بديل 1)", equipment: "بار EZ", whyUseIt: "يريح مفاصل المعصم ويسمح بحمل أوزان أكبر.", githubFolder: "EZ-Bar_Curl" },
          { id: "d1-e5-alt2", name: "Cable Bicep Curl", arabicName: "بايسبس بالكابل أو جهاز الارتكاز (بديل 2)", equipment: "جهاز كابل سفلي", whyUseIt: "حافظ على شد ومقاومة مستمرة في كل زاوية.", githubFolder: "Cable_Preacher_Curl" }
        ]
      },
      { 
        id: "d1-e6", name: "Tricep Pushdown", type: "ترايسبس", sets: 3, reps: "12", defaultWeight: 25, notes: "تفصيل الترايسبس.", 
        arabicSearchTerm: "ترايسبس حبل",
        dos: ["ثبت كوعك جنبك لازق في جسمك.", "افرد دراعك للآخر لتحت واعمل Squeeze."],
        donts: ["تخلي كوعك يتحرك لقدام وورا وأنت بتلعب."],
        alts: [
          { id: "d1-e6-main", name: "Cable Rope Pushdown", arabicName: "ترايسبس بالحبل على الكابل (الرئيسي)", equipment: "كابل + حبل", whyUseIt: "يعزل الرأس الجانبية للترايسبس بامتياز.", githubFolder: "Triceps_Pushdown" },
          { id: "d1-e6-alt1", name: "Overhead Dumbbell Extension", arabicName: "ترايسبس خلف الرأس بالدمبل (بديل 1)", equipment: "دمبل", whyUseIt: "يستهدف الرأس الطويلة للترايسبس (Long Head).", githubFolder: "Standing_Dumbbell_Triceps_Extension" },
          { id: "d1-e6-alt2", name: "Bench Dips / Skullcrushers", arabicName: "متوازي دكة أو كسار جمجمة (بديل 2)", equipment: "دكة أو بار EZ", whyUseIt: "بديل بدون كابل ممتاز لبناء حجم التراي.", githubFolder: "Dips_-_Triceps_Version" }
        ]
      },
      { 
        id: "d1-e7", name: "Plank", type: "ثبات", sets: 3, reps: "45-60ث", defaultWeight: 0, notes: "قوة الكور وثبات الحوض.", 
        arabicSearchTerm: "بلانك بطن",
        dos: ["خلي جسمك خط مستقيم من راسك لكعبك.", "شد عضلات بطنك والمؤخرة."],
        donts: ["تنزل وسطك لتحت (بيحمل على القطنية).", "ترفع وسطك لفوق زي الخيمة."],
        alts: [
          { id: "d1-e7-main", name: "Standard Elbow Plank", arabicName: "بلانك ثبات على الكوع (الرئيسي)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن العميقة واستقرار الحوض.", githubFolder: "Plank" },
          { id: "d1-e7-alt1", name: "Ab Wheel Rollout", arabicName: "عجلة البطن Ab Wheel (بديل 1)", equipment: "عجلة بطن", whyUseIt: "تمرين متقدم يبني قوة انقباض فائقة للكور.", githubFolder: "Ab_Roller" },
          { id: "d1-e7-alt2", name: "Side Plank", arabicName: "بلانك جانبي Side Plank (بديل 2)", equipment: "مات أرضي", whyUseIt: "يقوي عضلات البطن الجانبية (Obliques).", githubFolder: "Side_Plank" }
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
        arabicSearchTerm: "سكوات بار رجل",
        dos: ["انزل لحد ما فخدك يبقى موازي للأرض.", "خلي وزنك موزع على كعبك ومشط رجلك."],
        donts: ["تخلي ركبتك تضم لجوه وأنت طالع.", "ترفع كعبك من على الأرض وأنت نازل."],
        alts: [
          { id: "d2-e1-main", name: "Barbell Back Squat", arabicName: "سكوات خلفي بالبار (الرئيسي)", equipment: "بار + راك السكوات", whyUseIt: "التمرين الأول لبناء قوة وحجم الرجلين والجذع.", githubFolder: "Barbell_Full_Squat" },
          { id: "d2-e1-alt1", name: "Goblet Dumbbell Squat", arabicName: "سكوات جوبلت بالدمبل (بديل 1)", equipment: "دمبل واحد تقيل", whyUseIt: "لو الراك مشغول، سهل الأداء ويحافظ على استقامة الضهر.", githubFolder: "Goblet_Squat" },
          { id: "d2-e1-alt2", name: "Smith Machine Squat", arabicName: "سكوات على جهاز السميث (بديل 2)", equipment: "جهاز سميث", whyUseIt: "يعطي ثبات عالي للتركيز الكامل على العضلات الأمامية.", githubFolder: "Smith_machine_squat" }
        ]
      },
      { 
        id: "d2-e2", name: "Romanian Deadlift (RDL)", type: "بار أو دمبل", sets: 3, reps: "8-10", defaultWeight: 75, notes: "قوة التسديد والخلفيات.", 
        arabicSearchTerm: "رومانيان ديدليفت",
        dos: ["ارجع بوسطك لورا (Hinge) بدل ما تتني ركبتك.", "حس بالشد في الخلفيات مش في أسفل الضهر."],
        donts: ["تقوس ضهرك (Rounding)."],
        alts: [
          { id: "d2-e2-main", name: "Barbell RDL", arabicName: "ديدليفت روماني بالبار (الرئيسي)", equipment: "بار مستقيم", whyUseIt: "يبني قوة التسديد في الكورة وعضلات الخلفيات بالجسم.", githubFolder: "Stiff-Legged_Barbell_Deadlift" },
          { id: "d2-e2-alt1", name: "Dumbbell RDL", arabicName: "ديدليفت روماني بالدمبلز (بديل 1)", equipment: "دمبلز", whyUseIt: "يسمح بحرية حركة المعصم وحركة الطبيعية للحوض.", githubFolder: "Romanian_Deadlift_With_Dumbbells" },
          { id: "d2-e2-alt2", name: "Single-Leg Dumbbell RDL", arabicName: "ديدليفت روماني رجل واحدة (بديل 2)", equipment: "دمبل", whyUseIt: "ممتاز للتوازن الحركي وتثبيت الركبة للاعبي الكورة.", githubFolder: "Single-Leg_Deadlift_With_Dumbbells" }
        ]
      },
      { 
        id: "d2-e3", name: "Leg Extensions", type: "جهاز أمامي", sets: 3, reps: "12", defaultWeight: 45, notes: "عزل الأماميات.", 
        arabicSearchTerm: "جهاز اماميات رجل",
        dos: ["اضبط مسند الضهر عشان ركبتك تبقى مع مفصل الجهاز.", "اثبت ثانية فوق واعمل Squeeze."],
        donts: ["تشيل وزن أتقل من اللازم وتتمرجح بجسمك."],
        alts: [
          { id: "d2-e3-main", name: "Machine Leg Extension", arabicName: "جهاز أمامي رجل (الرئيسي)", equipment: "جهاز الأماميات", whyUseIt: "يعزل العضلة الرباعية الأمامية (Quads) بنسبة 100%.", githubFolder: "Leg_Extensions" },
          { id: "d2-e3-alt1", name: "Sissy Squats", arabicName: "سيسي سكوات بوزن الجسم (بديل 1)", equipment: "وزن الجسم / حافة دكة", whyUseIt: "بديل ممتاز بدون أجهزة يعمل استطالة هائلة للأماميات.", githubFolder: "Sissy_Squat" },
          { id: "d2-e3-alt2", name: "Dumbbell Pass Leg Extension", arabicName: "أمامي بالدمبل على الدكة (بديل 2)", equipment: "دمبل بين القدمين + دكة", whyUseIt: "لو الجهاز عطلان أو مشغول في الجيم.", githubFolder: "Dumbbell_pass" }
        ]
      },
      { 
        id: "d2-e4", name: "Calf Raises", type: "سمانة", sets: 4, reps: "15", defaultWeight: 40, notes: "قوة القفز وتجنب الشد العضلي.", 
        arabicSearchTerm: "سمانة واقف",
        dos: ["اطلع لأقصى مدى حركي فوق واثبت ثانية.", "انزل ببطء لحد ما تحس باسترتش كامل."],
        donts: ["تعمل التمرين بسرعة (Bouncing)."],
        alts: [
          { id: "d2-e4-main", name: "Standing Calf Raise", arabicName: "سمانة واقفاً (الرئيسي)", equipment: "جهاز السمانة / استيب", whyUseIt: "تستهدف العضلة التوأمية السطحية (Gastrocnemius).", githubFolder: "Standing_Calf_Raises" },
          { id: "d2-e4-alt1", name: "Seated Dumbbell Calf Raise", arabicName: "سمانة جالس بالدمبلز (بديل 1)", equipment: "دكة + دمبل على الركبة", whyUseIt: "تستهدف عضلة السمانة العميقة (Soleus).", githubFolder: "Seated_Calf_Raise" },
          { id: "d2-e4-alt2", name: "Leg Press Calf Press", arabicName: "سمانة على جهاز الليج بريس (بديل 2)", equipment: "جهاز leg press", whyUseIt: "تسمح بأوزان أثقل وأداء آمن جداً.", githubFolder: "Calf_Press_On_The_Leg_Press_Machine" }
        ]
      },
      { 
        id: "d2-e5", name: "HIIT Cardio", type: "مشاية أو عجلة", sets: 1, reps: "6 دورات", defaultWeight: 0, notes: "كارديو الكورة المتقطع.", 
        arabicSearchTerm: "تمرين هيت كارديو مشاية",
        dos: ["ادي 100% مجهود في الـ 30 ثانية السبرينت.", "تنفس بعمق في دقيقة المشي للتعافي."],
        donts: ["توقف فجأة بعد السبرينت (لازم مشي)."],
        alts: [
          { id: "d2-e5-main", name: "Jumping Jacks / Sprint", arabicName: "سبرينت مشاية أو نط جاق (الرئيسي)", equipment: "مشاية / مساحة حرة", whyUseIt: "يعود الرئة والجهاز العصبي على السبرينت المتقطع.", githubFolder: "Jumping_jack" },
          { id: "d2-e5-alt1", name: "Mountain Climbers", arabicName: "متسلق الجبال Mountain Climbers (بديل 1)", equipment: "مات أرضي", whyUseIt: "كارديو حرق دهون وتفعيل عضلات البطن والرجل.", githubFolder: "Mountain_climbers" },
          { id: "d2-e5-alt2", name: "Burpees", arabicName: "بوربيز Burpees (بديل 2)", equipment: "مساحة مفتوحة", whyUseIt: "أقوى تمرين لياقة وتأهيل بدني شامل.", githubFolder: "Burpees" }
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
        arabicSearchTerm: "تجميع صدر عالي دمبل",
        dos: ["زاوية الدكة 30 لـ 45 درجة بالكتير.", "انزل بالدمبل لحد مستوى الصدر."],
        donts: ["تفتح كوعك 90 درجة مع كتفك.", "تخبط الدمبلز في بعض فوق."],
        alts: [
          { id: "d4-e1-main", name: "Incline Dumbbell Press", arabicName: "تجميع صدر عالي بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة مائلة 30 درجة", whyUseIt: "أفضل تمرين لملء وتكبير الصدر العالي.", githubFolder: "Incline_Dumbbell_Press" },
          { id: "d4-e1-alt1", name: "Incline Barbell Press", arabicName: "بنش عالي بالبار (بديل 1)", equipment: "بار + دكة عالي", whyUseIt: "يسمح بأوزان أثقل لزيادة القوة الإجمالية.", githubFolder: "Barbell_Incline_Bench_Press_-_Medium_Grip" },
          { id: "d4-e1-alt2", name: "Incline Dumbbell Flyes", arabicName: "تفتيح عالي بالدمبلز (بديل 2)", equipment: "دمبلز خفيفة + دكة مائلة", whyUseIt: "يعطي استطالة وتوسيع رائع لالياف الصدر.", githubFolder: "Incline_Dumbbell_Flyes" }
        ]
      },
      { 
        id: "d4-e2", name: "Dumbbell Rows", type: "منشار", sets: 3, reps: "8-10", defaultWeight: 28, notes: "سمك الضهر النصفي.", 
        arabicSearchTerm: "منشار ضهر دمبل",
        dos: ["اسحب الدمبل ناحية وسطك (جيب البنطلون).", "خلي ضهرك موازي للأرض ومفرود."],
        donts: ["تلف وسطك وتفتح صدرك وأنت بتسحب."],
        alts: [
          { id: "d4-e2-main", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (الرئيسي)", equipment: "دمبل + دكة", whyUseIt: "مدى حركي كبير وتركيز فردي على كل جهة.", githubFolder: "One-Arm_Dumbbell_Row" },
          { id: "d4-e2-alt1", name: "Chest Supported Incline Row", arabicName: "سحب دمبلز سند صدر على الدكة (بديل 1)", equipment: "دمبلز + دكة مائلة", whyUseIt: "يلغي أي تحميل على أسفل الضهر نهائياً.", githubFolder: "Dumbbell_Incline_Row" },
          { id: "d4-e2-alt2", name: "Bent-Over Barbell Row", arabicName: "سحب بار انحناء ضهر (بديل 2)", equipment: "بار مستقيم", whyUseIt: "يبني كتلة ضخمة لعضلات الضهر بالكامل.", githubFolder: "Bent_Over_Two-Arm_Long_Barbell_Row" }
        ]
      },
      { 
        id: "d4-e3", name: "Lateral Raises", type: "رفرفة جانبي", sets: 3, reps: "12-15", defaultWeight: 10, notes: "تعريض الكتف الجانبي.", 
        arabicSearchTerm: "رفرفة جانبي كتف دمبل",
        dos: ["ارفع دراعك مايل لقدام 30 درجة (Scapular plane).", "خلي كوعك متني سنة بسيطة."],
        donts: ["ترفع الدمبل أعلى من مستوى كتفك.", "تتمرجح بجسمك وتستخدم الزخم."],
        alts: [
          { id: "d4-e3-main", name: "Dumbbell Lateral Raise", arabicName: "رفرفة جانبي بالدمبلز واقفا (الرئيسي)", equipment: "دمبلز", whyUseIt: "يعطي شكل شكل الكتف الكروي العريض (3D Shoulder).", githubFolder: "Side_Lateral_Raise" },
          { id: "d4-e3-alt1", name: "Cable Lateral Raise", arabicName: "رفرفة جانبي بالكابل سفلي (بديل 1)", equipment: "كابل سفلي", whyUseIt: "يوفر مقاومة مستمرة من بداية الحركة حتى أعلاها.", githubFolder: "Cable_Lateral_Raise" },
          { id: "d4-e3-alt2", name: "Seated Dumbbell Lateral Raise", arabicName: "رفرفة جانبي جالساً (بديل 2)", equipment: "دمبلز + دكة", whyUseIt: "يمنع المرجحة بالجسم لضمان العزل الصافي.", githubFolder: "Seated_Dumbbell_Lateral_Raise" }
        ]
      },
      { 
        id: "d4-e4", name: "Face Pulls", type: "كابل", sets: 3, reps: "15", defaultWeight: 20, notes: "تأهيل الكتف وتصليح الأتب.", 
        arabicSearchTerm: "فيس بول كتف خلفي كابل",
        dos: ["اسحب الحبل ناحية وشك (مستوى العين).", "ركز على الكتف الخلفي."],
        donts: ["تستخدم وزن تقيل يبوظ الأداء.", "تسحب بكوعك لتحت بدل لورا."],
        alts: [
          { id: "d4-e4-main", name: "Cable Face Pulls", arabicName: "فيس بول بالحبل على الكابل (الرئيسي)", equipment: "كابل عالي + حبل", whyUseIt: "يحسن صحة مفصل الكتف ويستهدف الكتف الخلفي.", githubFolder: "Face_Pull" },
          { id: "d4-e4-alt1", name: "Seated Rear Delt Raise", arabicName: "رفرفة خلفي جالساً بالدمبلز (بديل 1)", equipment: "دمبلز خفيفة + دكة", whyUseIt: "بديل ممتاز بالدمبل لعزل الكتف الخلفي.", githubFolder: "Seated_Rear_Delt_Raise" },
          { id: "d4-e4-alt2", name: "Reverse Cable Flyes", arabicName: "تفتيح خلفي على الكابل (بديل 2)", equipment: "كابل ممتد", whyUseIt: "تركيز دقيق بدون ضغط على المعصم.", githubFolder: "Reverse_Flyes" }
        ]
      },
      { 
        id: "d4-e5", name: "Hanging Leg Raises", type: "بطن سفلي", sets: 3, reps: "10", defaultWeight: 0, notes: "قوة الكور من التعلق.", 
        arabicSearchTerm: "بطن سفلي متعلق",
        dos: ["ارفع رجلك باستخدام عضلات بطنك.", "انزل ببطء وتحكم."],
        donts: ["تتمرجح جسمك كله (Kipping)."],
        alts: [
          { id: "d4-e5-main", name: "Hanging Leg Raise", arabicName: "بطن سفلي متعلق بالعقلة (الرئيسي)", equipment: "بار عقلة", whyUseIt: "يستهدف عضلات البطن السفلى ويزيد قوة القبضة.", githubFolder: "Hanging_Leg_Raise" },
          { id: "d4-e5-alt1", name: "Lying Leg Raise on Bench", arabicName: "رفع رجلين مستلقي على الدكة (بديل 1)", equipment: "دكة فلات", whyUseIt: "أسهل في التحكم ويمنع المرجحة تماماً.", githubFolder: "Flat_Bench_Lying_Leg_Raise" },
          { id: "d4-e5-alt2", name: "Decline Bench Crunch", arabicName: "طحن بطن على الدكة المائلة (بديل 2)", equipment: "دكة بطن مائلة", whyUseIt: "تمرين قوي لتقسيم الجزء العلوي والسفلي للبطن.", githubFolder: "Decline_Crunch" }
        ]
      },
      { 
        id: "d4-e6", name: "Russian Twists", type: "بطن جانبي", sets: 3, reps: "15", defaultWeight: 10, notes: "للاحتكاكات واللف في الملعب.", 
        arabicSearchTerm: "رشان تويست بطن",
        dos: ["لف جذعك كله وكتفك مش دراعك بس.", "بص للاتجاه اللي بتلف ليه."],
        donts: ["تعمل الحركة بسرعة جداً من غير تحكم."],
        alts: [
          { id: "d4-e6-main", name: "Russian Twist", arabicName: "رشان تويست بالطارة أو الدمبل (الرئيسي)", equipment: "طارة / دمبل", whyUseIt: "يقوي عضلات البطن الجانبية والدوران الميداني في الكورة.", githubFolder: "Russian_Twist" },
          { id: "d4-e6-alt1", name: "Cross-Body Crunch", arabicName: "طحن عكسي متقاطع للبطن (بديل 1)", equipment: "مات أرضي", whyUseIt: "تمرين بوزن الجسم رائع للخواصر.", githubFolder: "Cross-Body_Crunch" },
          { id: "d4-e6-alt2", name: "Bicycle Crunches", arabicName: "تمرين العجلة للبطن Bicycle Crunch (بديل 2)", equipment: "مات أرضي", whyUseIt: "يستهدف العضلات المائلة مع الحفاظ على المقاومة.", githubFolder: "Cross-Body_Crunch" }
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
        arabicSearchTerm: "سكوات بلغاري دمبل",
        dos: ["انزل لحد ما ركبتك الخلفية تقرب من الأرض.", "ميل بجذعك لقدام سنة عشان تستهدف الجلوتس."],
        donts: ["تقف قريب أوي أو بعيد أوي عن الدكة."],
        alts: [
          { id: "d5-e1-main", name: "Bulgarian Split Squats", arabicName: "سكوات بلغاري بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة خلفية", whyUseIt: "أفضل تمرين لبناء ثبات الركبة والقوة المنفردة للاعبي الكورة.", githubFolder: "Dumbbell_Lunges" },
          { id: "d5-e1-alt1", name: "Dumbbell Walking Lunges", arabicName: "طعن مشي بالدمبلز (بديل 1)", equipment: "دمبلز + مسار مشي", whyUseIt: "ديناميكي للغاية ويحاكي حركة الجري والطعن في الملعب.", githubFolder: "Dumbbell_Walking_Lunge" },
          { id: "d5-e1-alt2", name: "Barbell Reverse Lunge", arabicName: "طعن رجوع للخلف بالبار (بديل 2)", equipment: "بار عالي", whyUseIt: "يحمي الركبة ويستهدف الجلوتس والخلفيات بكفاءة.", githubFolder: "Barbell_Lunge" }
        ]
      },
      { 
        id: "d5-e2", name: "Leg Curls", type: "خلفيات أجهزة", sets: 3, reps: "12", defaultWeight: 40, notes: "تجنب إصابات الضمة والخلفية.", 
        arabicSearchTerm: "جهاز خلفيات رجل",
        dos: ["اضبط محور الجهاز مع ركبتك بالظبط.", "اسحب الوزن بقوة وانزل ببطء."],
        donts: ["ترفع وسطك من على الكرسي وأنت بتسحب."],
        alts: [
          { id: "d5-e2-main", name: "Seated / Lying Leg Curl", arabicName: "جهاز خلفيات رجل جالس/مستلقي (الرئيسي)", equipment: "جهاز الخلفيات", whyUseIt: "يعزل عضلات الهامسترينج الخلفية لحمايتها من التمزق.", githubFolder: "Seated_Leg_Curl" },
          { id: "d5-e2-alt1", name: "Dumbbell Lying Leg Curl", arabicName: "خلفيات بالدمبل بين القدمين (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "بديل ذكي ممتاز لو جهاز الخلفيات غير متاح.", githubFolder: "Dumbbell_Lying_Leg_Curl" },
          { id: "d5-e2-alt2", name: "Exercise Ball Hamstring Curl", arabicName: "سحب خلفيات بالكرة السويسرية (بديل 2)", equipment: "كرة سويسرية Swiss Ball", whyUseIt: "يقوي الخلفيات والجلوتس وثبات أسفل الضهر.", githubFolder: "Exercise_Ball_Hamstring_Curl" }
        ]
      },
      { 
        id: "d5-e3", name: "Leg Press", type: "جهاز رجل", sets: 3, reps: "10-12", defaultWeight: 140, notes: "قوة الدفع.", 
        arabicSearchTerm: "ليج بريس جهاز",
        dos: ["حط رجلك عالي وواسع عشان الجلوتس والخلفيات.", "ادفع بكعب رجلك."],
        donts: ["تقفل مفصل ركبتك للآخر فوق (Lockout)."],
        alts: [
          { id: "d5-e3-main", name: "Leg Press Machine", arabicName: "جهاز مكبس الرجلين Leg Press (الرئيسي)", equipment: "جهاز مكبس 45", whyUseIt: "يسمح بأوزان ضخمة جداً في أمان تام.", githubFolder: "Leg_Press" },
          { id: "d5-e3-alt1", name: "Hack Squats Machine", arabicName: "جهاز هاك سكوات Hack Squat (بديل 1)", equipment: "جهاز الهاك", whyUseIt: "تركيز ناري على العضلات الأمامية فوق الركبة مباشرة.", githubFolder: "Hack_Squat" },
          { id: "d5-e3-alt2", name: "Dumbbell Step-Ups", arabicName: "صعود على الصندوق بالدمبلز (بديل 2)", equipment: "دمبلز + صندوق Box/دكة", whyUseIt: "يبني قوة انفجارية للقدمين والتوازن الأادي.", githubFolder: "Dumbbell_Step-Ups" }
        ]
      },
      { 
        id: "d5-e4", name: "LISS Cardio", type: "مشي سريع Incline", sets: 1, reps: "20د", defaultWeight: 0, notes: "سرعة الاستشفاء وحرق الدهون.", 
        arabicSearchTerm: "مشي انحدار كارديو",
        dos: ["حافظ على رتم ثابت.", "ارفع الانحدار (Incline) شوية."],
        donts: ["تمسك في المشاية وأنت رافع الانحدار."],
        alts: [
          { id: "d5-e4-main", name: "Incline Treadmill Walk", arabicName: "مشي بميل على المشاية Incline (الرئيسي)", equipment: "مشاية كهربائية", whyUseIt: "يحرق الدهون بدقة دون التحميل على مفاصل الركبة.", githubFolder: "Treadmill_walking" },
          { id: "d5-e4-alt1", name: "Elliptical Trainer", arabicName: "جهاز الإليبتيكال Elliptical (بديل 1)", equipment: "جهاز إليبتيكال", whyUseIt: "كارديو كامل للجسم علوي وسفلي بدون أي صدمات.", githubFolder: "Elliptical_trainer" },
          { id: "d5-e4-alt2", name: "Stationary Bike", arabicName: "عجلة جيم الثابتة (بديل 2)", equipment: "عجلة جيم", whyUseIt: "تنشيط الدورة الدموية والاستشفاء العضلي للرجلين.", githubFolder: "Treadmill_walking" }
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
];`;

fs.writeFileSync('e:\\ali-Gym-Track\\src\\initialWorkoutPlan.js', initialWorkoutPlanCode, 'utf8');
console.log('Saved initialWorkoutPlan.js cleanly!');
