const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Find page data, colors, captions
const colorMatches = [...js.matchAll(/#[0-9a-fA-F]{6}/g)].map(m => m[0]);
console.log('Unique hex colors in bundle:', [...new Set(colorMatches)]);

// Find shaders
const shaderMatches = [...js.matchAll(/(varying\s+[^;]+;[\s\S]*?void\s+main\s*\(\)\s*\{[\s\S]*?\})/g)];
console.log('Shaders found:', shaderMatches.length);
shaderMatches.forEach((s, i) => {
  console.log(`Shader ${i}:`, s[1].slice(0, 300));
});

// Check how pages are created
const pageCreation = [...js.matchAll(/(class\s+\w+\s*\{[\s\S]*?render[\s\S]*?\})/g)];
console.log('Class count:', pageCreation.length);
