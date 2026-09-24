const fs = require('fs');
const content = fs.readFileSync('vercel_debug.log', 'utf8');
const lines = content.split('\n');
const errIdx = lines.findIndex(l => l.includes('Command "npm run build" exited') || l.includes('failed because of webpack errors') || l.includes('Error:'));
if (errIdx !== -1) {
    fs.writeFileSync('crash.txt', lines.slice(Math.max(0, errIdx - 50), errIdx + 10).join('\n'));
} else {
    fs.writeFileSync('crash.txt', lines.slice(-50).join('\n'));
}
