const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const p = js.indexOf('checkWebP');
if (p !== -1) {
  console.log('checkWebP:');
  console.log(js.slice(Math.max(0, p - 100), Math.min(js.length, p + 500)));
}
