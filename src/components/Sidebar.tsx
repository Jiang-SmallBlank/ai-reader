import React from 'react';
import { LayoutGrid, Library, BarChart2, Bookmark, Settings, LogOut, Sun, Moon, BookOpen } from 'lucide-react';
import { ViewState } from '../types';
import { USER_AVATAR } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, isDarkMode, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: '我的书库', icon: LayoutGrid },
    { id: 'report', label: '阅读报告', icon: BarChart2 },
    { id: 'bookmarks', label: '书签', icon: Bookmark },
    { id: 'summary', label: '每周 AI 总结', icon: Library },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-sidebar-light dark:bg-background-dark flex flex-col h-full transition-colors">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => onChangeView('dashboard')}>
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <BookOpen size={24} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight tracking-tight">AI Reader</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">个人数字书库</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id === 'summary' || item.id === 'bookmarks' ? 'dashboard' : item.id as ViewState)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? "fill-current" : ""} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm font-medium">外观模式</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 size-3 bg-white rounded-full transition-all ${isDarkMode ? 'left-4' : 'left-0.5'}`}></div>
            </div>
          </button>

          <button 
             onClick={() => onChangeView('settings')}
             className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'settings' 
                  ? 'bg-slate-200/50 dark:bg-slate-800 text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
          >
            <Settings size={20} />
            <span className="text-sm font-medium">设置</span>
          </button>
          
           <button 
             onClick={onLogout}
             className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">退出登录</span>
          </button>

          <div 
            onClick={() => onChangeView('profile')}
            className="flex items-center gap-3 px-3 py-4 mt-2 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-transparent cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div 
              className="size-8 rounded-full bg-cover bg-center" 
              style={{ backgroundImage: `url('${USER_AVATAR}')` }}
            ></div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold truncate">Alex Rivers</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">专业版方案</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
