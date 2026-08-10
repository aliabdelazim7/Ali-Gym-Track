import fs from 'fs';

async function testAppsScript() {
  const url = "https://script.google.com/macros/s/AKfycbzbib8mglWxUhFt63mk798-Evdz2GEQy2nqy9zkzPhxMJNOe95yeCWChJDRJFyGmbJ7Bw/exec";
  try {
    console.log('Testing GET request to Apps Script URL...');
    const res = await fetch(url + '?action=getData', { redirect: 'follow' });
    console.log('Response status:', res.status);
    const text = await res.text();
    console.log('Response text (first 500 chars):', text.slice(0, 500));
  } catch(e) {
    console.error('Fetch error:', e);
  }
}

testAppsScript();
