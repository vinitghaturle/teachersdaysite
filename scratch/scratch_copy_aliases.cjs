const fs = require('fs');
const path = require('path');

// Ensure public/assets/images and public/assets/models exist
const dirs = ['public/assets/images', 'public/assets/models'];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Copy files if needed
const copies = [
  ['public/bg.707b1e7c.jpg', 'public/assets/images/bg.jpg'],
  ['public/roughness_2.4c20e531.jpg', 'public/assets/models/roughness_2.jpg'],
  ['public/bump.79691ae4.jpg', 'public/assets/models/bump.jpg'],
  ['public/normal.1f0c6ba6.jpg', 'public/assets/models/normal.jpg'],
  ['public/page_blender.c0989f10.glb', 'public/assets/models/page_blender.glb'],
  ['public/cover_blender.a3d644b2.glb', 'public/assets/models/cover_blender.glb'],
];

copies.forEach(([src, dest]) => {
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  }
});
