const initialWorkoutPlan = [
  {
    day: 1,
    title: "Upper Body + Core (Static)",
    arabicTitle: "جزء علوي + ثبات",
    goal: "بناء عضلات الصدر، الضهر، الأكتاف، والذراع.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    exercises: [
      { 
        id: "d1-e1", name: "Bench Press", type: "بار أو دمبل", sets: 3, reps: "8-10", defaultWeight: 0, notes: "تمرين أساسي لقوة الصدر.", 
        alts: [
          { 
            id: "d1-e1-main", name: "Barbell Bench Press", arabicName: "بنش بريس بالبار المستوي (الرئيسي)", equipment: "بار مستقيم + دكة فلات", whyUseIt: "الخيار الأول لبناء القوة والحجم الكلي لعضلات الصدر.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["نزل البار لحد منتصف الصدر ببطء وتحكم.", "ثبت كعب رجلك في الأرض كويس لتوليد القوة.", "ضم لوحين كتفك لورا (Scapular Retraction)."],
            donts: ["ترفع وسطك من على الدكة (حماية للقطنية).", "تفرد كوعك للآخر بقفل المفصل (Lockout) فوق."],
            githubFolder: "Barbell_Bench_Press_-_Medium_Grip"
          },
          { 
            id: "d1-e1-alt1", name: "Dumbbell Bench Press", arabicName: "تجميع صدر فلات بالدمبلز (بديل 1)", equipment: "دمبلز + دكة فلات", whyUseIt: "لو البار مشغول، بيدي مدى حركي أعمق وعزل متساوي للناحيتين.", defaultWeight: 0, defaultReps: "8-10",
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
        id: "d1-e2", name: "Lat Pulldown", type: "جهاز سحب", sets: 3, reps: "8-10", defaultWeight: 0, notes: "عشان تعرض مجنص الضهر.", 
        alts: [
          { 
            id: "d1-e2-main", name: "Wide-Grip Lat Pulldown", arabicName: "سحب عالي واسع للجهاز (الرئيسي)", equipment: "جهاز السحب العالي + مقبض واسع", whyUseIt: "أفضل تمرين لتعريض مجنص الضهر رسم V-Taper.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["اسحب البار لحد أعلى الصدر مباشرة.", "وجه كوعك لتحت ولورا مع عصر عضلة المجنص.", "حافظ على الصدر مرفوع لأعلى."],
            donts: ["تتمرجح بضهرك لورا بحدة عشان تسحب وزن أتقل.", "تسحب البار خلف الرقبة (يسبب إصابات الكتف)."],
            githubFolder: "Wide-Grip_Lat_Pulldown"
          },
          { 
            id: "d1-e2-alt1", name: "V-Bar Pulldown", arabicName: "سحب عالي قبضة ضيقة V-Bar (بديل 1)", equipment: "مقبض V + جهاز السحب", whyUseIt: "لو المقبض الواسع مش متاح، بيدي استطالة أعمق وتركيز سفلي للمجنص.", defaultWeight: 0, defaultReps: "10",
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
        id: "d1-e3", name: "Overhead Press", type: "دمبل", sets: 3, reps: "10", defaultWeight: 0, notes: "لقوة الأكتاف الأمامية والجانبية.", 
        alts: [
          { 
            id: "d1-e3-main", name: "Seated Dumbbell Press", arabicName: "ضغط كتف بالدمبلز جالساً (الرئيسي)", equipment: "دمبلز + دكة 90 درجة", whyUseIt: "يحمي الضهر ويعزل عضلات الكتف الأمامي والجانبي بكفاءة.", defaultWeight: 0, defaultReps: "10",
            dos: ["شد عضلات بطنك وثبت ضهرك على مسند الدكة.", "خلي كوعك مايل لقدام 30 درجة في زاوية (Scapular plane)."],
            donts: ["تقوس ضهرك لورا أوي (Hyper-extension).", "تنزل بالدمبلز أسفل من مستوى أذنيك."],
            githubFolder: "Seated_Dumbbell_Press"
          },
          { 
            id: "d1-e3-alt1", name: "Standing Barbell OHP", arabicName: "ضغط كتف أمامي بالبار واقفا (بديل 1)", equipment: "بار مستقيم + طارات", whyUseIt: "يبني قوة انفجارية للجسم ككل وعضلات الجذع الكتف.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["اقف بقدمين بعرض الكتف وشد البطن والجلوتس.", "ادفع البار لأعلى في مسار مستقيم وقرب راسك لقدام سنة فوق."],
            donts: ["تثني ركبتك وتستخدم دفع الرجلين (إلا لو بتلعب Push Press).", "ترجع بظهرك لورا بفرط تقوس."],
            githubFolder: "Standing_Military_Press"
          },
          { 
            id: "d1-e3-alt2", name: "Arnold Dumbbell Press", arabicName: "تمرين أرنولد بريس بالدمبلز (بديل 2)", equipment: "دمبلز + دكة 90 درجة", whyUseIt: "يدور الكتف 180 درجة ويستهدف الرأس الأمامية والجانبية معا.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["ابدأ بالدمبلز أمام صدرك وكفك باصص لوشك.", "لف دراعك لبرة وأنت بتدفع لفوق حتى يواجه كفك لقدام."],
            donts: ["استخدام أوزان ثقيلة جداً قد تضغط على مفصل الكتف.", "الإسراع في حركة الدوران دون تحكم."],
            githubFolder: "Arnold_press"
          }
        ]
      },
      { 
        id: "d1-e4", name: "Seated Cable Row", type: "سحب أرضي", sets: 3, reps: "10-12", defaultWeight: 0, notes: "لسمك وكثافة الضهر.", 
        alts: [
          { 
            id: "d1-e4-main", name: "Seated Cable Row", arabicName: "سحب أرضي بالكابل (الرئيسي)", equipment: "جهاز سحب أرضي + مقبض V", whyUseIt: "يوفر مقاومة مستمرة لبناء كثافة عضلات منتصف الظهر.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["افرد ضهرك وحافظ على استقامة الجذع.", "اسحب المقبض باتجاه السرة مع ضم لوحي الكتف لبعض."],
            donts: ["التمرجح بالجذع للأمام والخلف أثناء السحب.", "سحب الوزن باستخدام ذراعيك فقط."],
            githubFolder: "Seated_Cable_Rows"
          },
          { 
            id: "d1-e4-alt1", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "لو جهاز السحب مالي الجيم، بيدي مدى حركي أعمق وعزل فردي لكل ناحية.", defaultWeight: 0, defaultReps: "10",
            dos: ["اسحب الدمبل باتجاه جيب البنطلون (الورك) وليس السدر.", "حافظ على ظهرك موازي للأرض ومفرود."],
            donts: ["لف الجذع وفتح الصدر للأعلى أثناء السحب.", "ترك الدمبل يسقط بسرعة دون التحكم في النزول."],
            githubFolder: "One-Arm_Dumbbell_Row"
          },
          { 
            id: "d1-e4-alt2", name: "T-Bar Row", arabicName: "سحب تي بار T-Bar (بديل 2)", equipment: "بار T-Bar أو بار بالزاوية", whyUseIt: "يسمح بحمل أوزان أثقل لبناء سمك وضخامة الظهر.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["اثني ركبتك سنة وانحني بظهرك 45 درجة مع الحفاظ على استقامته.", "اسحب البار باتجاه أسفل بطنك مع اعتصار الظهر."],
            donts: ["تقوس الظهر السفلي أثناء حمل الوزن الثقيل.", "الوقوف بشكل عمودي وتقليل المدى الحركي."],
            githubFolder: "T-Bar_Row"
          }
        ]
      },
      { 
        id: "d1-e5", name: "Bicep Curls", type: "بايسبس", sets: 3, reps: "12", defaultWeight: 0, notes: "تكبير عضلة الباي.", 
        alts: [
          { 
            id: "d1-e5-main", name: "Dumbbell Alternate Curl", arabicName: "تبادل باي بالدمبلز (الرئيسي)", equipment: "دمبلز", whyUseIt: "يسمح بتدوير الساعد (Supination) لتكبير وتدوير البايسبس.", defaultWeight: 0, defaultReps: "12",
            dos: ["ثبت كوعك بجانب جسمك دون تحريكه للأمام.", "لف معصمك للأعلى في قمة الحركة واعتصر الباي ثانية."],
            donts: ["استخدام المرجحة بالظهر لرفع الدمبل.", "إسقاط الوزن بسرعة أثناء النزول."],
            githubFolder: "Dumbbell_Alternate_Bicep_Curl"
          },
          { 
            id: "d1-e5-alt1", name: "EZ-Bar Bicep Curl", arabicName: "بايسبس بالبار الزيجزاج EZ (بديل 1)", equipment: "بار EZ + طارات", whyUseIt: "يريح مفاصل المعصم ويسمح بحمل أوزان أكبر لبناء الحجم.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["امسك البار الزيجزاج من الانحناء المريح لمعصمك.", "اطلع بالبار لحد أعلى الصدر مع ثبات الكوع."],
            donts: ["تحريك الكوع للأمام وللأعلى لتسهيل الحركة.", "تقوس الظهر لرفع الأوزان الثقيلة."],
            githubFolder: "EZ-Bar_Curl"
          },
          { 
            id: "d1-e5-alt2", name: "Cable Bicep Curl", arabicName: "بايسبس بالكابل السفلي (بديل 2)", equipment: "جهاز كابل سفلي + مستقيم", whyUseIt: "يحافظ على الشد والمقاومة المستمرة في كل زوايا الحركة.", defaultWeight: 0, defaultReps: "12-15",
            dos: ["قف مستقيماً أمام الكابل وثبت الكوعين بجانب الجذع.", "اسحب مقبض الكابل باتجاه الكتفين ببطء."],
            donts: ["الرجوع للجلف بالجسم أثناء السحب.", "ترك الكابل يسحب ذراعيك بسرعة."],
            githubFolder: "Cable_Preacher_Curl"
          }
        ]
      },
      { 
        id: "d1-e6", name: "Tricep Pushdown", type: "ترايسبس", sets: 3, reps: "12", defaultWeight: 0, notes: "تفصيل الترايسبس.", 
        alts: [
          { 
            id: "d1-e6-main", name: "Cable Rope Pushdown", arabicName: "ترايسبس بالحبل على الكابل (الرئيسي)", equipment: "كابل عالي + حبل", whyUseIt: "يعزل الرأس الجانبية والخارجية للترايسبس بامتياز.", defaultWeight: 0, defaultReps: "12",
            dos: ["ثبت كوعك بجانب اضلاعك تماماً.", "افرد ذراعك لأسفل وافتح الحبل للخارج في النهاية."],
            donts: ["ترك الكوع يتحرك للأمام وللأعلى أثناء الصعود.", "الانحناء فوق الحبل بوزن الجسم."],
            githubFolder: "Triceps_Pushdown"
          },
          { 
            id: "d1-e6-alt1", name: "Overhead Dumbbell Extension", arabicName: "ترايسبس خلف الرأس بالدمبل (بديل 1)", equipment: "دمبل واحد تقيل", whyUseIt: "يستهدف الرأس الطويلة للترايسبس (Long Head) لاستطالة فائقة.", defaultWeight: 0, defaultReps: "10-12",
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
        id: "d2-e1", name: "Squats", type: "بار أو جهاز", sets: 3, reps: "8-10", defaultWeight: 0, notes: "ملك تمارين الرجل.", 
        alts: [
          { 
            id: "d2-e1-main", name: "Barbell Back Squat", arabicName: "سكوات خلفي بالبار (الرئيسي)", equipment: "بار مستقيم + راك السكوات", whyUseIt: "التمرين الأساسي الأول لبناء قوة عضلات الساقين والجذع.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["انزل لحد ما يكون الفخذ موازي للأرض على الأقل.", "وزع الوزن بالتساوي على كعب القدم ومشط القدم.", "ادفع بالركبتين للخارج في نفس اتجاه أصابع القدم."],
            donts: ["دخول الركبتين للداخل أثناء الصعود (Knee Cave).", "رفع الكعبين عن الأرض أثناء النزول."],
            githubFolder: "Barbell_Full_Squat"
          },
          { 
            id: "d2-e1-alt1", name: "Goblet Dumbbell Squat", arabicName: "سكوات جوبلت بالدمبل (بديل 1)", equipment: "دمبل واحد تقيل", whyUseIt: "لو الراك مشغول، سهل الأداء ويحافظ على استقامة الظهر تلقائياً.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["احمل الدمبل رأسياً أمام صدرك مباشرة بين كفيك.", "انزل بين رجليك مع إبقاء الصدر مرفوعاً والظهر مستقيماً."],
            donts: ["الانحناء للجذع للأمام وسقوط الدمبل لأسفل.", "النزول السريع دون التحكم بالوزن."],
            githubFolder: "Goblet_Squat"
          },
          { 
            id: "d2-e1-alt2", name: "Smith Machine Squat", arabicName: "سكوات على جهاز السميث (بديل 2)", equipment: "جهاز سميث", whyUseIt: "يوفر مسار ثابت وأمان عالي للتركيز الكامل على العضلات الأمامية.", defaultWeight: 0, defaultReps: "10",
            dos: ["ضع قدميك لقدام سنة أمام مسار البار لحماية الركبة.", "انزل بسلاسة حتى يوازي فخذك الأرض ثم ادفع بالكعبين."],
            donts: ["وضع القدمين أسفل البار مباشرة بفرط ضغط على الركبة.", "قفل مفصل الركبة بحدة فوق."],
            githubFolder: "Smith_machine_squat"
          }
        ]
      },
      { 
        id: "d2-e2", name: "Romanian Deadlift (RDL)", type: "بار أو دمبل", sets: 3, reps: "8-10", defaultWeight: 0, notes: "قوة التسديد والخلفيات.", 
        alts: [
          { 
            id: "d2-e2-main", name: "Barbell RDL", arabicName: "ديدليفت روماني بالبار (الرئيسي)", equipment: "بار مستقيم", whyUseIt: "يبني قوة التسديد في الكورة وعضلات خلفيات الفخذ والجلوتس.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["ادفع بحوضك للخلف (Hinge) مع ثني بسيط جداً بالركبة.", "مرر البار ملاصقاً لرجلك حتى أسفل الركبة واشعر بالاستطالة."],
            donts: ["تقوس الظهر السفلي (Rounding) أثناء النزول.", "ثني الركبتين لأسفل كأنك تعمل سكوات."],
            githubFolder: "Stiff-Legged_Barbell_Deadlift"
          },
          { 
            id: "d2-e2-alt1", name: "Dumbbell RDL", arabicName: "ديدليفت روماني بالدمبلز (بديل 1)", equipment: "دمبلز", whyUseIt: "يسمح بحرية حركة المعصم والحركة الطبيعية للحوض.", defaultWeight: 0, defaultReps: "10",
            dos: ["امسك الدمبلز بجانب الفخذين وادفع بالحوض للخلف.", "حافظ على استقامة الظهر ونظرك متوجه للأرض أماما."],
            donts: ["ترك الدمبلز تبتعد عن الساقين أثناء النزول.", "رفع الوزن باستخدام ظهرك بدلاً من اعتصار الجلوتس."],
            githubFolder: "Romanian_Deadlift_With_Dumbbells"
          },
          { 
            id: "d2-e2-alt2", name: "Single-Leg Dumbbell RDL", arabicName: "ديدليفت روماني رجل واحدة (بديل 2)", equipment: "دمبل واحد", whyUseIt: "تمرين توازن حركي ممتاز جداً لتثبيت الركبة ومنع إصابات الملعب.", defaultWeight: 0, defaultReps: "8 لكل رجل",
            dos: ["اقف على رجل واحدة وارجع بالرجل الثانية للخلف متوازية مع الجذع.", "انزل بالدمبل ببطء واشعر باستطالة خلفية الرجل الثابتة."],
            donts: ["لف الحوض للخارج أثناء النزول.", "فقدان التوازن والإسراع في الحركة."],
            githubFolder: "Single-Leg_Deadlift_With_Dumbbells"
          }
        ]
      },
      { 
        id: "d2-e3", name: "Leg Extensions", type: "جهاز أمامي", sets: 3, reps: "12", defaultWeight: 0, notes: "عزل الأماميات.", 
        alts: [
          { 
            id: "d2-e3-main", name: "Machine Leg Extension", arabicName: "جهاز أمامي رجل (الرئيسي)", equipment: "جهاز الأماميات", whyUseIt: "يعزل العضلة الرباعية الأمامية (Quads) بنسبة 100% فوق مفصل الركبة.", defaultWeight: 0, defaultReps: "12",
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
            id: "d2-e3-alt2", name: "Dumbbell Pass Leg Extension", arabicName: "أمامي بالدمبل على الدكة (بديل 2)", equipment: "دمبل بين القدمين + دكة", whyUseIt: "لو جهاز الأماميات عطلان أو ممتلئ بالجيم.", defaultWeight: 0, defaultReps: "12",
            dos: ["اجلس على حافة الدكة وثبت الدمبل بين قدميك جيداً.", "ارفع قدميك لأعلى لفرد الساقين واعتصر العضلات الأمامية."],
            donts: ["سقوط الدمبل أثناء الحركة (استخدم وزناً متوازناً).", "تحريك الفخذين لأعلى أثناء الفرد."],
            githubFolder: "Dumbbell_pass"
          }
        ]
      },
      { 
        id: "d2-e4", name: "Calf Raises", type: "سمانة", sets: 4, reps: "15", defaultWeight: 0, notes: "قوة القفز وتجنب الشد العضلي.", 
        alts: [
          { 
            id: "d2-e4-main", name: "Standing Calf Raise", arabicName: "سمانة واقفا (الرئيسي)", equipment: "جهاز السمانة / استيب", whyUseIt: "تستهدف العضلة التوأمية السطحية (Gastrocnemius) لقوة القفز.", defaultWeight: 0, defaultReps: "15",
            dos: ["اطلع على أمشاط قدميك لأقصى ارتفاع ممكن واثبت ثانية.", "انزل ببطء لأسفل مستوى الاستيب لاستطالة كاملة."],
            donts: ["النط السريع (Bouncing) باستخدام أوتار القدم.", "ثني الركبتين أثناء الصعود."],
            githubFolder: "Standing_Calf_Raises"
          },
          { 
            id: "d2-e4-alt1", name: "Seated Dumbbell Calf Raise", arabicName: "سمانة جالس بالدمبلز (بديل 1)", equipment: "دكة + دمبل على الركبة", whyUseIt: "تستهدف عضلة السمانة العميقة (Soleus) لحماية أوتار الساق.", defaultWeight: 0, defaultReps: "15-20",
            dos: ["ضع مشط قدمك على بلوك أو طارة وضع الدمبل على ركبتك.", "ارفع الكعبين لأعلى نقطة وانزل ببطء هادئ."],
            donts: ["رفع الدمبل باستخدام يديك بدل عضلات السمانة.", "تقليل المدى الحركي."],
            githubFolder: "Seated_Calf_Raise"
          },
          { 
            id: "d2-e4-alt2", name: "Leg Press Calf Press", arabicName: "سمانة على جهاز الليج بريس (بديل 2)", equipment: "جهاز leg press", whyUseIt: "تسمح بحمل أوزان تقيلة في أمان تام دون تحميل على العمود الفقري.", defaultWeight: 0, defaultReps: "12-15",
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
        id: "d4-e1", name: "Incline Dumbbell Press", type: "صدر عالي دمبل", sets: 3, reps: "8-10", defaultWeight: 0, notes: "تعريض الصدر العالي.", 
        alts: [
          { 
            id: "d4-e1-main", name: "Incline Dumbbell Press", arabicName: "تجميع صدر عالي بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة مائلة 30 درجة", whyUseIt: "أفضل تمرين لملء وتكبير عضلات الصدر العالي بالكامل.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["اضبط زاوية الدكة على 30 درجة لعدم تشغيل الكتف بفرط.", "انزل بالدمبلز بجانب الصدر العالي واضغط لأعلى."],
            donts: ["فتح الكوع بزاوية 90 درجة مع الجسم.", "رفع الدكة لزاوية قائمة 60 درجة."],
            githubFolder: "Incline_Dumbbell_Press"
          },
          { 
            id: "d4-e1-alt1", name: "Incline Barbell Press", arabicName: "بنش عالي بالبار (بديل 1)", equipment: "بار + دكة عالي", whyUseIt: "يسمح بحمل أوزان أثقل لزيادة القوة البنائية الإجمالية للصدر.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["امسك البار أوسع من كتفك بقليل وانزل به لترقوة الصدر.", "ادفع البار لأعلى بثبات وقوة."],
            donts: ["خبط البار بالصدر بقوة للارتداد.", "قفل مفصل الكوع بفرط فوق."],
            githubFolder: "Barbell_Incline_Bench_Press_-_Medium_Grip"
          },
          { 
            id: "d4-e1-alt2", name: "Incline Dumbbell Flyes", arabicName: "تفتيح عالي بالدمبلز (بديل 2)", equipment: "دمبلز خفيفة + دكة مائلة", whyUseIt: "يعطي استطالة وتوسيع رائع لألياف الصدر العالي.", defaultWeight: 0, defaultReps: "12",
            dos: ["اثني كوعك سنة بسيطة وافتح ذراعيك للخارج كأنك تحضن شجرة.", "اضم الدمبلز لأعلى بالتركيز على عصر الصدر."],
            donts: ["فرد الذراعين بالكامل أثناء النزول.", "النزول بأوزان ثقيلة جداً تضر الكتف."],
            githubFolder: "Incline_Dumbbell_Flyes"
          }
        ]
      },
      { 
        id: "d4-e2", name: "Dumbbell Rows", type: "منشار", sets: 3, reps: "8-10", defaultWeight: 0, notes: "سمك الضهر النصفي.", 
        alts: [
          { 
            id: "d4-e2-main", name: "One-Arm Dumbbell Row", arabicName: "منشار بالدمبل إيد واحدة (الرئيسي)", equipment: "دمبل + دكة مستوية", whyUseIt: "مدى حركي كبير وتركيز فردي قوي على عضلات المجنص والظهر.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["اسحب الدمبل باتجاه الورك وليس الصدر.", "اعتصر عضلات ظهرك في قمة السحب."],
            donts: ["لف الجسم والكتف للأعلى لتسهيل الوزن.", "سقوط الدمبل المفاجئ."],
            githubFolder: "One-Arm_Dumbbell_Row"
          },
          { 
            id: "d4-e2-alt1", name: "Chest Supported Incline Row", arabicName: "سحب دمبلز سند صدر على الدكة (بديل 1)", equipment: "دمبلز + دكة مائلة 45", whyUseIt: "يلغي أي تحميل أو إجهاد على أسفل الظهر تماماً.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["انبطح بفقرات صدرك على الدكة المائلة ودع الذراعين يتدليان.", "اسحب الدمبلز لأعلى باتجاه الخصر مع ضم لوحي الكتف."],
            donts: ["رفع الصدر عن الدكة أثناء السحب.", "استخدام الأذرع بدلاً من عضلات الظهر."],
            githubFolder: "Dumbbell_Incline_Row"
          },
          { 
            id: "d4-e2-alt2", name: "Bent-Over Barbell Row", arabicName: "سحب بار بانحناء ظهر (بديل 2)", equipment: "بار مستقيم + طارات", whyUseIt: "يبني كتلة ضخمة وشاملة لجميع عضلات الظهر.", defaultWeight: 0, defaultReps: "8-10",
            dos: ["انحني بظهرك 45 درجة وثبت القطنية والجذع.", "اسحب البار باتجاه السرة مع الحفاظ على استقامة الظهر."],
            donts: ["تقوس الظهر السفلي أثناء التمريين.", "رفع الجذع لأعلى مع كل تكرار."],
            githubFolder: "Bent_Over_Two-Arm_Long_Barbell_Row"
          }
        ]
      },
      { 
        id: "d4-e3", name: "Lateral Raises", type: "رفرفة جانبي", sets: 3, reps: "12-15", defaultWeight: 0, notes: "تعريض الكتف الجانبي.", 
        alts: [
          { 
            id: "d4-e3-main", name: "Dumbbell Lateral Raise", arabicName: "رفرفة جانبي بالدمبلز واقفا (الرئيسي)", equipment: "دمبلز خفيفة", whyUseIt: "يعطي شكل الكتف الكروي العريض (3D Shoulder Shape).", defaultWeight: 0, defaultReps: "12-15",
            dos: ["ارفع الذراعين مايلاً لقدام 30 درجة في مستوى (Scapular plane).", "خلي الكوع أعلى قليلاً من المعصم أثناء الرفع."],
            donts: ["رفع الدمبلز أعلى من مستوى الكتف.", "استخدام المرجحة بالترابيز والجسم."],
            githubFolder: "Side_Lateral_Raise"
          },
          { 
            id: "d4-e3-alt1", name: "Cable Lateral Raise", arabicName: "رفرفة جانبي بالكابل السفلي (بديل 1)", equipment: "كابل سفلي + مقبض", whyUseIt: "يوفر مقاومة وشد مستمر من بداية الحركة من أسفل حتى الأفق.", defaultWeight: 0.5, defaultReps: "12-15",
            dos: ["اسحب الكابل من خلف ظهرك أو من أمامك ببطء.", "ارفع المقبض حتى مستوى الكتف باعتصار جانبي."],
            donts: ["سحب الكابل بسرعة خاطفة.", "الانحناء للجوانب أثناء الرفع."],
            githubFolder: "Cable_Lateral_Raise"
          },
          { 
            id: "d4-e3-alt2", name: "Seated Dumbbell Lateral Raise", arabicName: "رفرفة جانبي جالساً على الدكة (بديل 2)", equipment: "دمبلز + دكة 90", whyUseIt: "يمنع المرجحة بالجسم نهائياً لضمان العزل الصافي للكتف الجانبي.", defaultWeight: 0, defaultReps: "15",
            dos: ["اجلس مستقيماً على الدكة وارفع الدمبلز للخارج بثبات.", "ثبت جذعك كاملاً على المسند."],
            donts: ["استخدام الزخم للحركة.", "رفع الأوزان الثقيلة جداً."],
            githubFolder: "Seated_Dumbbell_Lateral_Raise"
          }
        ]
      },
      { 
        id: "d4-e4", name: "Face Pulls", type: "كابل", sets: 3, reps: "15", defaultWeight: 0, notes: "تأهيل الكتف وتصليح الأتب.", 
        alts: [
          { 
            id: "d4-e4-main", name: "Cable Face Pulls", arabicName: "فيس بول بالحبل على الكابل (الرئيسي)", equipment: "كابل عالي + حبل", whyUseIt: "يحسن صحة مفصل الكتف ويستهدف الكتف الخلفي وعضلات الأتب.", defaultWeight: 0, defaultReps: "15",
            dos: ["اضبط الكابل في مستوى العين واسحب الحبل باتجاه الجبهة/العينين.", "افتح الحبل للخارج واعتصر الكتف الخلفي."],
            donts: ["سحب الحبل باتجاه الصدر أو الذقن.", "حمل أوزان ثقيلة تسبب الانحناء للخلف."],
            githubFolder: "Face_Pull"
          },
          { 
            id: "d4-e4-alt1", name: "Seated Rear Delt Raise", arabicName: "رفرفة خلفي جالساً بالدمبلز (بديل 1)", equipment: "دمبلز خفيفة + دكة", whyUseIt: "بديل ممتاز بالدمبلز لعزل عضلات الكتف الخلفي.", defaultWeight: 0, defaultReps: "15",
            dos: ["انحني بجذعك فوق فخذيك وارفع الدمبلز للخارج وللأعلى.", "احرص على توجيه الكوعين للسقف أثناء الرفرفة."],
            donts: ["رفع الجذع لأعلى أثناء التكرارات.", "استخدام عضلات البايسبس."],
            githubFolder: "Seated_Rear_Delt_Raise"
          },
          { 
            id: "d4-e4-alt2", name: "Reverse Cable Flyes", arabicName: "تفتيح خلفي على جهاز الكابل (بديل 2)", equipment: "كابل مزدوج", whyUseIt: "يوفر تركيز دقيق للغاية بدون أي ضغط على مفاصل المعصم.", defaultWeight: 0, defaultReps: "15",
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
        id: "d4-e6", name: "Russian Twists", type: "بطن جانبي", sets: 3, reps: "15", defaultWeight: 0, notes: "للاحتكاكات واللف في الملعب.", 
        alts: [
          { 
            id: "d4-e6-main", name: "Russian Twist with Plate", arabicName: "رشان تويست بالطارة أو الدمبل (الرئيسي)", equipment: "طارة / دمبل", whyUseIt: "يقوي عضلات الخواصر والبطن الجانبية والقدرة على الدوران في الملعب.", defaultWeight: 0, defaultReps: "15 لكل جانب",
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
        id: "d5-e1", name: "Bulgarian Split Squats", type: "دمبل", sets: 3, reps: "8-10 لكل رجل", defaultWeight: 0, notes: "لتغيير الاتجاهات السريعة في الكورة.", 
        alts: [
          { 
            id: "d5-e1-main", name: "Bulgarian Split Squats", arabicName: "سكوات بلغاري بالدمبلز (الرئيسي)", equipment: "دمبلز + دكة خلفية", whyUseIt: "أفضل تمرين لبناء ثبات الركبة والقوة الفردية لكل قدم للاعبي كرة القدم.", defaultWeight: 0, defaultReps: "8-10 لكل رجل",
            dos: ["ضع مشط القدم الخلفية على الدكة وانزل بالركبة الخلفية للأرض.", "ميل بالجذع للأمام 15 درجة لاستهداف عضلات الجلوتس."],
            donts: ["خروج الركبة الأمامية بفرط بعيداً عن مشط القدم.", "الوقوف قريب جداً أو بعيد جداً عن الدكة."],
            githubFolder: "Dumbbell_Lunges"
          },
          { 
            id: "d5-e1-alt1", name: "Dumbbell Walking Lunges", arabicName: "طعن مشي بالدمبلز (بديل 1)", equipment: "دمبلز + مسار مشي", whyUseIt: "ديناميكي للغاية ويحاكي حركة الجري والطعن الميداني في الملعب.", defaultWeight: 0, defaultReps: "10 خطوات لكل رجل",
            dos: ["انزل بركبتك الخلفية لقرب الأرض واخطو بثبات للأمام.", "حافظ على استقامة الجذع والصدر مرفوعاً."],
            donts: ["الميل العنيف للجذع للأمام أثناء المشي.", "ضرب الركبة الخلفية بالأرض بقوة."],
            githubFolder: "Dumbbell_Walking_Lunge"
          },
          { 
            id: "d5-e1-alt2", name: "Barbell Reverse Lunge", arabicName: "طعن رجوع للخلف بالبار (بديل 2)", equipment: "بار عالي + طارات", whyUseIt: "يحمي الركبة ويستهدف الجلوتس والخلفيات بكفاءة تامة.", defaultWeight: 0, defaultReps: "8-10 لكل رجل",
            dos: ["احمل البار على أعلى الظهر واخطو بخطوة واسعة للخلف.", "انزل عمودياً واعتصر القدم الأمامية عند الصعود."],
            donts: ["فقدان التوازن أثناء الرجوع للخلف.", "تحميل الوزن على مشط القدم الخلفية."],
            githubFolder: "Barbell_Lunge"
          }
        ]
      },
      { 
        id: "d5-e2", name: "Leg Curls", type: "خلفيات أجهزة", sets: 3, reps: "12", defaultWeight: 0, notes: "تجنب إصابات الضمة والخلفية.", 
        alts: [
          { 
            id: "d5-e2-main", name: "Seated Leg Curl", arabicName: "جهاز خلفيات رجل جالس (الرئيسي)", equipment: "جهاز خلفيات جالس", whyUseIt: "يعزل عضلات الهامسترينج الخلفية في وضع استطالة لحمايتها من التمزق.", defaultWeight: 0, defaultReps: "12",
            dos: ["اضبط محور دوران الجهاز مع ركبتك واقفل المسند على الفخذين.", "اسحب الوسادة لأسفل بقوة واعتصر خلفيات الساق."],
            donts: ["رفع الفخذين عن الكرسي أثناء السحب.", "النزول السريع الخاطف."],
            githubFolder: "Seated_Leg_Curl"
          },
          { 
            id: "d5-e2-alt1", name: "Dumbbell Lying Leg Curl", arabicName: "خلفيات بالدمبل مستلقي (بديل 1)", equipment: "دمبل + دكة مستوية", whyUseIt: "بديل ذكي ممتاز بوزن حر لو جهاز الخلفيات ممتلئ بالجيم.", defaultWeight: 0, defaultReps: "10-12",
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
        id: "d5-e3", name: "Leg Press", type: "جهاز رجل", sets: 3, reps: "10-12", defaultWeight: 0, notes: "قوة الدفع.", 
        alts: [
          { 
            id: "d5-e3-main", name: "45 Leg Press Machine", arabicName: "جهاز مكبس الرجلين Leg Press (الرئيسي)", equipment: "جهاز مكبس 45 درجة", whyUseIt: "يسمح بحمل أوزان ضخمة لزيادة قوة الدفع السفلي في أمان تام.", defaultWeight: 0, defaultReps: "10-12",
            dos: ["ضع قدميك بعرض الكتفين في منتصف المنصة.", "انزل بالمنصة حتى زاوية 90 بالركبة ثم ادفع بالكعبين."],
            donts: ["قفل مفصل الركبة بالكامل (Lockout) في الأعلى.", "رفع أسفل الظهر عن الكرسي أثناء النزول."],
            githubFolder: "Leg_Press"
          },
          { 
            id: "d5-e3-alt1", name: "Hack Squat Machine", arabicName: "جهاز هاك سكوات Hack Squat (بديل 1)", equipment: "جهاز الهاك", whyUseIt: "تركيز ناري ومباشر على العضلات الأمامية فوق الركبة.", defaultWeight: 0, defaultReps: "10",
            dos: ["ثبت كتفيك وظهرك كاملاً على الكرسي المائل.", "انزل حتى يوازي فخذك المنصة واعتصر الأماميات عند الصعود."],
            donts: ["رفع الكعبين عن المنصة.", "قفل الركبة بحدة في أعلى نقطة."],
            githubFolder: "Hack_Squat"
          },
          { 
            id: "d5-e3-alt2", name: "Dumbbell Step-Ups", arabicName: "صعود على الصندوق بالدمبلز (بديل 2)", equipment: "دمبلز + صندوق Box/دكة", whyUseIt: "يبني قوة دفع انفجارية لكل قدم وتوافق أداء حركي ميداني.", defaultWeight: 0, defaultReps: "10 لكل رجل",
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