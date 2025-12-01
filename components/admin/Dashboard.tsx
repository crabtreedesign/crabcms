import React, { useEffect, useState } from 'react';
import { db } from '../../services/storage';
import { Post } from '../../types';
import { FileText, Eye, User, MoreVertical, Layers } from '../ui/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ posts: 0, pages: 0, views: 1240, users: 3 });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const allContent = await db.getPosts();
      const posts = allContent.filter(p => p.type === 'post');
      const pages = allContent.filter(p => p.type === 'page');
      
      setStats(prev => ({ ...prev, posts: posts.length, pages: pages.length }));
      setRecentPosts(posts.slice(0, 5));
      
      // Mock chart data
      setData([
        { name: 'Mon', views: 400 },
        { name: 'Tue', views: 300 },
        { name: 'Wed', views: 550 },
        { name: 'Thu', views: 450 },
        { name: 'Fri', views: 600 },
        { name: 'Sat', views: 800 },
        { name: 'Sun', views: 700 },
      ]);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your CMS performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Posts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.posts}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pages</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pages}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Views</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.views}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Eye size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.users}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <User size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Traffic Overview</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="views" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-start justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="text-gray-400 group-hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
            {recentPosts.length === 0 && <p className="text-sm text-gray-500">No posts yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};