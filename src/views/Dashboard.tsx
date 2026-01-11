import React, { useRef, useState, useEffect } from 'react';
import { Search, Upload, Bell, Play, FileText, Plus, CheckCircle, TrendingUp, Grid, List, RefreshCw, Trash2 } from 'lucide-react';
import { Book } from '../types';
import { BOOKS } from '../constants';
import { booksApi } from '../api';

interface DashboardProps {
  onSelectBook: (book: Book) => void;
  onViewReport: () => void;
}

type ViewMode = 'grid' | 'list';

export const Dashboard: React.FC<DashboardProps> = ({ onSelectBook, onViewReport }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await booksApi.getBooks();
      console.log('📚 Fetched books:', response);

      // If backend returns books, use them; otherwise fall back to mock data
      if (response.books && response.books.length > 0) {
        setBooks(response.books);
      } else {
        // Use mock data for demo
        setBooks(BOOKS);
      }
    } catch (error) {
      console.error('❌ Failed to fetch books:', error);
      // Fall back to mock data on error
      setBooks(BOOKS);
    } finally {
      setIsLoading(false);
    }
  };

  const recentBook = books.length > 0 ? books[0] : BOOKS[0];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        console.log('📤 Uploading file:', file.name);
        const result = await booksApi.uploadBook(file);
        console.log('✅ Upload successful:', result);
        alert(`书籍导入成功！\n\n《${result.book.title}》\n作者：${result.book.author}\n页数：${result.book.total_pages || '未知'}`);

        // Refresh books list after upload
        await fetchBooks();
      } catch (error: any) {
        console.error('❌ Upload failed:', error);
        alert(`导入失败：${error.message || '未知错误'}`);
      } finally {
        setIsUploading(false);
        // Reset input value to allow selecting the same file again if needed
        if (event.target) {
          event.target.value = '';
        }
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the book

    if (!confirm(`确定要删除《${bookTitle}》吗？\n\n此操作将：\n• 删除书籍记录\n• 删除上传的 PDF 文件\n• 删除相关的阅读进度、书签和笔记\n\n此操作无法撤销！`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting book:', bookId);
      await booksApi.deleteBook(bookId);
      console.log('✅ Book deleted successfully');

      // Refresh books list
      await fetchBooks();
    } catch (error: any) {
      console.error('❌ Delete failed:', error);
      alert(`删除失败：${error.message || '未知错误'}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500" 
              placeholder="搜索书库..." 
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.epub,.mobi,.txt" 
            onChange={handleFileChange}
          />
          <button
            onClick={handleImportClick}
            disabled={isUploading}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>上传中...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>导入新书</span>
              </>
            )}
          </button>
          <button className="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {/* Recent Reading Section */}
        {books.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">最近阅读</h2>
              <button className="text-primary text-xs font-bold hover:underline">查看阅读历史</button>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-stretch">
              <div
                className="w-40 aspect-[3/4] bg-cover bg-center rounded-lg shadow-xl shrink-0 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundImage: `url('${recentBook.cover_url || recentBook.coverUrl}')` }}
                onClick={() => onSelectBook(recentBook)}
              ></div>
              <div className="flex flex-col justify-between flex-1 py-2 text-center md:text-left">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2 justify-center md:justify-start">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">阅读中</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                       ✨ AI 总结已就绪
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{recentBook.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{recentBook.author} • {recentBook.lastRead || '最近'}阅读</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl">
                    {recentBook.description || "开始您的阅读之旅，追踪进度并获取 AI 洞察。"}
                  </p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => onSelectBook(recentBook)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/25 hover:translate-y-[-1px] active:translate-y-0 transition-all w-full sm:w-auto justify-center"
                  >
                    <Play size={18} fill="currentColor" />
                    <span>继续阅读</span>
                  </button>
                  <button
                    onClick={onViewReport}
                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all w-full sm:w-auto justify-center"
                  >
                    <FileText size={18} />
                    <span>每周 AI 回顾</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* My Books Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">我的书籍</h2>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-transparent">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md shadow-sm transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white' : 'text-slate-400 hover:text-primary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white' : 'text-slate-400 hover:text-primary'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {books.map((book) => (
                <div key={book.id} className="group relative cursor-pointer bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div
                    onClick={() => onSelectBook(book)}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 shadow-sm group-hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${book.cover_url || book.coverUrl}')` }}
                    ></div>
                    {book.isFinished && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={12} /> 已读完
                        </span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-sm truncate">{book.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">{book.author}</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${book.isFinished ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${book.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className={`text-[10px] font-bold text-right uppercase tracking-wider ${book.isFinished ? 'text-green-500' : 'text-slate-400'}`}>
                    {book.isFinished ? '已完成' : `${book.progress || 0}% 已完成`}
                  </p>

                  {/* Delete button - only show for uploaded books */}
                  {book.file_url && (
                    <button
                      onClick={(e) => handleDeleteBook(book.id, book.title, e)}
                      className="absolute top-1 right-1 size-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 shadow-lg"
                      title="删除书籍"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Book Card - also triggers file input */}
              <button
                onClick={handleImportClick}
                disabled={isUploading}
                className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl aspect-[3/4] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-white dark:hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  {isUploading ? <RefreshCw size={24} className="animate-spin" /> : <Plus size={24} />}
                </div>
                <div className="text-center px-4">
                  <p className="text-xs font-bold uppercase tracking-wider">{isUploading ? '上传中...' : '导入新书'}</p>
                  <p className="text-[10px]">支持 PDF 或 EPUB</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="group relative cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div
                    onClick={() => onSelectBook(book)}
                    className="w-16 aspect-[3/4] rounded-lg overflow-hidden shadow-sm bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url('${book.cover_url || book.coverUrl}')` }}
                  ></div>
                  <div
                    onClick={() => onSelectBook(book)}
                    className="flex-1 min-w-0"
                  >
                    <h4 className="font-bold text-base truncate">{book.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{book.author}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs">
                      <div
                        className={`h-full rounded-full ${book.isFinished ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${book.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${book.isFinished ? 'text-green-500' : 'text-slate-400'}`}>
                      {book.isFinished ? '已完成' : `${book.progress || 0}% 已完成`}
                    </span>
                    {book.isFinished && (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> 已读完
                      </span>
                    )}
                  </div>

                  {/* Delete button - only show for uploaded books */}
                  {book.file_url && (
                    <button
                      onClick={(e) => handleDeleteBook(book.id, book.title, e)}
                      className="ml-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 shadow-sm"
                      title="删除书籍"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Insight Stats Summary */}
        <section className="mt-12 mb-8">
            <div className="bg-white dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-primary" size={24} />
                    <h3 className="text-lg font-bold">阅读洞察</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">阅读目标</span>
                        <span className="text-2xl font-bold">12 / 24 本书</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: '50%' }}></div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">月度阅读页数</span>
                        <span className="text-2xl font-bold">842 页</span>
                        <span className="text-xs text-green-600 dark:text-green-500 font-bold mt-1 flex items-center gap-1">
                             较上月增长 14%
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">专注时长</span>
                        <span className="text-2xl font-bold">18h 45m</span>
                        <span className="text-xs text-slate-400 mt-1">AI 监测到高效专注</span>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};