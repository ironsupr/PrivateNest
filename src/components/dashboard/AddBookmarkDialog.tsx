'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Link as LinkIcon, Tag, Type, AlertTriangle } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark } from '@/types';

interface AddBookmarkDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Bookmark | null;
}

export function AddBookmarkDialog({ isOpen, onClose, initialData }: AddBookmarkDialogProps) {
    const { addBookmark, updateBookmark, checkDuplicate } = useBookmarks();
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'url' | 'details'>('url');
    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setUrl(initialData.url);
                setTitle(initialData.title);
                setDescription(initialData.description || '');
                setTags(initialData.tags?.join(', ') || '');
                setStep('details');
            } else {
                // Reset for add mode
                setUrl('');
                setTitle('');
                setDescription('');
                setTags('');
                setStep('url');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const normalizeUrl = (u: string) => {
        const trimmed = u.trim();
        if (!trimmed) return '';
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedUrl = normalizeUrl(url);
        if (!normalizedUrl) return;

        // Duplicate Check
        if (!initialData && checkDuplicate(normalizedUrl)) {
            setIsDuplicate(true);
        } else {
            setIsDuplicate(false);
        }

        setLoading(true);
        try {
            // Updated to correct API path /api/metadata and use POST
            const res = await fetch('/api/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: normalizedUrl }),
            });
            const data = await res.json();

            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);

            // Ensure we use the normalized URL for further steps
            setUrl(normalizedUrl);
            setStep('details');
        } catch (error) {
            console.error('Failed to fetch metadata', error);
            setUrl(normalizedUrl);
            setStep('details'); // Allow manual entry even if fetch fails
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedUrl = normalizeUrl(url);
        if (!normalizedUrl) return;

        setLoading(true);
        try {
            const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

            if (initialData) {
                await updateBookmark(initialData.id, {
                    url: normalizedUrl,
                    title,
                    description,
                    tags: tagList,
                });
            } else {
                const domain = new URL(normalizedUrl).hostname;
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

                await addBookmark(
                    normalizedUrl,
                    title,
                    description,
                    faviconUrl,
                    tagList
                );
            }
            onClose();
        } catch (error) {
            console.error('Failed to save bookmark', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-navy-900 text-lg">{initialData ? 'Edit Bookmark' : 'Add New Bookmark'}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'url' ? (
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-2">Paste URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-accent focus:border-transparent transition-all"
                                        placeholder="youtube.com or https://..."
                                        autoFocus
                                    />
                                </div>
                            </div>
                            {isDuplicate && (
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-800 leading-tight">
                                        You've already bookmarked this site. Save anyway?
                                    </p>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-3 px-4 bg-indigo-accent hover:bg-indigo-hover text-white font-medium rounded-xl shadow-soft hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Next'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleFinalSubmit} className="space-y-4">
                            {initialData && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-navy-700 mb-1">URL</label>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-indigo-accent"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Title</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Type className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-indigo-accent focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-indigo-accent focus:border-transparent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Tags</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="design, inspiration, tool"
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-indigo-accent focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                {!initialData && (
                                    <button
                                        type="button"
                                        onClick={() => setStep('url')}
                                        className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-navy-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center py-2.5 px-4 bg-indigo-accent hover:bg-indigo-hover text-white font-medium rounded-xl shadow-soft hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Bookmark'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
