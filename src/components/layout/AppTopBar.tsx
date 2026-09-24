import React, { useState } from 'react';
import { Search, Bell, Menu, Check, ExternalLink, X, Sun, Moon, LogOut } from 'lucide-react';
import { AlarmItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface AppTopBarProps {
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  alarms?: AlarmItem[];
  onSelectAlarm?: (alarm: AlarmItem) => void;
  onOpenArchitectureModal?: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  onOpenMobileMenu,
  onOpenCommandPalette,
  alarms = [],
  onSelectAlarm,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadAlarms = alarms.filter(a => !a.acknowledged);

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors ${
      isDark
        ? 'bg-[#080d19]/90 border-[#152033] text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      
      {/* Mobile Toggle + Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileMenu}
          className={`lg:hidden p-2 rounded-xl border ${
            isDark
              ? 'bg-[#0f172a] border-slate-800 text-slate-300 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* The Single Global Search Bar */}
        <div
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border transition-all cursor-pointer shadow-xs group ${
            isDark
              ? 'bg-[#0d1527] border-[#1e2d47] text-slate-400 hover:border-blue-500/50 hover:text-slate-200'
              : 'bg-slate-100/90 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <Search className={`w-4 h-4 transition-colors ${
              isDark ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-600'
            }`} />
            <span className={`text-xs sm:text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Search tools, functions, or type a command...
            </span>
          </div>
          <kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-md border ${
            isDark
              ? 'bg-[#16233b] text-slate-400 border-slate-700/80'
              : 'bg-slate-200 text-slate-600 border-slate-300'
          }`}>
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* Right Side: Notification Bell, Theme Switcher, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3 relative">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`p-2 rounded-xl border transition-colors relative cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-[#131d31] border-transparent hover:border-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent hover:border-slate-200'
            }`}
            title="Notifications & Alarms"
          >
            <Bell className="w-5 h-5" />
            {unreadAlarms.length > 0 && (
              <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 animate-pulse ${
                isDark ? 'ring-[#080d19]' : 'ring-white'
              }`}></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 sm:w-96 border rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 ${
              isDark
                ? 'bg-[#0f172a] border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Active NOC Alarms
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                    {unreadAlarms.length} Critical
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className={`p-1 rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`divide-y max-h-72 overflow-y-auto mt-2 ${
                isDark ? 'divide-slate-800/60' : 'divide-slate-100'
              }`}>
                {unreadAlarms.length === 0 ? (
                  <div className={`py-6 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Semua alarm dalam status clean / normal.
                  </div>
                ) : (
                  unreadAlarms.slice(0, 4).map((alarm) => (
                    <div
                      key={alarm.id}
                      onClick={() => {
                        if (onSelectAlarm) onSelectAlarm(alarm);
                        setShowNotifications(false);
                      }}
                      className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-rose-500 dark:text-rose-400">{alarm.eaCode}</span>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {alarm.raisedAt}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {alarm.customerName}
                      </p>
                      <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {alarm.alarmMessage}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher Tool (Next to Bell Icon) */}
        <button
          id="btn-toggle-theme"
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border shadow-xs ${
            isDark
              ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border-amber-500/20'
              : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
          }`}
          title={isDark ? 'Ubah ke Mode Terang (Light Mode)' : 'Ubah ke Mode Gelap (Dark Mode)'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* User Circle Avatar */}
        <div className="relative">
          <div
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className={`w-8 h-8 rounded-full ${user?.avatarBg || 'bg-[#1d4ed8]'} text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-blue-500/30 cursor-pointer hover:scale-105 transition-transform select-none`}
            title={`${user?.name || 'Rudi'} (${user?.role || 'NOC Engineer'})`}
          >
            {user?.initial || 'R'}
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-64 border rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 ${
              isDark
                ? 'bg-[#0f172a] border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className={`flex items-center gap-3 pb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className={`w-10 h-10 rounded-full ${user?.avatarBg || 'bg-[#1d4ed8]'} text-white font-bold flex items-center justify-center text-base shadow`}>
                  {user?.initial || 'R'}
                </div>
                <div className="overflow-hidden">
                  <div className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user?.name || 'Rudi'}
                  </div>
                  <div className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {user?.role || 'NOC Engineer Shift'}
                  </div>
                  <div className="text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span>Online &bull; {user?.gatewayIp || '10.12.0.1'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 text-xs space-y-2">
                <div className={`flex items-center justify-between px-2.5 py-2 rounded-lg ${
                  isDark ? 'bg-slate-800/40 text-slate-300' : 'bg-slate-50 text-slate-700'
                }`}>
                  <span>Tema Tampilan</span>
                  <span className="font-semibold text-blue-500">
                    {isDark ? 'Mode Gelap' : 'Mode Terang'}
                  </span>
                </div>

                {user?.shift && (
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>Jadwal Sesi:</span>
                    <span className="font-medium truncate max-w-[130px]">{user.shift}</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.confirm('Apakah Anda yakin ingin keluar dari Portal NOC?')) {
                      logout();
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-rose-500 hover:bg-rose-500/10`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
