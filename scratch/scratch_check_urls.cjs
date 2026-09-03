const fs = require('fs');
const html = fs.readFileSync('site_dump.html', 'utf8');

// Check all URLs in site_dump.html
const urls = [...html.matchAll(/https?:\/\/[^\s"'<>]+/g)].map(m => m[0]);
console.log('External URLs found:', [...new Set(urls)]);
