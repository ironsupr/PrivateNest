'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type DashboardView = 'standard' | 'all' | 'favorites' | 'archive';
type SortOption = 'newest' | 'oldest' | 'title';

interface DashboardContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedTag: string | null;
    setSelectedTag: (tag: string | null) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    currentView: DashboardView;
    setCurrentView: (view: DashboardView) => void;
    resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentView, setCurrentView] = useState<DashboardView>('standard');

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedTag(null);
        setCurrentView('standard');
    };

    return (
        <DashboardContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                selectedTag,
                setSelectedTag,
                sortBy,
                setSortBy,
                currentView,
                setCurrentView,
                resetFilters,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
