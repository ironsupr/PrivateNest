'use client';

import { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { AddBookmarkForm } from '@/components/bookmarks/AddBookmarkForm';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { BookmarkSearch } from '@/components/bookmarks/BookmarkSearch';
import { SortSelect } from '@/components/bookmarks/SortSelect';
import { TagFilter } from '@/components/tags/TagFilter';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Loader2 } from 'lucide-react';
import type { SortOption } from '@/types';

export default function DashboardPage() {
    const {
        bookmarks,
        loading,
        addBookmark,
        deleteBookmark,
        toggleRead,
        checkDuplicate,
        getAllTags,
    } = useBookmarks();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);

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
                    {/* Add Bookmark */}
                    <AddBookmarkForm onAdd={addBookmark} checkDuplicate={checkDuplicate} />

                    {/* Controls */}
                    <div className="dashboard-controls">
                        <BookmarkSearch
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        <SortSelect
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                        />
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
                    />
                </div>
            </main>
        </div>
    );
}
