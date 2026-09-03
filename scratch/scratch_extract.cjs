const fs = require('fs');
const html = fs.readFileSync('site_dump.html', 'utf8');

// Extract all style tags
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Style tags count:', styles.length);
fs.writeFileSync('extracted_styles.css', styles.join('\n\n'));

// Extract script
const inlineScripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
if (inlineScripts[1]) {
  fs.writeFileSync('extracted_bundle.js', inlineScripts[1][1]);
  console.log('Saved extracted_bundle.js (size:', inlineScripts[1][1].length, ')');
}

// Extract body HTML (without scripts)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  const cleanBody = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '');
  fs.writeFileSync('extracted_body.html', cleanBody);
  console.log('Saved extracted_body.html');
}
