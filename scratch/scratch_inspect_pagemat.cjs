const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Find where Pg0f is used or where page textures are loaded
const p = js.indexOf('"Pg0f"');
console.log('Pg0f found at:', p);

// Check where pageMaterials or setupPageMaterials is defined
const setupPos = js.indexOf('setupPageMaterials()');
if (setupPos !== -1) {
  console.log('setupPageMaterials:');
  console.log(js.slice(setupPos, setupPos + 800));
}
