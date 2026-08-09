import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const updatedPairingModal = `      {/* Manual / Pair Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-arabic animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">طريقة ربط الساعة بالموقع ⌚</h3>
              </div>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                لماذا الساعة مقترنة بالموبايل ولا تظهر بالموقع؟
              </div>
              <p className="leading-relaxed text-[11px] text-slate-400">
                نظام الموبايل يربط الساعة مع تطبيقه الخاص (مثل Apple Health أو Mi Fitness)، ولإعطاء الموقع صلاحية قراءة النبض مباشرة يلزم تحديد جهاز البلوتوث من نافذة المتصفح:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] font-semibold text-slate-200 pt-1">
                <li>اضغط زر <span className="text-blue-400">اقتران ساعة حقيقية ⌚</span>.</li>
                <li>ستظهر نافذة البلوتوث المنسدلة من المتصفح 📡.</li>
                <li>اختر اسم ساعتك واضغط <span className="text-emerald-400">Pair / توصيل</span>.</li>
              </ol>
            </div>

            <button
              onClick={() => setShowSyncModal(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg active-press"
            >
              فهمت، سأدخل قراءات ساعتي الآن ✍️
            </button>
          </div>
        </div>
      )}`;

appCode = appCode.replace(/\{\/\* Manual \/ Pair Modal \*\}[\s\S]*?\}\n    <\/div>\n  \);/, updatedPairingModal + '\n    </div>\n  );');

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully updated pairing guide in App.jsx!');
