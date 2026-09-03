const fs = require('fs');

let js = fs.readFileSync('scratch/unpacked_bundle.js', 'utf8');

// Declare parcelRequire properly so ESM strict mode doesn't throw ReferenceError
if (js.startsWith('parcelRequire=')) {
  js = 'var ' + js;
}

// Replace window.onload with window.initHTWKRBook
js = js.replace(
  'window.onload=(()=>{window.Main=new t});',
  'window.initHTWKRBook=function(){if(!window.Main && document.querySelector("#canvasContainer")){window.Main=new t();}};'
);

const esmContent = `/* eslint-disable */
// 3D Three.js + GSAP Book Curl Animation Engine (Adapted for React)
var parcelRequire;
${js}

export function initBookEngine() {
  if (typeof window !== 'undefined' && typeof window.initHTWKRBook === 'function') {
    window.initHTWKRBook();
  }
}
`;

fs.writeFileSync('src/components/BookEngine/engine.js', esmContent);
console.log('Fixed src/components/BookEngine/engine.js with var parcelRequire!');
