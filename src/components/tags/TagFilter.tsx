import { TagBadge } from './TagBadge';

interface TagFilterProps {
    tags: string[];
    activeTag: string | null;
    onTagSelect: (tag: string | null) => void;
}

export function TagFilter({ tags, activeTag, onTagSelect }: TagFilterProps) {
    if (tags.length === 0) return null;

    return (
        <div className="tag-filter">
            <TagBadge
                tag="All"
                active={activeTag === null}
                onClick={() => onTagSelect(null)}
            />
            {tags.map((tag) => (
                <TagBadge
                    key={tag}
                    tag={tag}
                    active={activeTag === tag}
                    onClick={() => onTagSelect(tag)}
                />
            ))}
        </div>
    );
}
