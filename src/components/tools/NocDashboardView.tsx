import React, { useState } from 'react';
import {
  LayoutGrid,
  FileText,
  Users,
  BookOpen,
  ArrowRight,
  Radio,
  Globe,
  Server,
  FileCode,
  GitFork,
  Cpu,
  Search,
  Sliders,
  CircleDot,
  Target,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Check,
  BarChart3,
  Settings as SettingsIcon,
  ShieldCheck,
  Repeat,
  Calendar,
  UserCheck,
  AlertCircle,
  Clock,
  List,
  Activity,
  TrendingUp,
  Star,
  Bot,
  Sparkles
} from 'lucide-react';
import { NocTool, EchoTask, TaskStatus } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useActivity, getActivityIcon } from '../../context/ActivityContext';
import { ServerHealthWidget } from '../monitoring/ServerHealthWidget';
import { NocAiChatbot } from '../ai/NocAiChatbot';
import { InteractiveWorkbench } from './InteractiveWorkbench';


interface NocDashboardViewProps {
  tools: NocTool[];
  tasks: EchoTask[];
  onSelectToolById: (toolId: string) => void;
  onNavigateTools: () => void;
  onNavigateEcho: (filterStatus?: TaskStatus) => void;
  onNavigateLogBook: () => void;
  onOpenArchitectureModal: () => void;
  onNavigateAlarms?: (subTab?: 'alarm_list' | 'log_aktivitas' | 'progress_chart' | 'followup_pusat') => void;
  onToggleFavorite?: (toolId: string) => void;
}

