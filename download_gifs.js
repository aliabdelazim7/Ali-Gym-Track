import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const exercises = [
  { id: 'd1-e1', name: 'Bench Press', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/dumbbell-chest-press-exercise-illustration.gif' },
  { id: 'd1-e2', name: 'Lat Pulldown', url: 'https://www.spotebi.com/wp-content/uploads/2015/03/lat-pulldown-exercise-illustration.gif' },
  { id: 'd1-e3', name: 'Overhead Press', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/dumbbell-shoulder-press-exercise-illustration.gif' },
  { id: 'd1-e4', name: 'Seated Cable Row', url: 'https://www.spotebi.com/wp-content/uploads/2015/04/seated-cable-rows-exercise-illustration.gif' },
  { id: 'd1-e5', name: 'Bicep Curls', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/bicep-curls-exercise-illustration.gif' },
  { id: 'd1-e6', name: 'Tricep Pushdown', url: 'https://www.spotebi.com/wp-content/uploads/2015/03/tricep-pushdown-exercise-illustration.gif' },
  { id: 'd1-e7', name: 'Plank', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/plank-exercise-illustration.gif' },

  { id: 'd2-e1', name: 'Squats', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/squat-exercise-illustration.gif' },
  { id: 'd2-e2', name: 'Romanian Deadlift', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/romanian-deadlift-exercise-illustration.gif' },
  { id: 'd2-e3', name: 'Leg Extensions', url: 'https://www.spotebi.com/wp-content/uploads/2015/05/leg-extension-exercise-illustration.gif' },
  { id: 'd2-e4', name: 'Calf Raises', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/calf-raises-exercise-illustration.gif' },
  { id: 'd2-e5', name: 'HIIT Cardio', url: 'https://www.spotebi.com/wp-content/uploads/2015/12/sprint-in-place-exercise-illustration.gif' },

  { id: 'd4-e1', name: 'Incline Dumbbell Press', url: 'https://www.spotebi.com/wp-content/uploads/2015/03/incline-dumbbell-press-exercise-illustration.gif' },
  { id: 'd4-e2', name: 'Dumbbell Rows', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/dumbbell-row-exercise-illustration.gif' },
  { id: 'd4-e3', name: 'Lateral Raises', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/dumbbell-lateral-raise-exercise-illustration.gif' },
  { id: 'd4-e4', name: 'Face Pulls', url: 'https://www.spotebi.com/wp-content/uploads/2015/04/face-pull-exercise-illustration.gif' },
  { id: 'd4-e5', name: 'Hanging Leg Raises', url: 'https://www.spotebi.com/wp-content/uploads/2015/01/bent-knee-ab-bench-crunch-exercise-illustration.gif' },
  { id: 'd4-e6', name: 'Russian Twists', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/russian-twist-exercise-illustration.gif' },

  { id: 'd5-e1', name: 'Bulgarian Split Squats', url: 'https://www.spotebi.com/wp-content/uploads/2015/02/bulgarian-split-squat-exercise-illustration.gif' },
  { id: 'd5-e2', name: 'Leg Curls', url: 'https://www.spotebi.com/wp-content/uploads/2015/05/lying-leg-curl-exercise-illustration.gif' },
  { id: 'd5-e3', name: 'Leg Press', url: 'https://www.spotebi.com/wp-content/uploads/2015/05/leg-press-exercise-illustration.gif' },
  { id: 'd5-e4', name: 'LISS Cardio', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/run-in-place-exercise-illustration.gif' }
];

const destDir = path.join(process.cwd(), 'public', 'exercises');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(fileUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const client = fileUrl.startsWith('https') ? https : http;
    const req = client.get(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/gif,image/webp,image/*,*/*'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, outputPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${fileUrl}: ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });
    });
    req.on('error', (err) => reject(err));
  });
}

async function start() {
  console.log('Downloading exercise GIFs offline...');
  for (const ex of exercises) {
    const outPath = path.join(destDir, `${ex.id}.gif`);
    try {
      await downloadFile(ex.url, outPath);
      console.log(`✓ Downloaded ${ex.name} -> public/exercises/${ex.id}.gif`);
    } catch (err) {
      console.error(`✗ Error downloading ${ex.name}:`, err.message);
    }
  }
  console.log('Done downloading offline GIFs!');
}

start();
