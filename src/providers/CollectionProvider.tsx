'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Collection } from '@/types';

interface CollectionContextType {
    collections: Collection[];
    loading: boolean;
    addCollection: (name: string, description?: string, color?: string) => Promise<Collection>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    deleteCollection: (id: string) => Promise<void>;
    toggleSharing: (id: string, isPublic: boolean) => Promise<string | null>;
    refresh: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchCollections = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching collections:', error);
        } else {
            setCollections(data || []);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const addCollection = async (name: string, description: string = '', color: string = '#4F46E5') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('collections')
            .insert({
                user_id: user.id,
                name,
                description,
                color,
                icon: 'folder',
                is_public: false,
                slug: null
            })
            .select()
            .single();

        if (error) throw error;
        if (data) {
            setCollections(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        }
        return data as Collection;
    };

    const deleteCollection = async (id: string) => {
        const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setCollections(prev => prev.filter(c => c.id !== id));
    };

    const updateCollection = async (id: string, updates: Partial<Collection>) => {
        const { error } = await supabase
            .from('collections')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        setCollections(prev => prev.map(c =>
            c.id === id ? { ...c, ...updates } : c
        ).sort((a, b) => a.name.localeCompare(b.name)));
    };

    const toggleSharing = async (id: string, isPublic: boolean) => {
        const slug = isPublic ? `${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}` : null;

        const { error } = await supabase
            .from('collections')
            .update({ is_public: isPublic, slug })
            .eq('id', id);

        if (error) throw error;

        setCollections(prev => prev.map(c =>
            c.id === id ? { ...c, is_public: isPublic, slug } : c
        ));

        return slug;
    };

    return (
        <CollectionContext.Provider
            value={{
                collections,
                loading,
                addCollection,
                updateCollection,
                deleteCollection,
                toggleSharing,
                refresh: fetchCollections
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
}

export function useCollectionContext() {
    const context = useContext(CollectionContext);
    if (context === undefined) {
        throw new Error('useCollectionContext must be used within a CollectionProvider');
    }
    return context;
}
