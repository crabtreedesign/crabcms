import { DBAdapter, Post, SiteSettings, ThemeConfig } from '../types';

const STORAGE_KEYS = {
  POSTS: 'crab_cms_posts',
  SETTINGS: 'crab_cms_settings',
  THEME: 'crab_cms_theme',
  INIT: 'crab_cms_init'
};

const DEFAULT_SETTINGS: SiteSettings = {
  title: 'Crab CMS',
  description: 'A robust, frontend-first content management system.',
  footerText: '© 2024 Crab CMS. All rights reserved.',
  homepageId: 'home-page' // Default to the generated home page
};

const DEFAULT_THEME: ThemeConfig = {
  id: 'default-dark',
  name: 'Crab Dark',
  colors: {
    background: '#020617', // Slate 950 (Deep, rich dark)
    text: '#f1f5f9',       // Slate 100
    primary: '#f43f5e',    // Rose 500 (Vibrant red/pink)
    secondary: '#64748b'   // Slate 500
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  }
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'home-page',
    title: 'Home',
    slug: 'home',
    excerpt: 'Welcome to our site.',
    content: `# The Future is Frontend.\n\n> "Speed isn't just a feature. It's the foundation."\n\nCrab CMS reimagines what a Content Management System can be. By moving the entire logic layer to the browser, we eliminate the complexities of server maintenance while delivering **instant** interactions.\n\n### 🚀 Why Developers Choose Crab\n\n- **Zero Latency**: Runs entirely in the client's browser.\n- **Universal Adapters**: Connect to Postgres, Firebase, or LocalStorage.\n- **Theme Engine**: Live customization with CSS variables.\n\n*Scroll down to explore our engineering philosophy and design stories.*`,
    status: 'published',
    type: 'page',
    authorId: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  },
  {
    id: 'post-inception',
    title: 'Inception: Why We Built Crab CMS',
    slug: 'why-we-built-crab-cms',
    excerpt: 'The story behind the fastest frontend-first CMS. We wanted to escape the bloat of traditional monoliths.',
    content: `# The Fatigue of Complexity\n\nIf you have been building websites for as long as we have, you know the drill. You want to launch a simple blog, a documentation site, or a portfolio. \n\nYou start with good intentions. "I'll just use WordPress," you say. But then comes the database setup. The security plugins. The caching layers to make it reasonably fast. The constant updates.\n\n"Okay," you think, "I'll go Headless." You spin up a Sanity instance, connect it to Next.js, deploy to Vercel, set up webhooks for revalidation... and suddenly, your simple site has a CI/CD pipeline complex enough to launch a satellite.\n\n### Enter Crab CMS\n\nWe asked a simple question: **What if the browser IS the database?**\n\nModern browsers are incredibly powerful. IndexedDB allows us to store gigabytes of structured data. Devices have gigabytes of RAM. Why are we round-tripping to a server in Virginia just to render a blog post title?\n\nCrab CMS was born from this frustration. We wanted a system that:\n\n1.  **Runs Instantly**: No server cold starts.\n2.  **Is Portable**: The entire CMS is just a JavaScript bundle.\n3.  **Is Extensible**: If you *do* need a server, it's just an adapter away.\n\n### The "No-Backend" Philosophy\n\nBy default, Crab CMS runs in what we call "Local Mode". It uses your browser's local storage to persist data. This is perfect for prototyping, documentation, or personal journals.\n\nWhen you're ready to scale, you don't rewrite your frontend. You simply swap the \`LocalAdapter\` for a \`FirebaseAdapter\` or \`PostgresAdapter\`. The UI doesn't know the difference. The editing experience remains identical.\n\nThis is the future we believe in: software that scales with you, rather than demanding you scale for it from day one.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['Philosophy', 'Engineering', 'Story'],
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-architecture',
    title: 'Under the Hood: The Architecture of Crab',
    slug: 'architecture-of-crab',
    excerpt: 'A technical deep dive into how Crab CMS manages state, storage, and the Adapter Pattern.',
    content: `# Architecture Deep Dive\n\nCrab CMS isn't just a static site generator. It is a dynamic Single Page Application (SPA) that behaves with the SEO properties of a static site.\n\n## The Adapter Pattern\n\nThe core of Crab is the \`DBAdapter\` interface. This is the contract that decouples the User Interface from the Data Layer. \n\n\`\`\`typescript\nexport interface DBAdapter {\n  connect: () => Promise<void>;\n  getPosts: () => Promise<Post[]>;\n  savePost: (post: Post) => Promise<Post>;\n  // ... other methods\n}\n\`\`\`\n\n### Why is this powerful?\n\nImagine you are building a site for a client. They aren't sure where they want to host their data yet.\n\n1.  **Day 1**: You start developing using the \`LocalAdapter\`. You build the theme, create the pages, and write content. Data is saved in your browser.\n2.  **Day 7**: The client chooses Supabase. You write a 50-line \`SupabaseAdapter\` implementing the interface above.\n3.  **Day 8**: You swap the adapter import in \`services/storage.ts\`. **Done.**\n\nThe entire UI—the dashboard, the editor, the blog views—remains untouched. \n\n## State Management without the Bloat\n\nWe intentionally avoided Redux, MobX, or even Zustand for this project. Why? Because React 19 provides everything we need.\n\nWe utilize a combination of:\n- **React Context**: For global theme and auth state.\n- **React Query** (conceptually implemented via hooks): For data fetching and caching.\n- **CSS Variables**: For high-performance theming that doesn't trigger React re-renders.\n\n## Performance First\n\nWe achieve a Lighthouse score of 100 because we ship minimal JS. We use lazy loading for the Admin dashboard, meaning regular visitors only download the code needed to render content. The rich text editor, the charts, and the management tools are split into separate chunks.\n\nThis architecture proves that you don't need complex metaframeworks to build high-performance web applications. You just need good architecture.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['Deep Dive', 'React', 'TypeScript'],
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-theming',
    title: 'Designing the Theme Engine',
    slug: 'designing-theme-engine',
    excerpt: 'How we built a real-time theme editor using CSS variables and React effects.',
    content: `# The Power of CSS Variables\n\nOne of the coolest features of Crab CMS is the ability to change your site's look in real-time. This isn't just a "dark mode" toggle; it is a full design system engine.\n\n## The Problem with CSS-in-JS\n\nTraditionally, dynamic theming in React involves passing props to styled-components or using a ThemeProvider that forces a re-render of the entire component tree whenever a color changes. This is fine for a toggle, but terrible for a color picker where values change 60 times a second.\n\n## The Native Solution\n\nInstead, we map a JSON configuration directly to CSS Custom Properties (Variables).\n\n\`\`\`css\n:root {\n  --cms-primary: #ef4444;\n  --cms-bg: #0f172a;\n  --cms-font-heading: 'Inter', sans-serif;\n}\n\`\`\`\n\nWhen you drag the color picker in the Admin dashboard, we don't update React state that triggers a render. We simply update the style on the \`document.documentElement\`.\n\n\`\`\`typescript\n// Zero component re-renders\ndocument.documentElement.style.setProperty('--cms-primary', newColor);\n\`\`\`\n\nThis gives us **60fps performance** for theming. The interface feels alive.\n\n## Typography Matters\n\nWe also exposed font controls. By loading fonts like 'Merriweather' and 'JetBrains Mono' via Google Fonts, we allow users to radically change the vibe of their site—from a Tech Blog to a Literary Journal—with a single dropdown select.\n\nDesign is not just about how it looks, but how it works. And this engine works beautifully.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date().toISOString(), // Today
    updatedAt: new Date().toISOString(),
    tags: ['Design', 'CSS', 'UI/UX'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: '3',
    title: 'Contact Us',
    slug: 'contact',
    excerpt: '',
    content: `# Contact Us\n\nWe'd love to hear from you. \n\nEmail: hello@crabcms.com\nTwitter: @crabcms`,
    status: 'published',
    type: 'page',
    authorId: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  }
];

