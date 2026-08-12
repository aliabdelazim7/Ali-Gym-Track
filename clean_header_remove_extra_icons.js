import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const startTag = '<header className="flex justify-between items-center';
const endTag = '</header>';

const startIndex = appCode.indexOf(startTag);
const endIndex = appCode.indexOf(endTag, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const cleanHeaderCode = `<header className="flex justify-between items-center h-14 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 sm:px-4 shadow-lg min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0">
              AG
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate">Ali Gym Track</h1>
              <p className="text-[10px] text-slate-400 font-mono truncate">{formatArabicDate(selectedDate)}</p>
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <button 
              type="button"
              aria-label="فتح قائمة الإعدادات والإشعارات"
              onClick={() => { triggerHaptic(); setShowSettingsModal(true); }}
              className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm active:scale-95"
              title="الإعدادات والإشعارات ⚙️"
            >
              <Settings className="w-4.5 h-4.5 text-slate-300" />
            </button>
          </div>
        </header>`;

  appCode = appCode.substring(0, startIndex) + cleanHeaderCode + appCode.substring(endIndex + endTag.length);
  fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
  console.log('Successfully cleaned header in App.jsx!');
} else {
  console.log('Header tags not found!');
}
