const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

function fixFile(fileName) {
  const path = base + fileName;
  let content = fs.readFileSync(path, 'utf8');
  
  // The problem pattern: "rows":[...] ] ],"caption":"..."
  // Should be: "rows":[...],"caption":"..."
  // We need to replace ]],"caption": with ],"caption":
  
  const pattern = /(\]"rows":\[\[.*?\]\])\]\s*,\s*("caption":)/g;
  const matches = content.match(pattern);
  
  if (matches && matches.length > 0) {
    console.log(fileName + ': Found ' + matches.length + ' occurrences');
    const fixed = content.replace(pattern, '$1,$2');
    fs.writeFileSync(path, fixed, 'utf8');
    console.log(fileName + ': Fixed ' + matches.length + ' occurrences');
    return matches.length;
  } else {
    console.log(fileName + ': No issues found');
    return 0;
  }
}

console.log('=== Fixing files ===');
const count1 = fixFile('prompt-engineering-code_intermediate.html');
const count2 = fixFile('ai-code-navigation_intermediate.html');

console.log('');
console.log('Total fixes: ' + (count1 + count2));
console.log('Done!');