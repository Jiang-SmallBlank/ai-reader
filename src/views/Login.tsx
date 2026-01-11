import React, { useState } from 'react';
import { Mail, X, RefreshCw, BookOpen, User } from 'lucide-react';
import { authApi } from '../api';

interface LoginProps {
  onLoginSuccess: () => void;
  isDarkMode: boolean;
}

type LoginMode = 'login' | 'register';

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, isDarkMode }) => {
  const [mode, setMode] = useState<LoginMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await authApi.login(email, password);
      } else {
        await authApi.register(email, password, username || undefined);
      }
      onLoginSuccess();
    } catch (error: any) {
      setError(error.message || (mode === 'login' ? '登录失败，请检查邮箱和密码' : '注册失败，请重试'));
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 100);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="relative">
      {/* Close button for mobile */}
      <button
        onClick={onLoginSuccess}
        className="absolute -top-12 right-0 p-2 text-slate-500 hover:text-slate-700 lg:hidden"
      >
        <X size={24} />
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          {mode === 'login' ? '欢迎回来' : '创建账号'}
        </h2>
        <p className="text-slate-500 text-sm">
          {mode === 'login' ? '登录以继续您的阅读之旅' : '加入 AI Reader，开启智能阅读'}
        </p>
      </div>

      {/* Login/Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="如何称呼您？"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            邮箱
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            required
            minLength={6}
          />
          {mode === 'register' && (
            <p className="text-xs text-slate-500 mt-1">至少 6 个字符</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              {mode === 'login' ? '登录中...' : '注册中...'}
            </>
          ) : (
            mode === 'login' ? '登录' : '注册'
          )}
        </button>

        {/* Demo Account */}
        {mode === 'login' && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400">或</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              使用演示账号登录
            </button>

            <p className="text-xs text-center text-slate-500">
              演示账号：demo@example.com / demo123
            </p>
          </>
        )}
      </form>

      {/* Toggle Mode */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          {mode === 'login' ? '还没有账号？' : '已有账号？'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary font-semibold hover:underline"
          >
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>
    </div>
  );
};
