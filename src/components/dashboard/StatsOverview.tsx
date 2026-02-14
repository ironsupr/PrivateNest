'use client';

import { FileText, Palette, Lightbulb, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Bookmark } from '@/types';

interface StatsOverviewProps {
    bookmarks: Bookmark[];
}

export function StatsOverview({ bookmarks }: StatsOverviewProps) {
    const totalCount = bookmarks.length;
    const unreadCount = bookmarks.filter(b => !b.is_read).length;
    const readCount = bookmarks.filter(b => b.is_read).length;

    const stats = [
        {
            label: 'Total Bookmarks',
            value: totalCount,
            icon: FileText,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50',
            trend: 'All your items'
        },
        {
            label: 'Unread',
            value: unreadCount,
            icon: Clock,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            trend: 'Reading queue'
        },
        {
            label: 'Read',
            value: readCount,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50',
            trend: 'Completed'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {stat.trend}
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-navy-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-slate-400">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
