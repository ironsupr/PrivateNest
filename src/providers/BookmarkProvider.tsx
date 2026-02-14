'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark } from '@/types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface BookmarkContextType {
    bookmarks: Bookmark[];
    loading: boolean;
    fetchBookmarks: () => Promise<void>;
    addBookmark: (url: string, title: string, description: string, faviconUrl: string, tags: string[]) => Promise<void>;
    updateBookmark: (id: string, updates: Partial<Bookmark>) => Promise<void>;
    deleteBookmark: (id: string) => Promise<void>;
    toggleRead: (id: string, currentStatus: boolean) => Promise<void>;
    toggleFavorite: (id: string, currentStatus: boolean) => Promise<void>;
    toggleArchive: (id: string, currentStatus: boolean) => Promise<void>;
    toggleBookmarkSharing: (id: string, isPublic: boolean) => Promise<void>;
    moveToCollection: (id: string, collectionId: string | null) => Promise<void>;
    importBookmarks: (bookmarks: any[]) => Promise<number>;
    checkDuplicate: (url: string) => boolean;
    getAllTags: () => string[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchBookmarks = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookmarks(data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchBookmarks();

        // Realtime subscription for live updates
        const channel = supabase
            .channel('bookmarks-realtime-global')
            .on(
                'postgres_changes' as any,
                { event: '*', scheme: 'public', table: 'bookmarks' },
                (payload: RealtimePostgresChangesPayload<Bookmark>) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== payload.old.id)
                        );
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) =>
                                b.id === payload.new.id ? { ...b, ...payload.new } : b
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchBookmarks, supabase]);

    const getAllTags = useCallback(() => {
        const tagsSet = new Set<string>();
        bookmarks.forEach(b => b.tags?.forEach(t => tagsSet.add(t)));
        return Array.from(tagsSet).sort();
    }, [bookmarks]);

    const checkDuplicate = (url: string) => {
        const normalizedUrl = url.replace(/\/$/, '').toLowerCase();
        return bookmarks.some(b => b.url.replace(/\/$/, '').toLowerCase() === normalizedUrl);
    };

    const addBookmark = async (url: string, title: string, description: string, faviconUrl: string, tags: string[]) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('bookmarks')
            .insert({
                user_id: user.id,
                url,
                title,
                description,
                favicon_url: faviconUrl,
                tags,
                is_read: false,
                is_pinned: false,
                is_favorite: false,
                is_archived: false,
                is_public: false,
                slug: null,
                notes: '',
            })
            .select()
            .single();

        if (error) throw error;
        // Optimization: Realtime handles state update, but we can do it manually for instant UI
        // setBookmarks(prev => [data, ...prev]);
    };

    const updateBookmark = async (id: string, updates: Partial<Bookmark>) => {
        const { error } = await supabase
            .from('bookmarks')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    };

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id);

        if (error) throw error;
    };

    const toggleRead = async (id: string, currentStatus: boolean) => {
        await updateBookmark(id, { is_read: !currentStatus });
    };

    const toggleFavorite = async (id: string, currentStatus: boolean) => {
        await updateBookmark(id, { is_favorite: !currentStatus });
    };

    const toggleArchive = async (id: string, currentStatus: boolean) => {
        await updateBookmark(id, { is_archived: !currentStatus });
    };

    const toggleBookmarkSharing = async (id: string, isPublic: boolean) => {
        const slug = isPublic ? `${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}-${Date.now().toString(36).substring(4)}` : null;
        await updateBookmark(id, { is_public: isPublic, slug });
    };

    const moveToCollection = async (id: string, collectionId: string | null) => {
        await updateBookmark(id, { collection_id: collectionId });
    };

    const importBookmarks = async (newBookmarks: any[]) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const bookmarksToInsert = newBookmarks.map(b => ({
            ...b,
            user_id: user.id,
            is_public: false,
            slug: null,
        }));

        const { data, error } = await supabase
            .from('bookmarks')
            .insert(bookmarksToInsert)
            .select();

        if (error) throw error;
        return data?.length || 0;
    };

    return (
        <BookmarkContext.Provider
            value={{
                bookmarks,
                loading,
                fetchBookmarks,
                addBookmark,
                updateBookmark,
                deleteBookmark,
                toggleRead,
                toggleFavorite,
                toggleArchive,
                toggleBookmarkSharing,
                moveToCollection,
                importBookmarks,
                checkDuplicate,
                getAllTags,
            }}
        >
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarkContext() {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error('useBookmarkContext must be used within a BookmarkProvider');
    }
    return context;
}
