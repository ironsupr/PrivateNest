'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
}

export function DeleteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Bookmark',
    description = 'Are you sure you want to delete this bookmark? This action cannot be undone.',
    loading = false
}: DeleteConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center text-red-600">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <h3 className="font-bold text-navy-900 text-lg">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-navy-700/70 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-navy-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-soft hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
