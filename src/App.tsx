import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Landing } from './views/Landing';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Reader } from './views/Reader';
import { Report } from './views/Report';
import { Profile } from './views/Profile';
import { Settings } from './views/Settings';
import { ViewState, Book } from './types';
import { LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load theme from user preferences
  useEffect(() => {
    if (user?.preferences?.darkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [user]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    console.log('🎉 handleLoginSuccess called!');
    setShowLoginModal(false);
    // 不在这里设置 currentView，让 useEffect 来处理
  };

  // 当用户认证状态改变时，自动跳转到 dashboard
  useEffect(() => {
    if (isAuthenticated && currentView === 'landing') {
      console.log('🔄 User authenticated, redirecting to dashboard');
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    setCurrentView('landing');
    setSelectedBook(null);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reader');
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  // View Routing Logic
  const renderView = () => {
    if (!isAuthenticated) {
      return <Landing onLogin={handleShowLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }

    switch (currentView) {
      case 'reader':
        return selectedBook ? (
          <Reader
            book={selectedBook}
            onBack={() => {
              setSelectedBook(null);
              setCurrentView('dashboard');
            }}
          />
        ) : <Dashboard onSelectBook={handleBookSelect} onViewReport={() => setCurrentView('report')} />;
      case 'report':
        return <Report />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} onLogout={() => setShowLogoutModal(true)} />;
      case 'dashboard':
      default:
        return <Dashboard onSelectBook={handleBookSelect} onViewReport={() => setCurrentView('report')} />;
    }
  };

  // Reader view has its own layout logic (fullscreen), others share the sidebar
  if (currentView === 'reader' && isAuthenticated) {
    return (
       <div className={isDarkMode ? 'dark' : ''}>
         {renderView()}
       </div>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {isAuthenticated && (
        <Sidebar
          currentView={currentView}
          onChangeView={setCurrentView}
          onLogout={() => setShowLogoutModal(true)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
        {renderView()}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
              <Login onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} />
            </div>
          </div>
        )}

        {/* Logout Modal Overlay */}
        {showLogoutModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-slate-800 text-white w-full max-w-md rounded-xl p-8 text-center shadow-2xl border border-white/10">
                 <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 mx-auto">
                    <LogOut className="text-red-500" size={32} />
                 </div>
                 <h2 className="text-2xl font-bold mb-3">退出登录</h2>
                 <p className="text-slate-400 mb-8 leading-relaxed">
                    您确定要退出登录吗？退出后，您的阅读进度、AI 周报和阅读偏好将安全地保存到云端。
                 </p>
                 <div className="flex gap-3">
                    <button
                       onClick={() => setShowLogoutModal(false)}
                       className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-bold transition-colors"
                    >
                       取消
                    </button>
                    <button
                       onClick={handleLogout}
                       className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary-dark font-bold transition-colors"
                    >
                       确认退出
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;