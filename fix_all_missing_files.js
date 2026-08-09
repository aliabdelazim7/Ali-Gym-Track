import fs from 'fs';
import path from 'path';
import https from 'https';

const exercisesWithAlts = [
  // Day 1
  {
    id: 'd1-e1', name: 'Bench Press',
    alts: [
      { id: 'd1-e1-main', folders: ['Barbell_Bench_Press_-_Medium_Grip', 'Dumbbell_Bench_Press'] },
      { id: 'd1-e1-alt1', folders: ['Dumbbell_Bench_Press', 'Barbell_Bench_Press_-_Medium_Grip'] },
      { id: 'd1-e1-alt2', folders: ['Chest_dip', 'Dips_-_Chest_Version', 'Push-up'] }
    ]
  },
  {
    id: 'd1-e2', name: 'Lat Pulldown',
    alts: [
      { id: 'd1-e2-main', folders: ['Wide-Grip_Lat_Pulldown'] },
      { id: 'd1-e2-alt1', folders: ['V-bar_pulldown', 'Wide-Grip_Lat_Pulldown'] },
      { id: 'd1-e2-alt2', folders: ['Pullups', 'Chin-Up'] }
    ]
  },
  {
    id: 'd1-e3', name: 'Overhead Press',
    alts: [
      { id: 'd1-e3-main', folders: ['Seated_Dumbbell_Press'] },
      { id: 'd1-e3-alt1', folders: ['Standing_Military_Press'] },
      { id: 'd1-e3-alt2', folders: ['Arnold_press', 'Seated_Dumbbell_Press'] }
    ]
  },
  {
    id: 'd1-e4', name: 'Seated Cable Row',
    alts: [
      { id: 'd1-e4-main', folders: ['Seated_Cable_Rows'] },
      { id: 'd1-e4-alt1', folders: ['One-Arm_Dumbbell_Row'] },
      { id: 'd1-e4-alt2', folders: ['T-Bar_Row', 'Seated_Cable_Rows'] }
    ]
  },
  {
    id: 'd1-e5', name: 'Bicep Curls',
    alts: [
      { id: 'd1-e5-main', folders: ['Dumbbell_Alternate_Bicep_Curl'] },
      { id: 'd1-e5-alt1', folders: ['EZ-Bar_Curl'] },
      { id: 'd1-e5-alt2', folders: ['Cable_Preacher_Curl', 'Dumbbell_Alternate_Bicep_Curl'] }
    ]
  },
  {
    id: 'd1-e6', name: 'Tricep Pushdown',
    alts: [
      { id: 'd1-e6-main', folders: ['Triceps_Pushdown'] },
      { id: 'd1-e6-alt1', folders: ['Standing_Dumbbell_Triceps_Extension'] },
      { id: 'd1-e6-alt2', folders: ['Dips_-_Triceps_Version', 'Triceps_Pushdown'] }
    ]
  },
  {
    id: 'd1-e7', name: 'Plank',
    alts: [
      { id: 'd1-e7-main', folders: ['Plank'] },
      { id: 'd1-e7-alt1', folders: ['Ab_Roller'] },
      { id: 'd1-e7-alt2', folders: ['Side_Plank', 'Plank'] }
    ]
  },

  // Day 2
  {
    id: 'd2-e1', name: 'Squats',
    alts: [
      { id: 'd2-e1-main', folders: ['Barbell_Full_Squat'] },
      { id: 'd2-e1-alt1', folders: ['Goblet_Squat'] },
      { id: 'd2-e1-alt2', folders: ['Smith_machine_squat', 'Barbell_Full_Squat'] }
    ]
  },
  {
    id: 'd2-e2', name: 'Romanian Deadlift',
    alts: [
      { id: 'd2-e2-main', folders: ['Stiff-Legged_Barbell_Deadlift'] },
      { id: 'd2-e2-alt1', folders: ['Romanian_Deadlift_With_Dumbbells', 'Stiff-Legged_Barbell_Deadlift'] },
      { id: 'd2-e2-alt2', folders: ['Single-Leg_Deadlift_With_Dumbbells', 'Stiff-Legged_Barbell_Deadlift'] }
    ]
  },
  {
    id: 'd2-e3', name: 'Leg Extensions',
    alts: [
      { id: 'd2-e3-main', folders: ['Leg_Extensions'] },
      { id: 'd2-e3-alt1', folders: ['Sissy_Squat', 'Leg_Extensions'] },
      { id: 'd2-e3-alt2', folders: ['Dumbbell_pass', 'Leg_Extensions'] }
    ]
  },
  {
    id: 'd2-e4', name: 'Calf Raises',
    alts: [
      { id: 'd2-e4-main', folders: ['Standing_Calf_Raises'] },
      { id: 'd2-e4-alt1', folders: ['Seated_Calf_Raise'] },
      { id: 'd2-e4-alt2', folders: ['Calf_Press_On_The_Leg_Press_Machine'] }
    ]
  },
  {
    id: 'd2-e5', name: 'HIIT Cardio',
    alts: [
      { id: 'd2-e5-main', folders: ['Jumping_jack', 'Running'] },
      { id: 'd2-e5-alt1', folders: ['Mountain_climbers', 'Plank'] },
      { id: 'd2-e5-alt2', folders: ['Burpees', 'Jumping_jack'] }
    ]
  },

  // Day 4
  {
    id: 'd4-e1', name: 'Incline Dumbbell Press',
    alts: [
      { id: 'd4-e1-main', folders: ['Incline_Dumbbell_Press'] },
      { id: 'd4-e1-alt1', folders: ['Barbell_Incline_Bench_Press_-_Medium_Grip'] },
      { id: 'd4-e1-alt2', folders: ['Incline_Dumbbell_Flyes'] }
    ]
  },
  {
    id: 'd4-e2', name: 'Dumbbell Rows',
    alts: [
      { id: 'd4-e2-main', folders: ['One-Arm_Dumbbell_Row'] },
      { id: 'd4-e2-alt1', folders: ['Dumbbell_Incline_Row'] },
      { id: 'd4-e2-alt2', folders: ['Bent_Over_Two-Arm_Long_Barbell_Row', 'One-Arm_Dumbbell_Row'] }
    ]
  },
  {
    id: 'd4-e3', name: 'Lateral Raises',
    alts: [
      { id: 'd4-e3-main', folders: ['Side_Lateral_Raise'] },
      { id: 'd4-e3-alt1', folders: ['Cable_Lateral_Raise', 'Side_Lateral_Raise'] },
      { id: 'd4-e3-alt2', folders: ['Seated_Dumbbell_Lateral_Raise', 'Side_Lateral_Raise'] }
    ]
  },
  {
    id: 'd4-e4', name: 'Face Pulls',
    alts: [
      { id: 'd4-e4-main', folders: ['Face_Pull'] },
      { id: 'd4-e4-alt1', folders: ['Seated_Rear_Delt_Raise', 'Face_Pull'] },
      { id: 'd4-e4-alt2', folders: ['Reverse_Flyes'] }
    ]
  },
  {
    id: 'd4-e5', name: 'Hanging Leg Raises',
    alts: [
      { id: 'd4-e5-main', folders: ['Hanging_Leg_Raise'] },
      { id: 'd4-e5-alt1', folders: ['Flat_Bench_Lying_Leg_Raise'] },
      { id: 'd4-e5-alt2', folders: ['Decline_Crunch'] }
    ]
  },
  {
    id: 'd4-e6', name: 'Russian Twists',
    alts: [
      { id: 'd4-e6-main', folders: ['Russian_Twist'] },
      { id: 'd4-e6-alt1', folders: ['Cross-Body_Crunch'] },
      { id: 'd4-e6-alt2', folders: ['Cross-Body_Crunch'] }
    ]
  },

  // Day 5
  {
    id: 'd5-e1', name: 'Bulgarian Split Squats',
    alts: [
      { id: 'd5-e1-main', folders: ['Dumbbell_Lunges'] },
      { id: 'd5-e1-alt1', folders: ['Dumbbell_Walking_Lunge', 'Dumbbell_Lunges'] },
      { id: 'd5-e1-alt2', folders: ['Barbell_Lunge'] }
    ]
  },
  {
    id: 'd5-e2', name: 'Leg Curls',
    alts: [
      { id: 'd5-e2-main', folders: ['Seated_Leg_Curl'] },
      { id: 'd5-e2-alt1', folders: ['Dumbbell_Lying_Leg_Curl', 'Seated_Leg_Curl'] },
      { id: 'd5-e2-alt2', folders: ['Exercise_Ball_Hamstring_Curl', 'Seated_Leg_Curl'] }
    ]
  },
  {
    id: 'd5-e3', name: 'Leg Press',
    alts: [
      { id: 'd5-e3-main', folders: ['Leg_Press'] },
      { id: 'd5-e3-alt1', folders: ['Hack_Squat'] },
      { id: 'd5-e3-alt2', folders: ['Dumbbell_Step-Ups', 'Leg_Press'] }
    ]
  },
  {
    id: 'd5-e4', name: 'LISS Cardio',
    alts: [
      { id: 'd5-e4-main', folders: ['Treadmill_walking', 'Running'] },
      { id: 'd5-e4-alt1', folders: ['Elliptical_trainer', 'Treadmill_walking'] },
      { id: 'd5-e4-alt2', folders: ['Treadmill_walking'] }
    ]
  }
];

