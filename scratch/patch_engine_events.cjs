const fs = require('fs');

let js = fs.readFileSync('src/components/BookEngine/engine.js', 'utf8');

// Hook into setCurrentPage
const scp = 'this.setCurrentPage=(e=>{';
if (js.includes(scp) && !js.includes('htwkr:pageChange')) {
  js = js.replace(
    'this.setCurrentPage=(e=>{',
    'this.setCurrentPage=(e=>{try{window.dispatchEvent(new CustomEvent("htwkr:pageChange",{detail:{page:e,entered:this.ENTERED}}));}catch(_){}'
  );

  // Hook into dragUpdate
  js = js.replace(
    'this.checkNavArrows(),this.flipTimeline.progress(i)',
    'this.checkNavArrows(),this.flipTimeline.progress(i);try{window.dispatchEvent(new CustomEvent("htwkr:pageChange",{detail:{page:this.currPageIndex,entered:this.ENTERED}}));}catch(_){}'
  );

  // Hook into enterBook onComplete
  js = js.replace(
    'this.currPageIndex=1,t.gsap.set',
    'this.currPageIndex=1;try{window.dispatchEvent(new CustomEvent("htwkr:pageChange",{detail:{page:1,entered:!0}}));}catch(_){};t.gsap.set'
  );

  fs.writeFileSync('src/components/BookEngine/engine.js', js);
  console.log('Successfully hooked pageChange events into engine.js!');
} else {
  console.log('Already hooked or pattern not found');
}
