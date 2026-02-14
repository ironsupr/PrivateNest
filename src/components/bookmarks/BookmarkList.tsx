'use client';

import { Bookmark, SortOption } from '@/types';
import { BookmarkCard } from './BookmarkCard';
import { Bookmark as BookmarkIcon } from 'lucide-react';

interface BookmarkListProps {
    bookmarks: Bookmark[];
    sortOption: SortOption;
    searchQuery: string;
    activeTag: string | null;
    onDelete: (id: string) => void;
    onToggleRead: (id: string, currentStatus: boolean) => void;
    onUpdate: (id: string, fields: Partial<Pick<Bookmark, 'url' | 'title' | 'description' | 'tags' | 'notes'>>) => Promise<void>;
    onTogglePin: (id: string, currentStatus: boolean) => void;
    selectable?: boolean;
    selectedIds?: string[];
    onSelect?: (id: string) => void;
}

export function BookmarkList({
    bookmarks,
    sortOption,
    searchQuery,
    activeTag,
    onDelete,
    onToggleRead,
    onUpdate,
    onTogglePin,
    selectable = false,
    selectedIds = [],
    onSelect,
}: BookmarkListProps) {
    // Filter by search
    let filtered = bookmarks;

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
            (b) =>
                b.title.toLowerCase().includes(query) ||
                b.url.toLowerCase().includes(query) ||
                b.description?.toLowerCase().includes(query) ||
                b.tags?.some((t) => t.toLowerCase().includes(query))
        );
    }

    // Filter by tag
    if (activeTag) {
        filtered = filtered.filter((b) => b.tags?.includes(activeTag));
    }

    // Sort — pinned always first, then by sort option
    const sorted = [...filtered].sort((a, b) => {
        // Pinned first
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        switch (sortOption) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'a-z':
                return (a.title || a.url).localeCompare(b.title || b.url);
            case 'z-a':
                return (b.title || b.url).localeCompare(a.title || a.url);
            default:
                return 0;
        }
    });

    if (sorted.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <BookmarkIcon className="w-12 h-12" />
                </div>
                <h3 className="empty-title">
                    {searchQuery || activeTag ? 'No matching bookmarks' : 'No bookmarks yet'}
                </h3>
                <p className="empty-description">
                    {searchQuery || activeTag
                        ? 'Try adjusting your search or filter.'
                        : 'Add your first bookmark to get started.'}
                </p>
            </div>
        );
    }

    return (
        <div className="bookmark-list">
            <div className="bookmark-count">
                {sorted.length} bookmark{sorted.length !== 1 ? 's' : ''}
                {(searchQuery || activeTag) && ` matching`}
            </div>
            <div className="bookmark-grid">
                {sorted.map((bookmark) => (
                    <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onDelete={onDelete}
                        onToggleRead={onToggleRead}
                        onUpdate={onUpdate}
                        onTogglePin={onTogglePin}
                        selectable={selectable}
                        selected={selectedIds.includes(bookmark.id)}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
}
