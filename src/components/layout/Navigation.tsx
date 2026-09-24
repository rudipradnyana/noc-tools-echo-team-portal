import React from 'react';
import { 
  LayoutGrid, 
  Terminal, 
  Kanban, 
  Activity, 
  BellRing, 
  BookOpen,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  taskCount: number;
  unacknowledgedAlarmsCount: number;
  onOpenArchitectureModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  taskCount,
  unacknowledgedAlarmsCount,
  onOpenArchitectureModal,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'NOC Tools Dashboard',
      subtitle: 'Semua 23 Alat Jaringan',
      icon: LayoutGrid,
      badge: null,
    },
    {
      id: 'workbench',
      label: 'Interactive Workbench',
      subtitle: 'Run Tools Di Sini (No Redirect)',
      icon: Terminal,
      badge: 'In-App',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'echo',
      label: 'Echo Team Workspace',
      subtitle: 'Migrasi dari VPS Pegawai',
      icon: Kanban,
      badge: `${taskCount} Tasks`,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'backbone',
      label: 'Backbone & VVIP SLA',
      subtitle: 'Jawa-Bali & DU PLN',
      icon: Activity,
      badge: 'Live',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'alarms',
      label: 'Clean Alarm EA',
      subtitle: 'Trouble Ticket EA/POP',
      icon: BellRing,
      badge: unacknowledgedAlarmsCount > 0 ? `${unacknowledgedAlarmsCount} Active` : null,
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  ];

  return (
    <div className="bg-[#0e1626] border-b border-slate-800/80 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-semibold">{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 hidden md:block leading-none">
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Migration Status Banner on far right */}
        <div className="hidden xl:flex items-center gap-2 py-2 pl-4 border-l border-slate-800">
          <button
            onClick={onOpenArchitectureModal}
            className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Overview Tugas Mentor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
