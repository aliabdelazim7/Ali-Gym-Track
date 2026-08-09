import fs from 'fs';
import path from 'path';
import https from 'https';

const exercises = [
  { id: 'd1-e1', name: 'Bench Press', githubId: 'Barbell_Bench_Press' },
  { id: 'd1-e2', name: 'Lat Pulldown', githubId: 'Wide-Grip_Lat_Pulldown' },
  { id: 'd1-e3', name: 'Overhead Press', githubId: 'Seated_Dumbbell_Press' },
  { id: 'd1-e4', name: 'Seated Cable Row', githubId: 'Seated_Cable_Rows' },
  { id: 'd1-e5', name: 'Bicep Curls', githubId: 'Dumbbell_Alternate_Bicep_Curl' },
  { id: 'd1-e6', name: 'Tricep Pushdown', githubId: 'Triceps_Pushdown' },
  { id: 'd1-e7', name: 'Plank', githubId: 'Plank' },

  { id: 'd2-e1', name: 'Squats', githubId: 'Barbell_Full_Squat' },
  { id: 'd2-e2', name: 'Romanian Deadlift', githubId: 'Stiff-Legged_Barbell_Deadlift' },
  { id: 'd2-e3', name: 'Leg Extensions', githubId: 'Leg_Extensions' },
  { id: 'd2-e4', name: 'Calf Raises', githubId: 'Standing_Calf_Raises' },
  { id: 'd2-e5', name: 'HIIT Cardio', githubId: 'Jumping_Jacks' },

  { id: 'd4-e1', name: 'Incline Dumbbell Press', githubId: 'Incline_Dumbbell_Press' },
  { id: 'd4-e2', name: 'Dumbbell Rows', githubId: 'One-Arm_Dumbbell_Row' },
  { id: 'd4-e3', name: 'Lateral Raises', githubId: 'Side_Lateral_Raise' },
  { id: 'd4-e4', name: 'Face Pulls', githubId: 'Face_Pull' },
  { id: 'd4-e5', name: 'Hanging Leg Raises', githubId: 'Hanging_Leg_Raise' },
  { id: 'd4-e6', name: 'Russian Twists', githubId: 'Russian_Twist' },

  { id: 'd5-e1', name: 'Bulgarian Split Squats', githubId: 'Dumbbell_Lunges' },
  { id: 'd5-e2', name: 'Leg Curls', githubId: 'Seated_Leg_Curl' },
  { id: 'd5-e3', name: 'Leg Press', githubId: 'Leg_Press' },
  { id: 'd5-e4', name: 'LISS Cardio', githubId: 'Walking' }
];

const destDir = path.join(process.cwd(), 'public', 'exercises');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading exercise frames offline...');
  let successCount = 0;

  for (const ex of exercises) {
    for (let frame = 0; frame <= 1; frame++) {
      const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.githubId}/${frame}.jpg`;
      const fileName = `${ex.id}-${frame}.jpg`;
      const destPath = path.join(destDir, fileName);
      
      try {
        await download(url, destPath);
        console.log(`✓ Saved ${fileName} for ${ex.name}`);
        successCount++;
      } catch (err) {
        console.error(`✗ Error downloading ${fileName}:`, err.message);
      }
    }
  }

  console.log(`Finished downloading ${successCount} frames to public/exercises/!`);
}

run();
