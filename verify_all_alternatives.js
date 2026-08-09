import https from 'https';

const testFolders = [
  // Day 1
  { id: 'd1-e1-main', folder: 'Barbell_Bench_Press_-_Medium_Grip' },
  { id: 'd1-e1-alt1', folder: 'Dumbbell_Bench_Press' },
  { id: 'd1-e1-alt2', folder: 'Chest_dip' },

  { id: 'd1-e2-main', folder: 'Wide-Grip_Lat_Pulldown' },
  { id: 'd1-e2-alt1', folder: 'V-bar_pulldown' },
  { id: 'd1-e2-alt2', folder: 'Pullups' },

  { id: 'd1-e3-main', folder: 'Seated_Dumbbell_Press' },
  { id: 'd1-e3-alt1', folder: 'Standing_Military_Press' },
  { id: 'd1-e3-alt2', folder: 'Arnold_press' },

  { id: 'd1-e4-main', folder: 'Seated_Cable_Rows' },
  { id: 'd1-e4-alt1', folder: 'One-Arm_Dumbbell_Row' },
  { id: 'd1-e4-alt2', folder: 'T-Bar_Row' },

  { id: 'd1-e5-main', folder: 'Dumbbell_Alternate_Bicep_Curl' },
  { id: 'd1-e5-alt1', folder: 'EZ-Bar_Curl' },
  { id: 'd1-e5-alt2', folder: 'Cable_Preacher_Curl' },

  { id: 'd1-e6-main', folder: 'Triceps_Pushdown' },
  { id: 'd1-e6-alt1', folder: 'Standing_Dumbbell_Triceps_Extension' },
  { id: 'd1-e6-alt2', folder: 'Dips_-_Triceps_Version' },

  { id: 'd1-e7-main', folder: 'Plank' },
  { id: 'd1-e7-alt1', folder: 'Ab_Roller' },
  { id: 'd1-e7-alt2', folder: 'Side_Plank' },

  // Day 2
  { id: 'd2-e1-main', folder: 'Barbell_Full_Squat' },
  { id: 'd2-e1-alt1', folder: 'Goblet_Squat' },
  { id: 'd2-e1-alt2', folder: 'Smith_machine_squat' },

  { id: 'd2-e2-main', folder: 'Stiff-Legged_Barbell_Deadlift' },
  { id: 'd2-e2-alt1', folder: 'Romanian_Deadlift_With_Dumbbells' },
  { id: 'd2-e2-alt2', folder: 'Single-Leg_Deadlift_With_Dumbbells' },

  { id: 'd2-e3-main', folder: 'Leg_Extensions' },
  { id: 'd2-e3-alt1', folder: 'Sissy_Squat' },
  { id: 'd2-e3-alt2', folder: 'Dumbbell_pass' },

  { id: 'd2-e4-main', folder: 'Standing_Calf_Raises' },
  { id: 'd2-e4-alt1', folder: 'Seated_Calf_Raise' },
  { id: 'd2-e4-alt2', folder: 'Calf_Press_On_The_Leg_Press_Machine' },

  { id: 'd2-e5-main', folder: 'Jumping_jack' },
  { id: 'd2-e5-alt1', folder: 'Mountain_climbers' },
  { id: 'd2-e5-alt2', folder: 'Burpees' },

  // Day 4
  { id: 'd4-e1-main', folder: 'Incline_Dumbbell_Press' },
  { id: 'd4-e1-alt1', folder: 'Barbell_Incline_Bench_Press_-_Medium_Grip' },
  { id: 'd4-e1-alt2', folder: 'Incline_Dumbbell_Flyes' },

  { id: 'd4-e2-main', folder: 'One-Arm_Dumbbell_Row' },
  { id: 'd4-e2-alt1', folder: 'Dumbbell_Incline_Row' },
  { id: 'd4-e2-alt2', folder: 'Bent_Over_Two-Arm_Long_Barbell_Row' },

  { id: 'd4-e3-main', folder: 'Side_Lateral_Raise' },
  { id: 'd4-e3-alt1', folder: 'Cable_Lateral_Raise' },
  { id: 'd4-e3-alt2', folder: 'Seated_Dumbbell_Lateral_Raise' },

  { id: 'd4-e4-main', folder: 'Face_Pull' },
  { id: 'd4-e4-alt1', folder: 'Seated_Rear_Delt_Raise' },
  { id: 'd4-e4-alt2', folder: 'Reverse_Flyes' },

  { id: 'd4-e5-main', folder: 'Hanging_Leg_Raise' },
  { id: 'd4-e5-alt1', folder: 'Gorilla_Chin_Side_State' },
  { id: 'd4-e5-alt2', folder: 'Decline_Crunch' },

  { id: 'd4-e6-main', folder: 'Russian_Twist' },
  { id: 'd4-e6-alt1', folder: 'Standing_Cable_Woodchope' },
  { id: 'd4-e6-alt2', folder: 'Bicycle_Kick' },

  // Day 5
  { id: 'd5-e1-main', folder: 'Dumbbell_Lunges' },
  { id: 'd5-e1-alt1', folder: 'Dumbbell_Walking_Lunge' },
  { id: 'd5-e1-alt2', folder: 'Barbell_Lunge' },

  { id: 'd5-e2-main', folder: 'Seated_Leg_Curl' },
  { id: 'd5-e2-alt1', folder: 'Dumbbell_Lying_Leg_Curl' },
  { id: 'd5-e2-alt2', folder: 'Exercise_Ball_Hamstring_Curl' },

  { id: 'd5-e3-main', folder: 'Leg_Press' },
  { id: 'd5-e3-alt1', folder: 'Hack_Squat' },
  { id: 'd5-e3-alt2', folder: 'Dumbbell_Step-Ups' },

  { id: 'd5-e4-main', folder: 'Treadmill_walking' },
  { id: 'd5-e4-alt1', folder: 'Stationary_Bike' },
  { id: 'd5-e4-alt2', folder: 'Elliptical_trainer' }
];

async function checkUrl(item) {
  const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${item.folder}/0.jpg`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ id: item.id, folder: item.folder, status: res.statusCode });
    }).on('error', (err) => resolve({ id: item.id, folder: item.folder, error: err.message }));
  });
}

async function run() {
  console.log('Verifying folder paths for exercise alternatives...');
  let failed = 0;
  for (const item of testFolders) {
    const res = await checkUrl(item);
    if (res.status === 200) {
      console.log(`✓ [200 OK] ${res.id} -> ${res.folder}`);
    } else {
      console.error(`✗ [${res.status}] ${res.id} -> ${res.folder}`);
      failed++;
    }
  }
  console.log(`Verification finished. Total checked: ${testFolders.length}, Failed: ${failed}`);
}

run();
