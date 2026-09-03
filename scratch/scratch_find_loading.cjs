const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

// Search for 'loading' or '.loading'
const loadingMatches = [...js.matchAll(/(\.loading|\"loading\"|\'loading\'|Loading\.\.\.)/gi)];
console.log('Loading matches:', loadingMatches.length);

// Search for document.fonts, FontFaceObserver, images, TextureLoader, Image()
const fontMatches = [...js.matchAll(/(document\.fonts|FontFaceObserver|fontLoaded|fonts\.ready)/gi)].map(m => m[0]);
console.log('Font matches:', fontMatches);

const imageMatches = [...js.matchAll(/(new Image|TextureLoader|loadTexture|loadImage)/gi)].map(m => m[0]);
console.log('Image matches:', imageMatches);

// Let's find where '.loading' class is removed or '.pretext' is hidden or 'Open book' is shown
const pretextMatches = [...js.matchAll(/pretext|enterButton|CALC_HEIGHT_DIV/gi)].map(m => m[0]);
console.log('Pretext/enter matches:', pretextMatches);
