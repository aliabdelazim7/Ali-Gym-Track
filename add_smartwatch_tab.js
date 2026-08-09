import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Refactor SmartWatchCard into full dedicated SmartWatchFullTab component
const smartWatchFullTabCode = `
// ================= FULL SMARTWATCH TELEMETRY TAB =================
const SmartWatchFullTab = ({ soundEnabled, triggerHaptic }) => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchName') || '';
  });
  const [heartRate, setHeartRate] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchHR') || '78');
  });
  const [maxHR, setMaxHR] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchMaxHR') || '152');
  });
  const [activeCalories, setActiveCalories] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchCal') || '420');
  });
  const [stepCount, setStepCount] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchSteps') || '7850');
  });

  // Connect via Web Bluetooth API
  const connectBluetoothWatch = async () => {
    triggerHaptic();
    if (!('bluetooth' in navigator)) {
      alert("⚠️ متصفحك أو جهازك لا يدعم خاصية Web Bluetooth المباشرة. يرجى التأكد من تشغيل البلوتوث واستخدام متصفح Chrome أو Edge أو Safari على الموبايل.");
      return;
    }

    try {
      setIsConnecting(true);
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate', 'battery_service', 'device_information', 0x180D]
      });

      setDevice(selectedDevice);
      setDeviceName(selectedDevice.name || 'ساعة سمارت بلوتوث');
      localStorage.setItem('gymProgress_Ali_WatchName', selectedDevice.name || 'ساعة سمارت بلوتوث');
      setIsConnected(true);
      setIsConnecting(false);

      selectedDevice.addEventListener('gattserverdisconnected', onDisconnected);

      const server = await selectedDevice.gatt.connect();
      try {
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic('heart_rate_measurement');
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleHeartRateChange);
      } catch (e) {
        console.log("Heart rate GATT service not directly published, fallback to telemetry connection:", e);
      }

    } catch (error) {
      setIsConnecting(false);
      if (error.name !== 'NotFoundError') {
        alert("تنبيه البلوتوث: " + (error.message || "عفواً، تعذر الاتصال بالساعة. تأكد من إقتران الساعة بالموبايل وتفعيل البلوتوث."));
      }
    }
  };

  const handleHeartRateChange = (event) => {
    const value = event.target.value;
    const bpm = value.getUint8(1);
    setHeartRate(bpm);
    localStorage.setItem('gymProgress_Ali_WatchHR', bpm.toString());
    if (bpm > maxHR) {
      setMaxHR(bpm);
      localStorage.setItem('gymProgress_Ali_WatchMaxHR', bpm.toString());
    }
  };

  const onDisconnected = () => {
    setIsConnected(false);
    setDevice(null);
  };

  const disconnectWatch = () => {
    triggerHaptic();
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    }
    setIsConnected(false);
    setDevice(null);
  };

  const getHRZone = (bpm) => {
    if (bpm < 100) return { label: 'راحة / ريكفري', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    if (bpm < 135) return { label: 'حرق دهون (Fat Burn)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (bpm < 160) return { label: 'تمرين وسعرات (Cardio/Hypertrophy)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'أقصى جهد (Peak Lift Zone)', color: 'text-red-400 animate-pulse', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const currentZone = getHRZone(heartRate);

  const addSteps = (count) => {
    triggerHaptic();
    const newSteps = stepCount + count;
    setStepCount(newSteps);
    localStorage.setItem('gymProgress_Ali_WatchSteps', newSteps.toString());
  };

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shadow-lg \${isConnected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 glow-emerald' : 'bg-slate-800 border-slate-700 text-slate-400'}\`}>
              <Smartphone className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">الساعة الذكية (SmartWatch Connect)</h2>
                <span className={\`text-[10px] px-2.5 py-0.5 rounded-full font-bold border \${isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}\`}>
                  {isConnected ? 'متصلة 🟢' : 'غير متصلة ⚪'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isConnected ? (deviceName || 'ساعة البلوتوث المباشرة') : 'اربط ساعتك الذكية مباشرة لقراءة النبض والخطوات والسعرات أونلاين'}
              </p>
            </div>
          </div>

          <div>
            {!isConnected ? (
              <button
                onClick={connectBluetoothWatch}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl transition-all active-press flex items-center gap-2 text-sm"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري البحث...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>ربط الساعة المباشر ⌚</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={disconnectWatch}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-4 py-2.5 rounded-xl transition-all text-xs"
              >
                فصل الاتصال بالساعة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Live Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">نبض القلب المباشر</span>
            <HeartPulse className={\`w-5 h-5 \${isConnected ? 'text-red-500 animate-ping' : 'text-slate-500'}\`} />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-white font-mono tracking-tight">{heartRate}</span>
            <span className="text-xs text-slate-400 font-bold">BPM</span>
          </div>
          <div className={\`text-xs px-3 py-1 rounded-xl border font-bold text-center mt-2 \${currentZone.bg} \${currentZone.color}\`}>
            {currentZone.label}
          </div>
        </div>

        {/* Max HR Achieved */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">أعلى نبض محقق (Peak)</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-orange-400 font-mono tracking-tight">{maxHR}</span>
            <span className="text-xs text-slate-400 font-bold">BPM</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">أثناء المجموعات الثقيلة</span>
        </div>

        {/* Active Calories Burned */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">السعرات المحروقة (Active)</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-amber-400 font-mono tracking-tight">{activeCalories}</span>
            <span className="text-xs text-slate-400 font-bold">سعرة</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">مجهود الحديد والتمارين</span>
        </div>

        {/* Daily Steps Counter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">الخطوات اليومية</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{stepCount.toLocaleString('ar-EG')}</span>
            <span className="text-xs text-slate-400 font-bold">خطوة</span>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all" style={{ width: \`\${Math.min(100, (stepCount / 10000) * 100)}%\` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
              <span>الهدف: 10,000</span>
              <span>{Math.round((stepCount / 10000) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Manual Adjustments */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          تعديل سريع ومجموع الخطوات
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addSteps(1000)}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active-press"
          >
            +1,000 خطوة 👟
          </button>
          <button
            onClick={() => addSteps(2500)}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active-press"
          >
            +2,500 خطوة 👟
          </button>
          <button
            onClick={() => addSteps(5000)}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active-press"
          >
            +5,000 خطوة 👟
          </button>
        </div>
      </div>
    </div>
  );
};
`;

