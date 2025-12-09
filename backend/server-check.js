// server-check.js
const fs = require('fs');
const serverContent = fs.readFileSync('./server.js', 'utf8');

console.log('='.repeat(60));
console.log('🔍 CHECKING SERVER.JS');
console.log('='.repeat(60));

// Check for key components
const checks = [
    { name: 'Express import', check: serverContent.includes('const express = require') },
    { name: 'CORS middleware', check: serverContent.includes('cors') || serverContent.includes('CORS') },
    { name: 'Body parser JSON', check: serverContent.includes('express.json()') },
    { name: 'authRoutes import', check: serverContent.includes('authRoutes') },
    { name: 'app.use for /api/auth', check: serverContent.includes("app.use('/api/auth'") || serverContent.includes('app.use(\'/api/auth\'') },
    { name: 'app.listen', check: serverContent.includes('app.listen') }
];

checks.forEach(check => {
    console.log(`${check.check ? '✅' : '❌'} ${check.name}`);
});

// Show the authRoutes import section
console.log('\n📋 AUTHROUTES IMPORT SECTION:');
const lines = serverContent.split('\n');
lines.forEach((line, index) => {
    if (line.includes('authRoutes')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});

// Show app.use sections
console.log('\n📋 APP.USE SECTIONS:');
lines.forEach((line, index) => {
    if (line.includes('app.use') && (line.includes('/api') || line.includes('authRoutes') || line.includes('noteRoutes'))) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});

console.log('\n' + '='.repeat(60));