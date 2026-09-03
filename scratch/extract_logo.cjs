const fs = require('fs');
const path = require('path');

let css = fs.readFileSync('src/styles/main.css', 'utf8');

// Find the base64 logo image
const logoMatch = css.match(/\.logo\{[^}]*background:url\("data:image\/png;base64,([^"]+)"\)/);

if (logoMatch) {
  const base64Data = logoMatch[1];
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('public/logo.png', buffer);
  console.log('Saved extracted logo to public/logo.png (size:', buffer.length, 'bytes)');

  // Replace base64 in CSS with clean url(/logo.png)
  css = css.replace(
    /background:url\("data:image\/png;base64,[^"]+"\)/,
    'background:url(/logo.png)'
  );
  fs.writeFileSync('src/styles/main.css', css);
  console.log('Updated src/styles/main.css to use /logo.png');
} else {
  console.log('Logo base64 not matched');
}
