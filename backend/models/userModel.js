// models/userModel.js
const pool = require('../config/database');

const User = {
    create: async (email, password) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, password]
            );
            return result.insertId;
        } catch (error) {
            console.error('User.create error:', error);
            throw error;
        }
    },

    findByEmail: async (email) => {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('User.findByEmail error:', error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const [rows] = await pool.execute(
                'SELECT id, email, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('User.findById error:', error);
            throw error;
        }
    }
};

module.exports = User;