const destDir = path.join(process.cwd(), 'public', 'exercises');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
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
  console.log('Fixing & downloading all 132 files across 66 variations...');
  let fixedCount = 0;

  for (const ex of exercisesWithAlts) {
    const mainAlt = ex.alts[0];
    const mainFrame0 = path.join(destDir, `${mainAlt.id}-0.jpg`);
    const mainFrame1 = path.join(destDir, `${mainAlt.id}-1.jpg`);

    for (const alt of ex.alts) {
      for (let frame = 0; frame <= 1; frame++) {
        const fileName = `${alt.id}-${frame}.jpg`;
        const filePath = path.join(destDir, fileName);

        let isValid = false;
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.size > 1000) {
            isValid = true;
          }
        }

        if (!isValid) {
          let downloaded = false;
          // Try candidate folders
          for (const folder of alt.folders) {
            const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folder}/${frame}.jpg`;
            try {
              await download(url, filePath);
              console.log(`✓ [200 OK] Downloaded ${fileName} from ${folder}`);
              downloaded = true;
              fixedCount++;
              break;
            } catch (e) {}
          }

          // If still not downloaded, fallback copy main frame
          if (!downloaded) {
            const sourceFrame = frame === 0 ? mainFrame0 : mainFrame1;
            if (fs.existsSync(sourceFrame)) {
              fs.copyFileSync(sourceFrame, filePath);
              console.log(`✓ [FALLBACK COPY] Copied ${sourceFrame} to ${fileName}`);
              fixedCount++;
            }
          }
        }
      }
    }
  }

  console.log(`Fixing complete! Total fixed: ${fixedCount}.`);
}

run();
