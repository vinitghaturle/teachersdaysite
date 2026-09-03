const fs = require('fs');
const js = fs.readFileSync('extracted_bundle.js', 'utf8');

const modules = ['Pg0f', 'mR0n', 'z9Rv', 'Tyda', 'Hk8F', 'Edba', 'RipP', 'No9Z'];
modules.forEach(mod => {
  const p = js.indexOf(`"${mod}":[function`);
  if (p !== -1) {
    console.log(`=== Module ${mod} ===`);
    console.log(js.slice(p, p + 500));
  }
});
