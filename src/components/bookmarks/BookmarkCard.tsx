'use client';

import { Bookmark } from '@/types';
import { TagBadge } from '@/components/tags/TagBadge';
import { Trash2, ExternalLink, BookOpen, BookMarked, Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
    onToggleRead: (id: string, currentStatus: boolean) => void;
    onUpdate: (id: string, fields: Partial<Pick<Bookmark, 'url' | 'title' | 'description' | 'tags'>>) => Promise<void>;
}

export function BookmarkCard({ bookmark, onDelete, onToggleRead, onUpdate }: BookmarkCardProps) {
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Edit state
    const [editTitle, setEditTitle] = useState(bookmark.title);
    const [editDescription, setEditDescription] = useState(bookmark.description || '');
    const [editUrl, setEditUrl] = useState(bookmark.url);
    const [editTags, setEditTags] = useState<string[]>(bookmark.tags || []);
    const [editTagInput, setEditTagInput] = useState('');

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(bookmark.id);
        } catch {
            setDeleting(false);
        }
    };

    const startEditing = () => {
        setEditTitle(bookmark.title);
        setEditDescription(bookmark.description || '');
        setEditUrl(bookmark.url);
        setEditTags(bookmark.tags || []);
        setEditTagInput('');
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdate(bookmark.id, {
                title: editTitle || editUrl,
                description: editDescription,
                url: editUrl,
                tags: editTags,
            });
            setEditing(false);
        } catch {
            // Stay in edit mode on error
        }
        setSaving(false);
    };

    const handleEditTagAdd = () => {
        const tag = editTagInput.trim().toLowerCase();
        if (tag && !editTags.includes(tag)) {
            setEditTags([...editTags, tag]);
        }
        setEditTagInput('');
    };

    const handleEditTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleEditTagAdd();
        }
        if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    const removeEditTag = (tagToRemove: string) => {
        setEditTags(editTags.filter((t) => t !== tagToRemove));
    };

    const domain = (() => {
        try {
            return new URL(bookmark.url).hostname.replace('www.', '');
        } catch {
            return bookmark.url;
        }
    })();

    const timeAgo = (() => {
        const diff = Date.now() - new Date(bookmark.created_at).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return new Date(bookmark.created_at).toLocaleDateString();
    })();

    // ── Edit Mode ──
    if (editing) {
        return (
            <div className="bookmark-card bookmark-editing">
                <div className="edit-form">
                    <div className="edit-group">
                        <label className="edit-label">URL</label>
                        <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="form-input"
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="edit-group">
                        <label className="edit-label">Title</label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="form-input"
                            placeholder="Page title"
                            autoFocus
                        />
                    </div>
                    <div className="edit-group">
                        <label className="edit-label">Description</label>
                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="form-input"
                            placeholder="Brief description"
                        />
                    </div>
                    <div className="edit-group">
                        <label className="edit-label">Tags</label>
                        <div className="tags-input-wrap">
                            {editTags.map((tag) => (
                                <TagBadge
                                    key={tag}
                                    tag={tag}
                                    removable
                                    onRemove={() => removeEditTag(tag)}
                                />
                            ))}
                            <input
                                type="text"
                                value={editTagInput}
                                onChange={(e) => setEditTagInput(e.target.value)}
                                onKeyDown={handleEditTagKeyDown}
                                onBlur={handleEditTagAdd}
                                placeholder={editTags.length === 0 ? 'Add tags (Enter)' : 'Add more...'}
                                className="tag-input"
                            />
                        </div>
                    </div>
                    <div className="edit-actions">
                        <button
                            onClick={cancelEditing}
                            className="btn btn-secondary btn-sm"
                            disabled={saving}
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary btn-sm"
                            disabled={saving || !editUrl}
                        >
                            <Check className="w-3.5 h-3.5" />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Normal View Mode ──
    return (
        <div className={`bookmark-card ${bookmark.is_read ? 'bookmark-read' : ''}`}>
            <div className="bookmark-card-inner">
                <div className="bookmark-favicon-wrap">
                    {bookmark.favicon_url ? (
                        <img
                            src={bookmark.favicon_url}
                            alt=""
                            className="bookmark-favicon"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div className={`bookmark-favicon-fallback ${bookmark.favicon_url ? 'hidden' : ''}`}>
                        {domain.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="bookmark-content">
                    <div className="bookmark-header">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bookmark-title"
                        >
                            {bookmark.title || bookmark.url}
                            <ExternalLink className="w-3.5 h-3.5 inline ml-1.5 opacity-0 group-hover:opacity-100" />
                        </a>
                    </div>

                    <p className="bookmark-domain">{domain}</p>

                    {bookmark.description && (
                        <p className="bookmark-description">{bookmark.description}</p>
                    )}

                    <div className="bookmark-footer">
                        <div className="bookmark-tags">
                            {bookmark.tags?.map((tag) => (
                                <TagBadge key={tag} tag={tag} />
                            ))}
                        </div>
                        <span className="bookmark-time">{timeAgo}</span>
                    </div>
                </div>

                <div className="bookmark-actions">
                    <button
                        onClick={startEditing}
                        className="btn-icon"
                        aria-label="Edit bookmark"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onToggleRead(bookmark.id, bookmark.is_read)}
                        className="btn-icon"
                        aria-label={bookmark.is_read ? 'Mark as unread' : 'Mark as read'}
                        title={bookmark.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                        {bookmark.is_read ? (
                            <BookMarked className="w-4 h-4" />
                        ) : (
                            <BookOpen className="w-4 h-4" />
                        )}
                    </button>

                    {showConfirm ? (
                        <div className="confirm-delete">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn btn-danger btn-sm"
                            >
                                {deleting ? '...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn btn-ghost btn-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="btn-icon btn-icon-danger"
                            aria-label="Delete bookmark"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
