const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

function fixFile(fileName) {
  const path = base + fileName;
  let content = fs.readFileSync(path, 'utf8');
  
  // The issue: tables array has wrong structure
  // Current (wrong): "tables": [{"headers":[...],"rows":[...]},"caption":"..."]
  // Should be: "tables": [{"headers":[...],"rows":[...],"caption":"..."}]
  
  // Pattern to find: },"caption":" inside the tables array
  // We need to replace },"caption":" with ,"caption":"
  
  // Find all tables arrays and check their structure
  const tablesRegex = /"tables":\s*\[([^\]]+)\]/g;
  let match;
  let fixedContent = content;
  let count = 0;
  
  while ((match = tablesRegex.exec(content)) !== null) {
    const tablesContent = match[1];
    // Check if there's a } followed by "caption" without comma
    // This indicates caption is outside the object instead of inside
    if (tablesContent.includes('}"caption":')) {
      console.log(fileName + ': Found malformed tables structure');
      // Replace }"caption": with ,"caption": to put caption inside the object
      const fixedTables = tablesContent.replace(/\}"caption":/g, ',"caption":');
      fixedContent = fixedContent.replace(match[1], fixedTables);
      count++;
    }
  }
  
  if (count > 0) {
    fs.writeFileSync(path, fixedContent);
    console.log(fileName + ': Fixed ' + count + ' tables');
  } else {
    console.log(fileName + ': No issues found');
  }
  
  return count;
}

console.log('=== Fixing files ===');
const count1 = fixFile('prompt-engineering-code_intermediate.html');
const count2 = fixFile('ai-code-navigation_intermediate.html');

console.log('');
console.log('Total fixes: ' + (count1 + count2));
console.log('Done!');