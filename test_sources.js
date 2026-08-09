import https from 'https';

const testUrls = [
  // Free Exercise DB Github GIF / 0.jpg & 1.jpg
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/0.jpg',
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/1.jpg',
  // MuscleWiki / Giphy / Open Exercise Repos
  'https://v2.exercisedb.io/image/5aP9sF5aL7vN3d',
  'https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/Bench_Press/images/0.jpg',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG9sbG14eDFwbmtsZG0xbzltMWg5bzlwbWc3azFpZjJtNnM5b3R1ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKvx7cWk6K1Nqjm/giphy.gif'
];

async function check(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode, type: res.headers['content-type'], length: res.headers['content-length'] });
    }).on('error', (err) => resolve({ url, error: err.message }));
  });
}

async function run() {
  for (const u of testUrls) {
    console.log(await check(u));
  }
}
run();
