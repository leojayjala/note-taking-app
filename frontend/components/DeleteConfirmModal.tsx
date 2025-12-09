"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, noteTitle }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-card rounded-xl shadow-elevated animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-display font-semibold text-foreground">
            Delete Note
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-foreground mb-1">
                Are you sure you want to delete this note?
              </p>
              <p className="text-sm text-muted-foreground">
                &quot;{noteTitle}&quot; will be permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-danger flex-1">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

