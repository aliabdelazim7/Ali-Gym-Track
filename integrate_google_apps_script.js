import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Google Apps Script Custom Hook Definition
const appsScriptHookCode = `
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
    return localStorage.getItem('gymAppsScriptUrl') || '';
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
      const urlWithAction = targetUrl.includes('?') ? \`\${targetUrl}&action=getData\` : \`\${targetUrl}?action=getData\`;
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
    } catch (e) {
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
    } catch (e) {
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
`;

// Insert appsScriptHookCode right before `// ================= MAIN APPLICATION =================`
appCode = appCode.replace(
  '// ================= MAIN APPLICATION =================',
  appsScriptHookCode + '\n// ================= MAIN APPLICATION ================='
);

// 2. Instantiate hook inside MainApp
const hookInstantiation = `  const appsScriptSync = useAppsScriptSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    triggerHaptic
  );`;

appCode = appCode.replace(
  'const cloudSync = useCloudSync(',
  hookInstantiation + '\n  const cloudSync = useCloudSync('
);

// 3. Add Google Sheets button to Header
const headerBtnJSX = `            <button 
              type="button"
              onClick={() => appsScriptSync.setShowAppsScriptModal(true)} 
              className={\`p-2 rounded-xl transition-all border font-bold flex items-center gap-1 text-xs \${appsScriptSync.appsScriptUrl ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400'}\`}
              title="ربط ومزامنة شيت جوجل (Google Sheets / Apps Script)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">جوجل شيت</span>
              <span className={\`w-2 h-2 rounded-full \${appsScriptSync.appsScriptUrl ? 'bg-emerald-400' : 'bg-slate-600'}\`}></span>
            </button>`;

appCode = appCode.replace(
  '<button \n              type="button"\n              onClick={() => cloudSync.setShowCloudModal(true)}',
  headerBtnJSX + '\n            <button \n              type="button"\n              onClick={() => cloudSync.setShowCloudModal(true)}'
);

// 4. Add Google Apps Script Modal JSX before closing MainApp div
const appsScriptModalJSX = `
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
                <span className={\`font-bold \${appsScriptSync.appsScriptUrl ? 'text-emerald-400' : 'text-slate-500'}\`}>
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
                <ChevronDown className={\`w-4 h-4 transition-transform \${appsScriptSync.showCodeGuide ? 'rotate-180' : ''}\`} />
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
                    <pre>{\`function doGet(e) {
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
}\`}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;

appCode = appCode.replace(
  '{cloudSync.showCloudModal && (',
  appsScriptModalJSX + '\n      {cloudSync.showCloudModal && ('
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully integrated Google Apps Script & Sheets engine into App.jsx!');
