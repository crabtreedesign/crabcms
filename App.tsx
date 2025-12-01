
import React, { useState, useEffect, Suspense, Component } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { db } from './services/storage';
import { Post, ThemeConfig, SiteSettings } from './types';
import { CrabLogo, LayoutDashboard, FileText, Settings, Palette, LogOut, Plus, Search, Trash2, Edit3, ExternalLink, Layers, Home, User as UserIcon } from './components/ui/Icons';
import { PostEditor } from './components/admin/PostEditor';
import { Dashboard } from './components/admin/Dashboard';
import { ThemeEditor } from './components/admin/ThemeEditor';
import ReactMarkdown from 'react-markdown';

/* --- Authentication Mock --- */
const AuthContext = React.createContext<{ isAuthenticated: boolean; login: () => void; logout: () => void } | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('crab_auth') === 'true');
  
  const login = () => {
    localStorage.setItem('crab_auth', 'true');
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('crab_auth');
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

/* --- Public Components --- */
const PublicLayout: React.FC<{ theme: ThemeConfig; children: React.ReactNode }> = ({ theme, children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-500/30 selection:text-white" style={{ backgroundColor: 'var(--cms-bg)', color: 'var(--cms-text)' }}>
      <header className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-opacity-70 border-b border-white/5 bg-[#020617]/70 supports-[backdrop-filter]:bg-[#020617]/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative z-10">
             <div className="p-2 bg-brand-500/10 rounded-xl group-hover:bg-brand-500/20 transition-colors">
                 <CrabLogo className="w-6 h-6 text-brand-500 transition-transform group-hover:rotate-12 duration-500" />
             </div>
            <span className="font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>Crab CMS</span>
          </Link>
          <nav className="flex gap-8 text-sm font-medium items-center">
            <Link to="/" className="relative text-white/70 hover:text-white transition-colors duration-200">Home</Link>
            <Link to="/blog" className="relative text-white/70 hover:text-white transition-colors duration-200">Blog</Link>
            <Link to="/about" className="relative text-white/70 hover:text-white transition-colors duration-200">About</Link>
            <div className="w-px h-4 bg-white/10 mx-2"></div>
            <Link to="/admin" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all shadow-lg shadow-brand-900/20 text-xs font-bold uppercase tracking-wider hover:translate-y-[-1px]">Admin</Link>
          </nav>
        </div>
      </header>
      
      {/* Spacer for Fixed Header */}
      <div className="h-20"></div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-0">
        {children}
      </main>
      
      <footer className="border-t border-white/5 bg-black/20 py-16 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <CrabLogo className="w-12 h-12 text-brand-500" />
          </div>
          <p className="text-white/40 text-sm font-medium mb-2">© {new Date().getFullYear()} Crab CMS. Built for the modern web.</p>
          <p className="text-white/20 text-xs">Designed with React 19 & Vite.</p>
        </div>
      </footer>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-24 animate-in fade-in duration-700 slide-in-from-bottom-4">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-mono text-brand-500 mb-4">
          v1.0.0-beta.1 Release
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]" style={{ fontFamily: 'var(--cms-font-heading)' }}>
          The CMS that <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-600">feels like magic.</span>
        </h1>
        <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed font-light">
          No database hell. No server costs. Just pure, unadulterated performance.
        </p>
      </div>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Frontend First', icon: '⚡', desc: 'Runs fully in the browser. Zero latency.' },
            { title: 'Universal Adapters', icon: '🔌', desc: 'Plug into Postgres, Firebase, or LocalStorage.' },
            { title: 'Theme Engine', icon: '🎨', desc: 'Live customization with CSS variables.' },
            { title: 'Rich Editor', icon: '📝', desc: 'Split-pane Markdown with live preview.' },
            { title: 'Secure', icon: '🔒', desc: 'RBAC, JWT-ready, and strict sanitization.' },
            { title: 'Performant', icon: '🚀', desc: 'Lighthouse 100. Optimized for speed.' }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-brand-500/30 hover:bg-white/[0.05] transition duration-300 group">
              <div className="text-4xl mb-6 opacity-80 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-3 text-white group-hover:text-brand-400 transition-colors">{feature.title}</h3>
              <p className="opacity-60 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
      </section>

      {/* Documentation */}
      <section className="space-y-12 border-t border-white/10 pt-20">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--cms-font-heading)' }}>Ready to Build?</h2>
            <p className="opacity-60">Follow our quickstart guide to get up and running in seconds.</p>
        </div>

        <div className="bg-[#0f172a] border border-white/10 p-8 rounded-2xl font-mono text-sm shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
            </div>
            <div className="space-y-6 text-gray-300">
                <div className="flex gap-4">
                    <span className="text-gray-500 select-none">1</span>
                    <p><span className="text-purple-400">git</span> clone https://github.com/crab-cms/crab-cms.git</p>
                </div>
                <div className="flex gap-4">
                    <span className="text-gray-500 select-none">2</span>
                    <p><span className="text-purple-400">cd</span> crab-cms && <span className="text-purple-400">npm</span> install</p>
                </div>
                <div className="flex gap-4">
                    <span className="text-gray-500 select-none">3</span>
                    <p><span className="text-purple-400">npm</span> run dev</p>
                </div>
                <div className="flex gap-4 text-green-400 mt-4">
                    <span className="text-gray-500 select-none">➜</span>
                    <p>Ready on http://localhost:5173 🚀</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

/* --- Dynamic Routing --- */
const HomeRoute = () => {
  const [data, setData] = useState<{ homepage: Post | null, recentPosts: Post[] }>({ homepage: null, recentPosts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const settings = await db.getSettings();
      let homepage = null;
      if (settings.homepageId) {
        homepage = await db.getPost(settings.homepageId);
      }
      
      const allPosts = await db.getPosts();
      const recentPosts = allPosts
        .filter(p => p.type === 'post' && p.status === 'published')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      setData({ homepage: homepage || null, recentPosts });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;

  // Custom Animated Markdown Components
  const animatedComponents = {
    h1: ({node, ...props}: any) => (
      <div className="relative">
        <div className="absolute -top-10 -right-4 md:-right-10 z-0 opacity-40 animate-spin pointer-events-none" style={{ animationDuration: '20s' }}>
            <CrabLogo className="w-40 h-40 md:w-64 md:h-64 text-brand-500" />
        </div>
        <h1 className="relative z-10 text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-brand-500 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 tracking-tight leading-[1.1]" {...props} />
      </div>
    ),
    h2: ({node, ...props}: any) => (
      <h2 className="text-3xl md:text-5xl font-bold mt-24 mb-8 text-white animate-in fade-in slide-in-from-left-8 duration-1000 delay-200 tracking-tight" {...props} />
    ),
    h3: ({node, ...props}: any) => (
      <h3 className="text-2xl font-semibold text-brand-400 mt-12 mb-4 animate-in fade-in zoom-in duration-1000 delay-300" {...props} />
    ),
    p: ({node, ...props}: any) => (
      <p className="text-xl md:text-2xl opacity-70 leading-relaxed mb-8 font-light animate-in fade-in duration-1000 delay-500 max-w-3xl" {...props} />
    ),
    ul: ({node, ...props}: any) => (
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700" {...props} />
    ),
    li: ({node, ...props}: any) => (
      <li className="flex flex-col p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition duration-300 backdrop-blur-sm" {...props} />
    ),
    blockquote: ({node, ...props}: any) => (
      <blockquote className="p-8 my-16 bg-gradient-to-r from-brand-900/10 to-transparent border-l-4 border-brand-500 rounded-r-2xl italic text-2xl text-white/90 shadow-2xl animate-in fade-in duration-1000 delay-500" {...props} />
    )
  };

  return (
    <div className="space-y-24 animate-in fade-in">
       {/* Hero / Main Page Content */}
       <section>
         {data.homepage ? (
            <article className="max-w-none">
                <ReactMarkdown components={animatedComponents}>
                    {data.homepage.content}
                </ReactMarkdown>
            </article>
         ) : (
            <div className="text-center py-20">
                <h1 className="text-5xl font-bold mb-6 text-brand-500">Welcome to Crab CMS</h1>
                <p className="text-xl opacity-70 mb-8">A powerful, frontend-first content management system.</p>
                <Link to="/blog" className="px-6 py-3 bg-brand-600 rounded-lg text-white font-bold hover:bg-brand-500 transition">Read the Blog</Link>
            </div>
         )}
       </section>

       {/* Latest Stories Section */}
       {data.recentPosts.length > 0 && (
         <section className="border-t border-white/10 pt-24">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--cms-font-heading)' }}>Latest Stories</h2>
                    <p className="opacity-60 text-lg">Fresh thinking from the team.</p>
                </div>
                <Link to="/blog" className="hidden md:flex text-brand-500 hover:text-brand-400 font-medium items-center gap-2 px-4 py-2 rounded-full hover:bg-brand-500/10 transition-colors">View All <ExternalLink size={16}/></Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {data.recentPosts.map((post, i) => (
                    <Link key={post.id} to={`/post/${post.slug}`} className="group block flex flex-col h-full">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            {post.coverImage ? (
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/10"><CrabLogo className="w-12 h-12"/></div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-500">{post.tags[0] || 'Article'}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                <span className="text-xs opacity-50">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-brand-400 transition-colors leading-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>{post.title}</h3>
                            <p className="text-sm opacity-60 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-8 md:hidden text-center">
                <Link to="/blog" className="inline-flex text-brand-500 font-medium items-center gap-2">View All Articles <ExternalLink size={16}/></Link>
            </div>
         </section>
       )}
    </div>
  );
};

const PageRoute = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Post | null>(null);
  
  useEffect(() => {
    if (slug) db.getPostBySlug(slug).then(p => {
       if (p?.type === 'page') setPage(p);
    });
  }, [slug]);

  if (!page) return <div className="text-center py-20 opacity-50">Page not found.</div>;

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 tracking-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>{page.title}</h1>
        <ReactMarkdown className="prose prose-invert prose-lg max-w-none">
          {page.content}
        </ReactMarkdown>
      </article>
  );
};

const BlogIndex = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    db.getPosts().then(p => setPosts(p.filter(x => x.status === 'published' && x.type === 'post')));
  }, []);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="space-y-20 animate-in fade-in duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>
          The <span className="text-brand-500">Crab</span> Blog
        </h1>
        <p className="text-xl opacity-60 font-light" style={{ fontFamily: 'var(--cms-font-body)' }}>
          Engineering, design, and stories from the future of web development.
        </p>
      </div>
      
      {/* Featured Post */}
      {featuredPost && (
          <Link to={`/post/${featuredPost.slug}`} className="group relative block rounded-3xl overflow-hidden aspect-[21/9] min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity opacity-90 group-hover:opacity-80"></div>
              {featuredPost.coverImage && (
                  <img src={featuredPost.coverImage} alt={featuredPost.title} className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-105" />
              )}
              <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-4xl">
                  <div className="inline-block px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Featured</div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-brand-100 transition-colors" style={{ fontFamily: 'var(--cms-font-heading)' }}>
                      {featuredPost.title}
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl line-clamp-2 max-w-2xl font-light">{featuredPost.excerpt}</p>
              </div>
          </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {remainingPosts.map(post => (
          <article key={post.id} className="group flex flex-col space-y-5">
            <Link to={`/post/${post.slug}`} className="block overflow-hidden rounded-2xl aspect-[16/9] relative">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all z-10"></div>
              {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
              ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center"><CrabLogo className="w-12 h-12 opacity-20"/></div>
              )}
            </Link>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider opacity-60">
                 <span className="text-brand-500">{post.tags[0] || 'Story'}</span>
                 <span>•</span>
                 <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <Link to={`/post/${post.slug}`} className="block">
                <h2 className="text-3xl font-bold group-hover:text-brand-400 transition-colors leading-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>{post.title}</h2>
              </Link>
              <p className="opacity-70 line-clamp-3 leading-relaxed text-base">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) db.getPostBySlug(slug).then(setPost);
  }, [slug]);

  if (!post) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-xl opacity-50">Loading article...</div></div>;

  // Calculate read time
  const words = post.content.split(' ').length;
  const readTime = Math.ceil(words / 200);

  return (
    <article className="animate-in fade-in duration-700">
      {/* Hero Header */}
      <header className="max-w-4xl mx-auto mb-16 text-center space-y-8">
        <div className="flex justify-center items-center gap-3 text-sm font-medium opacity-60 uppercase tracking-widest">
           <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
           <span className="w-1 h-1 rounded-full bg-current"></span>
           <span>{readTime} min read</span>
           {post.tags.length > 0 && (
             <>
               <span className="w-1 h-1 rounded-full bg-current"></span>
               <span className="text-brand-500">{post.tags[0]}</span>
             </>
           )}
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>
            {post.title}
        </h1>
        
        <div className="flex justify-center items-center gap-3 pt-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 p-[2px]">
                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">A</div>
             </div>
             <div className="text-left">
                 <p className="text-sm font-bold text-white">Admin User</p>
                 <p className="text-xs opacity-50">Editor in Chief</p>
             </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.coverImage && (
          <div className="w-full aspect-[21/9] md:aspect-[2.4/1] overflow-hidden rounded-3xl shadow-2xl mb-20 relative ring-1 ring-white/10 group">
              <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" alt={post.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        <div className="prose prose-invert prose-lg md:prose-xl mx-auto">
           <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {/* Footer Author Card */}
        <div className="mt-20 pt-12 border-t border-white/10">
            <div className="bg-white/[0.03] rounded-2xl p-8 flex items-center gap-6 border border-white/5">
                 <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
                     <UserIcon size={32} />
                 </div>
                 <div>
                     <h3 className="text-lg font-bold text-white mb-1">Written by Admin</h3>
                     <p className="opacity-60 text-sm leading-relaxed">
                         Core maintainer of Crab CMS. Passionate about performance, React, and building tools that developers actually enjoy using.
                     </p>
                 </div>
            </div>
        </div>
      </div>
    </article>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-900/10 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 text-center relative z-10">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/5 rounded-2xl ring-1 ring-white/10 shadow-lg">
            <CrabLogo className="w-10 h-10 text-brand-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-slate-400 mb-8 font-light">Enter your credentials to access the workspace.</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email</label>
              <input type="email" placeholder="admin@crabcms.com" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:outline-none transition" required />
          </div>
          <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:outline-none transition" required />
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white p-4 rounded-xl font-bold hover:bg-brand-500 transition shadow-lg shadow-brand-900/20 mt-2">Sign In</button>
        </form>
        <p className="mt-8 text-xs text-slate-600">
          <span className="opacity-50">Demo Access:</span> <span className="text-slate-400">Any credentials work</span>
        </p>
      </div>
    </div>
  );
};

/* --- Admin Components --- */
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Posts', path: '/admin/posts' },
    { icon: Layers, label: 'Pages', path: '/admin/pages' },
    { icon: Palette, label: 'Appearance', path: '/admin/appearance' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-gray-900 font-sans">
      <aside className="w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
           <CrabLogo className="w-8 h-8 text-brand-500 mr-3" />
           <span className="font-bold text-xl text-white tracking-tight">Crab CMS</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Menu</div>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition text-sm font-medium">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-72 p-10 overflow-y-auto min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

// Generic Manager for Posts and Pages
const ContentManager: React.FC<{ type: 'post' | 'page' }> = ({ type }) => {
  const [items, setItems] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const loadItems = async () => {
    const all = await db.getPosts();
    setItems(all.filter(p => p.type === type));
    setSettings(await db.getSettings());
  };
  
  useEffect(() => { loadItems(); }, [type]);

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      await db.deletePost(id);
      loadItems();
    }
  };

  const setAsHomepage = async (id: string) => {
      if(!settings) return;
      const newSettings = { ...settings, homepageId: id };
      await db.saveSettings(newSettings);
      setSettings(newSettings);
  };

  const unsetHomepage = async () => {
      if(!settings) return;
      const newSettings = { ...settings, homepageId: undefined };
      await db.saveSettings(newSettings);
      setSettings(newSettings);
  };

  if (isEditorOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <PostEditor 
          postId={editingId} 
          defaultType={type}
          onClose={() => { setIsEditorOpen(false); setEditingId(null); }} 
          onSave={() => { setIsEditorOpen(false); setEditingId(null); loadItems(); }} 
        />
      </div>
    );
  }

  const isPage = type === 'page';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">{type}s</h1>
           <p className="text-slate-500 mt-1">Manage your {type} content</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setIsEditorOpen(true); }}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-brand-700 transition shadow-lg shadow-brand-200 font-bold text-sm"
        >
          <Plus size={18} /> New {type === 'post' ? 'Post' : 'Page'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input type="text" placeholder={`Search ${type}s...`} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white shadow-sm" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              {isPage && <th className="px-6 py-4">Homepage</th>}
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => {
                const isHomepage = settings?.homepageId === item.id;
                return (
              <tr key={item.id} className="hover:bg-slate-50 transition group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">/{item.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {item.status}
                  </span>
                </td>
                 {isPage && (
                    <td className="px-6 py-4">
                        {isHomepage ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <Home size={12} /> Home
                            </span>
                        ) : (
                            <button onClick={() => setAsHomepage(item.id)} className="text-xs font-medium text-slate-400 hover:text-blue-600 hover:underline">Set as Home</button>
                        )}
                         {isHomepage && <button onClick={unsetHomepage} className="ml-2 text-xs font-medium text-red-400 hover:text-red-600 hover:underline">(Unset)</button>}
                    </td>
                )}
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(item.id); setIsEditorOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {items.length === 0 && <div className="p-16 text-center text-slate-400">No {type}s found. Start writing!</div>}
      </div>
    </div>
  );
};

/* --- Main App Container --- */
const AppContent = () => {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    const init = async () => {
      await db.connect();
      const t = await db.getTheme();
      setTheme(t);
      updateCSSVariables(t);
    };
    init();
  }, []);

  const updateCSSVariables = (t: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--cms-bg', t.colors.background);
    root.style.setProperty('--cms-text', t.colors.text);
    root.style.setProperty('--cms-primary', t.colors.primary);
    root.style.setProperty('--cms-secondary', t.colors.secondary);
    root.style.setProperty('--cms-font-heading', t.fonts.heading);
    root.style.setProperty('--cms-font-body', t.fonts.body);
  };

  const handleThemeUpdate = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
    updateCSSVariables(newTheme);
  };

  if (!theme) return null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<ContentManager type="post" />} />
                <Route path="pages" element={<ContentManager type="page" />} />
                <Route path="appearance" element={<ThemeEditor currentTheme={theme} onUpdate={handleThemeUpdate} />} />
                <Route path="settings" element={<div className="text-gray-500">Global settings placeholder (SEO, Users, etc)</div>} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } />

        {/* Public Routes */}
        <Route path="/*" element={
          <PublicLayout theme={theme}>
            <Routes>
              <Route index element={<HomeRoute />} />
              <Route path="blog" element={<BlogIndex />} />
              <Route path="post/:slug" element={<BlogPost />} />
              <Route path="page/:slug" element={<PageRoute />} />
              <Route path="about" element={<AboutPage />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
};

class ErrorBoundary extends Component<any, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
        const err = error instanceof Error ? error : new Error(String(error));
        return { hasError: true, error: err };
    }
    componentDidCatch(error: any, errorInfo: any) {
        console.error("Uncaught error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
 <div className="max-w-md w-full bg-slate-800 p-6 rounded-lg border border-slate-700">
 <h1 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h1>
 <p className="text-slate-300 mb-4">The application crashed. Please try reloading.</p>
 <pre className="bg-black/30 p-4 rounded text-xs font-mono overflow-auto mb-4 text-slate-400">{this.state.error?.message}</pre>
 <button onClick={() => window.location.reload()} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded transition">Reload Application</button>
 </div>
 </div>);
        }
        return this.props.children;
    }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
