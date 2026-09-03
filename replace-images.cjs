const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REPLACE_DIR = path.join(__dirname, 'replace');
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const WEBP_DIR = path.join(__dirname, 'public', 'images_webp');

// Ensure replace folder exists
if (!fs.existsSync(REPLACE_DIR)) {
  fs.mkdirSync(REPLACE_DIR, { recursive: true });
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function buildTargetIndex() {
  const existingFiles = getAllFiles(IMAGES_DIR);
  const index = new Map();

  existingFiles.forEach((file) => {
    const relFromImages = path.relative(IMAGES_DIR, file);
    const baseNameWithoutExt = path.parse(file).name;
    const relKey = relFromImages.replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
    index.set(relKey, relFromImages);

    if (!index.has(baseNameWithoutExt)) {
      index.set(baseNameWithoutExt, relFromImages);
    }
  });

  // UI Icons in public root
  index.set('arrow', 'UI_ARROW');
  index.set('arrow.3779d7ca', 'UI_ARROW');
  index.set('open_link', 'UI_OPEN_LINK');
  index.set('open_link.9c13ce2f', 'UI_OPEN_LINK');

  return index;
}

async function processReplacements() {
  console.log('🔄 Checking for images in "replace/" directory...\n');

  const replaceFiles = getAllFiles(REPLACE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.svg'].includes(ext);
  });

  if (replaceFiles.length === 0) {
    console.log('ℹ️  No images found in the "replace/" folder.');
    console.log('💡 How to use:');
    console.log('   1. Drop your new image into the "replace/" folder (e.g., arrow.png, cover.jpg, 01_Inside_lasse_0004_background.png)');
    console.log('   2. Run: npm run replace-images\n');
    return;
  }

  const targetIndex = buildTargetIndex();
  let replacedCount = 0;

  for (const srcFile of replaceFiles) {
    const parsed = path.parse(srcFile);
    const relFromReplace = path.relative(REPLACE_DIR, srcFile).replace(/\\/g, '/');
    const relKey = relFromReplace.replace(/\.[^/.]+$/, '');
    const baseName = parsed.name;

    const matchedTargetRel = targetIndex.get(relKey) || targetIndex.get(baseName);

    if (!matchedTargetRel) {
      console.warn(`⚠️  Skipping "${relFromReplace}": No matching image found in public/images/ or UI icons.`);
      continue;
    }

    try {
      if (matchedTargetRel === 'UI_ARROW') {
        const arrowTarget = path.join(PUBLIC_DIR, 'arrow.3779d7ca.png');
        await sharp(srcFile).png().toFile(arrowTarget);
        console.log(`✅ Successfully replaced Nav Arrow icon: public/arrow.3779d7ca.png\n`);
        replacedCount++;
        continue;
      }

      if (matchedTargetRel === 'UI_OPEN_LINK') {
        const linkTarget = path.join(PUBLIC_DIR, 'open_link.9c13ce2f.png');
        await sharp(srcFile).png().toFile(linkTarget);
        console.log(`✅ Successfully replaced Open Link icon: public/open_link.9c13ce2f.png\n`);
        replacedCount++;
        continue;
      }

      const relWithoutExt = matchedTargetRel.replace(/\.[^/.]+$/, '');
      const targetPng = path.join(IMAGES_DIR, `${relWithoutExt}.png`);
      const targetWebp = path.join(WEBP_DIR, `${relWithoutExt}.webp`);

      fs.mkdirSync(path.dirname(targetPng), { recursive: true });
      fs.mkdirSync(path.dirname(targetWebp), { recursive: true });

      await sharp(srcFile).png({ quality: 100, compressionLevel: 8 }).toFile(targetPng);
      await sharp(srcFile).webp({ quality: 90 }).toFile(targetWebp);

      console.log(`✅ Successfully replaced:`);
      console.log(`   ➜ PNG:  public/images/${relWithoutExt}.png`);
      console.log(`   ➜ WebP: public/images_webp/${relWithoutExt}.webp\n`);
      replacedCount++;
    } catch (err) {
      console.error(`❌ Error processing "${srcFile}":`, err.message);
    }
  }

  console.log(`🎉 Done! Processed ${replacedCount} image(s). Refresh your browser at http://localhost:5173/ to view changes!`);
}

processReplacements();
