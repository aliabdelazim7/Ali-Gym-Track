import fs from 'fs';

const appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Check all identifiers inside { ... } in App.jsx JSX
const jsxExprRegex = /\{([^}]+)\}/g;
let match;
const foundVars = new Set();

while ((match = jsxExprRegex.exec(appCode)) !== null) {
  const expr = match[1].trim();
  // Extract word tokens
  const words = expr.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/g);
  if (words) {
    words.forEach(w => {
      if (!['true', 'false', 'null', 'undefined', 'return', 'typeof', 'const', 'let', 'var', 'if', 'else', 'map', 'filter', 'reduce', 'slice', 'split', 'length', 'toString', 'concat', 'includes', 'find', 'some', 'every', 'Array', 'Object', 'Math', 'JSON', 'Date', 'String', 'Number', 'Boolean', 'parseInt', 'parseFloat', 'e', 'i', 'k', 'v', 'b', 'd', 'ex', 'l', 'alt', 'idx', 'meal', 'exercise', 'day', 'prev', 'item', 'key', 'val', 'count'].includes(w)) {
        foundVars.add(w);
      }
    });
  }
}

console.log('Unique identifiers in JSX expressions:', foundVars.size);

// Scan for any variable referenced in MainApp
const mainAppCode = appCode.slice(appCode.indexOf('function MainApp()'));
let missingInMainApp = [];

foundVars.forEach(v => {
  if (!mainAppCode.includes(v) && !appCode.includes(`const ${v}`) && !appCode.includes(`function ${v}`)) {
    missingInMainApp.push(v);
  }
});

console.log('Potentially missing in MainApp scope:', missingInMainApp);
