'use client';

import { Bookmark } from '@/types';
import { Download, FileJson, Globe } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
    bookmarks: Bookmark[];
}

export function ExportButton({ bookmarks }: ExportButtonProps) {
    const [open, setOpen] = useState(false);

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
    };

    const exportJSON = () => {
        const data = bookmarks.map((b) => ({
            url: b.url,
            title: b.title,
            description: b.description,
            tags: b.tags,
            is_read: b.is_read,
            created_at: b.created_at,
        }));
        downloadFile(JSON.stringify(data, null, 2), 'privatenest-bookmarks.json', 'application/json');
    };

    const exportHTML = () => {
        // Netscape Bookmark File Format — importable by Chrome, Firefox, Edge, etc.
        const lines = [
            '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
            '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
            '<TITLE>PrivateNest Bookmarks</TITLE>',
            '<H1>PrivateNest Bookmarks</H1>',
            '<DL><p>',
        ];

        // Group by tags
        const untagged: Bookmark[] = [];
        const tagMap = new Map<string, Bookmark[]>();

        bookmarks.forEach((b) => {
            if (!b.tags || b.tags.length === 0) {
                untagged.push(b);
            } else {
                b.tags.forEach((tag) => {
                    if (!tagMap.has(tag)) tagMap.set(tag, []);
                    tagMap.get(tag)!.push(b);
                });
            }
        });

        // Write tagged folders
        tagMap.forEach((items, tag) => {
            lines.push(`    <DT><H3>${tag}</H3>`);
            lines.push('    <DL><p>');
            items.forEach((b) => {
                const ts = Math.floor(new Date(b.created_at).getTime() / 1000);
                lines.push(`        <DT><A HREF="${b.url}" ADD_DATE="${ts}">${b.title || b.url}</A>`);
            });
            lines.push('    </DL><p>');
        });

        // Write untagged
        untagged.forEach((b) => {
            const ts = Math.floor(new Date(b.created_at).getTime() / 1000);
            lines.push(`    <DT><A HREF="${b.url}" ADD_DATE="${ts}">${b.title || b.url}</A>`);
        });

        lines.push('</DL><p>');
        downloadFile(lines.join('\n'), 'privatenest-bookmarks.html', 'text/html');
    };

    if (bookmarks.length === 0) return null;

    return (
        <div className="export-container">
            <button
                onClick={() => setOpen(!open)}
                className="btn btn-secondary btn-sm"
                title="Export bookmarks"
            >
                <Download className="w-4 h-4" />
                Export
            </button>
            {open && (
                <div className="export-dropdown">
                    <button onClick={exportJSON} className="export-option">
                        <FileJson className="w-4 h-4" />
                        <div>
                            <span className="export-option-title">JSON</span>
                            <span className="export-option-desc">Machine-readable format</span>
                        </div>
                    </button>
                    <button onClick={exportHTML} className="export-option">
                        <Globe className="w-4 h-4" />
                        <div>
                            <span className="export-option-title">HTML</span>
                            <span className="export-option-desc">Import into any browser</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
