import fs from 'fs';
import path from 'path';

const planCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\initialWorkoutPlan.js', 'utf8');
let appContent = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Replace initialWorkoutPlan in App.jsx
const startMarker = 'const initialWorkoutPlan = [';
const endMarker = 'const dietPlan = {';

const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  appContent = appContent.substring(0, startIndex) + planCode + '\n\n' + appContent.substring(endIndex);
  console.log('Successfully updated initialWorkoutPlan in App.jsx!');
} else {
  console.error('Failed to locate markers in App.jsx');
}

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appContent, 'utf8');
