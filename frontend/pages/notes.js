// frontend/pages/notes.js - UPDATED WITH CRUD
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            
            const result = await api.getNotes();
            setNotes(result.notes || []);
        } catch (err) {
            setError('Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        try {
            const result = await api.createNote(title, content);
            setNotes([result.note, ...notes]);
            setTitle('');
            setContent('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateNote = async (id, updatedTitle, updatedContent) => {
        try {
            const result = await api.updateNote(id, updatedTitle, updatedContent);
            setNotes(notes.map(note => 
                note.id === id ? result.note : note
            ));
            setEditingNote(null);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!confirm('Delete this note?')) return;
        
        try {
            await api.deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
                        <p className="text-gray-600">Total: {notes.length} notes</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Create/Edit Note Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingNote ? 'Edit Note' : 'Create New Note'}
                    </h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingNote) {
                            handleUpdateNote(editingNote.id, title, content);
                        } else {
                            handleCreateNote(e);
                        }
                    }}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Note Title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                placeholder="Note Content"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {editingNote ? 'Update Note' : 'Add Note'}
                            </button>
                            {editingNote && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingNote(null);
                                        setTitle('');
                                        setContent('');
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Notes List */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
                    {notes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No notes yet. Create your first note above!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {notes.map(note => (
                                <div key={note.id} className="bg-white border rounded-lg p-4 shadow">
                                    {editingNote?.id === note.id ? (
                                        // Editing view
                                        <div>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border mb-2"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                            <textarea
                                                className="w-full px-3 py-2 border mb-2"
                                                rows="3"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        // View mode
                                        <div>
                                            <h3 className="text-lg font-bold mb-2">{note.title}</h3>
                                            <p className="text-gray-700 mb-2">{note.content}</p>
                                            <p className="text-sm text-gray-500">
                                                Created: {new Date(note.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    <div className="mt-4 flex space-x-2">
                                        {editingNote?.id === note.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateNote(note.id, title, content)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingNote(null);
                                                        setTitle('');
                                                        setContent('');
                                                    }}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingNote(note);
                                                        setTitle(note.title);
                                                        setContent(note.content);
                                                    }}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}