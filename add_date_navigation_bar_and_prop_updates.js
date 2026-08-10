import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Update ErgonomicExerciseCard invocation inside MainApp to use currentWorkoutProgress, currentExerciseWeights, currentExerciseReps
appCode = appCode.replace(
  `completedSets={workoutProgress[exercise.id] || 0}`,
  `completedSets={currentWorkoutProgress[exercise.id] || 0}`
);
appCode = appCode.replace(
  `exerciseWeights={exerciseWeights}`,
  `exerciseWeights={currentExerciseWeights}`
);
appCode = appCode.replace(
  `exerciseReps={exerciseReps}`,
  `exerciseReps={currentExerciseReps}`
);

// 2. Update Nutrition View to use currentDietProgress and currentWaterGlasses
appCode = appCode.replace(
  `<p className="text-[11px] text-slate-400">{waterGlasses} من 8 أكواب (2.5 لتر)</p>`,
  `<p className="text-[11px] text-slate-400">{currentWaterGlasses} من 8 أكواب (2.5 لتر)</p>`
);

appCode = appCode.replace(
  `setWaterGlasses(i + 1 === waterGlasses ? i : i + 1);`,
  `handleWaterChange(i + 1 === currentWaterGlasses ? i : i + 1);`
);

appCode = appCode.replace(
  `i < waterGlasses ? 'bg-blue-500 border border-blue-300'`,
  `i < currentWaterGlasses ? 'bg-blue-500 border border-blue-300'`
);

appCode = appCode.replace(
  `const isDone = dietProgress[meal.id];`,
  `const isDone = currentDietProgress[meal.id];`
);

// 3. Add Date Navigation Bar UI right below Header
const dateNavBarJSX = `
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
              className={\`px-3 py-1.5 rounded-xl font-bold transition-all text-xs \${selectedDate === getYesterdayDateKey() ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}\`}
            >
              أمس
            </button>
            <button
              type="button"
              onClick={() => { triggerHaptic(); setSelectedDate(todayDateKey); }}
              className={\`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 \${isTodaySelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}\`}
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
`;

appCode = appCode.replace('</header>', '</header>\n' + dateNavBarJSX);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully added Date Navigation Bar and updated JSX renders!');
