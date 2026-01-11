import React, { useState } from 'react';
import { BookOpen, RefreshCw, Mail, Bolt, Menu, X, ArrowRight } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [showQRRefresh, setShowQRRefresh] = useState(false);

  return (
    <div className="font-sans min-h-screen bg-background-light text-slate-900 relative selection:bg-primary/30">
        <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfgGh0OQ5sM5_fX_1Ii00mPeQn9viqeOu97sW32XttT6I6ikptmJWhBh48jjZiAKkD7wIRpkqdikAmEKc4iqjXnrULxKsNOFGJS4b7utwLTzP0WbYad3wigmSwN2dYQ1pZfxEgQJ9yH2sfZXeMp_yLELGba8gi80oSC4z0Fzv6SJkGXMKipz7z5UGE4nzh6BnuJcdtiCoOZ4ilKExFrYWbl_EPZ1Cqn60YIuiCVN-BDSnVx6DY0_Rp0B3QV5IkaYkoKTEcOx0kwa8F')] opacity-50 pointer-events-none"></div>
        
        {/* Header */}
        <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex h-20 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-9 bg-primary flex items-center justify-center rounded-lg text-white">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">AI Reader</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                       {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={onLogin} className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary/20">
                        开始阅读
                    </button>
                </div>
            </div>
        </header>

        <main className="pt-32 pb-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Hero Text */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            <Bolt size={14} />
                            AI 驱动阅读
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.2] tracking-tight text-slate-900">
                            智能赋能，<br />
                            <span className="text-primary">重塑</span>您的<br />
                            私人图书馆。
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
                            导入您的藏书，接收 AI 生成的每周总结，并在极简空间中轻松追踪您的认知成长。
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={onLogin} className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
                                立即注册
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                                了解详情
                            </button>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="lg:col-span-5">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
                            <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900">微信扫码登录</h3>
                                    <p className="text-slate-500 text-sm">使用微信扫描下方二维码安全登录</p>
                                </div>
                                
                                <div 
                                    className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 p-6 mb-8 relative cursor-pointer"
                                    onMouseEnter={() => setShowQRRefresh(true)}
                                    onMouseLeave={() => setShowQRRefresh(false)}
                                    onClick={onLogin}
                                >
                                    <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-4 shadow-inner">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbqf3mzvGB8gL2k7IcqG_t3p5AmMhlQHqM7_Axh_MEl5m5G1hKMy8Mzbg1_yfQ1ztQwoVI_2tAzwBg6ISO4dfgj-Vhrm1mzFNjiErrWpoEiG_UhrmoCqY_YGS5785xZzRsksUtJje5qLOiFwLoiWX1u06vQl1lIGxW24jMRu1g4YSdPovTXjjsUTEhZTz36Gbh0Bk_T-Rm7ROD8jXenSDi3bJoJlDczhiASvH2IdnHUFtcsHFITDuwG_9SF969SXUVEalR3US1fTx6" alt="WeChat Login QR" className="w-full h-full object-contain" />
                                    </div>
                                    
                                    {showQRRefresh && (
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center transition-opacity">
                                            <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg text-slate-900 border border-slate-200">
                                                <RefreshCw size={16} />
                                                点击模拟扫描
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-primary/50 transition-colors">
                                        <Mail size={20} className="text-primary" />
                                        <span className="text-sm font-medium text-slate-700">使用邮箱登录</span>
                                    </div>
                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">第一次使用 AI Reader?</span></div>
                                    </div>
                                    <button onClick={onLogin} className="w-full py-2 text-primary text-sm font-bold hover:underline">创建免费账号</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};
