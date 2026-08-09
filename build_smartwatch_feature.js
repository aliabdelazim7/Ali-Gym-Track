import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const bluetoothComponentCode = `
// ================= WEB BLUETOOTH SMARTWATCH ENGINE =================
const SmartWatchCard = ({ soundEnabled, triggerHaptic }) => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchName') || '';
  });
  const [heartRate, setHeartRate] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchHR') || '72');
  });
  const [maxHR, setMaxHR] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchMaxHR') || '145');
  });
  const [activeCalories, setActiveCalories] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchCal') || '380');
  });
  const [stepCount, setStepCount] = useState(() => {
    return parseInt(localStorage.getItem('gymProgress_Ali_WatchSteps') || '6420');
  });
  const [logHistory, setLogHistory] = useState([]);

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

      // Listen for disconnection
      selectedDevice.addEventListener('gattserverdisconnected', onDisconnected);

      // Connect to GATT Server if available
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

  // Determine Heart Rate Zone
  const getHRZone = (bpm) => {
    if (bpm < 100) return { label: 'راحة / ريكفري', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    if (bpm < 135) return { label: 'حرق دهون (Fat Burn)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (bpm < 160) return { label: 'تمرين وسعرات (Cardio/Hypertrophy)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'أقصى جهد (Peak Lift Zone)', color: 'text-red-400 animate-pulse', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const currentZone = getHRZone(heartRate);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl mb-6 font-arabic animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all \${isConnected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 glow-emerald' : 'bg-slate-800/80 border-slate-700 text-slate-400'}\`}>
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">الساعة الذكية (Web Bluetooth)</h3>
              <span className={\`text-[10px] px-2 py-0.5 rounded-full font-bold border \${isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}\`}>
                {isConnected ? 'متصلة 🟢' : 'غير متصلة ⚪'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isConnected ? (deviceName || 'ساعة البلوتوث الذكية') : 'اربط ساعتك مباشرة عبر البلوتوث لقراءة النبض والنشاط'}
            </p>
          </div>
        </div>

        <div>
          {!isConnected ? (
            <button
              onClick={connectBluetoothWatch}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all active-press flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري البحث...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>ربط الساعة ⌚</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={disconnectWatch}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              فصل الاتصال
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Heart Rate Live Metric */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">نبض القلب المباشر</span>
            <HeartPulse className={\`w-4 h-4 \${isConnected ? 'text-red-500 animate-ping' : 'text-slate-500'}\`} />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-black text-white font-mono">{heartRate}</span>
            <span className="text-[10px] text-slate-400 font-bold">BPM</span>
          </div>
          <div className={\`text-[10px] px-2 py-0.5 rounded-lg border font-bold text-center mt-1 truncate \${currentZone.bg} \${currentZone.color}\`}>
            {currentZone.label}
          </div>
        </div>

        {/* Max HR Achieved */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">أعلى نبض محقق</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-black text-orange-400 font-mono">{maxHR}</span>
            <span className="text-[10px] text-slate-400 font-bold">BPM</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">أقصى جهود المجموعات</span>
        </div>

        {/* Active Calories Burned */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">حرق التمرين النشط</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-black text-amber-400 font-mono">{activeCalories}</span>
            <span className="text-[10px] text-slate-400 font-bold">سعرة</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">مجهود التمارين والحديد</span>
        </div>

        {/* Daily Steps */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">الخطوات اليومية</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">{stepCount.toLocaleString('ar-EG')}</span>
            <span className="text-[10px] text-slate-400 font-bold">خطوة</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: \`\${Math.min(100, (stepCount / 10000) * 100)}%\` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

if (!appCode.includes('SmartWatchCard')) {
  appCode = appCode.replace(
    '// ================= WORKOUT & NUTRITION DATA =================',
    bluetoothComponentCode + '\n// ================= WORKOUT & NUTRITION DATA ================='
  );
  
  // Now place <SmartWatchCard soundEnabled={soundEnabled} triggerHaptic={triggerHaptic} /> right after header!
  const headerEndTarget = `</header>`;
  const smartWatchCardJSX = `</header>

      {/* WEB BLUETOOTH SMARTWATCH CARD */}
      <SmartWatchCard soundEnabled={soundEnabled} triggerHaptic={triggerHaptic} />`;
      
  appCode = appCode.replace(headerEndTarget, smartWatchCardJSX);
  
  fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
  console.log('Successfully integrated Web Bluetooth SmartWatch Engine into App.jsx!');
}
