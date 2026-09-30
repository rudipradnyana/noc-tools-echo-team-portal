import React from 'react';
import { ShieldCheck, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-150 ${
        isDark ? 'bg-[#060a14] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <header
        className={`w-full px-6 py-4 flex items-center justify-between border-b ${
          isDark ? 'bg-[#0b101c]/80 border-[#1a253b]' : 'bg-white/80 border-slate-200'
        } backdrop-blur-md sticky top-0 z-30`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl italic select-none">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight">NOC Central Portal</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-wider">
                Admin Area
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Management & Oversight Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
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

          {/* User Info & Logout Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700/30">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold">{user?.name || 'Central Admin'}</div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {user?.email || 'admin.noc@iconpln.co.id'}
              </div>
            </div>
            <button
              onClick={logout}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
              }`}
              title="Keluar dari sesi Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Placeholder */}
      <main className="w-full max-w-lg mx-auto px-4 py-16 my-auto text-center">
        <div
          className={`rounded-2xl border p-8 sm:p-10 backdrop-blur-md shadow-xl transition-all ${
            isDark
              ? 'bg-[#0c1322] border-[#1a253b] shadow-black/40'
              : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5 text-indigo-500 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            Administrator Access
          </span>

          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Admin Dashboard — Coming Soon
          </h1>

          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Portal administrasi sedang disiapkan. Fitur manajemen pengguna, katalog tools, dan
            pengawasan operasional terpusat akan tersedia di versi berikutnya.
          </p>

          <div
            className={`p-3.5 rounded-xl text-xs text-left border ${
              isDark ? 'bg-[#080d19] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="font-semibold mb-1 text-indigo-400">Info Sesi Aktif:</div>
            <div className="flex justify-between py-0.5">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Nama Akun:</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Username:</span>
              <span className="font-mono">{user?.username}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Access Level:</span>
              <span className="font-mono text-emerald-500 uppercase">{user?.accessLevel}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`w-full px-6 py-4 text-center text-xs ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        &copy; {new Date().getFullYear()} NOC Tools & Echo Team Portal — Central Admin
      </footer>
    </div>
  );
};
