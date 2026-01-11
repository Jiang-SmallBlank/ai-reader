import React from 'react';
import { Edit, Share2, Clock, Book, Zap, Info, Quote, Award } from 'lucide-react';
import { USER_AVATAR } from '../constants';

export const Profile: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 p-8">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Header Card */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-6">
             <div className="relative">
                <div className="size-24 md:size-32 rounded-full border-4 border-primary/10 overflow-hidden">
                   <img src={USER_AVATAR} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 bg-primary text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                   <Award size={14} />
                </div>
             </div>
             <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold">陈默 Alex</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                   <span>ID: 88293410</span>
                   <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold uppercase tracking-wider">高级阅读者</span>
                </div>
                <p className="text-sm italic text-slate-400 mt-2">"阅读是思考的延伸，AI是阅读的翅膀。"</p>
             </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
                <Edit size={16} /> 编辑资料
             </button>
             <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Share2 size={18} />
             </button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {[
             { label: '累计阅读时长', value: '128', unit: '小时', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
             { label: '已读完书籍', value: '24', unit: '本', icon: Book, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: '当前连读', value: '15', unit: '天', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
           ].map((stat, i) => (
              <div key={i} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                 <div className={`size-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={24} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value} <span className="text-sm font-normal">{stat.unit}</span></p>
                 </div>
              </div>
           ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Heatmap & Quotes */}
           <div className="lg:col-span-2 space-y-8">
              <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">阅读足迹</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                       <span>2023 - 2024</span>
                       <Info size={14} />
                    </div>
                 </div>
                 {/* Mock Heatmap */}
                 <div className="flex gap-1 overflow-x-auto pb-2">
                    {Array.from({ length: 40 }).map((_, colIndex) => (
                       <div key={colIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }).map((_, rowIndex) => {
                             const rand = Math.random();
                             let opacity = 'opacity-10'; // default
                             if (rand > 0.8) opacity = 'opacity-100';
                             else if (rand > 0.6) opacity = 'opacity-60';
                             else if (rand > 0.4) opacity = 'opacity-30';
                             return (
                                <div key={rowIndex} className={`size-3 rounded-sm bg-primary ${opacity}`}></div>
                             );
                          })}
                       </div>
                    ))}
                 </div>
              </section>

              <section>
                 <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Quote size={20} className="text-primary"/> 收藏金句</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-800 relative group">
                       <p className="text-base font-medium leading-relaxed mb-4 relative z-10">“一个人并不是生来要给打败的，你尽可以把他消灭掉，可就是打不败他。”</p>
                       <div className="flex items-center gap-3">
                          <div className="size-8 bg-slate-200 rounded"></div>
                          <div><p className="text-xs font-bold">《老人与海》</p><p className="text-[10px] text-slate-500">海明威</p></div>
                       </div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-800 relative group">
                       <p className="text-base font-medium leading-relaxed mb-4 relative z-10">“弱小和无知不是生存的障碍，傲慢才是。”</p>
                       <div className="flex items-center gap-3">
                          <div className="size-8 bg-slate-200 rounded"></div>
                          <div><p className="text-xs font-bold">《三体》</p><p className="text-[10px] text-slate-500">刘慈欣</p></div>
                       </div>
                    </div>
                 </div>
              </section>
           </div>
           
           {/* Badges Right Col */}
           <div className="space-y-8">
              <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">成就勋章</h3>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">12/36</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    {[
                      {name: '早起鸟', color: 'text-primary', bg: 'bg-primary/10'},
                      {name: '深度思考', color: 'text-emerald-500', bg: 'bg-emerald-500/10'},
                      {name: '博览群书', color: 'text-orange-500', bg: 'bg-orange-500/10'},
                    ].map((badge, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                         <div className={`size-16 rounded-full ${badge.bg} flex items-center justify-center border-2 border-transparent hover:border-current ${badge.color} transition-colors`}>
                            <Award size={28} />
                         </div>
                         <span className="text-[10px] font-bold text-center">{badge.name}</span>
                      </div>
                    ))}
                 </div>
              </section>
              
              <section className="p-6 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                 <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2"><Zap size={16}/> AI 阅读画像</h4>
                 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">基于你的阅读历史，你是一位**科幻与哲学**爱好者。你倾向于在深夜进行深度阅读。</p>
                 <div className="mt-4 flex gap-2 relative z-10">
                    <span className="px-2 py-1 bg-white/50 dark:bg-slate-800/50 rounded text-[10px] font-medium border border-primary/10">逻辑思维强</span>
                    <span className="px-2 py-1 bg-white/50 dark:bg-slate-800/50 rounded text-[10px] font-medium border border-primary/10">深夜读者</span>
                 </div>
              </section>
           </div>
        </div>

      </div>
    </div>
  );
};
