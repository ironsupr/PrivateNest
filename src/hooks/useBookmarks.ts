'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark } from '@/types';

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchBookmarks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookmarks:', error);
        } else {
            setBookmarks(data || []);
        }
        setLoading(false);
    }, [supabase]);

    // Real-time subscription
    useEffect(() => {
        fetchBookmarks();

        const channel = supabase
            .channel('bookmarks-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => {
                            // Avoid duplicates
                            if (prev.some((b) => b.id === (payload.new as Bookmark).id)) {
                                return prev;
                            }
                            return [payload.new as Bookmark, ...prev];
                        });
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== payload.old.id)
                        );
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) =>
                                b.id === (payload.new as Bookmark).id
                                    ? (payload.new as Bookmark)
                                    : b
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const addBookmark = async (
        url: string,
        title: string,
        description: string,
        favicon_url: string,
        tags: string[]
    ) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.from('bookmarks').insert({
            user_id: user.id,
            url,
            title,
            description,
            favicon_url,
            tags,
        }).select().single();

        if (error) throw error;

        // Optimistic update — add to local state immediately
        if (data) {
            setBookmarks((prev) => {
                if (prev.some((b) => b.id === data.id)) return prev;
                return [data, ...prev];
            });
        }
    };

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Optimistic update — remove from local state immediately
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    const toggleRead = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const now = new Date().toISOString();

        const { error } = await supabase
            .from('bookmarks')
            .update({ is_read: newStatus, updated_at: now })
            .eq('id', id);

        if (error) throw error;

        // Optimistic update — toggle read status in local state immediately
        setBookmarks((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, is_read: newStatus, updated_at: now } : b
            )
        );
    };

    const checkDuplicate = (url: string): boolean => {
        try {
            const normalized = new URL(url).href;
            return bookmarks.some((b) => {
                try {
                    return new URL(b.url).href === normalized;
                } catch {
                    return false;
                }
            });
        } catch {
            return false;
        }
    };

    const getAllTags = (): string[] => {
        const tagSet = new Set<string>();
        bookmarks.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
        return Array.from(tagSet).sort();
    };

    return {
        bookmarks,
        loading,
        addBookmark,
        deleteBookmark,
        toggleRead,
        checkDuplicate,
        getAllTags,
    };
}
