import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Helper functions for date formatting
const dateHelperCode = `
// ================= LOCAL DATE KEY HELPER (PREVENTS TIMEZONE OFFSETS) =================
const getLocalDateKey = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return \`\${year}-\${month}-\${day}\`;
};

const formatArabicDate = (dateKey) => {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch(e) {
    return dateKey;
  }
};
`;

// Insert date helper before useCloudSync
if (!appCode.includes('getLocalDateKey')) {
  appCode = appCode.replace(
    '// ================= REAL-TIME CLOUD SYNC ENGINE (100% UNIVERSAL STATE) =================',
    dateHelperCode + '\n// ================= REAL-TIME CLOUD SYNC ENGINE (100% UNIVERSAL STATE) ================='
  );
}

// Write the upgrade node script
fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Added date helper functions to App.jsx');