// Helper to simulate async delay for "Real Database" feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class LocalAdapter implements DBAdapter {
  async connect(): Promise<void> {
    await delay(300);
    if (!localStorage.getItem(STORAGE_KEYS.INIT)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(DEFAULT_THEME));
      localStorage.setItem(STORAGE_KEYS.INIT, 'true');
    }
  }

  async getPosts(): Promise<Post[]> {
    await delay(200);
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!data) return [];
    const posts: Post[] = JSON.parse(data);
    // Migration helper: ensure type exists
    return posts.map(p => ({ ...p, type: p.type || 'post' }));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const posts = await this.getPosts();
    return posts.find(p => p.id === id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const posts = await this.getPosts();
    return posts.find(p => p.slug === slug);
  }

  async savePost(post: Post): Promise<Post> {
    await delay(400); // Simulate network write
    const posts = await this.getPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      posts.unshift({ ...post, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return post;
  }

  async deletePost(id: string): Promise<void> {
    await delay(300);
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
  }

  async getSettings(): Promise<SiteSettings> {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  }

  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    await delay(200);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }

  async getTheme(): Promise<ThemeConfig> {
    const data = localStorage.getItem(STORAGE_KEYS.THEME);
    return data ? JSON.parse(data) : DEFAULT_THEME;
  }

  async saveTheme(theme: ThemeConfig): Promise<ThemeConfig> {
    await delay(200);
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    return theme;
  }
}

export const db = new LocalAdapter();