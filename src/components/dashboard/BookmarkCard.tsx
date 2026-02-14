import { Bookmark, Collection } from '@/types';
import { MoreHorizontal, Trash2, Edit, CheckCircle, Star, Archive, FolderInput, ChevronRight, Plus, Globe, Lock, Link as LinkIcon, Copy } from 'lucide-react';
import { useState } from 'react';

interface BookmarkCardProps {
    bookmark: Bookmark;
    collections?: Collection[];
    onDelete?: (id: string) => void;
    onEdit?: (bookmark: Bookmark) => void;
    onToggleRead?: (id: string, currentStatus: boolean) => void;
    onToggleFavorite?: (id: string, currentStatus: boolean) => void;
    onToggleArchive?: (id: string, currentStatus: boolean) => void;
    onMoveToCollection?: (id: string, collectionId: string | null) => void;
    onAddCollection?: (name: string) => Promise<Collection>;
    onToggleSharing?: (id: string, isPublic: boolean) => void;
}

export function BookmarkCard({
    bookmark,
    collections = [],
    onDelete,
    onEdit,
    onToggleRead,
    onToggleFavorite,
    onToggleArchive,
    onMoveToCollection,
    onAddCollection,
    onToggleSharing
}: BookmarkCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showFolderSelector, setShowFolderSelector] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Favicon fallback
    const domain = new URL(bookmark.url).hostname;
    const faviconUrl = bookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const currentCollection = collections.find(c => c.id === bookmark.collection_id);

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim() || !onAddCollection || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const newCol = await onAddCollection(newFolderName.trim());
            if (newCol && onMoveToCollection) {
                await onMoveToCollection(bookmark.id, newCol.id);
            }
            setIsCreatingFolder(false);
            setNewFolderName('');
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Failed to create folder from card:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!bookmark.slug) return;
        const url = `${window.location.origin}/b/${bookmark.slug}`;
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleToggleSharing = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSharing?.(bookmark.id, !bookmark.is_public);
    };

    return (
        <div
            className={`group relative p-5 bg-white rounded-2xl border shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-[200px] ${bookmark.is_archived
                ? 'opacity-70 grayscale-[0.5] border-slate-100 bg-slate-50/30'
                : 'border-slate-100 hover:border-indigo-100'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsMenuOpen(false);
                setShowFolderSelector(false);
                setIsCreatingFolder(false);
                setNewFolderName('');
            }}
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
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {bookmark.is_public && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-accent rounded-lg border border-indigo-100 mr-1 animate-in fade-in duration-300">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Public</span>
                        </div>
                    )}
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
                                    setShowFolderSelector(false);
                                    setIsCreatingFolder(false);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${isMenuOpen ? 'bg-slate-100 text-navy-900' : 'text-slate-400 hover:text-navy-900 hover:bg-slate-50'}`}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-visible animate-in fade-in zoom-in-95 duration-100">
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

                                    <div
                                        className="relative group/folder"
                                        onMouseEnter={() => {
                                            setShowFolderSelector(true);
                                            setIsCreatingFolder(false);
                                        }}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Keep click to toggle for mobile/accessibility
                                                setShowFolderSelector(!showFolderSelector);
                                                setIsCreatingFolder(false);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <FolderInput className="w-4 h-4 mr-2 text-slate-400" />
                                                Move to Folder
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-slate-400" />
                                        </button>

                                        {showFolderSelector && (
                                            <div className="absolute top-0 right-full mr-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-30 overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
                                                <div className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
                                                    {isCreatingFolder ? (
                                                        <form onSubmit={handleCreateFolder} className="px-3 py-2 border-b border-slate-100">
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={newFolderName}
                                                                onChange={(e) => setNewFolderName(e.target.value)}
                                                                placeholder="Folder name..."
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-accent/20 focus:border-indigo-accent"
                                                                disabled={isSubmitting}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </form>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setIsCreatingFolder(true);
                                                            }}
                                                            className="w-full flex items-center px-4 py-2 text-xs text-indigo-accent font-semibold hover:bg-indigo-50/50 transition-colors border-b border-slate-100"
                                                        >
                                                            <Plus className="w-3 h-3 mr-2" />
                                                            Create New Folder
                                                        </button>
                                                    )}

                                                    {collections.map(c => (
                                                        <button
                                                            key={c.id}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                onMoveToCollection?.(bookmark.id, c.id);
                                                                setIsMenuOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${bookmark.collection_id === c.id ? 'text-indigo-accent font-medium' : 'text-navy-700'}`}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onEdit?.(bookmark);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                    >
                                        <Edit className="w-4 h-4 mr-2 text-slate-400" />
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
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <button
                                        onClick={handleToggleSharing}
                                        className="w-full flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                    >
                                        {bookmark.is_public ? (
                                            <>
                                                <Lock className="w-4 h-4 mr-2 text-slate-400" />
                                                Make Private
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4 mr-2 text-slate-400" />
                                                Make Public
                                            </>
                                        )}
                                    </button>
                                    {bookmark.is_public && (
                                        <button
                                            onClick={handleCopyLink}
                                            className="w-full flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 hover:text-indigo-accent transition-colors"
                                        >
                                            <LinkIcon className="w-4 h-4 mr-2 text-slate-400" />
                                            {copySuccess ? 'Link Copied!' : 'Copy Share Link'}
                                        </button>
                                    )}
                                    <div className="border-t border-slate-100 my-1"></div>
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
                <div className="flex items-center gap-2 overflow-hidden">
                    {currentCollection && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-indigo-50 text-indigo-accent rounded-md border border-indigo-100/50 flex items-center shrink-0">
                            <FolderInput className="w-2.5 h-2.5 mr-1" />
                            {currentCollection.name}
                        </span>
                    )}
                    <div className="flex gap-2 overflow-hidden">
                        {bookmark.tags?.slice(0, 1).map(tag => (
                            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 bg-slate-50 text-navy-700/60 rounded-md border border-slate-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
}
