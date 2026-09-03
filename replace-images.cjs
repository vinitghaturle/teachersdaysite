const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REPLACE_DIR = path.join(__dirname, 'replace');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const WEBP_DIR = path.join(__dirname, 'public', 'images_webp');

// Ensure replace folder exists
if (!fs.existsSync(REPLACE_DIR)) {
  fs.mkdirSync(REPLACE_DIR, { recursive: true });
}

/**
 * Recursively find all files in a directory
 */
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

/**
 * Build index of all existing images in public/images
 */
function buildTargetIndex() {
  const existingFiles = getAllFiles(IMAGES_DIR);
  const index = new Map();

  existingFiles.forEach((file) => {
    const relFromImages = path.relative(IMAGES_DIR, file);
    const baseNameWithoutExt = path.parse(file).name;
    
    // Store by relative path without extension (e.g. '01/01_Inside_lasse_0004_background' or 'cover')
    const relKey = relFromImages.replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
    index.set(relKey, relFromImages);

    // Also store by pure filename for convenient flat drops (e.g. dropping '01_Inside_lasse_0004_background.jpg' directly in replace/)
    if (!index.has(baseNameWithoutExt)) {
      index.set(baseNameWithoutExt, relFromImages);
    }
  });

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
    console.log('   1. Drop your new image into the "replace/" folder (e.g., cover.jpg, 01_Inside_lasse_0004_background.png)');
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

    // Match by relative structure or basename
    const matchedTargetRel = targetIndex.get(relKey) || targetIndex.get(baseName);

    if (!matchedTargetRel) {
      console.warn(`⚠️  Skipping "${relFromReplace}": No matching image found in public/images/`);
      continue;
    }

    const relWithoutExt = matchedTargetRel.replace(/\.[^/.]+$/, '');
    const targetPng = path.join(IMAGES_DIR, `${relWithoutExt}.png`);
    const targetWebp = path.join(WEBP_DIR, `${relWithoutExt}.webp`);

    // Ensure target directories exist
    fs.mkdirSync(path.dirname(targetPng), { recursive: true });
    fs.mkdirSync(path.dirname(targetWebp), { recursive: true });

    try {
      // Convert and save PNG (preserves transparency)
      await sharp(srcFile)
        .png({ quality: 100, compressionLevel: 8 })
        .toFile(targetPng);

      // Convert and save WebP (high quality & compressed)
      await sharp(srcFile)
        .webp({ quality: 90 })
        .toFile(targetWebp);

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
