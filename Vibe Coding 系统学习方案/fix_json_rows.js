const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

function fixFile(fileName) {
  const path = base + fileName;
  let content = fs.readFileSync(path, 'utf8');
  
  // Find rows arrays that are incorrectly formatted as 1D arrays instead of 2D
  // Pattern: "rows":["a","b","c","d","e","f","g","h",...] where it should be
  // "rows":[["a","b","c","d"],["e","f","g","h"],...]
  
  // This particular table has 4 columns, so we need to group every 4 elements
  const pattern = /("rows":)\s*\[((?:"[^"]*",?\s*)+)\]/g;
  
  let fixedContent = content;
  let count = 0;
  
  fixedContent = fixedContent.replace(pattern, (match, prefix, rowsContent) => {
    // Split the rows content into individual elements
    const elements = rowsContent.match(/"[^"]*"/g);
    if (elements && elements.length > 0 && elements.length % 4 === 0) {
      // Group into subarrays of 4 elements each
      const grouped = [];
      for (let i = 0; i < elements.length; i += 4) {
        grouped.push('[' + elements.slice(i, i + 4).join(',') + ']');
      }
      count++;
      return prefix + '[' + grouped.join(',') + ']';
    }
    return match;
  });
  
  if (count > 0) {
    fs.writeFileSync(path, fixedContent, 'utf8');
    console.log(fileName + ': Fixed ' + count + ' rows arrays');
  } else {
    console.log(fileName + ': No rows array issues found');
  }
  
  return count;
}

console.log('=== Fixing rows arrays ===');
const count = fixFile('prompt-engineering-code_intermediate.html');

console.log('');
console.log('Total fixes: ' + count);
console.log('Done!');