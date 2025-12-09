"use client";

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Note } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  index: number;
}

export function NoteCard({ note, onEdit, onDelete, index }: NoteCardProps) {
  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <div 
      className="note-card group animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 flex-1">
          {note.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Edit note"
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete(note)}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
        {note.content}
      </p>
      <p className="text-xs text-muted-foreground/70">
        Updated {formattedDate}
      </p>
    </div>
  );
}

