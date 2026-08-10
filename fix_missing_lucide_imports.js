import fs from 'fs';

let appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

appCode = appCode.replace(
  'ChevronDown, ChevronUp, CheckCircle2, AlertOctagon, Timer,',
  'ChevronDown, ChevronUp, ChevronRight, ChevronLeft, CheckCircle2, AlertOctagon, Timer,'
);

fs.writeFileSync('e:\\ali-Gym-Track\\src\\App.jsx', appCode, 'utf8');
console.log('Successfully added ChevronRight and ChevronLeft to lucide-react imports in App.jsx!');
