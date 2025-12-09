// test-api.js
const http = require('http');

function testEndpoint(endpoint, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`\n${endpoint}:`);
                console.log('Status:', res.statusCode);
                console.log('Response:', data);
                resolve({ status: res.statusCode, data: JSON.parse(data) });
            });
        });

        req.on('error', (error) => {
            console.error(`❌ ${endpoint} failed:`, error.message);
            reject(error);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing API Endpoints...');
    console.log('='.repeat(50));
    
    const testUser = {
        email: 'test@example.com',
        password: 'password123'
    };
    
    try {
        // Test 1: Register
        await testEndpoint('/api/auth/register', testUser);
        
        // Test 2: Login
        await testEndpoint('/api/auth/login', testUser);
        
        // Test 3: Home page
        const http = require('http');
        http.get('http://localhost:5001/', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log('\nGET /:');
                console.log('Status:', res.statusCode);
                console.log('Response:', data);
            });
        });
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

runTests();