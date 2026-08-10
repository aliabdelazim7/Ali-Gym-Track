import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Update DEFAULT_CLOUD_BIN_ID
appCode = appCode.replace(
  'const DEFAULT_CLOUD_BIN_ID = "019fe604-c535-71a6-a516-7877bb05e289";',
  'const DEFAULT_CLOUD_BIN_ID = "019febb5-c70b-730c-8fb4-1227a57998ac";'
);

// 2. Refactor parseDateIndexedState to seed yesterday & today for legacy flat objects
const oldParse = `  // Helper to ensure state is an object keyed by date
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
  };`;

const newParse = `  // Helper to ensure state is an object keyed by date (seeds legacy flat data to yesterday & today)
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
        const yesterdayKey = getLocalDateKey(new Date(Date.now() - 86400000));
        return {
          [yesterdayKey]: parsed,
          [todayDateKey]: parsed
        };
      }
      return parsed;
    } catch(e) {
      return {};
    }
  };`;

appCode = appCode.replace(oldParse, newParse);

// 3. Add copyPreviousDayDataToSelected inside MainApp
const quickCopyFunc = `  const copyPreviousDayDataToSelected = () => {
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
  };`;

appCode = appCode.replace(
  'const isTodaySelected = selectedDate === todayDateKey;',
  'const isTodaySelected = selectedDate === todayDateKey;\n' + quickCopyFunc
);

// 4. Update the amber banner JSX safely
const oldBannerTarget = `        {!isTodaySelected && (
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
        )}`;

const newBannerTarget = `        {!isTodaySelected && (
          <div className="mt-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>أنت تستعرض وتسجل الآن لتاريخ سابق: <strong className="font-mono text-white">{formatArabicDate(selectedDate)}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyPreviousDayDataToSelected}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all"
                title="تعبئة بيانات وتمرين هذا اليوم فوراً"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>تعبئة/استرجاع اليوم 📋</span>
              </button>
              <button
                type="button"
                onClick={() => { triggerHaptic(); setSelectedDate(todayDateKey); }}
                className="text-[11px] underline font-bold hover:text-white shrink-0"
              >
                العودة لليوم 🎯
              </button>
            </div>
          </div>
        )}`;

appCode = appCode.replace(oldBannerTarget, newBannerTarget);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully updated App.jsx with clean yesterday migration & quick fill button!');
