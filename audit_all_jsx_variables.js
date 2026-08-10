import fs from 'fs';

const appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Check for currentDateFormatted usage
console.log('Includes currentDateFormatted?', appCode.includes('currentDateFormatted'));

// Let's check where currentDateFormatted is referenced vs defined
const lines = appCode.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('currentDateFormatted')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
