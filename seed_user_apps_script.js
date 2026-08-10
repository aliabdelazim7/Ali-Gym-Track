import fs from 'fs';

async function seedAppsScript() {
  const url = "https://script.google.com/macros/s/AKfycbzbib8mglWxUhFt63mk798-Evdz2GEQy2nqy9zkzPhxMJNOe95yeCWChJDRJFyGmbJ7Bw/exec";
  const payload = {
    appName: "Ali Gym Tracker Google Sheet",
    lastUpdatedDate: new Date().toISOString(),
    workoutProgress: {
      "2026-08-09": { "d1-e1": 3, "d1-e2": 3, "d1-e3": 3 },
      "2026-08-10": { "d1-e1": 3 }
    },
    exerciseWeights: {
      "2026-08-09": { "d1-e1": 70, "d1-e2": 60 },
      "2026-08-10": { "d1-e1": 72.5 }
    },
    exerciseReps: {
      "2026-08-09": { "d1-e1": 10, "d1-e2": 10 },
      "2026-08-10": { "d1-e1": 8 }
    },
    dietProgress: {
      "2026-08-09": { "breakfast": true, "lunch": true },
      "2026-08-10": { "breakfast": true }
    },
    waterGlasses: {
      "2026-08-09": 8,
      "2026-08-10": 4
    },
    weightLogs: [],
    activeDay: 1
  };

  try {
    console.log('Sending POST request to Apps Script URL...');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    console.log('POST status:', res.status);
    const text = await res.text();
    console.log('POST response:', text);
  } catch(e) {
    console.error('POST error:', e);
  }
}

seedAppsScript();
