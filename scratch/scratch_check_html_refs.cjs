const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const assetMatches = [...html.matchAll(/(["'])([^"']*\.(?:glb|gltf|png|jpg|jpeg|json))\1/gi)].map(m => m[2]);
console.log('Asset references in index.html:', [...new Set(assetMatches)]);
