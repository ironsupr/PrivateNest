'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background-offwhite flex font-sans text-navy-900">
            {/* Sidebar - Desktop */}
            <Sidebar className="hidden md:flex z-30" />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 min-h-screen flex flex-col relative">
                {children}
            </div>
        </div>
    );
}
