'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { Plus, Loader2, AlertTriangle, Link as LinkIcon, Copy } from 'lucide-react';

import { TagBadge } from '@/components/tags/TagBadge';
import type { UrlMetadata } from '@/types';

interface AddBookmarkFormProps {
    onAdd: (
        url: string,
        title: string,
        description: string,
        favicon_url: string,
        tags: string[]
    ) => Promise<void>;
    checkDuplicate: (url: string) => boolean;
    isExpanded?: boolean;
    onExpandChange?: (expanded: boolean) => void;
}

export function AddBookmarkForm({ onAdd, checkDuplicate, isExpanded, onExpandChange }: AddBookmarkFormProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [faviconUrl, setFaviconUrl] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [error, setError] = useState('');
    const [internalExpanded, setInternalExpanded] = useState(false);
    const [metadataFetched, setMetadataFetched] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);

    // Use external control if provided, otherwise internal
    const expanded = isExpanded !== undefined ? isExpanded : internalExpanded;
    const setExpanded = (val: boolean) => {
        if (onExpandChange) onExpandChange(val);
        setInternalExpanded(val);
    };

    const normalizeUrl = (inputUrl: string): string => {
        let fullUrl = inputUrl.trim();
        if (fullUrl && !fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = `https://${fullUrl}`;
        }
        return fullUrl;
    };

    const fetchMetadata = useCallback(async (inputUrl: string) => {
        const fullUrl = normalizeUrl(inputUrl);
        if (!fullUrl) return;

        // Check duplicate
        setIsDuplicate(checkDuplicate(fullUrl));

        setFetching(true);
        try {
            const res = await fetch('/api/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: fullUrl }),
            });
            const data: UrlMetadata = await res.json();

            setTitle((prev) => prev || data.title || '');
            setDescription((prev) => prev || data.description || '');
            if (data.favicon_url) setFaviconUrl(data.favicon_url);
            setMetadataFetched(true);
        } catch {
            // Silently fail — user can still enter title manually
        }
        setFetching(false);
    }, [checkDuplicate]);

    // Debounced auto-fetch: triggers 800ms after the user stops typing a URL
    useEffect(() => {
        if (!url || url.length < 4) return;

        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            if (!metadataFetched) {
                fetchMetadata(url);
            }
        }, 800);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setTagInput('');
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const saveBookmark = async () => {
        setLoading(true);
        setError('');
        setShowDuplicateConfirm(false);

        try {
            const fullUrl = normalizeUrl(url);

            // If metadata hasn't been fetched yet, fetch it now before saving
            let finalTitle = title;
            let finalDescription = description;
            let finalFavicon = faviconUrl;

            if (!metadataFetched && !title) {
                try {
                    const res = await fetch('/api/metadata', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: fullUrl }),
                    });
                    const data: UrlMetadata = await res.json();
                    finalTitle = data.title || fullUrl;
                    finalDescription = description || data.description || '';
                    finalFavicon = data.favicon_url || '';
                } catch {
                    finalTitle = fullUrl;
                }
            }

            await onAdd(fullUrl, finalTitle || fullUrl, finalDescription, finalFavicon, tags);

            // Reset form
            setUrl('');
            setTitle('');
            setDescription('');
            setFaviconUrl('');
            setTags([]);
            setTagInput('');
            setIsDuplicate(false);
            setMetadataFetched(false);
            setExpanded(false);
        } catch {
            setError('Failed to add bookmark. Please try again.');
        }

        setLoading(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!url) return;

        // If duplicate, show confirmation popup instead of saving directly
        const fullUrl = normalizeUrl(url);
        if (checkDuplicate(fullUrl)) {
            setShowDuplicateConfirm(true);
            return;
        }

        await saveBookmark();
    };

    return (
        <div className="add-bookmark-container">
            {/* Duplicate Confirmation Popup */}
            {showDuplicateConfirm && (
                <div className="popup-overlay" onClick={() => setShowDuplicateConfirm(false)}>
                    <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-icon-wrap">
                            <Copy className="w-6 h-6" />
                        </div>
                        <h3 className="popup-title">Duplicate Bookmark</h3>
                        <p className="popup-message">
                            This URL is already in your bookmarks. Do you want to add it again?
                        </p>
                        <div className="popup-actions">
                            <button
                                onClick={() => setShowDuplicateConfirm(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveBookmark}
                                className="btn btn-primary"
                            >
                                Add Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!expanded ? (
                <button
                    onClick={() => setExpanded(true)}
                    className="add-bookmark-trigger"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add a bookmark</span>
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="add-bookmark-form">
                    <div className="form-header">
                        <h3 className="form-title">
                            <LinkIcon className="w-4 h-4" />
                            New Bookmark
                        </h3>
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            ×
                        </button>
                    </div>

                    {/* URL Input */}
                    <div className="form-group">
                        <label htmlFor="bookmark-url" className="form-label">URL</label>
                        <div className="url-input-wrap">
                            <input
                                id="bookmark-url"
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setMetadataFetched(false);
                                }}
                                onPaste={(e) => {
                                    const pasted = e.clipboardData?.getData('text');
                                    if (pasted) {
                                        // Fetch immediately on paste (no debounce wait)
                                        setTimeout(() => fetchMetadata(pasted), 50);
                                    }
                                }}
                                placeholder="https://example.com"
                                className="form-input"
                                required
                                autoFocus
                            />
                            {fetching && (
                                <Loader2 className="url-loading-spinner" />
                            )}
                        </div>
                        {isDuplicate && (
                            <div className="form-warning">
                                <AlertTriangle className="w-4 h-4" />
                                <span>This URL is already in your bookmarks</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="bookmark-title" className="form-label">Title</label>
                        <input
                            id="bookmark-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Page title (auto-fetched)"
                            className="form-input"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="bookmark-desc" className="form-label">Description</label>
                        <input
                            id="bookmark-desc"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description (auto-fetched)"
                            className="form-input"
                        />
                    </div>

                    {/* Tags */}
                    <div className="form-group">
                        <label htmlFor="bookmark-tags" className="form-label">Tags</label>
                        <div className="tags-input-wrap">
                            {tags.map((tag) => (
                                <TagBadge
                                    key={tag}
                                    tag={tag}
                                    removable
                                    onRemove={() => removeTag(tag)}
                                />
                            ))}
                            <input
                                id="bookmark-tags"
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={handleAddTag}
                                placeholder={tags.length === 0 ? 'Add tags (press Enter)' : 'Add more...'}
                                className="tag-input"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="form-error">{error}</p>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add Bookmark
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
