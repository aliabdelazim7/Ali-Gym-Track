import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const honestSmartWatchCode = `
// ================= FULL SMARTWATCH TELEMETRY TAB =================
const SmartWatchFullTab = ({ soundEnabled, triggerHaptic }) => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchConnected') === 'true';
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  
  const [deviceName, setDeviceName] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchName') || '';
  });
  const [heartRate, setHeartRate] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchHR');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [maxHR, setMaxHR] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchMaxHR');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [activeCalories, setActiveCalories] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchCal');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [stepCount, setStepCount] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchSteps');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Manual Form State
  const [manualSteps, setManualSteps] = useState('');
  const [manualCal, setManualCal] = useState('');
  const [manualBpm, setManualBpm] = useState('');

  // Connect via Web Bluetooth API (Real BLE Scan)
  const connectBluetoothWatch = async () => {
    triggerHaptic();
    
    if ('bluetooth' in navigator) {
      try {
        setIsConnecting(true);
        const selectedDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'battery_service', 'device_information', 0x180D]
        });

        setDevice(selectedDevice);
        const realName = selectedDevice.name || 'ساعة بلوتوث ذكية';
        setDeviceName(realName);
        localStorage.setItem('gymProgress_Ali_WatchName', realName);
        localStorage.setItem('gymProgress_Ali_WatchConnected', 'true');
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
          console.log("Heart rate GATT service fallback:", e);
        }
        return;
      } catch (error) {
        setIsConnecting(false);
        if (error.name === 'NotFoundError') return;
      }
    }

    // Open Manual / Real Data Panel if WebBluetooth is unavailable on device
    setShowSyncModal(true);
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
    localStorage.setItem('gymProgress_Ali_WatchConnected', 'false');
    setDevice(null);
  };

  const disconnectWatch = () => {
    triggerHaptic();
    if (device && device.gatt && device.gatt.connected) {
      try { device.gatt.disconnect(); } catch(e){}
    }
    setIsConnected(false);
    setDevice(null);
    setDeviceName('');
    setHeartRate(0);
    setMaxHR(0);
    setActiveCalories(0);
    setStepCount(0);
    localStorage.removeItem('gymProgress_Ali_WatchConnected');
    localStorage.removeItem('gymProgress_Ali_WatchName');
    localStorage.removeItem('gymProgress_Ali_WatchHR');
    localStorage.removeItem('gymProgress_Ali_WatchMaxHR');
    localStorage.removeItem('gymProgress_Ali_WatchCal');
    localStorage.removeItem('gymProgress_Ali_WatchSteps');
  };

  const saveManualMetrics = (e) => {
    e.preventDefault();
    triggerHaptic();
    if (manualSteps) {
      const s = parseInt(manualSteps, 10) || 0;
      setStepCount(s);
      localStorage.setItem('gymProgress_Ali_WatchSteps', s.toString());
    }
    if (manualCal) {
      const c = parseInt(manualCal, 10) || 0;
      setActiveCalories(c);
      localStorage.setItem('gymProgress_Ali_WatchCal', c.toString());
    }
    if (manualBpm) {
      const b = parseInt(manualBpm, 10) || 0;
      setHeartRate(b);
      localStorage.setItem('gymProgress_Ali_WatchHR', b.toString());
      if (b > maxHR) {
        setMaxHR(b);
        localStorage.setItem('gymProgress_Ali_WatchMaxHR', b.toString());
      }
    }
    setIsConnected(true);
    if (!deviceName) {
      setDeviceName('بيانات الساعة المسجلة');
      localStorage.setItem('gymProgress_Ali_WatchName', 'بيانات الساعة المسجلة');
    }
    localStorage.setItem('gymProgress_Ali_WatchConnected', 'true');
    setShowSyncModal(false);
    setManualSteps('');
    setManualCal('');
    setManualBpm('');
  };

  const getHRZone = (bpm) => {
    if (!bpm || bpm === 0) return { label: 'في انتظار بيانات النبض الحقيقية', color: 'text-slate-500', bg: 'bg-slate-950 border-slate-800' };
    if (bpm < 100) return { label: 'راحة / ريكفري', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    if (bpm < 135) return { label: 'حرق دهون (Fat Burn)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (bpm < 160) return { label: 'تمرين وسعرات (Cardio/Hypertrophy)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'أقصى جهد (Peak Lift Zone)', color: 'text-red-400 animate-pulse', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const currentZone = getHRZone(heartRate);

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shadow-lg \${isConnected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 glow-emerald' : 'bg-slate-800 border-slate-700 text-slate-500'}\`}>
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">الساعة الذكية (SmartWatch)</h2>
                <span className={\`text-[10px] px-2.5 py-0.5 rounded-full font-bold border \${isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}\`}>
                  {isConnected ? 'متصلة ومزامنة 🟢' : 'غير متصلة ⚪'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isConnected ? (\`ساعتك الحالية: \${deviceName}\`) : 'قم باقتران ساعتك أو إدخال قراءاتك الحقيقية لمتابعة نشاطك اليومي'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isConnected ? (
              <button
                onClick={connectBluetoothWatch}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl transition-all active-press flex items-center gap-2 text-sm"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري المسح...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>اقتران ساعة حقيقية ⌚</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={disconnectWatch}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-4 py-2.5 rounded-xl transition-all text-xs"
              >
                فصل وإلغاء الاقتران ✖
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
            <span className="text-xs font-bold">نبض القلب الحقيقي</span>
            <HeartPulse className={\`w-5 h-5 \${heartRate > 0 ? 'text-red-500 animate-ping' : 'text-slate-600'}\`} />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-white font-mono tracking-tight">{heartRate > 0 ? heartRate : '--'}</span>
            <span className="text-xs text-slate-400 font-bold">BPM</span>
          </div>
          <div className={\`text-xs px-3 py-1 rounded-xl border font-bold text-center mt-2 \${currentZone.bg} \${currentZone.color}\`}>
            {currentZone.label}
          </div>
        </div>

        {/* Max HR Achieved */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">أعلى نبض محقق</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-orange-400 font-mono tracking-tight">{maxHR > 0 ? maxHR : '--'}</span>
            <span className="text-xs text-slate-400 font-bold">BPM</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">أقصى مجهود تمرين</span>
        </div>

        {/* Active Calories Burned */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">السعرات المحروقة الحقيقية</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-amber-400 font-mono tracking-tight">{activeCalories}</span>
            <span className="text-xs text-slate-400 font-bold">سعرة</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">المسجلة من ساعتك</span>
        </div>

        {/* Daily Steps Counter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">الخطوات الحقيقية</span>
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

      {/* Manual Real Watch Data Entry Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-blue-400" />
          تسجيل قراءات ساعتك اليومية الحقيقية (أو تعديلها)
        </h3>
        <p className="text-xs text-slate-400 mb-4">أدخل الأرقام الفعلية الظاهرة على شاشة ساعتك لمزامنتها في حسابك:</p>

        <form onSubmit={saveManualMetrics} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">عدد الخطوات</label>
            <input
              type="number"
              placeholder="مثال: 8500"
              value={manualSteps}
              onChange={(e) => setManualSteps(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">السعرات المحروقة (سعرة)</label>
            <input
              type="number"
              placeholder="مثال: 350"
              value={manualCal}
              onChange={(e) => setManualCal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">نبض القلب الحقيقي (BPM)</label>
            <input
              type="number"
              placeholder="مثال: 125"
              value={manualBpm}
              onChange={(e) => setManualBpm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="sm:col-span-3 pt-1 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg active-press text-xs"
            >
              حفظ القراءات الحقيقية 💾
            </button>
          </div>
        </form>
      </div>

      {/* Manual / Pair Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">اقتران الساعة الذكية</h3>
              </div>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              خاصية البلوتوث المباشر تحتاج تفعيل البلوتوث من الإعدادات. يمكنك أيضاً إدخال أرقام ساعتك الفعلية مباشرة:
            </p>

            <button
              onClick={() => setShowSyncModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs"
            >
              إدخال بيانات الساعة يدوياً ✍️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
`;

appCode = appCode.replace(/\/\/ ================= FULL SMARTWATCH TELEMETRY TAB =================[\s\S]*?\/\/ ================= WORKOUT & NUTRITION DATA =================/, honestSmartWatchCode + '\n// ================= WORKOUT & NUTRITION DATA =================');

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully updated SmartWatchFullTab with honest real-data logic!');
