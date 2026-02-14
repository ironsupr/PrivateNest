'use client';

import {
    LayoutDashboard,
    GalleryVerticalEnd,
    Star,
    Archive,
    Settings,
    Hash,
    Plus,
    Folder,
    Globe,
    Lock,
    Link as LinkIcon,
    Copy,
    MoreVertical,
    Trash2,
    Edit
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';
import { useDashboard } from '@/providers/DashboardProvider';
import { Logo } from '@/components/ui/Logo';
import { useState, useRef, useEffect } from 'react';

interface SidebarProps {
    className?: string;
}

export function Sidebar({
    className = '',
}: SidebarProps) {
    const pathname = usePathname();
    const {
        currentView,
        setCurrentView,
        selectedTag,
        setSelectedTag,
        selectedCollectionId,
        setSelectedCollectionId,
        setSearchQuery
    } = useDashboard();

    const { getAllTags } = useBookmarks();
    const { collections, addCollection, toggleSharing, deleteCollection, updateCollection } = useCollections();
    const tags = getAllTags();

    const [isAddingCollection, setIsAddingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on click outside or scroll
    useEffect(() => {
        const handleClose = () => {
            setOpenMenuId(null);
            setMenuPosition(null);
        };

        if (openMenuId) {
            window.addEventListener('mousedown', (e) => {
                if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                    handleClose();
                }
            });
            window.addEventListener('scroll', handleClose, true);
        }

        return () => {
            window.removeEventListener('mousedown', handleClose);
            window.removeEventListener('scroll', handleClose, true);
        };
    }, [openMenuId]);

    const handleViewChange = (view: 'standard' | 'all' | 'favorites' | 'archive') => {
        setSearchQuery('');
        setSelectedTag(null);
        setSelectedCollectionId(null);
        setCurrentView(view);
    };

    const handleCollectionSelect = (id: string) => {
        setSearchQuery('');
        setSelectedTag(null);
        setSelectedCollectionId(id);
        setCurrentView('all');
    };

    const handleCopyLink = (slug: string) => {
        const url = `${window.location.origin}/share/${slug}`;
        navigator.clipboard.writeText(url);
        setCopySuccess(slug);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const handleToggleSharing = async (id: string, isPublic: boolean) => {
        try {
            await toggleSharing(id, !isPublic);
        } catch (error) {
            console.error('Failed to toggle sharing:', error);
        }
    };

    const handleDeleteCollection = async (id: string) => {
        try {
            await deleteCollection(id);
            if (selectedCollectionId === id) {
                setSelectedCollectionId(null);
                setCurrentView('standard');
            }
            setOpenMenuId(null);
            setConfirmingDeleteId(null);
        } catch (error) {
            console.error('Failed to delete collection:', error);
        }
    };

    const handleRenameCollection = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        if (!renameValue.trim()) {
            setRenamingId(null);
            return;
        }
        try {
            await updateCollection(id, { name: renameValue.trim() });
            setRenamingId(null);
            setRenameValue('');
        } catch (error) {
            console.error('Failed to rename collection:', error);
        }
    };

    const handleAddCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;
        try {
            await addCollection(newCollectionName.trim());
            setNewCollectionName('');
            setIsAddingCollection(false);
        } catch (error) {
            console.error('Failed to add collection:', error);
        }
    };

    const navItems = [
        // ... (navItems remain same)
        {
            label: 'My Nest',
            icon: LayoutDashboard,
            href: '/dashboard',
            active: currentView === 'standard' && !selectedTag && !selectedCollectionId,
            onClick: () => handleViewChange('standard')
        },
        {
            label: 'All Bookmarks',
            icon: GalleryVerticalEnd,
            href: '/dashboard',
            active: currentView === 'all' && !selectedTag && !selectedCollectionId,
            onClick: () => handleViewChange('all')
        },
        {
            label: 'Favorites',
            icon: Star,
            href: '/dashboard',
            active: currentView === 'favorites' && !selectedTag && !selectedCollectionId,
            onClick: () => handleViewChange('favorites')
        },
        {
            label: 'Archive',
            icon: Archive,
            href: '/dashboard',
            active: currentView === 'archive' && !selectedTag && !selectedCollectionId,
            onClick: () => handleViewChange('archive')
        },
    ];

    return (
        <aside className={`w-64 h-screen fixed left-0 top-0 bg-slate-50/50 backdrop-blur-sm border-r border-slate-100 flex flex-col ${className}`}>
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100/50">
                <Logo size={32} showText />
            </div>

            {/* Main Nav */}
            <div className="p-4 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-navy-700/50 uppercase tracking-wider mb-2">
                    Menu
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.label}
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

            {/* Collections (Folders) */}
            <div className="px-4 py-2 border-t border-slate-100/50">
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <div className="text-xs font-semibold text-navy-700/50 uppercase tracking-wider">
                        Folders
                    </div>
                    <button
                        onClick={() => setIsAddingCollection(!isAddingCollection)}
                        className="p-1 hover:bg-slate-200/50 rounded-md transition-colors text-navy-700/50 hover:text-indigo-accent"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {isAddingCollection && (
                        <form onSubmit={handleAddCollection} className="px-3 py-2">
                            <input
                                autoFocus
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="Folder Name..."
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-accent/20 focus:border-indigo-accent"
                                onBlur={() => !newCollectionName && setIsAddingCollection(false)}
                            />
                        </form>
                    )}
                    {collections.map((collection) => (
                        <div key={collection.id} className="relative group/folder-item">
                            {confirmingDeleteId === collection.id ? (
                                <div className="w-full flex items-center justify-between px-3 py-2 bg-red-50/50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-left-1 duration-200">
                                    <span className="text-xs font-bold text-red-600 truncate mr-2">Delete {collection.name}?</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCollection(collection.id);
                                            }}
                                            className="p-1 hover:bg-red-500 hover:text-white text-red-600 rounded-md transition-all"
                                            title="Confirm Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmingDeleteId(null);
                                            }}
                                            className="p-1 hover:bg-slate-200 text-slate-500 rounded-md transition-all"
                                            title="Cancel"
                                        >
                                            <Plus className="w-3.5 h-3.5 rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            ) : renamingId === collection.id ? (
                                <form
                                    onSubmit={(e) => handleRenameCollection(e, collection.id)}
                                    className="px-2 py-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-accent/20 focus:border-indigo-accent"
                                        onBlur={() => {
                                            if (renameValue === collection.name || !renameValue.trim()) {
                                                setRenamingId(null);
                                            }
                                        }}
                                    />
                                </form>
                            ) : (
                                <>
                                    <div
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group/btn ${selectedCollectionId === collection.id
                                            ? 'bg-white text-indigo-accent shadow-soft cursor-default'
                                            : 'text-navy-700 hover:bg-white/60 hover:text-navy-900 cursor-pointer'
                                            }`}
                                        onClick={() => handleCollectionSelect(collection.id)}
                                    >
                                        <div className="flex items-center">
                                            <Folder className={`w-4 h-4 mr-3 transition-colors ${selectedCollectionId === collection.id ? 'text-indigo-accent' : 'text-navy-700/40 group-hover/btn:text-indigo-accent/70'
                                                }`} />
                                            <span className="truncate max-w-[120px]">{collection.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {collection.is_public && (
                                                <Globe className="w-3 h-3 text-indigo-accent/60" />
                                            )}
                                            <div className="flex items-center opacity-0 group-hover/folder-item:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmingDeleteId(collection.id);
                                                        setOpenMenuId(null); // Close share menu if open
                                                    }}
                                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                                                    title="Delete Folder"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (openMenuId === collection.id) {
                                                            setOpenMenuId(null);
                                                            setMenuPosition(null);
                                                        } else {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setOpenMenuId(collection.id);
                                                            setMenuPosition({ top: rect.bottom + 8, left: rect.left - 180 });
                                                            setConfirmingDeleteId(null);
                                                        }
                                                    }}
                                                    className={`p-1 rounded-md transition-colors ${openMenuId === collection.id ? 'bg-indigo-50 text-indigo-accent' : 'hover:bg-slate-200/50 text-navy-700/60 hover:text-navy-900'}`}
                                                    title="More Options"
                                                >
                                                    <MoreVertical className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Menu Overlay */}
            {openMenuId && menuPosition && (
                <div
                    ref={menuRef}
                    className="fixed z-[100] w-52 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {collections.find(c => c.id === openMenuId) && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const col = collections.find(c => c.id === openMenuId);
                                    if (col) {
                                        setRenamingId(col.id);
                                        setRenameValue(col.name);
                                    }
                                    setOpenMenuId(null);
                                    setMenuPosition(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-xs font-medium text-navy-700 hover:bg-indigo-50 hover:text-indigo-accent transition-colors group/item"
                            >
                                <Edit className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover/item:text-indigo-accent" />
                                Rename Folder
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const col = collections.find(c => c.id === openMenuId);
                                    if (col) {
                                        handleToggleSharing(col.id, col.is_public);
                                    }
                                    setOpenMenuId(null);
                                    setMenuPosition(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-xs font-medium text-navy-700 hover:bg-indigo-50 hover:text-indigo-accent transition-colors group/item"
                            >
                                {collections.find(c => c.id === openMenuId)?.is_public ? (
                                    <>
                                        <Lock className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover/item:text-indigo-accent" />
                                        Make Private
                                    </>
                                ) : (
                                    <>
                                        <Globe className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover/item:text-indigo-accent" />
                                        Make Public
                                    </>
                                )}
                            </button>

                            {collections.find(c => c.id === openMenuId)?.is_public && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const col = collections.find(c => c.id === openMenuId);
                                        if (col?.slug) handleCopyLink(col.slug);
                                        setTimeout(() => {
                                            setOpenMenuId(null);
                                            setMenuPosition(null);
                                        }, 1000);
                                    }}
                                    className="w-full flex items-center px-4 py-2 text-xs font-medium text-navy-700 hover:bg-indigo-50 hover:text-indigo-accent transition-colors group/item"
                                >
                                    <Copy className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover/item:text-indigo-accent" />
                                    {copySuccess === collections.find(c => c.id === openMenuId)?.slug ? 'Copied Link!' : 'Copy Share Link'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Tags */}
            <div className="px-4 py-2 flex-1 overflow-y-auto border-t border-slate-100/50">
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <div className="text-xs font-semibold text-navy-700/50 uppercase tracking-wider">
                        Tags
                    </div>
                    <button className="p-1 hover:bg-slate-200/50 rounded-md transition-colors text-navy-700/50 hover:text-indigo-accent">
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <div className="space-y-1">
                    {tags.map((tag: string) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
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
