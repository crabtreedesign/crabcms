export type Role = 'admin' | 'editor' | 'author';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
  coverImage?: string;
  status: 'draft' | 'published';
  type: 'post' | 'page';
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface SiteSettings {
  title: string;
  description: string;
  logoUrl?: string;
  footerText: string;
  homepageId?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface DBAdapter {
  connect: () => Promise<void>;
  getPosts: () => Promise<Post[]>;
  getPost: (id: string) => Promise<Post | undefined>;
  getPostBySlug: (slug: string) => Promise<Post | undefined>;
  savePost: (post: Post) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  getSettings: () => Promise<SiteSettings>;
  saveSettings: (settings: SiteSettings) => Promise<SiteSettings>;
  getTheme: () => Promise<ThemeConfig>;
  saveTheme: (theme: ThemeConfig) => Promise<ThemeConfig>;
}