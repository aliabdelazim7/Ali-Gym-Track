import fs from 'fs';

const content = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');
const lines = content.split('\n');

let stack = [];

lines.forEach((line, lineIdx) => {
  const lineNum = lineIdx + 1;
  
  // Find all <div or </div>
  const matches = [...line.matchAll(/<\/?div[\s>]/g)];
  for (const match of matches) {
    const str = match[0];
    if (str.startsWith('</div')) {
      if (stack.length === 0) {
        console.log(`Extra closing </div> at line ${lineNum}`);
      } else {
        stack.pop();
      }
    } else {
      stack.push(lineNum);
    }
  }
});

console.log(`Unclosed <div> tags opened at lines:`, stack);
