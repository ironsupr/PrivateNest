'use client';

import { Bookmark } from '@/types';
import { BookmarkCard } from './BookmarkCard';

interface BookmarkGridProps {
    bookmarks: Bookmark[];
    loading?: boolean;
    onDelete?: (id: string) => void;
    onEdit?: (bookmark: Bookmark) => void;
    onToggleRead?: (id: string, currentStatus: boolean) => void;
}

export function BookmarkGrid({ bookmarks, loading, onDelete, onEdit, onToggleRead }: BookmarkGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[200px] bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
                        <div className="flex justify-between">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                            <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                        </div>
                        <div className="pt-4 flex gap-2">
                            <div className="h-6 w-16 bg-slate-100 rounded-md"></div>
                            <div className="h-6 w-16 bg-slate-100 rounded-md"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-soft">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl">bookmarks</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">No bookmarks found</h3>
                <p className="text-navy-700/70 max-w-sm mx-auto">
                    Your nest is empty. Add your first bookmark to start building your collection.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {bookmarks.map((bookmark) => (
                <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onToggleRead={onToggleRead}
                />
            ))}
        </div>
    );
}
