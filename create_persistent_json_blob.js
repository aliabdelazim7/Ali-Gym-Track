import fs from 'fs';

async function createBlob() {
  try {
    const payload = {
      appName: "Ali Gym Tracker Cloud",
      lastUpdated: new Date().toISOString(),
      workoutProgress: {
        "2026-08-09": { "d1-e1": 3, "d1-e2": 3, "d1-e3": 3 }
      },
      exerciseWeights: {
        "2026-08-09": { "d1-e1": 70, "d1-e2": 60 }
      },
      exerciseReps: {
        "2026-08-09": { "d1-e1": 10, "d1-e2": 10 }
      },
      dietProgress: {
        "2026-08-09": { "breakfast": true, "lunch": true }
      },
      waterGlasses: {
        "2026-08-09": 8
      },
      weightLogs: [],
      activeDay: 1
    };

    const res = await fetch("https://jsonblob.com/api/jsonBlob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const location = res.headers.get("Location");
      const binId = location ? location.split('/').pop() : null;
      console.log('New Blob Location:', location);
      console.log('New Blob Bin ID:', binId);
    } else {
      console.log('Create status:', res.status);
    }
  } catch(e) {
    console.error('Error creating blob:', e);
  }
}

createBlob();
