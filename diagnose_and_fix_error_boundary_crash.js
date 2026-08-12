import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Inspect lines 750 to 850 in App.jsx to find where notification state was injected
console.log('Searching for MainApp definition in App.jsx...');
const mainAppIndex = appCode.indexOf('const MainApp = () => {');
if (mainAppIndex !== -1) {
  console.log('Found MainApp at index', mainAppIndex);
  console.log(appCode.substring(mainAppIndex, mainAppIndex + 800));
}
