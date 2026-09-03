const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
  'open_link.9c13ce2f.png',
  'arrow.3779d7ca.png',
  'apple-touch-icon.771ac0b9.png',
  'favicon-32x32.641a0f9f.png',
  'favicon-16x16.dcb1ad76.png',
  'safari-pinned-tab.4d1ac785.svg',
  'images/social_share.jpg'
];

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images');
}

assets.forEach(asset => {
  const fileUrl = `https://howtotalktowhitekidsaboutracism.com/${asset}`;
  const destPath = path.join('public', asset);
  
  const file = fs.createWriteStream(destPath);
  https.get(fileUrl, res => {
    if (res.statusCode === 200) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${asset} (${fs.statSync(destPath).size} bytes)`);
      });
    } else {
      console.log(`Failed to download ${asset}: Status ${res.statusCode}`);
    }
  }).on('error', err => {
    console.error(`Error downloading ${asset}:`, err.message);
  });
});
