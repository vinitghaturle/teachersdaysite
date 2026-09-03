const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Extract styles
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Found styles count:', styleMatches.length);

if (styleMatches[0]) {
  fs.writeFileSync('scratch/unpacked_fonts.css', styleMatches[0]);
}
if (styleMatches[1]) {
  fs.writeFileSync('scratch/unpacked_main.css', styleMatches[1]);
}

// Extract scripts
const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
console.log('Found scripts count:', scriptMatches.length);

if (scriptMatches[0]) {
  fs.writeFileSync('scratch/unpacked_bundle.js', scriptMatches[0]);
}
