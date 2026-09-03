const fs = require('fs');
const html = fs.readFileSync('site_dump.html', 'utf8');

// Find all @font-face
const fontFaces = [...html.matchAll(/@font-face\s*\{[^}]*\}/gi)].map(m => m[0]);
console.log('Font faces count:', fontFaces.length);
fontFaces.forEach((f, i) => {
  const family = f.match(/font-family:\s*([^;]+)/i);
  console.log(`Font ${i}:`, family ? family[1] : 'unknown', f.slice(0, 100));
});

// Check for SVGs / Illustrations / Animations
const svgs = [...html.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/gi)];
console.log('SVG count:', svgs.length);
svgs.forEach((s, i) => {
  console.log(`SVG ${i} length: ${s[0].length}, preview: ${s[0].slice(0, 150)}`);
});

// Check inline scripts
const inlineScripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Inline script count:', inlineScripts.length);
inlineScripts.forEach((s, i) => {
  console.log(`Script ${i} length: ${s[1].length}`);
});

// Check DOM structure under body
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  const bodyContent = bodyMatch[1];
  console.log('Body length:', bodyContent.length);
  // Find top level tags in body
  const tags = [...bodyContent.matchAll(/<([a-zA-Z0-9\-]+)([^>]*)>/g)].slice(0, 25);
  console.log('Top tags:', tags.map(t => `<${t[1]} class="${(t[2].match(/class="([^"]+)"/) || [])[1] || ''}" id="${(t[2].match(/id="([^"]+)"/) || [])[1] || ''}">`));
}
