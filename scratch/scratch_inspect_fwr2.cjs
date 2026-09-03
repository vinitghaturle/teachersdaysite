const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const modPos = js.indexOf('"fwR2":[function');
if (modPos !== -1) {
  console.log('Module fwR2:');
  console.log(js.slice(modPos, modPos + 1800));
}
