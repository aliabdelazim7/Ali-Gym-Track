import http from 'http';
import fs from 'fs';

http.get('http://localhost:4173/', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('HTML fetched successfully, status code:', res.statusCode);
    const jsMatches = body.match(/src="([^"]+)"/g) || [];
    const cssMatches = body.match(/href="([^"]+\.css)"/g) || [];
    console.log('JS assets in HTML:', jsMatches);
    console.log('CSS assets in HTML:', cssMatches);

    // Verify JS file exists in dist
    jsMatches.forEach(m => {
      const relPath = m.replace('src="', '').replace('"', '');
      const fullPath = 'e:\\ali-Gym-Track\\dist' + relPath.replace(/\//g, '\\');
      console.log(`Checking asset: ${relPath} -> exists: ${fs.existsSync(fullPath)}`);
    });
  });
}).on('error', (err) => {
  console.error('HTTP preview fetch error:', err.message);
});
