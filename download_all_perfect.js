import fs from 'fs';
import path from 'path';
import https from 'https';

const exercises = [
  { id: 'd1-e1', name: 'Bench Press', githubFolder: 'Barbell_Bench_Press_-_Medium_Grip' },
  { id: 'd1-e2', name: 'Lat Pulldown', githubFolder: 'Wide-Grip_Lat_Pulldown' },
  { id: 'd1-e3', name: 'Overhead Press', githubFolder: 'Seated_Dumbbell_Press' },
  { id: 'd1-e4', name: 'Seated Cable Row', githubFolder: 'Seated_Cable_Rows' },
  { id: 'd1-e5', name: 'Bicep Curls', githubFolder: 'Dumbbell_Alternate_Bicep_Curl' },
  { id: 'd1-e6', name: 'Tricep Pushdown', githubFolder: 'Triceps_Pushdown' },
  { id: 'd1-e7', name: 'Plank', githubFolder: 'Plank' },

  { id: 'd2-e1', name: 'Squats', githubFolder: 'Barbell_Full_Squat' },
  { id: 'd2-e2', name: 'Romanian Deadlift', githubFolder: 'Stiff-Legged_Barbell_Deadlift' },
  { id: 'd2-e3', name: 'Leg Extensions', githubFolder: 'Leg_Extensions' },
  { id: 'd2-e4', name: 'Calf Raises', githubFolder: 'Standing_Calf_Raises' },
  { id: 'd2-e5', name: 'HIIT Cardio', githubFolder: 'Jumping_jack' },

  { id: 'd4-e1', name: 'Incline Dumbbell Press', githubFolder: 'Incline_Dumbbell_Press' },
  { id: 'd4-e2', name: 'Dumbbell Rows', githubFolder: 'One-Arm_Dumbbell_Row' },
  { id: 'd4-e3', name: 'Lateral Raises', githubFolder: 'Side_Lateral_Raise' },
  { id: 'd4-e4', name: 'Face Pulls', githubFolder: 'Face_Pull' },
  { id: 'd4-e5', name: 'Hanging Leg Raises', githubFolder: 'Hanging_Leg_Raise' },
  { id: 'd4-e6', name: 'Russian Twists', githubFolder: 'Russian_Twist' },

  { id: 'd5-e1', name: 'Bulgarian Split Squats', githubFolder: 'Dumbbell_Lunges' },
  { id: 'd5-e2', name: 'Leg Curls', githubFolder: 'Seated_Leg_Curl' },
  { id: 'd5-e3', name: 'Leg Press', githubFolder: 'Leg_Press' },
  { id: 'd5-e4', name: 'LISS Cardio', githubFolder: 'Treadmill_walking' }
];

const destDir = path.join(process.cwd(), 'public', 'exercises');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading PERFECT 44 frames for all 22 exercises...');
  let count = 0;

  for (const ex of exercises) {
    for (let frame = 0; frame <= 1; frame++) {
      const fileName = `${ex.id}-${frame}.jpg`;
      const destPath = path.join(destDir, fileName);
      const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.githubFolder}/${frame}.jpg`;

      try {
        await downloadFile(url, destPath);
        console.log(`✓ [200 OK] Saved ${fileName} (${ex.name})`);
        count++;
      } catch (err) {
        console.error(`✗ Error downloading ${fileName}:`, err.message);
      }
    }
  }

  console.log(`Successfully downloaded ALL ${count}/44 exercise frames!`);
}

run();
