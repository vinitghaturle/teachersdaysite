const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const addPagePos = js.indexOf('addPage(');
if (addPagePos !== -1) {
  console.log('addPage method:');
  console.log(js.slice(addPagePos, addPagePos + 1000));
}
