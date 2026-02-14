'use client';

import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
    onToggleAddForm: () => void;
    onFocusSearch: () => void;
}

export function useKeyboardShortcuts({
    onToggleAddForm,
    onFocusSearch,
}: UseKeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs/textareas
            const target = e.target as HTMLElement;
            const isInput =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.isContentEditable;

            // Ctrl+K or Cmd+K → open add bookmark form
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                onToggleAddForm();
                return;
            }

            // "/" → focus search (only if not already in an input)
            if (e.key === '/' && !isInput) {
                e.preventDefault();
                onFocusSearch();
                return;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onToggleAddForm, onFocusSearch]);
}
