import React, { useState } from 'react';
import {
  LayoutDashboard,
  LayoutGrid,
  Boxes,
  Grid2X2,
  Search,
  Activity,
  FileText,
  CheckSquare,
  Settings,
  LogOut,
  MoreHorizontal,
  X,
  Users,
  Kanban,
  ChevronDown,
  BellRing,
  Bot,
  Sparkles
} from 'lucide-react';
import { NocTool, ToolCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface AppSidebarProps {
  activeNav: string;
  onNavigate: (navId: string, categoryFilter?: ToolCategory) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  taskCount: number;
  tools?: NocTool[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeNav,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  taskCount,
  tools,
}) => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const handleNavClick = (navId: string, categoryFilter?: ToolCategory) => {
    onNavigate(navId, categoryFilter);
    if (onCloseMobile) onCloseMobile();
  };

  const counts = React.useMemo(() => {
    if (!tools) {
      return { ALL: 25, BNG: 3, DHCP: 1, LOOKUP: 6, CHECK: 11, REPORT: 4 };
    }
    return {
      ALL: tools.length,
      BNG: tools.filter((t) => t.category === 'BNG').length,
      DHCP: tools.filter((t) => t.category === 'DHCP').length,
      LOOKUP: tools.filter((t) => t.category === 'LOOKUP').length,
      CHECK: tools.filter((t) => t.category === 'CHECK').length,
      REPORT: tools.filter((t) => t.category === 'REPORT').length,
    };
  }, [tools]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-[#0a0f1d] border-[#152033] text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          {/* Logo & Workspace Title */}
          <div className="flex items-center justify-between gap-3 px-2 mb-6">
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Stylized "N" badge matching screenshot */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1d4ed8] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl italic tracking-tighter select-none">
                  N
                </span>
              </div>
              <div>
                <h1 className={`font-bold text-base leading-tight tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  NOC Tools
                </h1>
                <p className={`text-[11px] font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Operations Workspace
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className={`lg:hidden p-1.5 rounded-lg ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Level Item: Dashboard */}
          <div className="mb-4">
            <button
              id="sidebar-nav-dashboard"
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNav === 'dashboard'
                  ? isDark
                    ? 'bg-[#15233c] text-white shadow-sm border border-blue-500/30'
                    : 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111a2e]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeNav === 'dashboard'
                    ? isDark ? 'text-[#38bdf8]' : 'text-blue-600'
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Section: TOOLS */}
          <div className="mb-5">
            <div className={`text-[10px] font-bold tracking-wider uppercase px-3.5 mb-2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              TOOLS
            </div>
            <nav className="space-y-1">
              {[
                { id: 'tools-all', cat: 'ALL' as ToolCategory, label: 'All Tools', icon: LayoutGrid, count: counts.ALL },
                { id: 'tools-bng', cat: 'BNG' as ToolCategory, label: 'BNG', icon: Boxes, count: counts.BNG },
                { id: 'tools-dhcp', cat: 'DHCP' as ToolCategory, label: 'DHCP', icon: Grid2X2, count: counts.DHCP },
                { id: 'tools-lookup', cat: 'LOOKUP' as ToolCategory, label: 'Lookup', icon: Search, count: counts.LOOKUP },
                { id: 'tools-check', cat: 'CHECK' as ToolCategory, label: 'Check', icon: Activity, count: counts.CHECK },
                { id: 'tools-report', cat: 'REPORT' as ToolCategory, label: 'Report', icon: FileText, count: counts.REPORT },
              ].map((item) => {
                const isActive = activeNav === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleNavClick('tools', item.cat)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#15233c] text-white font-semibold'
                          : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                        : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111a2e]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                    <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? isDark
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-800/40'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                        : isDark
                          ? 'text-slate-400 bg-slate-800/70'
                          : 'text-slate-600 bg-slate-100 border border-slate-200'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: WORKSPACE */}
          <div className="mb-5">
            <div className={`text-[10px] font-bold tracking-wider uppercase px-3.5 mb-2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              OPERATIONS & AI
            </div>
            <nav className="space-y-1">
              {/* Server Health */}
              <button
                id="sidebar-nav-server-health"
                onClick={() => handleNavClick('server-health')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeNav === 'server-health'
                    ? isDark
                      ? 'bg-[#15233c] text-white font-semibold'
                      : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111a2e]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Kesehatan Server</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* NOC AI Copilot */}
              <button
                id="sidebar-nav-ai-chat"
                onClick={() => handleNavClick('ai-chat')}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeNav === 'ai-chat'
                    ? isDark
                      ? 'bg-[#15233c] text-white font-semibold'
                      : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111a2e]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>NOC AI Copilot</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isDark
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                    : 'text-blue-700 bg-blue-50 border border-blue-200'
                }`}>
                  AI
                </span>
              </button>
            </nav>
          </div>

          {/* Section: SYSTEM */}
          <div>
            <div className={`text-[10px] font-bold tracking-wider uppercase px-3.5 mb-2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              SYSTEM
            </div>
            <nav className="space-y-1">
              <button
                id="sidebar-nav-system-settings"
                onClick={() => handleNavClick('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeNav === 'settings'
                    ? isDark
                      ? 'bg-[#15233c] text-white font-semibold'
                      : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111a2e]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom User Profile Widget */}
        <div className={`p-4 border-t transition-colors ${
          isDark ? 'border-[#152033] bg-[#090e1c]' : 'border-slate-200 bg-slate-50/80'
        }`}>
          {/* User Profile Card */}
          <div className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer group ${
            isDark ? 'hover:bg-[#121c2e]' : 'hover:bg-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              {/* User Avatar Circle */}
              <div className={`w-9 h-9 rounded-full ${user?.avatarBg || 'bg-[#1d4ed8]'} text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-blue-500/20`}>
                {user?.initial || 'R'}
              </div>
              <div className="text-left leading-tight">
                <div className={`text-sm font-semibold transition-colors truncate max-w-[120px] ${
                  isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {user?.name || 'Rudi'}
                </div>
                <div className={`text-[11px] font-medium truncate max-w-[120px] ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {user?.role || 'NOC Engineer'}
                </div>
              </div>
            </div>
            <button 
              className={`p-1 rounded ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
              title="User Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin keluar dari Portal NOC?')) {
                logout();
              }
            }}
            className={`w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
