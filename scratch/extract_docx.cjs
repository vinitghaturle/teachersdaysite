const fs = require('fs');
const child_process = require('child_process');

try {
  fs.copyFileSync('Teachers_Day_Question_Bank (4).docx', 'scratch/temp_doc.zip');
  const cmd = `powershell -Command "Expand-Archive -Path 'scratch/temp_doc.zip' -DestinationPath 'scratch/docx_extracted' -Force"`;
  child_process.execSync(cmd, { stdio: 'inherit' });
  
  const docXml = fs.readFileSync('scratch/docx_extracted/word/document.xml', 'utf8');
  // Strip XML tags to see text or extract paragraphs
  const text = docXml.replace(/<w:p[^>]*>/g, '\n\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  fs.writeFileSync('scratch/extracted_questions.txt', text);
  console.log('Extracted document text written to scratch/extracted_questions.txt');
  console.log('Sample preview:\n', text.slice(0, 1500));
} catch (e) {
  console.error('Error extracting docx:', e);
}
