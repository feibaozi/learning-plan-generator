const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

// Fix function - handle multiple occurrences
function fixTableJson(content) {
  // The issue is: \"rows\":[...]}\"caption\": 
  // Should be: \"rows\":[...],\"caption\":
  // Use a global regex with g flag to replace all occurrences
  const regex = /("rows":\[.*?\])}("caption":)/g;
  let fixed = content;
  let count = 0;
  let match;
  // Count occurrences first
  const testContent = content;
  while ((match = regex.exec(testContent)) !== null) {
    count++;
  }
  console.log('Found ' + count + ' occurrences to fix');
  // Now do the replacement with global flag
  fixed = content.replace(regex, '$1},$2');
  return fixed;
}

// Fix prompt-engineering-code
let promptPath = base + 'prompt-engineering-code_intermediate.html';
let promptContent = fs.readFileSync(promptPath, 'utf8');
console.log('=== Fixing prompt-engineering-code_intermediate.html ===');
let promptFixed = fixTableJson(promptContent);
fs.writeFileSync(promptPath, promptFixed);
console.log('Fixed prompt-engineering-code_intermediate.html');

// Fix ai-code-navigation
let navPath = base + 'ai-code-navigation_intermediate.html';
let navContent = fs.readFileSync(navPath, 'utf8');
console.log('');
console.log('=== Fixing ai-code-navigation_intermediate.html ===');
let navFixed = fixTableJson(navContent);
fs.writeFileSync(navPath, navFixed);
console.log('Fixed ai-code-navigation_intermediate.html');

console.log('');
console.log('Done!');