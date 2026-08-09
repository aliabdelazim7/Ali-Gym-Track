import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Add imports if needed
if (!appCode.includes('Smartphone')) {
  appCode = appCode.replace(
    "import { \n  Dumbbell,",
    "import { \n  Smartphone, Sun, Lock, Unlock, DownloadCloud, Dumbbell,"
  );
}

// 2. Add Mobile State & Wake Lock logic inside App component
const stateInsertTarget = "export default function App() {\n  const [mainTab, setMainTab] = useState('workout');";
const stateInsertReplacement = `export default function App() {
  const [mainTab, setMainTab] = useState('workout');
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

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
      alert("📱 لتثبيت التطبيق على الموبايل:\\n• iPhone (Safari): اضغط زر المشاركة ⎋ ثم (إضافة إلى الشاشة الرئيسية Add to Home Screen).\\n• Android (Chrome): اضغط القائمة ⠇ ثم (تثبيت التطبيق Install App).");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };`;

if (!appCode.includes('toggleWakeLock')) {
  appCode = appCode.replace(stateInsertTarget, stateInsertReplacement);
}

// 3. Update Header layout with Wake Lock Button & PWA Install Banner
const headerTarget = `<header className="max-w-3xl mx-auto mb-5 font-arabic">`;
const headerReplacement = `<header className="max-w-3xl mx-auto mb-4 font-arabic">
        {/* PWA Install Banner for Mobile */}
        {showInstallBanner && (
          <div className="mb-3 bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/60 border border-blue-500/40 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-2 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="bg-blue-500/20 text-blue-400 p-2 rounded-xl border border-blue-500/30 shrink-0">
                <Smartphone className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">تثبيت تطبيق علي جيم تراك 📱</h4>
                <p className="text-[11px] text-slate-300">استخدام سريع أوفلاين كـ App من الشاشة الرئيسية بدون إنترنت</p>
              </div>
            </div>
            <button
              onClick={handleInstallPWA}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md shrink-0 active-press"
            >
              تثبيت الآن
            </button>
          </div>
        )}`;

if (!appCode.includes('PWA Install Banner for Mobile')) {
  appCode = appCode.replace(headerTarget, headerReplacement);
}

// 4. Add Gym Wake Lock Toggle Button in Header Controls
const headerControlsTarget = `<button 
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className={\`p-2 rounded-xl text-xs font-bold transition-all \${soundEnabled ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30' : 'text-slate-500'}\`}
              title={soundEnabled ? "الصوت مفعل" : "الصوت مكتوم"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>`;

const headerControlsReplacement = `<button 
              type="button"
              onClick={toggleWakeLock} 
              className={\`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border active-press \${isWakeLockActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950/40 glow-orange' : 'bg-slate-950 text-slate-400 border-slate-800'}\`}
              title={isWakeLockActive ? "وضع الشاشة المضاءة مفعل" : "تفعيل إبقاء الشاشة مضاءة"}
            >
              <Sun className={\`w-3.5 h-3.5 \${isWakeLockActive ? 'text-amber-400 animate-spin-slow' : ''}\`} />
              <span className="hidden xs:inline">{isWakeLockActive ? "شاشة مضاءة 🔥" : "إبقاء الشاشة"}</span>
            </button>
            <button 
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className={\`p-2 rounded-xl text-xs font-bold transition-all \${soundEnabled ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30' : 'text-slate-500'}\`}
              title={soundEnabled ? "الصوت مفعل" : "الصوت مكتوم"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>`;

if (!appCode.includes('toggleWakeLock')) {
  appCode = appCode.replace(headerControlsTarget, headerControlsReplacement);
}

// 5. Replace Fixed Bottom End Day button with Floating Mobile App Navigation Bar
const bottomNavTarget = `<div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-40 flex justify-center backdrop-blur-md">
        <button 
          onClick={handleEndDay}
          className="w-full max-w-sm flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white py-3.5 rounded-2xl font-extrabold font-arabic shadow-xl shadow-orange-950/40 transition-all transform active-press border border-orange-400/30 text-sm sm:text-base"
        >
          <Trophy className="w-5 h-5 text-amber-300" />
          تقفيل اليوم والتقييم النهائي 🏆
        </button>
      </div>`;

const bottomNavReplacement = `/* Mobile Native Bottom Glass Navigation Bar */
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 pb-safe shadow-2xl font-arabic">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('workout'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'workout' ? 'text-orange-400 font-extrabold bg-orange-500/10 border border-orange-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px]">التمرين</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('nutrition'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'nutrition' ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px]">التغذية</span>
          </button>

          {/* Center Action Button: End Day */}
          <button
            type="button"
            onClick={handleEndDay}
            className="px-3 py-2 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 text-white font-black text-xs shadow-lg shadow-orange-950/50 flex flex-col items-center justify-center gap-0.5 border border-amber-300/40 active-press glow-orange"
          >
            <Trophy className="w-5 h-5 text-amber-200" />
            <span className="text-[9px] font-bold">تقفيل اليوم</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('analytics'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'analytics' ? 'text-blue-400 font-extrabold bg-blue-500/10 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px]">الأوزان</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('achievements'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'achievements' ? 'text-purple-400 font-extrabold bg-purple-500/10 border border-purple-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px]">الأوسمة</span>
          </button>
        </div>
      </div>`;

appCode = appCode.replace(bottomNavTarget, bottomNavReplacement);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully upgraded App.jsx with PWA Install Banner, Screen Wake Lock Engine, and Mobile Native Glass Bottom Navigation Bar!');
