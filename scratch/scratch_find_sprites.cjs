const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Find all data.json or TexturePacker imports in the bundle
const jsonMatches = [...js.matchAll(/data\.[a-f0-9]+\.json|data\.[a-f0-9]+\.png|[a-zA-Z0-9_\-]+\.[a-f0-9]{8}\.(?:png|jpg|json|glb)/gi)].map(m => m[0]);
console.log('Hashed assets in bundle:', [...new Set(jsonMatches)]);

// Check where data.json is loaded
const dataPos = [];
let p = 0;
while ((p = js.indexOf('data.json', p)) !== -1) {
  dataPos.push(p);
  p += 9;
}
dataPos.forEach((pos, i) => {
  console.log(`--- data.json pos ${i} ---`);
  console.log(js.slice(Math.max(0, pos - 150), Math.min(js.length, pos + 250)));
});
