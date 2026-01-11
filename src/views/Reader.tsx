import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Settings, Moon, Type, Activity, Bookmark, Edit, Sparkles, Share2, Languages, FileText } from 'lucide-react';
import { Book } from '../types';
import { USER_AVATAR, READER_CONTENT_BODY, READER_CONTENT_TITLE } from '../constants';
import { PDFViewer } from '../components/PDFViewer';

interface ReaderProps {
  book: Book;
  onBack: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ book, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usePDFViewer, setUsePDFViewer] = useState(false);

  // Check if book has an uploaded file
  useEffect(() => {
    if (book.file_url) {
      setUsePDFViewer(true);
      console.log('📖 Using PDF viewer for:', book.title);
    } else {
      setUsePDFViewer(false);
      console.log('📖 Using mock content for:', book.title);
    }
  }, [book]);

  // Get full file URL
  const getFileUrl = () => {
    if (!book.file_url) return '';

    // If it's already a full URL, return it
    if (book.file_url.startsWith('http')) {
      return book.file_url;
    }

    // Get backend base URL without /api
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const BASE_URL = API_BASE_URL.replace('/api', '');

    return `${BASE_URL}${book.file_url}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper text-slate-900 font-sans transition-colors duration-300">
      {/* Reader Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-3">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">
              {usePDFViewer ? 'PDF 阅读' : '深度阅读'}
            </h2>
          </div>
        </div>

        {/* Progress */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
              <span>{book.title} {usePDFViewer ? `- 第 ${currentPage} 页` : '- 第 4 章'}</span>
              <span>进度 {book.progress || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${book.progress || 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Type size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Settings size={18} />
            </button>
            <button className="p-2 rounded-lg bg-slate-100 text-primary transition-colors" title="明亮模式">
               <Moon size={18} />
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-primary/20" style={{ backgroundImage: `url('${USER_AVATAR}')` }}></div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {usePDFViewer ? (
          // PDF Viewer
          <div className="flex-1">
            <PDFViewer
              fileUrl={getFileUrl()}
              title={book.title}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        ) : (
          // Mock Text Content
          <>
            <div className="flex-1 overflow-y-auto scroll-smooth bg-[#f4ecd8]">
              <div className="max-w-[720px] mx-auto px-8 md:px-12 py-20 font-serif">
                <h1 className="text-[#433422] tracking-tight text-4xl font-bold leading-[1.2] pb-10 pt-6">{READER_CONTENT_TITLE}</h1>
                <div className="space-y-8 text-[#433422] text-lg leading-[1.9] font-normal whitespace-pre-wrap">
                  <p>{READER_CONTENT_BODY}</p>
                  <p className="bg-[#e8dec0] border-l-4 border-primary/60 p-8 rounded-r-lg italic shadow-sm my-8">
                    "学习的每一个方面或智能的任何其他特征，原则上都可以被精确地描述，从而可以制造出一台机器来模拟它。" —— 《达特茅斯提案》
                  </p>
                  <p>在 20 世纪 80 年代，专家系统成为主导范式。这些程序通过遵循一套庞大的"如果-那么"规则来模仿人类专家的决策能力。虽然在特定的工业应用中取得了成功，但它们缺乏处理现实世界杂乱、非结构化数据的灵活性。</p>
                </div>

                <div className="mt-24 border-t border-[#433422]/10 pt-12 flex justify-between items-center opacity-70">
                  <span className="text-sm font-medium">第 4 章 结束</span>
                  <button className="flex items-center gap-2 text-primary font-bold hover:translate-x-1 transition-transform">
                    下一章 <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-slate-200 bg-[#f8f9fa] hidden lg:flex flex-col">
          <div className="flex flex-col h-full p-6">
            <div className="mb-8">
              <h2 className="text-slate-800 text-lg font-bold flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                阅读活动
              </h2>
              <p className="text-slate-500 text-sm mt-1">里程碑与记录点</p>
            </div>

            <div className="flex-1 flex flex-col gap-6 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-300"></div>

              <div className="flex gap-4 relative z-10">
                <div className="size-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-[#f8f9fa]">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 leading-none">深度专注时段</p>
                  <p className="text-xs text-primary font-bold mt-1.5 uppercase tracking-wide">持续 24 分钟</p>
                  <p className="text-xs text-slate-600 mt-2.5 italic bg-white p-2 rounded-md leading-relaxed border border-slate-200 shadow-sm">
                    您在"神经网络"部分花费了大量时间。
                  </p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="size-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center ring-4 ring-[#f8f9fa]">
                  <Bookmark size={14} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 leading-none">标记关键见解</p>
                  <p className="text-xs text-slate-500 mt-1">今天 10:42 AM</p>
                  <div className="mt-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-sm">
                    "达特茅斯提案"
                  </div>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="size-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center ring-4 ring-[#f8f9fa]">
                   <Edit size={14} className="text-slate-500" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-semibold text-slate-800 leading-none">已添加笔记</p>
                   <p className="text-xs text-slate-500 mt-1">昨天</p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-6 border-t border-slate-200">
               <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1 uppercase tracking-wider">
                  <span>本周进度</span>
                  <span className="text-slate-700">总计 12h 40m</span>
               </div>
               <button className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                  <Activity size={18} />
                  <span>查看所有洞察</span>
               </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 flex items-end justify-end group">
          <div className="mr-4 mb-2 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
             <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-100 text-sm font-bold text-slate-700 whitespace-nowrap">
                总结本章内容？
            </div>
          </div>
          <button className="size-14 rounded-full bg-white text-primary shadow-xl border border-slate-100 flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all">
             <Sparkles size={28} />
          </button>
      </div>

      {/* Context Menu Mockup (Hidden primarily) */}
      <div className="hidden absolute top-1/2 left-1/2 bg-white border border-slate-200 p-2 rounded-xl shadow-2xl flex gap-1 z-[60]">
         <button className="p-2.5 hover:bg-slate-50 rounded-lg text-primary" title="总结"><FileText size={18}/></button>
         <button className="p-2.5 hover:bg-slate-50 rounded-lg text-primary" title="翻译"><Languages size={18}/></button>
         <button className="p-2.5 hover:bg-slate-50 rounded-lg text-primary" title="分享"><Share2 size={18}/></button>
      </div>

    </div>
  );
};
