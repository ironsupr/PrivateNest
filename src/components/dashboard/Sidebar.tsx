'use client';

import {
    LayoutDashboard,
    GalleryVerticalEnd,
    Star,
    Archive,
    Settings,
    Hash,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBookmarks } from '@/hooks/useBookmarks';

interface SidebarProps {
    className?: string;
    onTagSelect?: (tag: string) => void;
    selectedTag?: string | null;
    onClearTag?: () => void;
}

export function Sidebar({
    className = '',
    onTagSelect,
    selectedTag,
    onClearTag
}: SidebarProps) {
    const pathname = usePathname();

    const { getAllTags } = useBookmarks();
    const tags = getAllTags();

    const navItems = [
        {
            label: 'My Nest',
            icon: LayoutDashboard,
            href: '/dashboard',
            active: pathname === '/dashboard' && !selectedTag,
            onClick: () => onClearTag?.()
        },
        { label: 'All Bookmarks', icon: GalleryVerticalEnd, href: '/dashboard/all' },
        { label: 'Favorites', icon: Star, href: '/dashboard/favorites' },
        { label: 'Archive', icon: Archive, href: '/dashboard/archive' },
    ];

    return (
        <aside className={`w-64 h-screen fixed left-0 top-0 bg-slate-50/50 backdrop-blur-sm border-r border-slate-100 flex flex-col ${className}`}>
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100/50">
                <div className="w-8 h-8 rounded-lg bg-indigo-accent text-white flex items-center justify-center mr-3 shadow-soft">
                    <span className="material-symbols-outlined text-xl">bookmark</span>
                </div>
                <span className="text-lg font-bold text-navy-900 tracking-tight">PrivateNest</span>
            </div>

            {/* Main Nav */}
            <div className="p-4 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-navy-700/50 uppercase tracking-wider mb-2">
                    Menu
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                            if (item.onClick) {
                                e.preventDefault();
                                item.onClick();
                            }
                        }}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${item.active
                            ? 'bg-white text-indigo-accent shadow-soft'
                            : 'text-navy-700 hover:bg-white/60 hover:text-navy-900'
                            }`}
                    >
                        <item.icon className={`w-4 h-4 mr-3 ${item.active ? 'text-indigo-accent' : 'text-navy-700/70 group-hover:text-navy-900'}`} />
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Tags */}
            <div className="px-4 py-2 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <div className="text-xs font-semibold text-navy-700/50 uppercase tracking-wider">
                        Tags
                    </div>
                    <button className="p-1 hover:bg-slate-200/50 rounded-md transition-colors text-navy-700/50 hover:text-indigo-accent">
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <div className="space-y-1">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => onTagSelect?.(tag)}
                            className={`w-full flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors group ${selectedTag === tag
                                ? 'bg-indigo-50/50 text-indigo-accent'
                                : 'text-navy-700 hover:bg-white/60 hover:text-navy-900'
                                }`}
                        >
                            <Hash className={`w-3 h-3 mr-3 transition-colors ${selectedTag === tag ? 'text-indigo-accent' : 'text-navy-700/40 group-hover:text-indigo-accent/70'
                                }`} />
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100">
                <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-navy-700 hover:bg-white/60 hover:text-navy-900 transition-colors">
                    <Settings className="w-4 h-4 mr-3 text-navy-700/70" />
                    Settings
                </button>
            </div>
        </aside>
    );
}
