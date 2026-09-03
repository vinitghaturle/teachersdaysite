const fs = require('fs');

let bundle = fs.readFileSync('scratch/unpacked_bundle.js', 'utf8');

// Replace the automatic window.onload at the bottom with an exported init function
bundle = bundle.replace(/window\.onload\s*=\s*\(\s*\(\s*\)\s*=>\s*\{\s*window\.Main\s*=\s*new\s*t\s*\}\s*\)\s*;?/g, '');

const esmWrapper = `
${bundle}

export function initBookEngine() {
  if (typeof window !== 'undefined') {
    if (!window.Main) {
      // Find constructor 't' from QCba entry
      const mainModule = parcelRequire('QCba');
      // Or instantiate Main if already defined
      if (typeof window.initHTWKRMain === 'function') {
        window.initHTWKRMain();
      }
    }
  }
}
`;

// Let's check how window.Main is initialized at the end of the bundle
const mainInitIdx = bundle.lastIndexOf('window.Main=new t');
console.log('mainInitIdx:', mainInitIdx);
if (mainInitIdx !== -1) {
  console.log('Snippet around mainInit:', bundle.slice(mainInitIdx - 50, mainInitIdx + 100));
}
