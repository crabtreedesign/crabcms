import React, { useState, useEffect, type ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { db } from './services/storage';
import { Post, ThemeConfig, SiteSettings } from './types';
import { CrabLogo, LayoutDashboard, FileText, Settings, Palette, LogOut, Plus, Search, Trash2, Edit3, ExternalLink, Layers, Home, User as UserIcon, Download, ArrowLeft, Github } from './components/ui/Icons';
import { PostEditor } from './components/admin/PostEditor';
import { Dashboard } from './components/admin/Dashboard';
import { ThemeEditor } from './components/admin/ThemeEditor';
import ReactMarkdown from 'react-markdown';

/* --- Error Boundary --- */
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any): ErrorBoundaryState {
        const err = error instanceof Error ? error : new Error(String(error));
        return { hasError: true, error: err };
    }
    
    componentDidCatch(error: any, errorInfo: any) {
        console.error("Uncaught error:", error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
                    <div className="max-w-md w-full bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h1 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h1>
                        <p className="text-slate-300 mb-4">The application crashed. Please try reloading.</p>
                        <pre className="bg-black/30 p-4 rounded text-xs font-mono overflow-auto mb-4 text-slate-400 max-h-40">
                            {this.state.error?.message}
                        </pre>
                        <button onClick={() => window.location.reload()} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded transition w-full">
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

/* --- Scroll To Top --- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/* --- Authentication Mock --- */
const AuthContext = React.createContext<{ isAuthenticated: boolean; login: () => void; logout: () => void } | null>(null);

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('crab_auth') === 'true');
  
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

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

/* --- Public Components --- */
const PublicLayout = ({ theme, children }: { theme: ThemeConfig; children?: React.ReactNode }) => {
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
          <nav className="flex gap-4 md:gap-8 text-sm font-medium items-center">
            <Link to="/" className="relative text-white/70 hover:text-white transition-colors duration-200 hidden md:block">Home</Link>
            <Link to="/blog" className="relative text-white/70 hover:text-white transition-colors duration-200">Blog</Link>
            <Link to="/about" className="relative text-white/70 hover:text-white transition-colors duration-200">About</Link>
            <div className="w-px h-4 bg-white/10 mx-2 hidden md:block"></div>
            <Link to="/admin" className="px-4 py-2 md:px-5 md:py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all shadow-lg shadow-brand-900/20 text-xs font-bold uppercase tracking-wider hover:translate-y-[-1px]">Admin</Link>
          </nav>
        </div>
      </header>
      
      {/* Spacer for Fixed Header */}
      <div className="h-20"></div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-0">
        {children}
      </main>
      
      <footer className="border-t border-white/5 bg-black/20 py-16 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="flex justify-center mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <CrabLogo className="w-12 h-12 text-brand-500" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8 text-sm text-white/40 font-medium">
            <p>© {new Date().getFullYear()} Crab CMS</p>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/20"></span>
            <a href="https://github.com/crabtreedesign/crabcms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <Github size={16} /> GitHub
            </a>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/20"></span>
            <a href="https://briancrabtree.me" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Designed by BrianCrabtree.me
            </a>
          </div>

          <a 
            href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=briancrabtree420@gmail.com&item_name=Crab+CMS+Support&currency_code=USD" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            <span>♥</span> Donate via PayPal
          </a>
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
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1]" style={{ fontFamily: 'var(--cms-font-heading)' }}>
          The CMS that <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-600">feels like magic.</span>
        </h1>
        <p className="text-lg md:text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed font-light">
          No database hell. No server costs. Just pure, unadulterated performance.
        </p>

        <div className="flex justify-center pt-4">
          <a 
            href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=briancrabtree420@gmail.com&item_name=Crab+CMS+Support&currency_code=USD" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0070BA] hover:bg-[#003087] text-white font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            <span>♥</span> Donate via PayPal
          </a>
        </div>
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
            <p className="opacity-60">Install manually via GitHub or download the production ready bundle.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* GitHub Card */}
            <div className="bg-[#0f172a] border border-white/10 p-8 rounded-2xl font-mono text-xs md:text-sm shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="space-y-6 text-gray-300">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 mb-1"># Clone repository</p>
                        <p className="break-all"><span className="text-purple-400">git</span> clone https://github.com/crabtreedesign/crabcms.git</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 mb-1"># Install dependencies</p>
                        <p><span className="text-purple-400">cd</span> crabcms && <span className="text-purple-400">npm</span> install</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 mb-1"># Start development server</p>
                        <p><span className="text-purple-400">npm</span> run dev</p>
                    </div>
                    <div className="flex gap-2 text-green-400 pt-2">
                        <span className="text-gray-500 select-none">➜</span>
                        <p>Ready on http://localhost:5173</p>
                    </div>
                </div>
            </div>

            {/* Download Card */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
                <div>
                    <div className="w-12 h-12 bg-brand-500/20 text-brand-500 rounded-xl flex items-center justify-center mb-6">
                        <Download size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Direct Download</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        Get the full source code as a ZIP archive. Perfect for offline development or manual server deployment.
                    </p>
                </div>
                <a 
                    href="http://briancrabtree.me/downloads/crabcms.zip" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    <Download size={18} />
                    Download .ZIP
                </a>
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
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
      } catch (err) {
        console.error("Failed to load home page content", err);
        setError("Failed to load content. Please check your connection or database adapter.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (error) return <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-4"><p className="text-red-400 mb-4">{error}</p><button onClick={() => window.location.reload()} className="underline text-sm opacity-60 hover:opacity-100">Try Again</button></div>;

  // Custom Animated Markdown Components
  const animatedComponents = {
    h1: ({node, children, ...props}: any) => {
      // Safely convert children to string if possible, or fallback to standard render
      let textContent = "";
      
      try {
        if (typeof children === 'string') {
          textContent = children;
        } else if (Array.isArray(children)) {
            // Flatten array of strings/objects to a single string if possible
            textContent = children.map((c: any) => {
                if (typeof c === 'string') return c;
                return ''; // Ignore non-string children for gradient calculation
            }).join('');
        }
      } catch (e) {
        // Fallback
      }

      const hasContent = textContent.length > 0;

      if (!hasContent) {
         return (
            <h1 className="relative z-10 text-4xl md:text-6xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-[1.1] text-white" {...props}>
                {children}
            </h1>
         );
      }

      const words = textContent.split(' ');
      const firstWord = words[0] || '';
      const restText = words.slice(1).join(' ');

      return (
      <div className="relative">
        <div className="absolute -top-10 -right-4 md:-right-20 z-0 opacity-100 animate-spin pointer-events-none" style={{ animationDuration: '20s' }}>
            <CrabLogo className="w-48 h-48 md:w-80 md:h-80 text-brand-500/20" />
        </div>
        <h1 className="relative z-10 text-4xl md:text-6xl lg:text-8xl font-extrabold mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 tracking-tight leading-[1.1]" {...props}>
            <span className="text-white">{firstWord} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-600">{restText}</span>
        </h1>
      </div>
    )},
    h2: ({node, ...props}: any) => (
      <h2 className="text-3xl md:text-5xl font-bold mt-24 mb-8 text-white animate-in fade-in slide-in-from-left-8 duration-1000 delay-200 tracking-tight" {...props} />
    ),
    h3: ({node, ...props}: any) => (
      <h3 className="text-2xl font-semibold text-brand-400 mt-12 mb-4 animate-in fade-in zoom-in duration-1000 delay-300" {...props} />
    ),
    p: ({node, ...props}: any) => (
      <p className="text-lg md:text-2xl opacity-70 leading-relaxed mb-8 font-light animate-in fade-in duration-1000 delay-500 max-w-3xl" {...props} />
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--cms-font-heading)' }}>Latest Stories</h2>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (slug) {
        db.getPostBySlug(slug).then(p => {
            if (p?.type === 'page') setPage(p);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to load page", err);
            setError("Failed to load page.");
            setLoading(false);
        });
    }
  }, [slug]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-pulse text-xl opacity-50">Loading page...</div></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
  if (!page) return <div className="text-center py-20 opacity-50">Page not found.</div>;

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-600" style={{ fontFamily: 'var(--cms-font-heading)' }}>{page.title}</h1>
        <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown>
                {page.content}
            </ReactMarkdown>
        </div>
      </article>
  );
};

