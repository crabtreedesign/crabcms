import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Palette, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  Search, 
  Save, 
  ArrowLeft,
  ExternalLink,
  Menu,
  X,
  User,
  MoreVertical,
  Trash2,
  Edit3,
  Eye,
  Home,
  Download,
  Github
} from 'lucide-react';

export const CrabLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12c0 5-4 9-9 9s-9-4-9-9" />
    <path d="M12 12c0-3 2.5-5 6-5 2.5 0 3 2 3 2" />
    <path d="M12 12c0-3-2.5-5-6-5-2.5 0-3 2-3 2" />
    <path d="M15.5 16.5c1-1 3.5-.5 3.5-.5" />
    <path d="M8.5 16.5c-1-1-3.5-.5-3.5-.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const Layers: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export { 
  LayoutDashboard, FileText, Settings, Palette, ImageIcon, LogOut, 
  Plus, Search, Save, ArrowLeft, ExternalLink, Menu, X, User,
  MoreVertical, Trash2, Edit3, Eye, Home, Download, Github
};