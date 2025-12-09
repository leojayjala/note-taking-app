// backend/server.js - COMPLETE VERSION WITH MYSQL
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'note_app_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL database');
        connection.release();
    }
});

const dbPromise = db.promise();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

// ========== AUTHENTICATION ROUTES ==========

// REGISTER
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Check if user exists
        const [existingUsers] = await dbPromise.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        const [result] = await dbPromise.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        
        // Create JWT token
        const token = jwt.sign(
            { userId: result.insertId, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: { id: result.insertId, email }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Find user
        const [users] = await dbPromise.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const user = users[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ========== CRUD ROUTES (PROTECTED) ==========

// CREATE NOTE
app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.userId;
        
        if (!title || !content) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and content are required' 
            });
        }
        
        const [result] = await dbPromise.execute(
            'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
            [userId, title, content]
        );
        
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: {
                id: result.insertId,
                user_id: userId,
                title,
                content
            }
        });
        
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// READ ALL NOTES
app.get('/api/notes', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        const [notes] = await dbPromise.execute(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );
        
        res.json({
            success: true,
            count: notes.length,
            notes
        });
        
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// UPDATE NOTE
app.put('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.userId;
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and content are required' 
            });
        }
        
        const [result] = await dbPromise.execute(
            'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, noteId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Note not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Note updated successfully'
        });
        
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// DELETE NOTE
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.userId;
        
        const [result] = await dbPromise.execute(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [noteId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Note not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ========== TEST ROUTES ==========
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '✅ Note App Backend is running!',
        database: 'MySQL connected',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            createNote: 'POST /api/notes',
            getNotes: 'GET /api/notes',
            updateNote: 'PUT /api/notes/:id',
            deleteNote: 'DELETE /api/notes/:id'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        database: 'Connected',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 NOTE APP BACKEND - COMPLETE VERSION');
    console.log('='.repeat(60));
    console.log(`📍 http://localhost:${PORT}`);
    console.log('📦 Features:');
    console.log('   ✅ MySQL Database');
    console.log('   ✅ JWT Authentication');
    console.log('   ✅ User Registration/Login');
    console.log('   ✅ Full CRUD Operations');
    console.log('   ✅ User-Specific Data Access');
    console.log('='.repeat(60));
});