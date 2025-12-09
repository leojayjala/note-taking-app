"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';
import { NoteCard } from '@/components/NoteCard';
import { NoteModal } from '@/components/NoteModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Note } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuth();
  const { notes, deleteNote } = useNotes();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleDelete = (note: Note) => {
    setDeletingNote(note);
  };

  const confirmDelete = () => {
    if (deletingNote) {
      deleteNote(deletingNote.id);
      setDeletingNote(null);
    }
  };

  const handleCloseModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">Notes</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="btn-ghost text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
              Your Notes
            </h1>
            <p className="mt-1 text-muted-foreground">
              {notes.length === 0 
                ? 'No notes yet. Create your first one!' 
                : `${notes.length} note${notes.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex p-6 rounded-full bg-muted/50 mb-6">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-medium text-foreground mb-2">
              No notes yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start capturing your ideas, thoughts, and reminders by creating your first note.
            </p>
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseModal}
        note={editingNote}
      />

      <DeleteConfirmModal
        isOpen={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={confirmDelete}
        noteTitle={deletingNote?.title || ''}
      />
    </div>
  );
}

