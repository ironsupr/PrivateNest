'use client';

import { Bookmark } from '@/types';
import { MoreHorizontal, ExternalLink, Trash2, Edit, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete?: (id: string) => void;
    onEdit?: (bookmark: Bookmark) => void;
    onToggleRead?: (id: string, currentStatus: boolean) => void;
}

export function BookmarkCard({ bookmark, onDelete, onEdit, onToggleRead }: BookmarkCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Favicon fallback
    const domain = new URL(bookmark.url).hostname;
    const faviconUrl = bookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    return (
        <div
            className="group relative p-5 bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 flex flex-col h-[200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
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

                <div className={`relative transition-opacity duration-200 ${isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
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
                        <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
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

            {/* Content */}
            <div className="flex-1 min-h-0 flex flex-col">
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-navy-900 mb-2 line-clamp-1 hover:text-indigo-accent transition-colors block"
                >
                    {bookmark.title}
                </a>
                <p className="text-sm text-navy-700/70 line-clamp-2 leading-relaxed mb-4">
                    {bookmark.description || 'No description available.'}
                </p>
            </div>

            {/* Footer / Tags */}
            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2 overflow-hidden">
                    {bookmark.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 bg-slate-50 text-navy-700/60 rounded-md border border-slate-100">
                            {tag}
                        </span>
                    ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                    {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>

            {/* Hover Actions Overlay (Optional) */}
        </div>
    );
}
