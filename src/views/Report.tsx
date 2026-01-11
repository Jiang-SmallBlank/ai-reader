import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Calendar, ArrowUp, Zap, BookOpen, PenTool, Lightbulb, Quote, Share2, Copy } from 'lucide-react';
import { WEEKLY_STATS, INSIGHTS, USER_AVATAR } from '../constants';

export const Report: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fcfcfd] text-slate-900">
      <main className="flex-1 overflow-y-auto max-w-[1100px] mx-auto w-full px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-slate-400 text-sm font-medium">所有报告</span>
          <span className="text-slate-400 text-sm font-medium">/</span>
          <span className="text-primary text-sm font-medium">每周洞察</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">每周阅读报告</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={18} className="text-primary" />
              <p className="text-base font-normal">10月23日 - 10月29日 • 专注于斯多葛哲学与效率提升</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
            <Download size={18} />
            <span>下载 PDF</span>
          </button>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col gap-3 rounded-xl p-6 border border-slate-100 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-center">
               <p className="text-slate-500 text-sm font-medium">阅读总页数</p>
               <div className="p-1.5 bg-blue-50 rounded-lg text-primary"><BookOpen size={20} /></div>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-black">412</p>
               <p className="text-emerald-500 text-sm font-bold flex items-center"><ArrowUp size={12} />12%</p>
             </div>
             <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden"><div className="bg-primary h-1 rounded-full w-[75%]"></div></div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-6 border border-slate-100 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-center">
               <p className="text-slate-500 text-sm font-medium">新增词汇</p>
               <div className="p-1.5 bg-blue-50 rounded-lg text-primary"><PenTool size={20} /></div>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-black">28 个</p>
               <p className="text-emerald-500 text-sm font-bold flex items-center"><ArrowUp size={12} />5%</p>
             </div>
             <div className="flex gap-1 mt-2 flex-wrap">
               {['Ataraxia', 'Prohairesis', 'Eudaimonia'].map(tag => (
                 <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-primary border border-blue-100 font-medium">{tag}</span>
               ))}
             </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-6 border border-slate-100 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-center">
               <p className="text-slate-500 text-sm font-medium">阅读连胜</p>
               <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><Zap size={20} /></div>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-black">3 周</p>
               <p className="text-slate-400 text-sm font-medium">保持中</p>
             </div>
             <div className="flex gap-1 mt-2">
               {[1,1,1,0,0].map((v, i) => (
                  <div key={i} className={`size-2 rounded-full ${v ? 'bg-primary' : 'bg-slate-200'}`}></div>
               ))}
             </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-12 rounded-xl border border-slate-100 bg-white p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 rounded-lg"><BarChart size={20} className="text-primary"/></div>
                 <h2 className="text-xl font-bold">阅读速率</h2>
              </div>
           </div>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={WEEKLY_STATS}>
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="minutes" fill="#D0BB95" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* AI Insights */}
        <div className="flex items-center gap-3 px-4 pb-6 pt-5">
           <div className="flex items-center justify-center p-2 bg-amber-50 rounded-lg text-amber-500"><Lightbulb size={24} /></div>
           <h2 className="text-2xl font-black">AI 洞察与总结</h2>
        </div>

        <div className="space-y-6">
           {INSIGHTS.map((insight) => (
              <div key={insight.id} className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                 <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen size={24}/>
                       </div>
                       <div>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">{insight.type}</span>
                          <h3 className="text-lg font-bold">{insight.bookTitle}</h3>
                          {insight.subText && <p className="text-slate-500 text-xs italic">{insight.subText}</p>}
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50/30">
                    <div className="space-y-4">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          {insight.type === 'quote' ? <Quote size={14}/> : <Lightbulb size={14}/>} 
                          {insight.type === 'quote' ? '金句摘录' : '核心概念'}
                       </h4>
                       <p className={`text-slate-700 text-base leading-relaxed ${insight.type === 'quote' ? 'italic border-l-4 border-primary/40 pl-4 py-1' : ''}`}>
                          {insight.content}
                       </p>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Share CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/10">
           <div className="space-y-2 text-center md:text-left">
              <p className="text-2xl font-black">准备好分享你的进步了吗？</p>
              <p className="text-white/90 text-sm font-medium">你的阅读连胜和洞察可以激励你的社区成员。</p>
           </div>
           <div className="flex gap-3">
              <button className="bg-white text-blue-600 px-8 h-12 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                 <Share2 size={18} /> 分享至社区
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 h-12 rounded-xl font-bold hover:bg-white/20 transition-colors">
                 <Copy size={18} />
              </button>
           </div>
        </div>
      </main>
    </div>
  );
};
