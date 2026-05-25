const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

function fixFile(fileName) {
  const path = base + fileName;
  let content = fs.readFileSync(path, 'utf8');
  
  // The problem is: }"caption": - missing comma before "caption"
  // We need to find patterns like: }"caption":"..."
  // And replace with: },"caption":"..."
  
  // Count occurrences
  const pattern = /\}"caption":/g;
  const matches = content.match(pattern);
  const count = matches ? matches.length : 0;
  console.log(fileName + ': Found ' + count + ' occurrences');
  
  if (count > 0) {
    const fixed = content.replace(pattern, '},"caption":');
    fs.writeFileSync(path, fixed);
    console.log(fileName + ': Fixed ' + count + ' occurrences');
  }
  
  return count;
}

console.log('=== Fixing files ===');
const count1 = fixFile('prompt-engineering-code_intermediate.html');
const count2 = fixFile('ai-code-navigation_intermediate.html');

console.log('');
console.log('Total fixes: ' + (count1 + count2));
console.log('Done!');