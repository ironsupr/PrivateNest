import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Globe, ExternalLink, Calendar, Hash } from 'lucide-react';
import type { Bookmark } from '@/types';

interface SharedBookmarkPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function SharedBookmarkPage({ params }: SharedBookmarkPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    console.log('Fetching shared bookmark for slug:', slug);

    const { data: bookmark, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

    if (error) {
        console.error('Database error fetching shared bookmark:', error);
        notFound();
    }

    if (!bookmark) {
        console.warn('No public bookmark found for slug:', slug);
        notFound();
    }

    const typedBookmark = bookmark as Bookmark;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 p-3.5 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={typedBookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${new URL(typedBookmark.url).hostname}&sz=64`}
                                alt=""
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-accent text-[10px] font-bold uppercase tracking-wider border border-indigo-100/50">
                                    <Globe className="w-3 h-3" />
                                    Public Bookmark
                                </span>
                                <span className="text-slate-400 text-xs flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    Shared via PrivateNest
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-navy-900 truncate">
                                {typedBookmark.title}
                            </h1>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                        <p className="text-lg text-navy-700/80 leading-relaxed italic">
                            "{typedBookmark.description || 'No description provided for this bookmark.'}"
                        </p>
                    </div>

                    {/* Tags & Metadata */}
                    <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-slate-50">
                        {typedBookmark.tags && typedBookmark.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-slate-400" />
                                <div className="flex gap-2">
                                    {typedBookmark.tags.map(tag => (
                                        <span key={tag} className="text-xs font-semibold text-navy-700/60 transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Calendar className="w-4 h-4" />
                            <span>Added {new Date(typedBookmark.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mt-12">
                        <a
                            href={typedBookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 bg-navy-900 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:bg-navy-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-navy-900/10 group"
                        >
                            Visit Source Website
                            <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                        <p className="text-center text-slate-400 text-[10px] mt-6 uppercase tracking-widest font-medium">
                            Secured & Synced with PrivateNest
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