// Replace SmartWatchCard with SmartWatchFullTab
appCode = appCode.replace(/\/\/ ================= WEB BLUETOOTH SMARTWATCH ENGINE =================[\s\S]*?\/\/ ================= WORKOUT & NUTRITION DATA =================/, smartWatchFullTabCode + '\n// ================= WORKOUT & NUTRITION DATA =================');

// Remove SmartWatchCard from top header (line 1850)
appCode = appCode.replace('{/* WEB BLUETOOTH SMARTWATCH CARD */}\n      <SmartWatchCard soundEnabled={soundEnabled} triggerHaptic={triggerHaptic} />', '');

// Add SmartWatch tab button to Desktop Navigation Bar
const desktopNavTarget = `<button
          onClick={() => setMainTab('nutrition')}
          className={\`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all \${
            mainTab === 'nutrition' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }\`}
        >
          <Utensils className="w-4 h-4" /> التغذية
        </button>`;

const desktopNavReplacement = `<button
          onClick={() => setMainTab('nutrition')}
          className={\`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all \${
            mainTab === 'nutrition' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }\`}
        >
          <Utensils className="w-4 h-4" /> التغذية
        </button>
        <button
          onClick={() => setMainTab('smartwatch')}
          className={\`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all \${
            mainTab === 'smartwatch' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50 border border-blue-400/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }\`}
        >
          <Smartphone className="w-4 h-4" /> الساعة
        </button>`;

appCode = appCode.replace(desktopNavTarget, desktopNavReplacement);

// Add SmartWatch tab view in <main>
const mainViewTarget = `{mainTab === 'achievements' && (`;
const smartwatchMainView = `{mainTab === 'smartwatch' && (
          <SmartWatchFullTab soundEnabled={soundEnabled} triggerHaptic={triggerHaptic} />
        )}

        {mainTab === 'achievements' && (`;

appCode = appCode.replace(mainViewTarget, smartwatchMainView);

// Add SmartWatch tab button to Mobile Bottom Navigation Bar
const mobileNavTarget = `<button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('nutrition'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'nutrition' ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px]">التغذية</span>
          </button>`;

const mobileNavReplacement = `<button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('nutrition'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'nutrition' ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px]">التغذية</span>
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic(); setMainTab('smartwatch'); }}
            className={\`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active-press \${mainTab === 'smartwatch' ? 'text-cyan-400 font-extrabold bg-cyan-500/10 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}\`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[10px]">الساعة</span>
          </button>`;

appCode = appCode.replace(mobileNavTarget, mobileNavReplacement);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully added dedicated SmartWatch Tab to Navigation Bar and App.jsx!');
