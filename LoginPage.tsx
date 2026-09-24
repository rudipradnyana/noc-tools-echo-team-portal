import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [username, setUsername] = useState('rudipradnyana');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Silakan masukkan username.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(username.trim(), password, rememberMe);
    } catch {
      setErrorMsg('Gagal masuk. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-150 ${
      isDark ? 'bg-[#060a14] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Bar with Theme Toggle */}
      <header className="w-full px-6 py-4 flex items-center justify-end">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all cursor-pointer border shadow-2xs ${
            isDark
              ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border-amber-500/20'
              : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
          }`}
          title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto px-4 py-8 my-auto">
        <div className={`rounded-2xl border p-7 sm:p-8 backdrop-blur-md shadow-xl transition-all ${
          isDark 
            ? 'bg-[#0c1322] border-[#1a253b] shadow-black/40' 
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1d4ed8] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
              <span className="text-white font-black text-2xl italic tracking-tighter select-none">
                N
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-1">
              NOC Tools & Echo Portal
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Masuk untuk melanjutkan ke portal operasional
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  placeholder="Masukkan username"
                  autoFocus
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Masukkan kata sandi"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Ingat saya
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isLoading
                  ? 'bg-blue-700 opacity-80 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-600/20'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className={`w-full px-6 py-4 text-center text-xs ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        &copy; {new Date().getFullYear()} NOC Tools & Echo Team Portal
      </footer>
    </div>
  );
};
