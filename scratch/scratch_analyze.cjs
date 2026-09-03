const fs = require('fs');
const html = fs.readFileSync('site_dump.html', 'utf8');

// Find all script tags
const scriptTags = [...html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('Script tags:', scriptTags);

// Find all link tags
const linkTags = [...html.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('Link tags:', linkTags);

// Check if there are inline styles or scripts
console.log('HTML preview (first 1000 chars):');
console.log(html.slice(0, 1000));
