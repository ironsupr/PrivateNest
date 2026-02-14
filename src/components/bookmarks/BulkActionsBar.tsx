'use client';

import { Bookmark } from '@/types';
import { Trash2, BookOpen, Tag, X, CheckSquare } from 'lucide-react';
import { useState } from 'react';

interface BulkActionsBarProps {
    selectedIds: string[];
    bookmarks: Bookmark[];
    onClearSelection: () => void;
    onBulkDelete: (ids: string[]) => Promise<void>;
    onBulkToggleRead: (ids: string[], markAsRead: boolean) => Promise<void>;
    onBulkTag: (ids: string[], tag: string) => Promise<void>;
}

export function BulkActionsBar({
    selectedIds,
    bookmarks,
    onClearSelection,
    onBulkDelete,
    onBulkToggleRead,
    onBulkTag,
}: BulkActionsBarProps) {
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagValue, setTagValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (selectedIds.length === 0) return null;

    const handleBulkDelete = async () => {
        setLoading(true);
        await onBulkDelete(selectedIds);
        setLoading(false);
        setShowDeleteConfirm(false);
        onClearSelection();
    };

    const handleBulkRead = async (read: boolean) => {
        setLoading(true);
        await onBulkToggleRead(selectedIds, read);
        setLoading(false);
        onClearSelection();
    };

    const handleBulkTag = async () => {
        const tag = tagValue.trim().toLowerCase();
        if (!tag) return;
        setLoading(true);
        await onBulkTag(selectedIds, tag);
        setLoading(false);
        setTagValue('');
        setShowTagInput(false);
        onClearSelection();
    };

    return (
        <div className="bulk-bar">
            <div className="bulk-bar-info">
                <CheckSquare className="w-4 h-4" />
                <span>{selectedIds.length} selected</span>
                <button onClick={onClearSelection} className="bulk-clear-btn" title="Clear selection">
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="bulk-bar-actions">
                <button
                    onClick={() => handleBulkRead(true)}
                    className="btn btn-secondary btn-sm"
                    disabled={loading}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    Mark Read
                </button>
                <button
                    onClick={() => handleBulkRead(false)}
                    className="btn btn-secondary btn-sm"
                    disabled={loading}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    Mark Unread
                </button>

                {showTagInput ? (
                    <div className="bulk-tag-input-wrap">
                        <input
                            type="text"
                            value={tagValue}
                            onChange={(e) => setTagValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBulkTag()}
                            placeholder="Tag name"
                            className="bulk-tag-input"
                            autoFocus
                        />
                        <button onClick={handleBulkTag} className="btn btn-primary btn-sm" disabled={!tagValue.trim() || loading}>
                            Add
                        </button>
                        <button onClick={() => setShowTagInput(false)} className="btn btn-ghost btn-sm">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowTagInput(true)}
                        className="btn btn-secondary btn-sm"
                        disabled={loading}
                    >
                        <Tag className="w-3.5 h-3.5" />
                        Add Tag
                    </button>
                )}

                {showDeleteConfirm ? (
                    <div className="bulk-confirm-delete">
                        <button onClick={handleBulkDelete} className="btn btn-danger btn-sm" disabled={loading}>
                            {loading ? '...' : 'Confirm'}
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost btn-sm">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="btn btn-danger btn-sm"
                        disabled={loading}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
