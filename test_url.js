import fs from 'fs';
import path from 'path';
import https from 'https';

const exercises = [
  { id: 'd1-e1', name: 'Bench Press', url: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/0.jpg' },
  { id: 'd1-e1-gif', name: 'Bench Press GIF', url: 'https://www.spotebi.com/wp-content/uploads/2014/10/dumbbell-chest-press-exercise-illustration.gif' },
  { id: 'd1-e1-giphy', name: 'Bench Press Giphy', url: 'https://media.giphy.com/media/l41K3tWko01vk650c/giphy.gif' }
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      resolve({ status: res.statusCode, headers: res.headers });
    });
    req.on('error', (err) => resolve({ error: err.message }));
  });
}

async function test() {
  for (const ex of exercises) {
    const res = await checkUrl(ex.url);
    console.log(ex.name, res);
  }
}

test();
