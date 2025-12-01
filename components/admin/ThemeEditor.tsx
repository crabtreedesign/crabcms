import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../types';
import { db } from '../../services/storage';
import { Save, Palette } from '../ui/Icons';

interface ThemeEditorProps {
  currentTheme: ThemeConfig;
  onUpdate: (theme: ThemeConfig) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ currentTheme, onUpdate }) => {
  const [theme, setTheme] = useState<ThemeConfig>(currentTheme);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    const newTheme = {
      ...theme,
      colors: { ...theme.colors, [key]: value }
    };
    setTheme(newTheme);
    // Live preview
    const root = document.documentElement;
    if (key === 'background') root.style.setProperty('--cms-bg', value);
    if (key === 'text') root.style.setProperty('--cms-text', value);
    if (key === 'primary') root.style.setProperty('--cms-primary', value);
    if (key === 'secondary') root.style.setProperty('--cms-secondary', value);
  };

  const saveTheme = async () => {
    setSaving(true);
    await db.saveTheme(theme);
    onUpdate(theme);
    setSaving(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Palette size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Theme Editor</h2>
            <p className="text-sm text-gray-500">Customize the look and feel of your site</p>
          </div>
        </div>
        <button 
          onClick={saveTheme}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Theme'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="font-semibold text-gray-700 pb-2 border-b">Colors</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-500">{theme.colors.background}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-500">{theme.colors.text}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Brand</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-500">{theme.colors.primary}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Accent</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={theme.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-500">{theme.colors.secondary}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-gray-700 pb-2 border-b">Typography</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
              <select 
                value={theme.fonts.heading}
                onChange={(e) => setTheme({ ...theme, fonts: { ...theme.fonts, heading: e.target.value }})}
                className="w-full border-gray-300 border rounded-lg p-2.5 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              >
                <option value="Inter">Inter</option>
                <option value="Merriweather">Merriweather</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
              <select 
                value={theme.fonts.body}
                onChange={(e) => setTheme({ ...theme, fonts: { ...theme.fonts, body: e.target.value }})}
                className="w-full border-gray-300 border rounded-lg p-2.5 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              >
                <option value="Inter">Inter</option>
                <option value="Merriweather">Merriweather</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Live Preview Snippet</h4>
            <div 
              style={{ 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <h4 style={{ fontFamily: theme.fonts.heading, color: theme.colors.primary, fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Hello World
              </h4>
              <p className="text-sm opacity-90">
                This is how your content will look. <span style={{ color: theme.colors.secondary }}>Secondary colors look like this.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
