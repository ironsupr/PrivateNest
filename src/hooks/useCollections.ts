'use client';

import { useCollectionContext } from '@/providers/CollectionProvider';

export function useCollections() {
    return useCollectionContext();
}