const BlogIndex = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    db.getPosts()
      .then(p => {
          setPosts(p.filter(x => x.status === 'published' && x.type === 'post'));
          setLoading(false);
      })
      .catch(err => {
          console.error("Failed to load blog posts", err);
          setError("Failed to load blog posts.");
          setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="space-y-20 animate-in fade-in duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'var(--cms-font-heading)' }}>
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-600">Crab Blog</span>
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
                <h2 className="text-2xl md:text-3xl font-bold group-hover:text-brand-400 transition-colors leading-tight" style={{ fontFamily: 'var(--cms-font-heading)' }}>{post.title}</h2>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
        db.getPostBySlug(slug)
          .then((p) => {
              setPost(p || null);
              setLoading(false);
          })
          .catch(err => {
              console.error("Failed to load blog post", err);
              setError("Failed to load article.");
              setLoading(false);
          });
    }
  }, [slug]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-xl opacity-50">Loading article...</div></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
  if (!post) return <div className="text-center py-20 opacity-50">Article not found.</div>;

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
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-600" style={{ fontFamily: 'var(--cms-font-heading)' }}>
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

/* --- Admin Components --- */

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      login();
      navigate('/admin');
  };

  if (isAuthenticated) return <Navigate to="/admin" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl relative">
        <div className="absolute top-6 left-6">
            <Link to="/" className="text-gray-400 hover:text-gray-600 flex items-center gap-2 text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 mt-8">Crab CMS Login</h1>
        <form onSubmit={handleLogin}>
            <input 
            type="password" 
            placeholder="Enter password (demo)" 
            className="w-full p-3 border rounded mb-4"
            value={pass}
            onChange={e => setPass(e.target.value)}
            />
            <button type="submit" className="w-full bg-brand-600 text-white p-3 rounded font-bold hover:bg-brand-500">
            Sign In
            </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">For demo, just click Sign In.</p>
      </div>
    </div>
  );
};

