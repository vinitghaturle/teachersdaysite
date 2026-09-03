const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Find occurrences of enterButton in the bundle
const idxs = [];
let pos = 0;
while ((pos = js.indexOf('enterButton', pos)) !== -1) {
  idxs.push(pos);
  pos += 11;
}

idxs.forEach((idx, i) => {
  console.log(`--- enterButton occurrence ${i} ---`);
  console.log(js.slice(Math.max(0, idx - 200), Math.min(js.length, idx + 300)));
});
