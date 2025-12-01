import { DBAdapter, Post, SiteSettings, ThemeConfig } from '../types';

const STORAGE_KEYS = {
  POSTS: 'crab_cms_posts',
  SETTINGS: 'crab_cms_settings',
  THEME: 'crab_cms_theme',
  INIT: 'crab_cms_init_v6' // Incremented to force re-seed
};

const DEFAULT_SETTINGS: SiteSettings = {
  title: 'Crab CMS',
  description: 'A robust, frontend-first content management system.',
  footerText: '© 2024 Crab CMS. All rights reserved.',
  homepageId: 'home-page'
};

const DEFAULT_THEME: ThemeConfig = {
  id: 'default-dark',
  name: 'Crab Dark',
  colors: {
    background: '#020617', // Slate 950
    text: '#f1f5f9',       // Slate 100
    primary: '#f43f5e',    // Rose 500
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
    content: `# The Future is Frontend.

> "Speed isn't just a feature. It's the foundation."

Crab CMS reimagines what a Content Management System can be. By moving the entire logic layer to the browser, we eliminate the complexities of server maintenance while delivering **instant** interactions.

### 🚀 Why Developers Choose Crab

- ⚡ **Zero Latency**
  Runs entirely in the client's browser.
- 🔌 **Universal Adapters**
  Connect to Postgres, Firebase, or LocalStorage.
- 🎨 **Theme Engine**
  Live customization with CSS variables.

*Scroll down to explore our engineering philosophy and design stories.*`,
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
    content: `# The Fatigue of Complexity

If you have been building websites for as long as we have, you know the drill. You want to launch a simple blog, a documentation site, or a portfolio. 

You start with good intentions. "I'll just use WordPress," you say. But then comes the database setup. The security plugins. The caching layers to make it reasonably fast. The constant updates.

"Okay," you think, "I'll go Headless." You spin up a Sanity instance, connect it to Next.js, deploy to Vercel, set up webhooks for revalidation... and suddenly, your simple site has a CI/CD pipeline complex enough to launch a satellite.

### Enter Crab CMS

We asked a simple question: **What if the browser IS the database?**

Modern browsers are incredibly powerful. IndexedDB allows us to store gigabytes of structured data. Devices have gigabytes of RAM. Why are we round-tripping to a server in Virginia just to render a blog post title?

Crab CMS was born from this frustration. We wanted a system that:

1.  **Runs Instantly**: No server cold starts.
2.  **Is Portable**: The entire CMS is just a JavaScript bundle.
3.  **Is Extensible**: If you *do* need a server, it's just an adapter away.

### The "No-Backend" Philosophy

By default, Crab CMS runs in what we call "Local Mode". It uses your browser's local storage to persist data. This is perfect for prototyping, documentation, or personal journals.

When you're ready to scale, you don't rewrite your frontend. You simply swap the \`LocalAdapter\` for a \`FirebaseAdapter\` or \`PostgresAdapter\`. The UI doesn't know the difference. The editing experience remains identical.

This is the future we believe in: software that scales with you, rather than demanding you scale for it from day one.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 172800000).toISOString(), 
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['Philosophy', 'Engineering', 'Story'],
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-architecture',
    title: 'Under the Hood: The Architecture of Crab',
    slug: 'architecture-of-crab',
    excerpt: 'A technical deep dive into how Crab CMS manages state, storage, and the Adapter Pattern.',
    content: `# Architecture Deep Dive

Crab CMS isn't just a static site generator. It is a dynamic Single Page Application (SPA) that behaves with the SEO properties of a static site.

## The Adapter Pattern

The core of Crab is the \`DBAdapter\` interface. This is the contract that decouples the User Interface from the Data Layer. 

\`\`\`typescript
export interface DBAdapter {
  connect: () => Promise<void>;
  getPosts: () => Promise<Post[]>;
  savePost: (post: Post) => Promise<Post>;
  // ... other methods
}
\`\`\`

### Why is this powerful?

Imagine you are building a site for a client. They aren't sure where they want to host their data yet.

1.  **Day 1**: You start developing using the \`LocalAdapter\`. You build the theme, create the pages, and write content. Data is saved in your browser.
2.  **Day 7**: The client chooses Supabase. You write a 50-line \`SupabaseAdapter\` implementing the interface above.
3.  **Day 8**: You swap the adapter import in \`services/storage.ts\`. **Done.**

The entire UI—the dashboard, the editor, the blog views—remains untouched. 

## State Management without the Bloat

We intentionally avoided Redux, MobX, or even Zustand for this project. Why? Because React 19 provides everything we need.

We utilize a combination of:
- **React Context**: For global theme and auth state.
- **React Query** (conceptually implemented via hooks): For data fetching and caching.
- **CSS Variables**: For high-performance theming that doesn't trigger React re-renders.

## Performance First

We achieve a Lighthouse score of 100 because we ship minimal JS. We use lazy loading for the Admin dashboard, meaning regular visitors only download the code needed to render content. The rich text editor, the charts, and the management tools are split into separate chunks.

This architecture proves that you don't need complex metaframeworks to build high-performance web applications. You just need good architecture.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['Deep Dive', 'React', 'TypeScript'],
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-theming',
    title: 'Designing the Theme Engine',
    slug: 'designing-theme-engine',
    excerpt: 'How we built a real-time theme editor using CSS variables and React effects.',
    content: `# The Power of CSS Variables

One of the coolest features of Crab CMS is the ability to change your site's look in real-time. This isn't just a "dark mode" toggle; it is a full design system engine.

## The Problem with CSS-in-JS

Traditionally, dynamic theming in React involves passing props to styled-components or using a ThemeProvider that forces a re-render of the entire component tree whenever a color changes. This is fine for a toggle, but terrible for a color picker where values change 60 times a second.

## The Native Solution

Instead, we map a JSON configuration directly to CSS Custom Properties (Variables).

\`\`\`css
:root {
  --cms-primary: #ef4444;
  --cms-bg: #0f172a;
  --cms-font-heading: 'Inter', sans-serif;
}
\`\`\`

When you drag the color picker in the Admin dashboard, we don't update React state that triggers a render. We simply update the style on the \`document.documentElement\`.

\`\`\`typescript
// Zero component re-renders
document.documentElement.style.setProperty('--cms-primary', newColor);
\`\`\`

This gives us **60fps performance** for theming. The interface feels alive.

## Typography Matters

We also exposed font controls. By loading fonts like 'Merriweather' and 'JetBrains Mono' via Google Fonts, we allow users to radically change the vibe of their site—from a Tech Blog to a Literary Journal—with a single dropdown select.

Design is not just about how it looks, but how it works. And this engine works beautifully.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Design', 'CSS', 'UI/UX'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-zen',
    title: 'The Zen of Coding',
    slug: 'zen-of-coding',
    excerpt: 'Finding flow state in a world of constant notifications and distractions.',
    content: `# Entering the Flow

Coding is one of the few professions where you can truly enter a meditative state. We call it "The Zone". 

But getting there is harder than ever. Slack notifications, email pings, and the endless scroll of social media all fight for your attention.

## Strategies for Focus

1. **Deep Work**: Block out 4 hours of uninterrupted time.
2. **Turn off Notifications**: Seriously. Do it now.
3. **Listen to Ambient Music**: Low-fi beats help the brain settle.

The code you write when you are distracted is brittle. The code you write in the flow is art.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ['Lifestyle', 'Productivity'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-rsc',
    title: 'Understanding React Server Components',
    slug: 'react-server-components',
    excerpt: 'Why RSCs are the biggest paradigm shift since hooks, and why you should care.',
    content: `# The Server is Part of the Tree

For years, we treated the backend as an API that we fetch from. With React Server Components, the backend becomes part of your component tree.

This eliminates the "waterfall" problem of data fetching. Instead of a component loading, then fetching data, then rendering children which fetch more data... the server resolves all dependencies before sending the HTML.

## Is it complex?

Yes. But the complexity lies in the framework (Next.js), not your application code. Your code actually gets simpler.

\`\`\`jsx
// Server Component
async function Profile() {
  const user = await db.user.get();
  return <div>{user.name}</div>;
}
\`\`\`

No useEffect. No useState. Just async/await in your component.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
    tags: ['React', 'Tech', 'RSC'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-tailwind',
    title: 'Why Tailwind Won',
    slug: 'why-tailwind-won',
    excerpt: 'It wasn\'t just about utility classes. It was about constraints and design tokens.',
    content: `# The Utility-First Revolution

People hated Tailwind when it first came out. "It's just inline styles!" they screamed.

They missed the point. Tailwind isn't about writing CSS in HTML. It's about **Design Tokens**.

By restricting you to a set of pre-defined spacing, colors, and typography scales, Tailwind forces consistency. You can't just pick "13px" padding. You have to pick \`p-3\` or \`p-4\`.

This constraint breeds creativity. It allows you to build interfaces that look professional without being a designer.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
    tags: ['CSS', 'Design'],
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-ai',
    title: 'The AI Revolution in Web Dev',
    slug: 'ai-revolution-web-dev',
    excerpt: 'Will AI replace developers? No. But developers using AI will replace those who don\'t.',
    content: `# Co-Pilot for Everything

We are moving from a world where we write code character-by-character to a world where we guide intent.

Tools like GitHub Copilot and ChatGPT are not replacing us; they are raising the baseline. A junior developer with AI is now a mid-level developer. A senior developer with AI is a 10x engineer.

The skill of the future is not "syntax memory". It is "system architecture" and "problem decomposition".`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
    tags: ['AI', 'Future', 'Opinion'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-wasm',
    title: 'WebAssembly: The Sleeping Giant',
    slug: 'webassembly-sleeping-giant',
    excerpt: 'Bringing native performance to the browser. Photoshop, Figma, and Video Editing on the web.',
    content: `# Beyond JavaScript

JavaScript is fast, but it has limits. WebAssembly (Wasm) breaks those limits.

We are seeing entire desktop applications ported to the web. Figma is built on C++ compiled to Wasm. Photoshop runs in the browser now.

This is the end of "installing software". If it has a URL, you can run it. The browser is the new operating system.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
    tags: ['Wasm', 'Performance'],
    coverImage: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-a11y',
    title: 'Accessibility First Design',
    slug: 'accessibility-first',
    excerpt: 'Accessibility is not an afterthought. It is a requirement for the modern web.',
    content: `# The Web is for Everyone

When we build for accessibility (a11y), we build better products for everyone.

- **Contrast**: Good contrast helps people with low vision, but also people looking at their phone in the sun.
- **Keyboard Nav**: Helps people with motor disabilities, but also power users who hate the mouse.
- **Semantic HTML**: Helps screen readers, but also improves SEO.

Don't wait until the end of the project to audit a11y. Bake it in from the start.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 691200000).toISOString(),
    updatedAt: new Date(Date.now() - 691200000).toISOString(),
    tags: ['A11y', 'Design'],
    coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  },
  {
    id: 'post-minimalism',
    title: 'The Return to Minimalism',
    slug: 'return-to-minimalism',
    excerpt: 'Why brutalist design and simple typography are making a comeback in web design.',
    content: `# Less is More, Again.

The early web was ugly, but it was simple. Then came the era of gradients, shadows, and glassmorphism. Now, we are seeing a return to the roots.

**Brutalism** in web design is not about being ugly. It's about being honest. It shows the structure of the page. It uses default fonts. It isn't afraid of white space.

In a world of information overload, clarity is the only luxury left.`,
    status: 'published',
    type: 'post',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 777600000).toISOString(),
    updatedAt: new Date(Date.now() - 777600000).toISOString(),
    tags: ['Design', 'Minimalism'],
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class LocalAdapter implements DBAdapter {
  private async init() {
    // Check if we need to seed data
    const initKey = localStorage.getItem(STORAGE_KEYS.INIT);
    
    // Only initialize if version mismatch or missing.
    // This handles the "first load" or "version upgrade" scenario.
    if (initKey !== STORAGE_KEYS.INIT) {
      console.log("Initializing database with seed data...");
      
      // Clear potentially old incompatible data
      localStorage.removeItem(STORAGE_KEYS.POSTS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.THEME);

      // Seed new data
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(DEFAULT_THEME));
      
      // Mark as initialized
      localStorage.setItem(STORAGE_KEYS.INIT, STORAGE_KEYS.INIT);
    }
  }

  async connect(): Promise<void> {
    await delay(300);
    await this.init();
  }

  async getPosts(): Promise<Post[]> {
    await this.init(); // Auto-init if needed
    await delay(200);
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!data) return [];
    const posts: Post[] = JSON.parse(data);
    return posts.map(p => ({ ...p, type: p.type || 'post' }));
  }

  async getPost(id: string): Promise<Post | undefined> {
    await this.init(); // Auto-init if needed
    const posts = await this.getPosts();
    return posts.find(p => p.id === id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    await this.init(); // Auto-init if needed
    const posts = await this.getPosts();
    return posts.find(p => p.slug === slug);
  }

  async savePost(post: Post): Promise<Post> {
    await this.init(); // Auto-init if needed
    await delay(400);
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
    await this.init(); // Auto-init if needed
    await delay(300);
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
  }

  async getSettings(): Promise<SiteSettings> {
    await this.init(); // Auto-init if needed
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  }

  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    await this.init(); // Auto-init if needed
    await delay(200);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }

  async getTheme(): Promise<ThemeConfig> {
    await this.init(); // Auto-init if needed
    const data = localStorage.getItem(STORAGE_KEYS.THEME);
    return data ? JSON.parse(data) : DEFAULT_THEME;
  }

  async saveTheme(theme: ThemeConfig): Promise<ThemeConfig> {
    await this.init(); // Auto-init if needed
    await delay(200);
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    return theme;
  }
}

/**
 * A Database Adapter that reads from a static JSON file (content.json)
 * and "saves" by downloading a new JSON file to the user's computer.
 * Perfect for a "No-Backend" CMS that deploys to GitHub Pages/Netlify.
 */
export class RemoteJsonAdapter implements DBAdapter {
  private data: {
    posts: Post[];
    settings: SiteSettings;
    theme: ThemeConfig;
  } | null = null;

  private async loadData() {
    if (this.data) return;
    try {
      const res = await fetch('/content.json');
      if (res.ok) {
        this.data = await res.json();
      } else {
        throw new Error('No content.json found');
      }
    } catch (e) {
      console.warn('Failed to load remote content, using fallback data:', e);
      // Fallback for demo purposes if content.json doesn't exist
      this.data = {
        posts: INITIAL_POSTS,
        settings: DEFAULT_SETTINGS,
        theme: DEFAULT_THEME
      };
    }
  }

  private triggerDownload() {
    if (!this.data) return;
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('CHANGES SAVED LOCALLY!\n\nA "content.json" file has been downloaded.\nCommit this file to your repository to publish your changes.');
  }

  async connect() { await this.loadData(); }

  async getPosts() { 
    await this.loadData(); 
    return this.data!.posts; 
  }

  async getPost(id: string) { 
    await this.loadData(); 
    return this.data!.posts.find(p => p.id === id); 
  }

  async getPostBySlug(slug: string) { 
    await this.loadData(); 
    return this.data!.posts.find(p => p.slug === slug); 
  }

  async savePost(post: Post) {
    await this.loadData();
    const idx = this.data!.posts.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      this.data!.posts[idx] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      this.data!.posts.unshift({ ...post, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.triggerDownload();
    return post;
  }

  async deletePost(id: string) {
    await this.loadData();
    this.data!.posts = this.data!.posts.filter(p => p.id !== id);
    this.triggerDownload();
  }

  async getSettings() { 
    await this.loadData(); 
    return this.data!.settings; 
  }

  async saveSettings(settings: SiteSettings) {
    await this.loadData();
    this.data!.settings = settings;
    this.triggerDownload();
    return settings;
  }

  async getTheme() { 
    await this.loadData(); 
    return this.data!.theme; 
  }

  async saveTheme(theme: ThemeConfig) {
    await this.loadData();
    this.data!.theme = theme;
    this.triggerDownload();
    return theme;
  }
}

export const db = new LocalAdapter();