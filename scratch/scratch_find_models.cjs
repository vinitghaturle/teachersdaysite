const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Find all occurrences of .gltf, .glb, .bin, .jpg, .png, .webp, .svg in the bundle
const assetMatches = [...js.matchAll(/["']([^"']+\.(?:gltf|glb|bin|png|jpg|jpeg|webp|svg|json))["']/gi)].map(m => m[1]);
console.log('Asset file paths in bundle:', [...new Set(assetMatches)]);

// Check where r.default comes from
const rDefaultPos = js.indexOf('t.load(');
if (rDefaultPos !== -1) {
  console.log('Around t.load:');
  console.log(js.slice(Math.max(0, rDefaultPos - 400), Math.min(js.length, rDefaultPos + 600)));
}
