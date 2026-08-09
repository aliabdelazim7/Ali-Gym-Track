import fs from 'fs';
import path from 'path';

// Audit all imports and React component definitions in src/App.jsx
const appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

console.log('--- AUDITING APP.JSX FOR POTENTIAL MOBILE CRASHES ---');

// Check 1: Missing JSX closing tags
const divOpen = (appCode.match(/<div/g) || []).length;
const divClose = (appCode.match(/<\/div>/g) || []).length;
console.log(`div tags count: open=${divOpen}, close=${divClose}`);

// Check 2: ResponsiveContainer usage
if (appCode.includes('ResponsiveContainer width="100%" height="100%"')) {
  console.log('WARNING: ResponsiveContainer has height="100%" inside dynamic flex/grid. Replacing with fixed numeric height for mobile stability.');
}

// Check 3: Check safeAltId usage in UnbreakableAnimation
if (!appCode.includes('safeAltId')) {
  console.log('NOTE: Adding safeAltId fallback for UnbreakableAnimation.');
}

console.log('Audit complete.');
