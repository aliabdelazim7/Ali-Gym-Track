import fs from 'fs';

async function testGifs() {
  const testUrls = [
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg",
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/1.jpg",
    "https://media.giphy.com/media/l41YkFIiBxQdpmFd6/giphy.gif",
    "https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif"
  ];

  for (const url of testUrls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(url, '=> Status:', res.status);
    } catch(e) {
      console.log(url, '=> Error:', e.message);
    }
  }
}

testGifs();
