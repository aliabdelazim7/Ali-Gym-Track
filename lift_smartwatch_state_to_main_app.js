import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Update SmartWatchFullTab component to receive smartwatch state via props
const oldSmartWatchTabHeader = `const SmartWatchFullTab = ({ soundEnabled, triggerHaptic }) => {
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
  });`;

const newSmartWatchTabHeader = `const SmartWatchFullTab = ({ 
  soundEnabled, 
  triggerHaptic,
  isConnected, setIsConnected,
  deviceName, setDeviceName,
  heartRate, setHeartRate,
  maxHR, setMaxHR,
  activeCalories, setActiveCalories,
  stepCount, setStepCount
}) => {
  const [device, setDevice] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);`;

appCode = appCode.replace(oldSmartWatchTabHeader, newSmartWatchTabHeader);

// 2. Add Smartwatch states into MainApp and pass to useCloudSync
const oldMainAppSyncCall = `  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    triggerHaptic
  );`;

const newMainAppSyncCall = `  const [watchSteps, setWatchSteps] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchSteps');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchCal, setWatchCal] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchCal');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchHR, setWatchHR] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchHR');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchMaxHR, setWatchMaxHR] = useState(() => {
    const saved = localStorage.getItem('gymProgress_Ali_WatchMaxHR');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [watchConnected, setWatchConnected] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchConnected') === 'true';
  });
  const [watchName, setWatchName] = useState(() => {
    return localStorage.getItem('gymProgress_Ali_WatchName') || '';
  });

  const cloudSync = useCloudSync(
    workoutProgress, setWorkoutProgress,
    exerciseWeights, setExerciseWeights,
    exerciseReps, setExerciseReps,
    dietProgress, setDietProgress,
    waterGlasses, setWaterGlasses,
    weightLogs, setWeightLogs,
    activeDay, setActiveDay,
    watchSteps, setWatchSteps,
    watchCal, setWatchCal,
    watchHR, setWatchHR,
    watchMaxHR, setWatchMaxHR,
    watchConnected, setWatchConnected,
    watchName, setWatchName,
    triggerHaptic
  );`;

appCode = appCode.replace(oldMainAppSyncCall, newMainAppSyncCall);

// 3. Update <SmartWatchFullTab /> render in MainApp to pass props
appCode = appCode.replace(
  '<SmartWatchFullTab soundEnabled={soundEnabled} triggerHaptic={triggerHaptic} />',
  `<SmartWatchFullTab 
            soundEnabled={soundEnabled} 
            triggerHaptic={triggerHaptic}
            isConnected={watchConnected}
            setIsConnected={setWatchConnected}
            deviceName={watchName}
            setDeviceName={setWatchName}
            heartRate={watchHR}
            setHeartRate={setWatchHR}
            maxHR={watchMaxHR}
            setMaxHR={setWatchMaxHR}
            activeCalories={watchCal}
            setActiveCalories={setWatchCal}
            stepCount={watchSteps}
            setStepCount={setWatchSteps}
          />`
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully lifted SmartWatch state to MainApp and integrated into 100% universal cloud sync!');
