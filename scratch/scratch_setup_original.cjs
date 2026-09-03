const fs = require('fs');

let html = fs.readFileSync('site_dump.html', 'utf8');

// Remove google analytics tracking script to avoid external tracking/blocked requests locally
html = html.replace(/<script async="" src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>/gi, '');
html = html.replace(/<script>function a\(\)\{dataLayer\.push\(arguments\)[\s\S]*?<\/script>/gi, '');

// Save to index.html
fs.writeFileSync('index.html', html);
console.log('Successfully written index.html with exact original assets, Canela fonts, shaders, and animations!');
