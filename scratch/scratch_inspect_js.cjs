const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Check for known libraries
const libs = ['three', 'pixi', 'gsap', 'tween', 'canvas', 'webgl', 'matter', 'howler', 'anime'];
libs.forEach(lib => {
  const match = js.match(new RegExp(lib, 'i'));
  console.log(`Library search '${lib}':`, match ? 'Found' : 'Not found');
});

// Search for shaders, textures, canvas, page flipping algorithms
const matches = [];
if (js.includes('WebGLRenderer')) matches.push('WebGLRenderer');
if (js.includes('CanvasRenderer')) matches.push('CanvasRenderer');
if (js.includes('PerspectiveCamera')) matches.push('PerspectiveCamera');
if (js.includes('fragmentShader') || js.includes('vertexShader')) matches.push('Shaders');
if (js.includes('createShader')) matches.push('createShader');
if (js.includes('TweenMax') || js.includes('gsap')) matches.push('GSAP');
console.log('Detected tech keywords:', matches);
