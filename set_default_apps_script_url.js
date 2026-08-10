import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

const targetUrl = "https://script.google.com/macros/s/AKfycbzbib8mglWxUhFt63mk798-Evdz2GEQy2nqy9zkzPhxMJNOe95yeCWChJDRJFyGmbJ7Bw/exec";

appCode = appCode.replace(
  "return localStorage.getItem('gymAppsScriptUrl') || '';",
  `return localStorage.getItem('gymAppsScriptUrl') || "${targetUrl}";`
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully set default Google Apps Script URL in App.jsx!');
