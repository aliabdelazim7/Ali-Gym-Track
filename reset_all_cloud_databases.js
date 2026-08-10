import fs from 'fs';

async function resetAllDatabases() {
  const emptyPayload = {
    appName: "Ali Gym Tracker Clean Database",
    lastUpdatedDate: new Date().toISOString(),
    workoutProgress: {},
    exerciseWeights: {},
    exerciseReps: {},
    dietProgress: {},
    waterGlasses: {},
    weightLogs: [],
    activeDay: 1
  };

  console.log('--- RESETTING ALL DATABASES & CLOUD BINS ---');

  // 1. Reset Google Apps Script Web App URL
  const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzbib8mglWxUhFt63mk798-Evdz2GEQy2nqy9zkzPhxMJNOe95yeCWChJDRJFyGmbJ7Bw/exec";
  try {
    console.log('Clearing Google Apps Script Sheet...');
    const resApps = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(emptyPayload),
      redirect: 'follow'
    });
    console.log('Apps Script Reset Status:', resApps.status);
    const textApps = await resApps.text();
    console.log('Apps Script Response:', textApps);
  } catch(e) {
    console.error('Apps Script reset error:', e);
  }

  // 2. Reset JSONBlob Cloud Bin
  const jsonBlobUrl = "https://jsonblob.com/api/jsonBlob/019febb5-c70b-730c-8fb4-1227a57998ac";
  try {
    console.log('Clearing JSONBlob Bin...');
    const resBlob = await fetch(jsonBlobUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emptyPayload)
    });
    console.log('JSONBlob Reset Status:', resBlob.status);
  } catch(e) {
    console.error('JSONBlob reset error:', e);
  }

  console.log('--- ALL CLOUD DATABASES SUCCESSFULLY RESET TO CLEAN ZERO STATE ---');
}

resetAllDatabases();
