const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Search for parcel asset imports like module.exports="/page_blender..." or similar
const exportMatches = [...js.matchAll(/module\.exports\s*=\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Exported asset paths:', exportMatches);

// Search for any string ending in .glb, .png, .jpg, .json
const allAssets = [...js.matchAll(/["']([^"']+\.(glb|gltf|png|jpg|jpeg|json|bin))["']/gi)].map(m => m[1]);
console.log('All matched assets:', [...new Set(allAssets)]);
