import fs from 'fs';

const content = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');
const lines = content.split('\n');

let currentComponent = 'GLOBAL';

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  if (line.includes('const ') && line.includes(' = ') && (line.includes('=>') || line.includes('function'))) {
    currentComponent = line.trim().slice(0, 50);
  }
  const opens = (line.match(/<div[\s>]/g) || []).length + (line.match(/<div$/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  if (opens !== closes) {
    console.log(`Line ${lineNum} [${currentComponent}]: +${opens} -${closes} | ${line.trim().slice(0, 50)}`);
  }
});
