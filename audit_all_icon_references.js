import fs from 'fs';

const appCode = fs.readFileSync('e:\\ali-Gym-Track\\src\\App.jsx', 'utf8');

// Find all imported names from lucide-react
const lucideImportMatch = appCode.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"]/);
const importedIcons = new Set();
if (lucideImportMatch) {
  lucideImportMatch[1].split(',').forEach(i => {
    const clean = i.trim().split(' as ')[0].trim();
    if (clean) importedIcons.add(clean);
  });
}

// Find all React component declarations / variables in App.jsx
const customDefs = new Set([
  'React', 'MainApp', 'ErrorBoundary', 'ErgonomicExerciseCard', 'UnbreakableAnimation',
  'ProgressiveAnalyticsView', 'AchievementsView', 'YoutubeIcon', 'ResponsiveContainer',
  'AreaChart', 'Area', 'XAxis', 'YAxis', 'Tooltip', 'BarChart', 'Bar', 'CartesianGrid'
]);

// Scan JSX tags <CapitalizedWord
const jsxTagRegex = /<([A-Z][A-Za-z0-9_]*)/g;
let match;
const missingIcons = new Set();

while ((match = jsxTagRegex.exec(appCode)) !== null) {
  const tagName = match[1];
  if (!importedIcons.has(tagName) && !customDefs.has(tagName)) {
    missingIcons.add(tagName);
  }
}

console.log('Imported Lucide Icons Count:', importedIcons.size);
console.log('Missing/Undefined Icons Found:', Array.from(missingIcons));