const ThemeRoute = () => {
    const [theme, setTheme] = useState<ThemeConfig | null>(null);
    useEffect(() => { db.getTheme().then(setTheme) }, []);
    if (!theme) return <div>Loading theme...</div>;
    return <ThemeEditor currentTheme={theme} onUpdate={(t) => {
        db.saveTheme(t);
        // Update live vars
        const root = document.documentElement;
        root.style.setProperty('--cms-bg', t.colors.background);
        root.style.setProperty('--cms-text', t.colors.text);
        root.style.setProperty('--cms-primary', t.colors.primary);
        root.style.setProperty('--cms-secondary', t.colors.secondary);
        root.style.setProperty('--cms-font-heading', t.fonts.heading);
        root.style.setProperty('--cms-font-body', t.fonts.body);
    }} />;
};

const EditorRoute = ({ type }: { type?: 'post' | 'page' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    return <PostEditor postId={id} defaultType={type || 'post'} onClose={() => navigate(-1)} onSave={() => navigate(-1)} />;
};

const PostsList = ({ type }: { type: 'post' | 'page' }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    
    const load = () => db.getPosts().then(p => setPosts(p.filter(x => x.type === type)));
    useEffect(() => { load() }, [type]);

    const handleDelete = async (id: string) => {
        if(confirm('Delete this item?')) {
            await db.deletePost(id);
            load();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold capitalize text-gray-900">{type}s</h2>
                <Link to={`/admin/${type === 'post' ? 'posts' : 'pages'}/new`} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                    <Plus size={18} /> New {type}
                </Link>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                        <th className="px-6 py-3 font-medium">Title</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {posts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50 group">
                            <td className="px-6 py-4">
                                <Link to={`/admin/edit/${post.id}`} className="font-medium text-gray-900 hover:text-brand-600">
                                    {post.title || '(Untitled)'}
                                </Link>
                                <div className="text-xs text-gray-400 mt-1">{post.slug}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {post.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/admin/edit/${post.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Edit3 size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {posts.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No {type}s found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <CrabLogo className="w-6 h-6 text-red-600 mr-2" />
           <span className="font-bold text-lg">Crab CMS</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
           <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition"><LayoutDashboard size={18}/> Dashboard</Link>
           <Link to="/admin/posts" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition"><FileText size={18}/> Posts</Link>
           <Link to="/admin/pages" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition"><Layers size={18}/> Pages</Link>
           <Link to="/admin/theme" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition"><Palette size={18}/> Theme</Link>
           <div className="pt-4 mt-4 border-t border-gray-100">
             <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-50 transition"><ExternalLink size={18}/> View Site</Link>
           </div>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition w-full text-left">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 relative">
        <div className="p-8 max-w-7xl mx-auto">
           <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/theme" element={<ThemeRoute />} />
              <Route path="/posts" element={<PostsList type="post" />} />
              <Route path="/pages" element={<PostsList type="page" />} />
              <Route path="/posts/new" element={<EditorRoute type="post" />} />
              <Route path="/pages/new" element={<EditorRoute type="page" />} />
              <Route path="/edit/:id" element={<EditorRoute />} />
           </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
    const [theme, setTheme] = useState<ThemeConfig>({
        id: 'default',
        name: 'Default',
        colors: { background: '#020617', text: '#f1f5f9', primary: '#f43f5e', secondary: '#64748b' },
        fonts: { heading: 'Inter', body: 'Inter' }
    });

    useEffect(() => {
        db.getTheme().then(t => {
            setTheme(t);
             const root = document.documentElement;
            root.style.setProperty('--cms-bg', t.colors.background);
            root.style.setProperty('--cms-text', t.colors.text);
            root.style.setProperty('--cms-primary', t.colors.primary);
            root.style.setProperty('--cms-secondary', t.colors.secondary);
            root.style.setProperty('--cms-font-heading', t.fonts.heading);
            root.style.setProperty('--cms-font-body', t.fonts.body);
        });
    }, []);

    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                         <Route path="/admin/*" element={
                            <PrivateRoute>
                                <AdminLayout />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={
                            <PublicLayout theme={theme}>
                                <Routes>
                                    <Route path="/" element={<HomeRoute />} />
                                    <Route path="/blog" element={<BlogIndex />} />
                                    <Route path="/post/:slug" element={<BlogPost />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/:slug" element={<PageRoute />} />
                                </Routes>
                            </PublicLayout>
                        } />
                    </Routes>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;