import React, { useState, useEffect } from 'react';
import { Post } from '../../types';
import { db } from '../../services/storage';
import { Save, ArrowLeft, ImageIcon, Eye } from '../ui/Icons';
import ReactMarkdown from 'react-markdown';

interface PostEditorProps {
  postId?: string | null;
  defaultType: 'post' | 'page';
  onClose: () => void;
  onSave: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ postId, defaultType, onClose, onSave }) => {
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    type: defaultType,
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (postId) {
      setLoading(true);
      db.getPost(postId).then(data => {
        if (data) setPost(data);
        setLoading(false);
      });
    } else {
        setPost(p => ({ ...p, type: defaultType }));
    }
  }, [postId, defaultType]);

  const handleSave = async () => {
    if (!post.title) return alert('Title is required');
    
    setSaving(true);
    const slug = post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newPost: Post = {
      ...post as Post,
      id: post.id || crypto.randomUUID(),
      slug,
      type: post.type || defaultType,
      authorId: 'admin', // Mock
      updatedAt: new Date().toISOString(),
      createdAt: post.createdAt || new Date().toISOString(),
      excerpt: post.excerpt || post.content?.substring(0, 150) + '...' || '',
      tags: post.tags || []
    };

    await db.savePost(newPost);
    setSaving(false);
    onSave();
  };

  if (loading) return <div className="p-8 text-center">Loading editor...</div>;

  const isPage = defaultType === 'page';

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <span className="font-semibold text-gray-700">{postId ? `Edit ${isPage ? 'Page' : 'Post'}` : `New ${isPage ? 'Page' : 'Post'}`}</span>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition ${showPreview ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Eye size={16} />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={post.status}
            onChange={(e) => setPost({...post, status: e.target.value as any})}
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm text-sm font-medium"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Editor Pane */}
        <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${showPreview ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
          <div className="max-w-3xl mx-auto space-y-6">
            <input 
              type="text" 
              placeholder={`${isPage ? 'Page' : 'Post'} Title`}
              value={post.title}
              onChange={(e) => setPost({...post, title: e.target.value})}
              className="w-full text-4xl font-bold placeholder-gray-300 border-none focus:ring-0 p-0 text-gray-900"
            />
            
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="slug-url-opt"
                value={post.slug}
                onChange={(e) => setPost({...post, slug: e.target.value})}
                className="flex-1 text-sm font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded border border-transparent focus:border-red-200 focus:bg-white transition"
              />
              {!isPage && (
               <input 
                type="text" 
                placeholder="Comma, separated, tags"
                value={post.tags?.join(', ')}
                onChange={(e) => setPost({...post, tags: e.target.value.split(',').map(t => t.trim())})}
                className="flex-1 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded border border-transparent focus:border-red-200 focus:bg-white transition"
              />
              )}
            </div>

            <textarea 
              placeholder="Write your masterpiece in Markdown..." 
              value={post.content}
              onChange={(e) => setPost({...post, content: e.target.value})}
              className="w-full h-[60vh] resize-none border-none focus:ring-0 p-0 text-lg leading-relaxed text-gray-700 font-mono"
            />
          </div>
        </div>

        {/* Preview Pane */}
        {(showPreview || window.innerWidth > 768) && (
          <div className={`flex-1 overflow-y-auto bg-gray-50 border-l border-gray-200 p-8 ${!showPreview ? 'hidden' : 'block'}`}>
            <div className="max-w-3xl mx-auto prose prose-red prose-lg">
              <h1>{post.title || 'Untitled'}</h1>
              <ReactMarkdown>{post.content || '*Start writing...*'}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};