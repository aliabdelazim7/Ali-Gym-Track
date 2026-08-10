import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Define currentDateFormatted in MainApp
const currentDateFormattedDef = `
  const currentDateFormatted = useMemo(() => {
    return formatArabicDate(selectedDate);
  }, [selectedDate]);
`;

// Insert currentDateFormatted right after `const isTodaySelected = selectedDate === todayDateKey;`
appCode = appCode.replace(
  'const isTodaySelected = selectedDate === todayDateKey;',
  'const isTodaySelected = selectedDate === todayDateKey;\n' + currentDateFormattedDef
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Added currentDateFormatted definition into MainApp!');
