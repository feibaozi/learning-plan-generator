const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

function fixFile(fileName) {
  const path = base + fileName;
  
  // Read with UTF-8 encoding
  let content = fs.readFileSync(path, 'utf8');
  
  // Check if there's a tables array with caption outside the object
  // Pattern: "rows":[...]},"caption":"..." - caption is after object closes
  // Should be: "rows":[...],"caption":"..." - caption is inside the object
  
  const pattern = /("rows":\[.*?\])\s*}\s*,\s*("caption":)/g;
  const matches = content.match(pattern);
  
  if (matches && matches.length > 0) {
    console.log(fileName + ': Found ' + matches.length + ' malformed tables');
    const fixed = content.replace(pattern, '$1,$2');
    fs.writeFileSync(path, fixed, 'utf8');
    console.log(fileName + ': Fixed ' + matches.length + ' tables');
    return matches.length;
  } else {
    console.log(fileName + ': No malformed tables found');
    return 0;
  }
}

console.log('=== Fixing files ===');
const count1 = fixFile('prompt-engineering-code_intermediate.html');
const count2 = fixFile('ai-code-navigation_intermediate.html');

console.log('');
console.log('Total fixes: ' + (count1 + count2));
console.log('Done!');