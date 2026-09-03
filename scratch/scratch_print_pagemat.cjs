const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const setupPos = js.indexOf('setupPageMaterials(){');
if (setupPos !== -1) {
  console.log('setupPageMaterials definition:');
  console.log(js.slice(setupPos, setupPos + 1200));
}
