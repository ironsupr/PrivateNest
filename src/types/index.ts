export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_public: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  collection_id: string | null;
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
  is_public: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface UrlMetadata {
  title: string;
  description: string;
  favicon_url: string;
}

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
