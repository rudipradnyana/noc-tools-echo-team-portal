import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, Sun, Moon, UserPlus, ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PortalRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, register, loginAsPreset } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState<PortalRole>('regular');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status indicators
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPendingNotice, setIsPendingNotice] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Silakan masukkan username.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsPendingNotice(false);
    setIsLoading(true);

    try {
      await login(username.trim(), password, rememberMe);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Gagal masuk. Silakan coba lagi.';
      if (msg.includes('MENUNGGU PERSETUJUAN') || msg.includes('ACC')) {
        setIsPendingNotice(true);
      }
      setErrorMsg(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsPendingNotice(false);

    if (!regUsername.trim()) {
      setErrorMsg('Username wajib diisi.');
      return;
    }
    if (!regFullName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!regPassword) {
      setErrorMsg('Password wajib diisi.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(
        regUsername.trim().toLowerCase(),
        regPassword,
        regFullName.trim(),
        regRole
      );
      setIsLoading(false);
      setSuccessMsg(res.message);
      // Auto switch back to login with prefilled username
      setUsername(regUsername.trim().toLowerCase());
      setPassword(regPassword);
      setRegUsername('');
      setRegFullName('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMsg(err instanceof Error ? err.message : 'Pendaftaran gagal.');
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-150 ${
      isDark ? 'bg-[#060a14] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Bar with Theme Toggle */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`text-xs font-medium tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            MySQL Database: <strong className="text-emerald-500">Connected (XAMPP)</strong>
          </span>
        </div>
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

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto px-4 py-6 my-auto">
        <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all ${
          isDark 
            ? 'bg-[#0c1322] border-[#1a253b] shadow-black/40' 
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1d4ed8] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
              <span className="text-white font-black text-2xl italic tracking-tighter select-none">
                N
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-1">
              NOC Tools & Echo Portal
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sistem Portal Operasional Terpadu & Manajemen Tool
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className={`grid grid-cols-2 p-1 rounded-xl mb-5 border text-xs font-medium ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? isDark
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-white text-blue-700 font-semibold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? isDark
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-white text-blue-700 font-semibold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Baru</span>
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-start gap-2 ${
              isPendingNotice
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}>
              {isPendingNotice ? (
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              )}
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                    placeholder="Masukkan username akun"
                    autoFocus
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                  />
                </div>
              </div>

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
                    <span>Masuk ke Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TAB 2: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    disabled={isLoading}
                    placeholder="Masukkan username"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Pilih Role / Jabatan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as PortalRole)}
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer ${
                    isDark
                      ? 'bg-[#080d19] border-slate-800 text-white focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-blue-600/20'
                  }`}
                >
                  <option value="regular">Regular (NOC Engineer Regular)</option>
                  <option value="analis">Analis (Data & Traffic Analyst)</option>
                  <option value="ea">EA (Enterprise Access Specialist)</option>
                  <option value="tdm">TDM (TDM Specialist)</option>
                  <option value="manager">Manager (NOC Operations Manager)</option>
                  <option value="mod">Manager On Duty</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Minimal 4 huruf"
                    className={`w-full px-3 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Konfirmasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Ulangi password"
                    className={`w-full px-3 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-blue-500 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showRegPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}</span>
                </button>
              </div>

              {/* Informational Notice */}
              <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                isDark ? 'bg-blue-500/5 border-blue-500/20 text-slate-300' : 'bg-blue-50 border-blue-200 text-slate-700'
              }`}>
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <div>
                  Setelah mendaftar, akun Anda berstatus <strong>Pending</strong> dan membutuhkan persetujuan (ACC) dari Admin di Dashboard Admin sebelum bisa login.
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  isLoading
                    ? 'bg-blue-700 opacity-80 cursor-wait'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Akun Sekarang</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className={`w-full px-6 py-4 text-center text-xs ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        &copy; {new Date().getFullYear()} NOC Tools & Echo Team Portal &bull; Terhubung ke MySQL XAMPP
      </footer>
    </div>
  );
};
