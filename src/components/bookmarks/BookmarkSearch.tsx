'use client';

import { Search } from 'lucide-react';
import type { RefObject } from 'react';

interface BookmarkSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    inputRef?: RefObject<HTMLInputElement | null>;
}

export function BookmarkSearch({ searchQuery, onSearchChange, inputRef }: BookmarkSearchProps) {
    return (
        <div className="search-container">
            <Search className="search-icon" />
            <input
                ref={inputRef}
                type="text"
                placeholder="Search bookmarks by title, URL, or tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
            />
            {searchQuery && (
                <button
                    onClick={() => onSearchChange('')}
                    className="search-clear"
                    aria-label="Clear search"
                >
                    ×
                </button>
            )}
        </div>
    );
}

