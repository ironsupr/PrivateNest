'use client';

import { Search, Plus, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useDashboard } from '@/providers/DashboardProvider';

interface DashboardHeaderProps {
    user: any; // User type from supabase
    onAddClick: () => void;
}

export function DashboardHeader({ user, onAddClick }: DashboardHeaderProps) {
    const { searchQuery, setSearchQuery } = useDashboard();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

        const handleKeyDown = (e: KeyboardEvent) => {
            // Search shortcut: Cmd/Ctrl + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }

            // New Bookmark shortcut: Cmd/Ctrl + Alt + N
            if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'n') {
                e.preventDefault();
                onAddClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onAddClick]);
    return (
        <>
            <header className="h-16 flex items-center justify-between px-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">

                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-accent transition-colors" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search your nest... (Cmd + K)"
                            className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-slate-50 text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-soft/50 focus:bg-white transition-all shadow-sm group-hover:bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <kbd className="hidden sm:inline-block border border-slate-200 rounded px-1.5 text-[10px] font-medium text-slate-400 bg-white">
                                {isMac ? '⌘K' : 'Ctrl+K'}
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 ml-4">
                    <button className="p-2 text-slate-400 hover:text-indigo-accent hover:bg-slate-50 rounded-lg transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <button
                        onClick={onAddClick}
                        className="hidden sm:flex items-center px-4 py-2 bg-indigo-accent hover:bg-indigo-hover text-white text-sm font-medium rounded-lg shadow-soft hover:shadow-glow transition-all group/btn"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>New Bookmark</span>
                        <kbd className="ml-2 hidden lg:inline-block border border-white/20 rounded px-1 text-[9px] font-medium text-white/50 bg-white/10">
                            {isMac ? '⌥⌘N' : 'Ctrl+Alt+N'}
                        </kbd>
                    </button>

                    {/* Profile */}
                    <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-offset-2 hover:ring-indigo-accent transition-all">
                        {user?.user_metadata?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-indigo-soft flex items-center justify-center text-indigo-accent font-bold text-xs">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
