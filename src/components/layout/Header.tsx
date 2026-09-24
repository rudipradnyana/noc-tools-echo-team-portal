import React from 'react';
import { 
  Activity, 
  Search, 
  Bell, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenArchitectureModal: () => void;
  taskCount: number;
  onlineToolsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenArchitectureModal,
  taskCount,
  onlineToolsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c1220]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Unified Tag */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                  NOC Tools & Operations
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Unified v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                JozzLabs Network Operations & Engineering Suite
              </p>
            </div>
          </div>

          {/* Architecture Badge */}
          <button
            onClick={onOpenArchitectureModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors ml-2"
            title="Lihat Arsitektur Redesign & Migrasi VPS"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Migrated: Same Origin (No Redirects)</span>
          </button>
        </div>

        {/* Center: Global Search Trigger */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div 
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-slate-400 hover:border-blue-500/50 hover:text-slate-200 transition-colors cursor-pointer text-sm shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Cari alat NOC, IP, EA, atau task Echo...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right: Quick Telemetry, Echo switch, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick status pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-mono text-[11px]">{onlineToolsCount} Tools Active</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">0 Port Bounces</span>
          </div>

          {/* Mobile search trigger */}
          <button 
            onClick={onOpenSearch}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Cari"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Architecture info button */}
          <button
            onClick={onOpenArchitectureModal}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-colors relative"
            title="Detail Perubahan Redesign & Migrasi Echo"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
            </button>
          </div>

          {/* User Profile matching screenshot 3 */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">rudipradnyana@gmail.com</div>
              <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                NOC Engineer Shift
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm shadow-md ring-2 ring-blue-500/30">
              R
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
