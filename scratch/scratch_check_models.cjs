const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const matches = [];
['modelsLoaded', 'texturesLoaded', 'loading'].forEach(term => {
  let pos = 0;
  while ((pos = js.indexOf(term, pos)) !== -1) {
    console.log(`--- term '${term}' at ${pos} ---`);
    console.log(js.slice(Math.max(0, pos - 150), Math.min(js.length, pos + 250)));
    pos += term.length;
  }
});
