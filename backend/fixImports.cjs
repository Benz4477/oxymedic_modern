const fs = require('fs');
const path = require('path');
const routesDir = path.join(__dirname, 'src', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

let fixedCount = 0;
for (const file of files) {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const lines = content.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import ') && lines[i].includes('requirePermission(')) {
      lines[i] = lines[i].replace(/requirePermission\('[^']+'\),?\s*/g, '');
      changed = true;
    }
  }
  
  if (changed) {
    let newContent = lines.join('\n');
    newContent = newContent.replace(/,\s*\}/g, '}');
    fs.writeFileSync(filePath, newContent, 'utf8');
    fixedCount++;
    console.log('Fixed imports in', file);
  }
}
console.log('Total files fixed:', fixedCount);
