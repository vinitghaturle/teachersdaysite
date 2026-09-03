const fs = require('fs');
const js = fs.readFileSync('scratch/unpacked_bundle.js', 'utf8');

console.log(js.slice(0, 300));
