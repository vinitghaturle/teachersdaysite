const fs = require('fs');
const js = fs.readFileSync('scratch/unpacked_bundle.js', 'utf8');

// The parcel bundle defines modules in parcelRequire and executes the entry module at the bottom
const entryMatch = js.slice(js.length - 1000);
console.log('Bundle footer / Entry:');
console.log(entryMatch);
