'use client';

import { useBookmarkContext } from '@/providers/BookmarkProvider';

export function useBookmarks() {
    return useBookmarkContext();
}
