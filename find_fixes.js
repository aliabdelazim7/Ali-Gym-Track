import https from 'https';

const fixes = [
  'Captain_Chair_Leg_Raise',
  'Flat_Bench_Lying_Leg_Raise',
  'Ab_Crunch_Machine',
  'Cross-Body_Crunch',
  'Standing_Cable_Woodchop',
  'Cable_Woodchop',
  'Bicycle_Crunches',
  'Recumbent_Bike',
  'Elliptical_trainer'
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
  for (const f of fixes) {
    console.log(await check(f));
  }
}
run();
