import fs from 'fs';
import path from 'path';

const exercisesWithAlts = [
  // Day 1
  {
    id: 'd1-e1', name: 'Bench Press',
    alts: [
      { id: 'd1-e1-main', folder: 'Barbell_Bench_Press_-_Medium_Grip' },
      { id: 'd1-e1-alt1', folder: 'Dumbbell_Bench_Press' },
      { id: 'd1-e1-alt2', folder: 'Chest_dip' }
    ]
  },
  {
    id: 'd1-e2', name: 'Lat Pulldown',
    alts: [
      { id: 'd1-e2-main', folder: 'Wide-Grip_Lat_Pulldown' },
      { id: 'd1-e2-alt1', folder: 'V-bar_pulldown' },
      { id: 'd1-e2-alt2', folder: 'Pullups' }
    ]
  },
  {
    id: 'd1-e3', name: 'Overhead Press',
    alts: [
      { id: 'd1-e3-main', folder: 'Seated_Dumbbell_Press' },
      { id: 'd1-e3-alt1', folder: 'Standing_Military_Press' },
      { id: 'd1-e3-alt2', folder: 'Arnold_press' }
    ]
  },
  {
    id: 'd1-e4', name: 'Seated Cable Row',
    alts: [
      { id: 'd1-e4-main', folder: 'Seated_Cable_Rows' },
      { id: 'd1-e4-alt1', folder: 'One-Arm_Dumbbell_Row' },
      { id: 'd1-e4-alt2', folder: 'T-Bar_Row' }
    ]
  },
  {
    id: 'd1-e5', name: 'Bicep Curls',
    alts: [
      { id: 'd1-e5-main', folder: 'Dumbbell_Alternate_Bicep_Curl' },
      { id: 'd1-e5-alt1', folder: 'EZ-Bar_Curl' },
      { id: 'd1-e5-alt2', folder: 'Cable_Preacher_Curl' }
    ]
  },
  {
    id: 'd1-e6', name: 'Tricep Pushdown',
    alts: [
      { id: 'd1-e6-main', folder: 'Triceps_Pushdown' },
      { id: 'd1-e6-alt1', folder: 'Standing_Dumbbell_Triceps_Extension' },
      { id: 'd1-e6-alt2', folder: 'Dips_-_Triceps_Version' }
    ]
  },
  {
    id: 'd1-e7', name: 'Plank',
    alts: [
      { id: 'd1-e7-main', folder: 'Plank' },
      { id: 'd1-e7-alt1', folder: 'Ab_Roller' },
      { id: 'd1-e7-alt2', folder: 'Side_Plank' }
    ]
  },

  // Day 2
  {
    id: 'd2-e1', name: 'Squats',
    alts: [
      { id: 'd2-e1-main', folder: 'Barbell_Full_Squat' },
      { id: 'd2-e1-alt1', folder: 'Goblet_Squat' },
      { id: 'd2-e1-alt2', folder: 'Smith_machine_squat' }
    ]
  },
  {
    id: 'd2-e2', name: 'Romanian Deadlift',
    alts: [
      { id: 'd2-e2-main', folder: 'Stiff-Legged_Barbell_Deadlift' },
      { id: 'd2-e2-alt1', folder: 'Romanian_Deadlift_With_Dumbbells' },
      { id: 'd2-e2-alt2', folder: 'Single-Leg_Deadlift_With_Dumbbells' }
    ]
  },
  {
    id: 'd2-e3', name: 'Leg Extensions',
    alts: [
      { id: 'd2-e3-main', folder: 'Leg_Extensions' },
      { id: 'd2-e3-alt1', folder: 'Sissy_Squat' },
      { id: 'd2-e3-alt2', folder: 'Dumbbell_pass' }
    ]
  },
  {
    id: 'd2-e4', name: 'Calf Raises',
    alts: [
      { id: 'd2-e4-main', folder: 'Standing_Calf_Raises' },
      { id: 'd2-e4-alt1', folder: 'Seated_Calf_Raise' },
      { id: 'd2-e4-alt2', folder: 'Calf_Press_On_The_Leg_Press_Machine' }
    ]
  },
  {
    id: 'd2-e5', name: 'HIIT Cardio',
    alts: [
      { id: 'd2-e5-main', folder: 'Jumping_jack' },
      { id: 'd2-e5-alt1', folder: 'Mountain_climbers' },
      { id: 'd2-e5-alt2', folder: 'Burpees' }
    ]
  },

  // Day 4
  {
    id: 'd4-e1', name: 'Incline Dumbbell Press',
    alts: [
      { id: 'd4-e1-main', folder: 'Incline_Dumbbell_Press' },
      { id: 'd4-e1-alt1', folder: 'Barbell_Incline_Bench_Press_-_Medium_Grip' },
      { id: 'd4-e1-alt2', folder: 'Incline_Dumbbell_Flyes' }
    ]
  },
  {
    id: 'd4-e2', name: 'Dumbbell Rows',
    alts: [
      { id: 'd4-e2-main', folder: 'One-Arm_Dumbbell_Row' },
      { id: 'd4-e2-alt1', folder: 'Dumbbell_Incline_Row' },
      { id: 'd4-e2-alt2', folder: 'Bent_Over_Two-Arm_Long_Barbell_Row' }
    ]
  },
  {
    id: 'd4-e3', name: 'Lateral Raises',
    alts: [
      { id: 'd4-e3-main', folder: 'Side_Lateral_Raise' },
      { id: 'd4-e3-alt1', folder: 'Cable_Lateral_Raise' },
      { id: 'd4-e3-alt2', folder: 'Seated_Dumbbell_Lateral_Raise' }
    ]
  },
  {
    id: 'd4-e4', name: 'Face Pulls',
    alts: [
      { id: 'd4-e4-main', folder: 'Face_Pull' },
      { id: 'd4-e4-alt1', folder: 'Seated_Rear_Delt_Raise' },
      { id: 'd4-e4-alt2', folder: 'Reverse_Flyes' }
    ]
  },
  {
    id: 'd4-e5', name: 'Hanging Leg Raises',
    alts: [
      { id: 'd4-e5-main', folder: 'Hanging_Leg_Raise' },
      { id: 'd4-e5-alt1', folder: 'Flat_Bench_Lying_Leg_Raise' },
      { id: 'd4-e5-alt2', folder: 'Decline_Crunch' }
    ]
  },
  {
    id: 'd4-e6', name: 'Russian Twists',
    alts: [
      { id: 'd4-e6-main', folder: 'Russian_Twist' },
      { id: 'd4-e6-alt1', folder: 'Cross-Body_Crunch' },
      { id: 'd4-e6-alt2', folder: 'Cross-Body_Crunch' }
    ]
  },

  // Day 5
  {
    id: 'd5-e1', name: 'Bulgarian Split Squats',
    alts: [
      { id: 'd5-e1-main', folder: 'Dumbbell_Lunges' },
      { id: 'd5-e1-alt1', folder: 'Dumbbell_Walking_Lunge' },
      { id: 'd5-e1-alt2', folder: 'Barbell_Lunge' }
    ]
  },
  {
    id: 'd5-e2', name: 'Leg Curls',
    alts: [
      { id: 'd5-e2-main', folder: 'Seated_Leg_Curl' },
      { id: 'd5-e2-alt1', folder: 'Dumbbell_Lying_Leg_Curl' },
      { id: 'd5-e2-alt2', folder: 'Exercise_Ball_Hamstring_Curl' }
    ]
  },
  {
    id: 'd5-e3', name: 'Leg Press',
    alts: [
      { id: 'd5-e3-main', folder: 'Leg_Press' },
      { id: 'd5-e3-alt1', folder: 'Hack_Squat' },
      { id: 'd5-e3-alt2', folder: 'Dumbbell_Step-Ups' }
    ]
  },
  {
    id: 'd5-e4', name: 'LISS Cardio',
    alts: [
      { id: 'd5-e4-main', folder: 'Treadmill_walking' },
      { id: 'd5-e4-alt1', folder: 'Elliptical_trainer' },
      { id: 'd5-e4-alt2', folder: 'Treadmill_walking' }
    ]
  }
];

const destDir = path.join(process.cwd(), 'public', 'exercises');

function audit() {
  console.log('Auditing all 66 variation files in public/exercises...');
  let totalChecked = 0;
  let missingOrZero = 0;
  let missingList = [];

  for (const ex of exercisesWithAlts) {
    for (const alt of ex.alts) {
      for (let frame = 0; frame <= 1; frame++) {
        totalChecked++;
        const fileName = `${alt.id}-${frame}.jpg`;
        const filePath = path.join(destDir, fileName);

        let ok = false;
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.size > 1000) {
            ok = true;
          }
        }

        if (!ok) {
          missingOrZero++;
          missingList.push({ id: alt.id, fileName, folder: alt.folder, frame });
        }
      }
    }
  }

  console.log(`Audit Results: Total checked: ${totalChecked}, Valid: ${totalChecked - missingOrZero}, Missing/0-byte: ${missingOrZero}`);
  if (missingList.length > 0) {
    console.log('Broken/Missing files:', JSON.stringify(missingList, null, 2));
  }
}

audit();
