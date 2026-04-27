const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.dart')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Specifically target the exact lines failing from the log by finding `const ` followed by common widget/class names, and if they have `AppTheme.` nearby.
      // A safer blanket approach for these specific files is just to remove `const ` before these specific types, because it's impossible for them to be const if they contain AppTheme getters anyway.
      
      const replacements = [
        /const\s+TextStyle\b/g,
        /const\s+InputDecoration\b/g,
        /const\s+BoxDecoration\b/g,
        /const\s+Icon\b/g,
        /const\s+Divider\b/g,
        /const\s+Text\b/g
      ];

      let newContent = content;
      // We only apply this regex if the file contains AppTheme to avoid messing up completely unrelated files.
      if (newContent.includes('AppTheme')) {
        for (const regex of replacements) {
          // Replace `const Type` with `Type` globally
          newContent = newContent.replace(regex, (match) => match.replace('const ', ''));
        }
      }
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('c:\\Users\\Lenovo\\Google_solution_challenge_2026\\supplychain\\flutter_app\\lib');
console.log('Done!');
