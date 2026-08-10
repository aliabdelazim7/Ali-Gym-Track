import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// 1. Fix const-comparisons: completedTasksCount >= 8 && completedTasksCount > 0 -> completedTasksCount >= 8
appCode = appCode.replace('completedTasksCount >= 8 && completedTasksCount > 0', 'completedTasksCount >= 8');

// 2. Fix catch(e) -> catch(_e), catch(err) -> catch(_err)
appCode = appCode.replace(/catch\s*\(\s*e\s*\)/g, 'catch(_e)');
appCode = appCode.replace(/catch\s*\(\s*err\s*\)/g, 'catch(_err)');

// 3. Attach toggleWakeLock & handleInstallPWA into Header buttons
const headerPWAButtons = `            <button 
              type="button"
              onClick={toggleWakeLock} 
              className={\`p-2 rounded-xl transition-all border font-bold text-xs \${isWakeLockActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}\`}
              title={isWakeLockActive ? "إبقاء الشاشة مضاءة مفعل 💡" : "تفعيل إبقاء الشاشة مضاءة 💡"}
            >
              <Zap className="w-4 h-4 text-amber-400" />
            </button>
            <button 
              type="button"
              onClick={handleInstallPWA} 
              className="p-2 text-slate-400 hover:text-blue-400 rounded-xl transition-colors"
              title="تثبيت التطبيق على الموبايل (PWA)"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
            </button>`;

appCode = appCode.replace(
  '<button \n              type="button"\n              onClick={() => appsScriptSync.setShowAppsScriptModal(true)}',
  headerPWAButtons + '\n            <button \n              type="button"\n              onClick={() => appsScriptSync.setShowAppsScriptModal(true)}'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Cleaned unused variable warnings in App.jsx');
