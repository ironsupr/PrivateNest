'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bookmark, Collection } from '@/types';
import { GalleryVerticalEnd, ExternalLink, Share2, MousePointer2 } from 'lucide-react';
import Link from 'next/link';

export default function PublicCollectionPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [collection, setCollection] = useState<Collection | null>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch collection
                const { data: colData, error: colError } = await supabase
                    .from('collections')
                    .select('*')
                    .eq('slug', slug)
                    .eq('is_public', true)
                    .single();

                if (colError || !colData) {
                    setError('Collection not found or is private.');
                    setLoading(false);
                    return;
                }

                setCollection(colData);

                // Fetch bookmarks
                const { data: bmData, error: bmError } = await supabase
                    .from('bookmarks')
                    .select('*')
                    .eq('collection_id', colData.id)
                    .order('created_at', { ascending: false });

                if (bmError) throw bmError;
                setBookmarks(bmData || []);

            } catch (err: any) {
                console.error('Sharing error:', err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchData();
    }, [slug, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-accent/30 border-t-indigo-accent rounded-full animate-spin mb-4"></div>
                <p className="text-navy-700/70 font-medium">Unnesting your collection...</p>
            </div>
        );
    }

    if (error || !collection) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">error</span>
                </div>
                <h1 className="text-2xl font-bold text-navy-900 mb-2">Oops!</h1>
                <p className="text-navy-700/70 mb-8 max-w-sm">{error}</p>
                <Link href="/" className="px-6 py-3 bg-indigo-accent text-white rounded-xl font-bold shadow-soft hover:bg-indigo-hover transition-colors">
                    Back to PrivateNest
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-accent text-white flex items-center justify-center mr-2 shadow-soft">
                            <span className="material-symbols-outlined text-xl">bookmark</span>
                        </div>
                        <span className="text-lg font-bold text-navy-900 tracking-tight">PrivateNest</span>
                    </Link>
                    <Link href="/login" className="text-sm font-semibold text-indigo-accent hover:text-indigo-hover transition-colors">
                        Sign up to build your own
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Collection Meta */}
                <div className="mb-12 text-center">
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft"
                        style={{ backgroundColor: collection.color + '10', color: collection.color }}
                    >
                        <span className="material-symbols-outlined text-4xl">{collection.icon || 'folder'}</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-navy-900 mb-4 tracking-tight">
                        {collection.name}
                    </h1>
                    {collection.description && (
                        <p className="text-lg text-navy-700/70 max-w-2xl mx-auto leading-relaxed">
                            {collection.description}
                        </p>
                    )}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="flex items-center px-4 py-2 bg-white rounded-full border border-slate-100 shadow-soft text-sm font-medium text-navy-700">
                            <GalleryVerticalEnd className="w-4 h-4 mr-2 text-indigo-accent" />
                            {bookmarks.length} Bookmarks
                        </div>
                        <div className="flex items-center px-4 py-2 bg-indigo-accent text-white rounded-full shadow-soft text-sm font-semibold">
                            <Share2 className="w-4 h-4 mr-2" />
                            Shared Collection
                        </div>
                    </div>
                </div>

                {/* Bookmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarks.map((bookmark) => (
                        <a
                            key={bookmark.id}
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-white p-6 rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={bookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`}
                                        alt="Favicon"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerHTML = `<span class="material-symbols-outlined text-indigo-accent text-xl">public</span>`;
                                        }}
                                    />
                                </div>
                                <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-accent group-hover:bg-indigo-50 transition-all">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 mb-2 line-clamp-1 group-hover:text-indigo-accent transition-colors">
                                {bookmark.title}
                            </h2>
                            <p className="text-sm text-navy-700/70 line-clamp-2 leading-relaxed mb-4">
                                {bookmark.description || 'No description available.'}
                            </p>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                <span className="flex items-center">
                                    <MousePointer2 className="w-3 h-3 mr-1 text-indigo-accent/50" />
                                    {new URL(bookmark.url).hostname}
                                </span>
                                <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-20 p-12 bg-indigo-accent rounded-[2rem] text-center text-white relative overflow-hidden shadow-soft-lg">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <h2 className="text-3xl font-bold mb-4">Build your own Nest.</h2>
                    <p className="text-indigo-50 mb-8 max-w-md mx-auto">
                        PrivateNest helps you save, organize, and share your favorite parts of the web in a beautiful, private space.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center px-8 py-4 bg-white text-indigo-accent rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
                    >
                        Get Started for Free
                        <span className="material-symbols-outlined ml-2">arrow_forward</span>
                    </Link>
                </div>
            </main>

            <footer className="py-12 text-center text-navy-700/50 text-sm">
                <p>&copy; {new Date().getFullYear()} PrivateNest. All rights reserved.</p>
            </footer>
        </div>
    );
}