export const NocDashboardView: React.FC<NocDashboardViewProps> = ({
  tools,
  tasks,
  onSelectToolById,
  onNavigateTools,
  onNavigateEcho,
  onNavigateLogBook,
  onOpenArchitectureModal,
  onNavigateAlarms,
  onToggleFavorite,
}) => {
  const { isDark } = useTheme();

  // Default mode for the 4 metric cards
  const dashboardMetricsMode: 'clean_alarm' | 'noc_overview' = 'clean_alarm';

  // Right Panel Tab state: 'health' | 'ai'
  const [activeRightTab, setActiveRightTab] = useState<'health' | 'ai'>('health');
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');


  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
      case 'Network':
        return Radio;
      case 'Globe':
        return Globe;
      case 'Server':
        return Server;
      case 'FileCode':
      case 'FileCode2':
        return FileCode;
      case 'GitFork':
        return GitFork;
      case 'Cpu':
        return Cpu;
      case 'Search':
        return Search;
      case 'Sliders':
        return Sliders;
      case 'Activity':
        return Activity;
      case 'FileText':
        return FileText;
      case 'Users':
        return Users;
      case 'BookOpen':
        return BookOpen;
      default:
        return LayoutGrid;
    }
  };

  const getToolCategoryColor = (category: string) => {
    switch (category) {
      case 'BNG':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'DHCP':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'LOOKUP':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'CHECK':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'REPORT':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'ROUTING':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'CONFIG':
        return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  // Derive Quick Access tools dynamically from favorited tools
  const favoritedTools = React.useMemo(() => {
    return tools.filter((t) => t.isFavorite);
  }, [tools]);

  // Real-time user activities from ActivityContext
  const { activities, logToolAccess } = useActivity();

  // Active Tool currently shown dynamically on the Dashboard
  const [activeToolId, setActiveToolId] = useState<string>(() => {
    try {
      return localStorage.getItem('noc_active_dashboard_tool') || 'cek-ea-pop';
    } catch {
      return 'cek-ea-pop';
    }
  });

  const handleSelectActiveTool = (toolId: string) => {
    setActiveToolId(toolId);
    try {
      localStorage.setItem('noc_active_dashboard_tool', toolId);
    } catch {
      // ignore
    }
    const found = tools.find((t) => t.id === toolId);
    if (found) {
      logToolAccess(found);
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          NOC Dashboard
        </h1>
      </div>

      {/* Top Section: Compact Favorites / Quick Access */}
      <div
        className={`rounded-2xl p-4 sm:p-5 shadow-xs border transition-colors ${
          isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
        }`}
      >
        {/* Header of Quick Access */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-sm sm:text-base font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Favorite Quick Access
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isDark ? 'text-amber-300 bg-amber-950/50 border border-amber-800/40' : 'text-amber-800 bg-amber-50 border border-amber-200'
                }`}>
                  {favoritedTools.length > 0 ? `${favoritedTools.length} Tools` : '8 Rekomendasi'}
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Klik tool di bawah untuk langsung membuka &amp; menjalankan fungsinya di panel workbench dinamis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateTools}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                isDark
                  ? 'border-slate-800 text-[#38bdf8] hover:bg-[#131d31] hover:text-white'
                  : 'border-slate-200 text-blue-600 hover:bg-slate-100 hover:text-blue-700'
              }`}
            >
              <span>View all tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact Grid of Quick Access Tools */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {(favoritedTools.length > 0 ? favoritedTools : tools.slice(0, 8)).map((tool) => {
            const Icon = getToolIcon(tool.iconName);
            const colorClass = getToolCategoryColor(tool.category);
            const isActive = activeToolId === tool.id;

            return (
              <div
                key={tool.id}
                id={`quick-access-${tool.id}`}
                onClick={() => handleSelectActiveTool(tool.id)}
                className={`group relative rounded-xl p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? 'border-blue-500 bg-blue-600/15 shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/50'
                    : isDark
                      ? 'bg-[#10192b] hover:bg-[#142037] border-[#1a2b46] hover:border-blue-500/50'
                      : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 hover:border-blue-400'
                }`}
                title={`Jalankan fungsi ${tool.name} di dashboard`}
              >
                {/* Top Row: Icon + Star */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg ${colorClass} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <button
                    type="button"
                    id={`quick-star-btn-${tool.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(tool.id);
                    }}
                    className="p-1 rounded-md text-amber-400 hover:text-amber-500 hover:bg-amber-400/10 transition-colors cursor-pointer"
                    title={tool.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                  >
                    <Star className={`w-3.5 h-3.5 ${tool.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                  </button>
                </div>

                {/* Bottom Row: Name + Status */}
                <div>
                  <div className={`text-xs font-bold truncate transition-colors ${
                    isActive
                      ? 'text-blue-400'
                      : isDark
                        ? 'text-white group-hover:text-blue-400'
                        : 'text-slate-900 group-hover:text-blue-600'
                  }`}>
                    {tool.name}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className={`font-mono truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {tool.category}
                    </span>
                    {isActive ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Aktif
                      </span>
                    ) : (
                      <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        Pilih &rarr;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Section: Quick Access (Left) + My Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Left: Dynamic Active Tool Function (8 columns) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <InteractiveWorkbench
            isEmbedded={true}
            hideSelectorStrip={true}
            initialToolId={activeToolId}
            tools={tools}
            onSelectTool={handleSelectActiveTool}
            onNavigateEcho={onNavigateEcho}
          />
        </div>

        {/* Right: Server Health & AI Assistant Panel (4 columns) */}
        <div className={`lg:col-span-4 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between border ${
          isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
        }`}>
          {/* Top Toggle Switch: Kesehatan Server vs AI Chatbot */}
          <div className={`flex items-center p-1 rounded-xl mb-4 border ${
            isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setActiveRightTab('health')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRightTab === 'health'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Kesehatan Server</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('ai')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRightTab === 'ai'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Chatbot</span>
              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-300">New</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1">
            {activeRightTab === 'health' ? (
              <ServerHealthWidget
                onAskAi={(prompt) => {
                  setAiInitialPrompt(prompt);
                  setActiveRightTab('ai');
                }}
              />
            ) : (
              <NocAiChatbot
                initialPrompt={aiInitialPrompt}
                onClearInitialPrompt={() => setAiInitialPrompt('')}
              />
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Activity */}
      <div className={`rounded-2xl p-5 sm:p-6 shadow-xs border ${
        isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-base sm:text-lg font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Recent Activity
          </h2>
          <button
            onClick={onNavigateLogBook}
            className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isDark ? 'text-[#38bdf8] hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activity Table Rows */}
        <div className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
          {activities.slice(0, 6).map((act) => {
            const Icon = getActivityIcon(act.iconName);

            let badgeStyle = isDark
              ? 'bg-[#131c2d] text-slate-400 border border-slate-800'
              : 'bg-slate-100 text-slate-700 border border-slate-200';

            if (act.badge === 'Task Update') {
              badgeStyle = isDark
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            } else if (act.badge === 'Report') {
              badgeStyle = isDark
                ? 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
                : 'bg-blue-50 text-blue-700 border border-blue-200';
            } else if (act.badge === 'Diagnostic') {
              badgeStyle = isDark
                ? 'bg-purple-950/40 text-purple-400 border border-purple-800/40'
                : 'bg-purple-50 text-purple-700 border border-purple-200';
            }

            return (
              <div
                key={act.id}
                onClick={() => {
                  if (act.actionToolId) {
                    handleSelectActiveTool(act.actionToolId);
                  } else if (act.targetNav === 'echo') {
                    onNavigateEcho();
                  }
                }}
                className={`py-3.5 px-2 -mx-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer group ${
                  isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'
                }`}
              >
                {/* Left: Glowing dot + timestamp + icon + title/actor */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  {/* Glowing cyan dot */}
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-xs shadow-cyan-400 shrink-0"></span>

                  {/* Timestamp */}
                  <span className={`font-mono text-xs font-medium shrink-0 w-12 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {act.time}
                  </span>

                  {/* Icon Box */}
                  <div
                    className={`w-8 h-8 rounded-lg ${act.iconBg} text-white flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <div className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                      isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {act.title}
                    </div>
                    <div className={`text-[11px] truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {act.actor}
                    </div>
                  </div>
                </div>

                {/* Right Badge */}
                <div className="shrink-0 ml-3">
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${badgeStyle}`}
                  >
                    {act.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
