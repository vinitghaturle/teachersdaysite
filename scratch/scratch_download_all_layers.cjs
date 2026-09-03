const fs = require('fs');
const https = require('https');
const path = require('path');

const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const modules = ['Pg0f', 'mR0n', 'z9Rv', 'Tyda', 'Hk8F', 'Edba', 'RipP', 'No9Z'];

const allFiles = [];

// Also add cover and back_cover
allFiles.push('images/cover.png');
allFiles.push('images/back_cover.png');
allFiles.push('images_webp/cover.webp');
allFiles.push('images_webp/back_cover.webp');

modules.forEach((mod, idx) => {
  const chapterNum = `0${idx + 1}`;
  const p = js.indexOf(`"${mod}":[function`);
  if (p !== -1) {
    const chunk = js.slice(p, p + 2500);
    const filenames = [...chunk.matchAll(/filename:"([^"]+)"/g)].map(m => m[1]);
    console.log(`Chapter ${chapterNum} filenames:`, filenames);
    
    filenames.forEach(fn => {
      allFiles.push(`images/${chapterNum}/${fn}`);
      allFiles.push(`images_webp/${chapterNum}/${fn.replace('.png', '.webp')}`);
    });
  }
});

console.log('Total files to download:', allFiles.length);

async function downloadFile(relPath) {
  const url = `https://howtotalktowhitekidsaboutracism.com/${relPath}`;
  const destPath = path.join('public', relPath);
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return new Promise((resolve) => {
    https.get(url, res => {
      if (res.statusCode === 200) {
        // Verify it's not the fallback HTML
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('html')) {
          console.log(`[SKIPPED HTML fallback] ${relPath}`);
          resolve(false);
          return;
        }

        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(destPath).size;
          console.log(`[OK] ${relPath} (${size} bytes)`);
          resolve(true);
        });
      } else {
        console.log(`[ERR ${res.statusCode}] ${relPath}`);
        resolve(false);
      }
    }).on('error', err => {
      console.log(`[ERR] ${relPath}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const f of allFiles) {
    await downloadFile(f);
  }
  console.log('Finished downloading all chapter layers & WebP sprites!');
}

run();
