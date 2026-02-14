'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Bookmark } from '@/types';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { BookmarkGrid } from '@/components/dashboard/BookmarkGrid';
import { useBookmarks } from '@/hooks/useBookmarks';
import { AddBookmarkDialog } from '@/components/dashboard/AddBookmarkDialog';
import { DeleteConfirmationDialog } from '@/components/dashboard/DeleteConfirmationDialog';


export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const { bookmarks, loading: bookmarksLoading, deleteBookmark, toggleRead } = useBookmarks();
    const [authLoading, setAuthLoading] = useState(true);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setAuthLoading(false);
        };
        getUser();
    }, [supabase, router]);

    const handleAddClick = () => {
        setEditingBookmark(null);
        setDialogOpen(true);
    };

    const handleEditClick = (bookmark: Bookmark) => {
        setEditingBookmark(bookmark);
        setDialogOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        setBookmarkToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!bookmarkToDelete) return;
        setIsDeleting(true);
        try {
            await deleteBookmark(bookmarkToDelete);
            setDeleteDialogOpen(false);
            setBookmarkToDelete(null);
        } catch (error) {
            console.error('Failed to delete bookmark:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredBookmarks = useMemo(() => {
        let result = [...bookmarks];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(query) ||
                b.url.toLowerCase().includes(query) ||
                b.description?.toLowerCase().includes(query) ||
                b.tags?.some(t => t.toLowerCase().includes(query))
            );
        }

        // Tag filter
        if (selectedTag) {
            result = result.filter(b => b.tags?.includes(selectedTag));
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });

        return result;
    }, [bookmarks, searchQuery, selectedTag, sortBy]);

    if (authLoading) {
        return null; // Layout handles loading state or skeleton if needed
    }

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar
                onTagSelect={setSelectedTag}
                selectedTag={selectedTag}
                onClearTag={() => setSelectedTag(null)}
            />

            <div className="flex-1 lg:pl-64">
                <DashboardHeader
                    user={user}
                    onAddClick={handleAddClick}
                    onSearch={setSearchQuery}
                />

                <main className="p-8 max-w-7xl mx-auto w-full">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-navy-900 mb-2">
                                {selectedTag ? `#${selectedTag}` : 'My Nest'}
                            </h1>
                            <p className="text-navy-700/70">
                                {selectedTag
                                    ? `Showing all bookmarks tagged with "${selectedTag}"`
                                    : 'Welcome back to your digital sanctuary.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-slate-50 border border-slate-100 text-navy-700 text-sm rounded-xl px-4 py-2 hover:bg-white hover:shadow-soft transition-all focus:outline-none focus:ring-2 focus:ring-indigo-accent/20"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="title">Alphabetical</option>
                            </select>
                        </div>
                    </div>

                    <StatsOverview bookmarks={bookmarks} />

                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-navy-900">
                            {searchQuery ? `Search Results (${filteredBookmarks.length})` : 'Recent Bookmarks'}
                        </h2>
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="text-sm font-medium text-indigo-accent hover:text-indigo-hover transition-colors"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <BookmarkGrid
                        bookmarks={filteredBookmarks}
                        loading={bookmarksLoading}
                        onDelete={handleDeleteRequest}
                        onEdit={handleEditClick}
                        onToggleRead={toggleRead}
                    />
                </main>
            </div>

            <AddBookmarkDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                initialData={editingBookmark}
            />

            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </div>
    );
}
