// controllers/noteController.js
const Note = require('../models/noteModel');

const noteController = {
    createNote: async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.userId;

            if (!title || !content) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title and content are required.' 
                });
            }

            const noteId = await Note.create(userId, title, content);
            
            res.status(201).json({
                success: true,
                message: 'Note created successfully!',
                note: { id: noteId, title, content, user_id: userId }
            });

        } catch (error) {
            console.error('Create note error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error: ' + error.message 
            });
        }
    },

    getAllNotes: async (req, res) => {
        try {
            const userId = req.userId;
            const notes = await Note.getAllByUser(userId);

            res.json({
                success: true,
                count: notes.length,
                notes
            });

        } catch (error) {
            console.error('Get notes error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error: ' + error.message 
            });
        }
    }
};

module.exports = noteController;