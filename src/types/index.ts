export interface Article {
  id: string; title: string; slug: string; excerpt: string; content: string;
  coverImage?: string; published: boolean; featured: boolean; views: number;
  publishedAt?: string; createdAt: string; updatedAt: string;
  author: { id: string; name: string; username: string; avatar?: string; bio?: string };
  category: { id: string; name: string; slug: string; color?: string };
  tags: Tag[]; comments?: Comment[]; _count?: { comments: number };
}
export interface Category {
  id: string; name: string; slug: string; description?: string; color?: string;
  _count?: { articles: number };
}
export interface Tag { id: string; name: string; slug: string; }
export interface Comment {
  id: string; content: string; approved: boolean; createdAt: string;
  author: { id: string; name: string; username: string; avatar?: string };
}
export interface PaginationMeta {
  total: number; page: number; limit: number; totalPages: number;
  hasNextPage: boolean; hasPrevPage: boolean;
}
