import https from 'https';

const initialData = JSON.stringify({
  appName: "Ali Gym Tracker Master Cloud",
  lastUpdated: new Date().toISOString(),
  workoutProgress: {},
  exerciseWeights: {},
  exerciseReps: {},
  dietProgress: {},
  waterGlasses: 0,
  weightLogs: []
});

const req = https.request('https://jsonblob.com/api/jsonBlob', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}, (res) => {
  const blobId = res.headers['location'].split('/').pop();
  console.log('MASTER_CLOUD_BIN_ID:', blobId);
});

req.write(initialData);
req.end();
