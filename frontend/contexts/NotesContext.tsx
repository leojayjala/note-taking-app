"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note } from '@/types';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: Note[];
  createNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const NOTES_KEY = 'notes_app_notes';

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [user]);

  const loadNotes = () => {
    try {
      const allNotes = localStorage.getItem(NOTES_KEY);
      const parsedNotes: Note[] = allNotes ? JSON.parse(allNotes) : [];
      const userNotes = parsedNotes.filter((note) => note.userId === user?.id);
      setNotes(userNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch {
      setNotes([]);
    }
  };

  const saveNotes = (updatedUserNotes: Note[]) => {
    try {
      const allNotes = localStorage.getItem(NOTES_KEY);
      const parsedNotes: Note[] = allNotes ? JSON.parse(allNotes) : [];
      const otherNotes = parsedNotes.filter((note) => note.userId !== user?.id);
      const newAllNotes = [...otherNotes, ...updatedUserNotes];
      localStorage.setItem(NOTES_KEY, JSON.stringify(newAllNotes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const createNote = (title: string, content: string) => {
    if (!user) return;

    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      userId: user.id,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const updateNote = (id: string, title: string, content: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const getNoteById = (id: string) => {
    return notes.find((note) => note.id === id);
  };

  return (
    <NotesContext.Provider value={{ notes, createNote, updateNote, deleteNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

