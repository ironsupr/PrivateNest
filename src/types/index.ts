export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string;
  favicon_url: string;
  tags: string[];
  is_read: boolean;
  is_pinned: boolean;
  is_favorite: boolean;
  is_archived: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface UrlMetadata {
  title: string;
  description: string;
  favicon_url: string;
}

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
