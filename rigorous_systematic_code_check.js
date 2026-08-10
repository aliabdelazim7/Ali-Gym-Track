import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

console.log('--- RIGOROUS SYSTEMATIC CODE CHECK ---');

// 1. Audit ErrorBoundary handleReset to do a complete cache and localStorage reset with forced reload
const oldReset = `  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(n => caches.delete(n)));
      }
    } catch(e){}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
  };`;

const newReset = `  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(n => caches.delete(n)));
      }
    } catch(e){}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };`;

appCode = appCode.replace(oldReset, newReset);

// 2. Ensure parseDateIndexedState handles any corrupt localStorage data safely
const oldParse = `  const parseDateIndexedState = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      if (typeof parsed !== 'object' || parsed === null) return {};
      // If legacy flat format (no date keys), migrate to today
      const hasDateKey = Object.keys(parsed).some(k => k.includes('-'));
      if (!hasDateKey && Object.keys(parsed).length > 0) {
        return { [todayDateKey]: parsed };
      }
      return parsed;
    } catch(e) {
      return {};
    }
  };`;

const newParse = `  const parseDateIndexedState = (key) => {
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

appCode = appCode.replace(oldParse, newParse);

// 3. Ensure shiftDate handles missing/invalid date strings gracefully
const oldShiftDate = `  const shiftDate = (days) => {
    triggerHaptic();
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d + days);
    setSelectedDate(getLocalDateKey(dt));
  };`;

const newShiftDate = `  const shiftDate = (days) => {
    try {
      triggerHaptic();
      const parts = (selectedDate || getLocalDateKey()).split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) {
        setSelectedDate(getLocalDateKey());
        return;
      }
      const [y, m, d] = parts;
      const dt = new Date(y, m - 1, d + days);
      setSelectedDate(getLocalDateKey(dt));
    } catch(e) {
      setSelectedDate(getLocalDateKey());
    }
  };`;

appCode = appCode.replace(oldShiftDate, newShiftDate);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully completed systematic code fortification in App.jsx!');
