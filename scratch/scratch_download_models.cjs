const fs = require('fs');
const https = require('https');
const path = require('path');

const filesToTry = [
  'page_blender.c0989f10.glb',
  'cover_blender.a3d644b2.glb',
  'roughness_2.4c20e531.jpg',
  'bump.79691ae4.jpg',
  'bg.707b1e7c.jpg',
  'normal.1f0c6ba6.jpg',
  'mask1.172d26f0.png',
  'mask2.28b06f61.png',
  'mask3.fc15afd4.png',
  'images/cover.png',
  'images/back_cover.png',
  // static images & json
  'images/01/data.json', 'images/01/data.png',
  'images/02/data.json', 'images/02/data.png',
  'images/03/data.json', 'images/03/data.png',
  'images/04/data.json', 'images/04/data.png',
  'images/05/data.json', 'images/05/data.png',
  'images/06/data.json', 'images/06/data.png',
  'images/07/data.json', 'images/07/data.png',
  'images/08/data.json', 'images/08/data.png',
  'assets/static/images/01/data.json', 'assets/static/images/01/data.png',
  'assets/static/images/02/data.json', 'assets/static/images/02/data.png',
  'assets/static/images/03/data.json', 'assets/static/images/03/data.png',
  'assets/static/images/04/data.json', 'assets/static/images/04/data.png',
  'assets/static/images/05/data.json', 'assets/static/images/05/data.png',
  'assets/static/images/06/data.json', 'assets/static/images/06/data.png',
  'assets/static/images/07/data.json', 'assets/static/images/07/data.png',
  'assets/static/images/08/data.json', 'assets/static/images/08/data.png',
];

async function download(fileRel) {
  const url = `https://howtotalktowhitekidsaboutracism.com/${fileRel}`;
  const localPath = path.join('public', fileRel);
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return new Promise((resolve) => {
    https.get(url, res => {
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(localPath);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          const size = fs.statSync(localPath).size;
          console.log(`[OK 200] ${fileRel} (${size} bytes)`);
          resolve(true);
        });
      } else {
        console.log(`[ERR ${res.statusCode}] ${fileRel}`);
        resolve(false);
      }
    }).on('error', err => {
      console.log(`[FAILED] ${fileRel}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const f of filesToTry) {
    await download(f);
  }
}

run();
