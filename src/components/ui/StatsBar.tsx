'use client';

import { Bookmark } from '@/types';
import { BarChart3, BookOpen, BookMarked, Tag, TrendingUp } from 'lucide-react';

interface StatsBarProps {
    bookmarks: Bookmark[];
}

export function StatsBar({ bookmarks }: StatsBarProps) {
    if (bookmarks.length === 0) return null;

    const total = bookmarks.length;
    const readCount = bookmarks.filter((b) => b.is_read).length;
    const unreadCount = total - readCount;

    // Count added this week
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = bookmarks.filter(
        (b) => new Date(b.created_at).getTime() > oneWeekAgo
    ).length;

    // Top 3 tags
    const tagCounts = new Map<string, number>();
    bookmarks.forEach((b) =>
        b.tags?.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1))
    );
    const topTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="stats-grid">
            <div className="stats-card">
                <div className="stats-card-icon stats-card-icon-total">
                    <BarChart3 className="w-5 h-5" />
                </div>
                <div className="stats-card-info">
                    <span className="stats-card-value">{total}</span>
                    <span className="stats-card-label">Total</span>
                </div>
            </div>

            <div className="stats-card">
                <div className="stats-card-icon stats-card-icon-unread">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div className="stats-card-info">
                    <span className="stats-card-value">{unreadCount}</span>
                    <span className="stats-card-label">Unread</span>
                </div>
            </div>

            <div className="stats-card">
                <div className="stats-card-icon stats-card-icon-read">
                    <BookMarked className="w-5 h-5" />
                </div>
                <div className="stats-card-info">
                    <span className="stats-card-value">{readCount}</span>
                    <span className="stats-card-label">Read</span>
                </div>
            </div>

            <div className="stats-card">
                <div className="stats-card-icon stats-card-icon-week">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div className="stats-card-info">
                    <span className="stats-card-value">{thisWeek}</span>
                    <span className="stats-card-label">This week</span>
                </div>
            </div>

            {topTags.length > 0 && (
                <div className="stats-card stats-card-tags">
                    <div className="stats-card-icon stats-card-icon-tags">
                        <Tag className="w-5 h-5" />
                    </div>
                    <div className="stats-card-info">
                        <div className="stats-top-tags">
                            {topTags.map(([tag, count]) => (
                                <span key={tag} className="stats-tag-pill">
                                    {tag} <span className="stats-tag-count">({count})</span>
                                </span>
                            ))}
                        </div>
                        <span className="stats-card-label">Top tags</span>
                    </div>
                </div>
            )}
        </div>
    );
}
