const fs = require('fs');

const body = fs.readFileSync('extracted_body.html', 'utf8');
console.log('--- Body HTML ---');
console.log(body);

const styles = fs.readFileSync('extracted_styles.css', 'utf8');
console.log('--- Styles preview (without base64) ---');
console.log(styles.replace(/url\("data:[^"]+"\)/g, 'url("data:...")'));
