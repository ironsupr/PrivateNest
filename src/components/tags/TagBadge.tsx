interface TagBadgeProps {
    tag: string;
    onClick?: () => void;
    active?: boolean;
    removable?: boolean;
    onRemove?: () => void;
}

export function TagBadge({ tag, onClick, active, removable, onRemove }: TagBadgeProps) {
    return (
        <span
            className={`tag-badge ${active ? 'tag-badge-active' : ''} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {tag}
            {removable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    className="tag-remove"
                    aria-label={`Remove tag ${tag}`}
                >
                    ×
                </button>
            )}
        </span>
    );
}
