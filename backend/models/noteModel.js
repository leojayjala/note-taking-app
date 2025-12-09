// models/noteModel.js
const pool = require('../config/database');

const Note = {
    create: async (userId, title, content) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
                [userId, title, content]
            );
            return result.insertId;
        } catch (error) {
            console.error('Note.create error:', error);
            throw error;
        }
    },

    getAllByUser: async (userId) => {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Note.getAllByUser error:', error);
            throw error;
        }
    }
};

module.exports = Note;