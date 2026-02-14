'use client';

import { Bookmark } from '@/types';
import { MoreHorizontal, Trash2, Edit, CheckCircle, Star, Archive } from 'lucide-react';
import { useState } from 'react';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete?: (id: string) => void;
    onEdit?: (bookmark: Bookmark) => void;
    onToggleRead?: (id: string, currentStatus: boolean) => void;
    onToggleFavorite?: (id: string, currentStatus: boolean) => void;
    onToggleArchive?: (id: string, currentStatus: boolean) => void;
}

export function BookmarkCard({
    bookmark,
    onDelete,
    onEdit,
    onToggleRead,
    onToggleFavorite,
    onToggleArchive
}: BookmarkCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Favicon fallback
    const domain = new URL(bookmark.url).hostname;
    const faviconUrl = bookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    return (
        <div
            className={`group relative p-5 bg-white rounded-2xl border shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-[200px] ${bookmark.is_archived
                    ? 'opacity-70 grayscale-[0.5] border-slate-100 bg-slate-50/30'
                    : 'border-slate-100 hover:border-indigo-100'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={faviconUrl}
                            alt="Favicon"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<span class="material-symbols-outlined text-indigo-accent text-xl">public</span>`;
                            }}
                        />
                    </div>
                </div>

                <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered || isMenuOpen || bookmark.is_favorite ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFavorite?.(bookmark.id, bookmark.is_favorite);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${bookmark.is_favorite
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                        title={bookmark.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star className={`w-4 h-4 ${bookmark.is_favorite ? 'fill-current' : ''}`} />
                    </button>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${isMenuOpen ? 'bg-slate-100 text-navy-900' : 'text-slate-400 hover:text-navy-900 hover:bg-slate-50'}`}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleRead?.(bookmark.id, bookmark.is_read);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                >
                                    <CheckCircle className={`w-4 h-4 mr-2 ${bookmark.is_read ? 'text-green-500' : 'text-slate-400'}`} />
                                    {bookmark.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onEdit?.(bookmark);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleArchive?.(bookmark.id, bookmark.is_archived);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                >
                                    <Archive className={`w-4 h-4 mr-2 ${bookmark.is_archived ? 'text-indigo-accent' : 'text-slate-400'}`} />
                                    {bookmark.is_archived ? 'Restore' : 'Archive'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDelete?.(bookmark.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 flex flex-col">
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-navy-900 mb-1 line-clamp-1 hover:text-indigo-accent transition-colors block"
                >
                    {bookmark.title}
                </a>
                <p className="text-sm text-navy-700/70 line-clamp-2 leading-relaxed mb-4">
                    {bookmark.description || 'No description available.'}
                </p>
            </div>

            {/* Footer / Tags */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                <div className="flex gap-2 overflow-hidden">
                    {bookmark.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 bg-slate-50 text-navy-700/60 rounded-md border border-slate-100">
                            {tag}
                        </span>
                    ))}
                </div>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
}
