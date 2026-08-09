import fs from 'fs';

const lines = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8').split('\n');

let depth = 0;
lines.forEach((line, index) => {
  const opens = (line.match(/<div[\s>]/g) || []).length + (line.match(/<div$/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += opens - closes;
  if (opens > 0 || closes > 0) {
    // console.log(`Line ${index + 1}: depth=${depth} (+${opens}, -${closes}) | ${line.trim().slice(0, 60)}`);
  }
});

console.log(`Final div balance depth: ${depth}`);
