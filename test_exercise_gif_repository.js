import fs from 'fs';

async function testFolders() {
  const folders = [
    "Barbell_Bench_Press_-_Medium_Grip",
    "Incline_Dumbbell_Press",
    "T-Bar_Row",
    "Wide-Grip_Lat_Pulldown",
    "Cable_Lateral_Raise",
    "Standing_Dumbbell_Triceps_Extension",
    "Plank",
    "Ab_Roller",
    "Leg_Press",
    "Stiff-Legged_Barbell_Deadlift",
    "Leg_Extensions",
    "Standing_Calf_Raises",
    "Seated_Cable_Rows",
    "Face_Pull",
    "EZ-Bar_Curl",
    "Dumbbell_Lunges",
    "Seated_Leg_Curl"
  ];

  for (const f of folders) {
    const url0 = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${f}/0.jpg`;
    const url1 = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${f}/1.jpg`;
    try {
      const r0 = await fetch(url0, { method: 'HEAD' });
      const r1 = await fetch(url1, { method: 'HEAD' });
      console.log(f, '=> 0.jpg:', r0.status, '| 1.jpg:', r1.status);
    } catch(e) {
      console.log(f, '=> Error:', e.message);
    }
  }
}

testFolders();
