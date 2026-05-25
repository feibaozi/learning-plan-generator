const fs = require('fs');

const base = 'c:/Users/hexi/Desktop/skills/学习资料/Vibe Coding 系统学习方案/';

function checkTables(fileName) {
  const path = base + fileName;
  const content = fs.readFileSync(path, 'utf8');
  
  // Extract inline script
  const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRe.exec(content)) !== null) {
    if (!scriptMatch[1].includes('src=')) {
      const scriptContent = scriptMatch[2];
      
      // Find all tables arrays
      const tablesRe = /"tables":\s*\[([^\]]+)\]/g;
      let tablesMatch;
      let tableIndex = 0;
      
      while ((tablesMatch = tablesRe.exec(scriptContent)) !== null) {
        tableIndex++;
        const tableContent = tablesMatch[1];
        
        // Check structure
        // Look for objects in the tables array
        const objRe = /\{[^\}]+\}/g;
        const objs = tableContent.match(objRe);
        
        if (objs) {
          console.log(fileName + ' - Table ' + tableIndex + ': ' + objs.length + ' object(s)');
          
          objs.forEach((obj, i) => {
            // Check if object has rows and caption
            if (obj.includes('"rows":') && obj.includes('"caption":')) {
              console.log('  Object ' + (i+1) + ': OK (has both rows and caption)');
            } else if (obj.includes('"rows":')) {
              console.log('  Object ' + (i+1) + ': PROBLEM (has rows but no caption)');
            } else if (obj.includes('"caption":')) {
              console.log('  Object ' + (i+1) + ': PROBLEM (has caption but no rows)');
            }
          });
          
          // Check if there's caption outside objects
          const cleanContent = tableContent.replace(/\{[^\}]+\}/g, '');
          if (cleanContent.includes('"caption":')) {
            console.log('  WARNING: caption found outside objects!');
          }
        } else {
          console.log('  No objects found in table array');
        }
      }
    }
  }
}

console.log('=== Checking all tables ===');
checkTables('prompt-engineering-code_intermediate.html');
console.log('');
checkTables('ai-code-navigation_intermediate.html');
console.log('');
checkTables('ai-dev-env-setup_intermediate.html');