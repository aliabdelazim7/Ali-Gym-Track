import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Replace top container padding with top safe area margin (pt-12 sm:pt-6 pt-[max(2.5rem,env(safe-area-inset-top))])
appCode = appCode.replace(
  '<div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-3 sm:p-5 pb-28 min-w-0" dir="rtl">',
  '<div className="min-h-screen bg-slate-950 text-slate-100 font-sans px-3 sm:px-5 pt-11 sm:pt-6 pb-28 min-w-0 pt-[max(2.75rem,env(safe-area-inset-top))]" dir="rtl">'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully added top safe-area padding for iPhone PWA in App.jsx!');
