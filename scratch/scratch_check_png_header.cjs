const fs = require('fs');

// Check the first 8 bytes of images/01/data.png to verify PNG magic header
const buf = fs.readFileSync('public/images/01/data.png');
console.log('File size:', buf.length);
console.log('First 20 bytes:', buf.slice(0, 20).toString());
console.log('Is PNG:', buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47);
