const fs = require('fs');
const lines = fs.readFileSync('vercel_debug.log', 'utf8').split('\n');
const errIdx = lines.findIndex(l => l.includes('Build failed because of webpack errors') || l.includes('Command "npm run build" exited with 1'));
if (errIdx !== -1) {
    console.log(lines.slice(Math.max(0, errIdx - 30), errIdx + 5).join('\n'));
} else {
    console.log(lines.slice(-20).join('\n'));
}
