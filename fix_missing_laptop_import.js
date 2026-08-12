import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Add Laptop to lucide-react imports
appCode = appCode.replace(
  "X, RotateCcw, Apple, Flame, Briefcase, Zap, Moon, Coffee, Utensils,",
  "X, RotateCcw, Apple, Flame, Briefcase, Zap, Moon, Coffee, Utensils, Laptop,"
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Added Laptop to lucide-react imports in App.jsx');
