import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Add handleResetAllData function inside MainApp
const resetAllDataFunction = `  const handleResetAllData = async () => {
    triggerHaptic();
    if (!window.confirm("⚠️ هل أنت تأكد من رغبتك في تصفير كافة البيانات والبدء من الجديد كلياً؟\\nسسيتم مسح كافة التمارين والأوزان والتغذية المسجلة من المتصفح والسحابة وشيت جوجل.")) {
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
  };`;

appCode = appCode.replace(
  'const handleClearBrowserCache = async () => {',
  resetAllDataFunction + '\n\n  const handleClearBrowserCache = async () => {'
);

// Add Clear All Data button next to Export/Import in Header
const headerClearBtn = `            <button 
              type="button"
              onClick={handleResetAllData} 
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
              title="تصفير وإعادة تعيين كافة البيانات والبدء من الجديد 🗑️"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>`;

appCode = appCode.replace(
  '<button \n              type="button"\n              onClick={exportData}',
  headerClearBtn + '\n            <button \n              type="button"\n              onClick={exportData}'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully added handleResetAllData function and button to App.jsx!');
