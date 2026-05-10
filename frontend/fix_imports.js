const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'app')).concat(walk(path.join(__dirname, 'components')));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace various depths of relative imports to backend/lib
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/\.\.\/backend\/lib\/([^'"]+)['"]/g, '"@backend/$1"');
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/backend\/lib\/([^'"]+)['"]/g, '"@backend/$1"');
    content = content.replace(/['"]\.\.\/\.\.\/backend\/lib\/([^'"]+)['"]/g, '"@backend/$1"');
    content = content.replace(/['"]\.\.\/backend\/lib\/([^'"]+)['"]/g, '"@backend/$1"');
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed imports in', file.replace(__dirname, ''));
    }
});
