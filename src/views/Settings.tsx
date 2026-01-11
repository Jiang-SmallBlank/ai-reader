import React from 'react';
import { User, Bell, Moon, Lock, HelpCircle, ChevronRight, LogOut, Smartphone } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme, onLogout }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-y-auto">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold">设置</h1>
      </header>

      <main className="flex-1 p-8 max-w-3xl mx-auto w-full space-y-8">
        {/* Account Section */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">账号</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             {/* Profile Item */}
             <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <User size={20} />
                   </div>
                   <div>
                      <p className="font-medium">个人资料</p>
                      <p className="text-xs text-slate-500">Alex Rivers</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
             </div>
             {/* Security */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <Lock size={20} />
                   </div>
                   <div>
                      <p className="font-medium">账号安全</p>
                      <p className="text-xs text-slate-500">密码与验证</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
             </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">偏好设置</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             {/* Appearance */}
             <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Moon size={20} />
                   </div>
                   <div>
                      <p className="font-medium">深色模式</p>
                      <p className="text-xs text-slate-500">调整应用外观</p>
                   </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-slate-300'}`}
                >
                   <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>
             {/* Notifications */}
             <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Bell size={20} />
                   </div>
                   <div>
                      <p className="font-medium">通知推送</p>
                      <p className="text-xs text-slate-500">管理每周总结提醒</p>
                   </div>
                </div>
                <button className="w-12 h-6 rounded-full relative transition-colors bg-primary">
                   <div className="absolute top-1 size-4 bg-white rounded-full transition-all left-7"></div>
                </button>
             </div>
          </div>
        </section>

        {/* More */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">更多</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <HelpCircle size={20} />
                   </div>
                   <div>
                      <p className="font-medium">帮助与支持</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
             </div>
             <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <Smartphone size={20} />
                   </div>
                   <div>
                      <p className="font-medium">关于 AI Reader</p>
                      <p className="text-xs text-slate-500">v1.2.0 (Beta)</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
             </div>
          </div>
        </section>
        
        <button 
           onClick={onLogout}
           className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
        >
           <LogOut size={20} />
           退出登录
        </button>

      </main>
    </div>
  );
};