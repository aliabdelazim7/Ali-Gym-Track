import https from 'https';
import fs from 'fs';
import path from 'path';

// Let's test common folder names for Bench Press, HIIT, LISS Cardio
const testPaths = [
  // Bench Press
  'Barbell_Bench_Press_-_Medium_Grip',
  'Barbell_Bench_Press',
  'Dumbbell_Bench_Press',
  'Bench_press',
  // Jumping Jacks
  'Jumping_jack',
  'Jumping_jacks',
  'Jumping_Jack',
  // Walking
  'Treadmill_walking',
  'Walking_on_treadmill',
  'Walking_treadmill'
];

async function check(folder) {
  const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folder}/0.jpg`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ folder, status: res.statusCode });
    }).on('error', (err) => resolve({ folder, error: err.message }));
  });
}

async function run() {
  for (const f of testPaths) {
    console.log(await check(f));
  }
}

run();
