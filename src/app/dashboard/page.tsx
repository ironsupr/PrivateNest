'use client';

import { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/ui/Header';
import { AddBookmarkForm } from '@/components/bookmarks/AddBookmarkForm';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { BookmarkSearch } from '@/components/bookmarks/BookmarkSearch';
import { SortSelect } from '@/components/bookmarks/SortSelect';
import { TagFilter } from '@/components/tags/TagFilter';
import { StatsBar } from '@/components/ui/StatsBar';
import { ExportButton } from '@/components/ui/ExportButton';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Loader2 } from 'lucide-react';
import type { SortOption } from '@/types';

export default function DashboardPage() {
    const {
        bookmarks,
        loading,
        addBookmark,
        deleteBookmark,
        toggleRead,
        updateBookmark,
        checkDuplicate,
        getAllTags,
    } = useBookmarks();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [addFormExpanded, setAddFormExpanded] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcuts
    const handleToggleAddForm = useCallback(() => {
        setAddFormExpanded((prev) => !prev);
    }, []);

    const handleFocusSearch = useCallback(() => {
        searchInputRef.current?.focus();
    }, []);

    useKeyboardShortcuts({
        onToggleAddForm: handleToggleAddForm,
        onFocusSearch: handleFocusSearch,
    });

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Loading your bookmarks...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Header />

            <main className="dashboard-main">
                <div className="dashboard-container">
                    {/* Stats Bar */}
                    <StatsBar bookmarks={bookmarks} />

                    {/* Add Bookmark */}
                    <AddBookmarkForm
                        onAdd={addBookmark}
                        checkDuplicate={checkDuplicate}
                        isExpanded={addFormExpanded}
                        onExpandChange={setAddFormExpanded}
                    />

                    {/* Controls */}
                    <div className="dashboard-controls">
                        <BookmarkSearch
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            inputRef={searchInputRef}
                        />
                        <SortSelect
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                        />
                        <ExportButton bookmarks={bookmarks} />
                    </div>

                    {/* Tag Filter */}
                    <TagFilter
                        tags={getAllTags()}
                        activeTag={activeTag}
                        onTagSelect={setActiveTag}
                    />

                    {/* Bookmark List */}
                    <BookmarkList
                        bookmarks={bookmarks}
                        sortOption={sortOption}
                        searchQuery={searchQuery}
                        activeTag={activeTag}
                        onDelete={deleteBookmark}
                        onToggleRead={toggleRead}
                        onUpdate={updateBookmark}
                    />

                    {/* Keyboard shortcut hints */}
                    <div className="shortcut-hints">
                        <span><kbd>Ctrl</kbd>+<kbd>K</kbd> Add</span>
                        <span><kbd>/</kbd> Search</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
