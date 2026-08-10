import fs from 'fs';

async function fetchBin() {
  try {
    const res = await fetch("https://jsonblob.com/api/jsonBlob/019fe604-c535-71a6-a516-7877bb05e289");
    if (res.ok) {
      const data = await res.json();
      console.log('Cloud Bin Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Fetch status:', res.status);
    }
  } catch(e) {
    console.error('Error fetching bin:', e);
  }
}

fetchBin();
