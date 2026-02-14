'use client';

import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from '@/types';

interface SortSelectProps {
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
}

export function SortSelect({ sortOption, onSortChange }: SortSelectProps) {
    return (
        <div className="sort-container">
            <ArrowUpDown className="sort-icon" />
            <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="sort-select"
                aria-label="Sort bookmarks"
            >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="a-z">A → Z</option>
                <option value="z-a">Z → A</option>
            </select>
        </div>
    );
}
