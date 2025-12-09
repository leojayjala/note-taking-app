const path = require('path');
console.log('Current directory:', __dirname);
console.log('Looking for routes/authRoutes.js...');

try {
    const routes = require('./routes/authRoutes');
    console.log('✅ authRoutes.js found and loaded!');
} catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Checking if file exists...');
    
    const fs = require('fs');
    const filePath = path.join(__dirname, 'routes', 'authRoutes.js');
    if (fs.existsSync(filePath)) {
        console.log('✅ File exists at:', filePath);
        console.log('File content (first 200 chars):');
        console.log(fs.readFileSync(filePath, 'utf8').substring(0, 200));
    } else {
        console.log('❌ File does not exist:', filePath);
    }
}