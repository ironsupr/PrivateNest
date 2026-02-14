'use client';

import { Upload, FileUp, X, Check } from 'lucide-react';
import { useState, useRef } from 'react';

interface ImportButtonProps {
    onImport: (items: Array<{ url: string; title: string; tags?: string[] }>) => Promise<number>;
}

function parseNetscapeBookmarks(html: string): Array<{ url: string; title: string; tags?: string[] }> {
    const results: Array<{ url: string; title: string; tags?: string[] }> = [];
    let currentFolder = '';

    const lines = html.split('\n');
    for (const line of lines) {
        // Detect folder names (H3 tags)
        const folderMatch = line.match(/<H3[^>]*>(.*?)<\/H3>/i);
        if (folderMatch) {
            currentFolder = folderMatch[1].trim().toLowerCase();
        }

        // Detect bookmarks (A tags)
        const linkMatch = line.match(/<A\s+HREF="([^"]+)"[^>]*>(.*?)<\/A>/i);
        if (linkMatch) {
            const url = linkMatch[1];
            const title = linkMatch[2].trim();

            // Skip non-http URLs
            if (!url.startsWith('http://') && !url.startsWith('https://')) continue;

            results.push({
                url,
                title: title || url,
                tags: currentFolder ? [currentFolder] : [],
            });
        }

        // Reset folder on closing DL
        if (line.includes('</DL>')) {
            currentFolder = '';
        }
    }

    return results;
}

export function ImportButton({ onImport }: ImportButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ count: number } | null>(null);
    const [parsedItems, setParsedItems] = useState<Array<{ url: string; title: string; tags?: string[] }>>([]);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const html = ev.target?.result as string;
            const items = parseNetscapeBookmarks(html);
            setParsedItems(items);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (parsedItems.length === 0) return;
        setImporting(true);
        try {
            const count = await onImport(parsedItems);
            setResult({ count });
        } catch {
            // Handle error silently
        }
        setImporting(false);
    };

    const handleClose = () => {
        setShowModal(false);
        setParsedItems([]);
        setFileName('');
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-secondary btn-sm"
                title="Import bookmarks"
            >
                <Upload className="w-4 h-4" />
                Import
            </button>

            {showModal && (
                <div className="popup-overlay" onClick={handleClose}>
                    <div className="popup-card import-card" onClick={(e) => e.stopPropagation()}>
                        {result ? (
                            <>
                                <div className="popup-icon-wrap" style={{ background: 'color-mix(in srgb, #22c55e 12%, transparent)', color: '#22c55e' }}>
                                    <Check className="w-6 h-6" />
                                </div>
                                <h3 className="popup-title">Import Complete!</h3>
                                <p className="popup-message">
                                    Successfully imported <strong>{result.count}</strong> bookmark{result.count !== 1 ? 's' : ''}.
                                </p>
                                <div className="popup-actions">
                                    <button onClick={handleClose} className="btn btn-primary">
                                        Done
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="popup-icon-wrap" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <h3 className="popup-title">Import Bookmarks</h3>
                                <p className="popup-message">
                                    Upload an HTML bookmark file exported from Chrome, Firefox, Edge, or Safari.
                                </p>

                                <div className="import-upload-area">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".html,.htm"
                                        onChange={handleFileSelect}
                                        className="import-file-input"
                                        id="bookmark-import"
                                    />
                                    <label htmlFor="bookmark-import" className="import-file-label">
                                        <Upload className="w-5 h-5" />
                                        {fileName || 'Choose a file'}
                                    </label>
                                </div>

                                {parsedItems.length > 0 && (
                                    <div className="import-preview">
                                        <span className="import-preview-count">
                                            {parsedItems.length} bookmark{parsedItems.length !== 1 ? 's' : ''} found
                                        </span>
                                        <div className="import-preview-list">
                                            {parsedItems.slice(0, 5).map((item, i) => (
                                                <div key={i} className="import-preview-item">
                                                    <span>{item.title}</span>
                                                    {item.tags && item.tags.length > 0 && (
                                                        <span className="import-preview-tag">{item.tags[0]}</span>
                                                    )}
                                                </div>
                                            ))}
                                            {parsedItems.length > 5 && (
                                                <span className="import-preview-more">
                                                    +{parsedItems.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="popup-actions">
                                    <button onClick={handleClose} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        className="btn btn-primary"
                                        disabled={parsedItems.length === 0 || importing}
                                    >
                                        {importing ? 'Importing...' : `Import ${parsedItems.length || ''}`}
                                    </button>
                                </div>
                            </>
                        )}

                        <button onClick={handleClose} className="import-close-btn" aria-label="Close">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
