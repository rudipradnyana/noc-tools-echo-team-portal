import React, { useState } from 'react';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppTopBar } from './components/layout/AppTopBar';
import { NocDashboardView } from './components/tools/NocDashboardView';
import { AllToolsCatalogView } from './components/tools/AllToolsCatalogView';
import { InteractiveWorkbench } from './components/tools/InteractiveWorkbench';
import { EchoWorkspace } from './components/echo/EchoWorkspace';
import { TeamWorkloadView } from './components/echo/TeamWorkloadView';
import { LogBookView } from './components/tools/LogBookView';
import { SettingsView } from './components/tools/SettingsView';
import { BackboneMonitorView } from './components/monitoring/BackboneMonitorView';
import { CleanAlarmView } from './components/alarms/CleanAlarmView';
import { CleanAlarmEAView, CleanAlarmSubTab } from './components/alarms/CleanAlarmEAView';
import { CommandPalette } from './components/modals/CommandPalette';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { INITIAL_NOC_TOOLS, INITIAL_ECHO_TASKS, MOCK_ALARMS } from './data/mockData';
import { NocTool, EchoTask, TaskStatus, ToolCategory } from './types';
import { useTheme } from './context/ThemeContext';
import { useActivity } from './context/ActivityContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ServerHealthWidget } from './components/monitoring/ServerHealthWidget';
import { NocAiChatbot } from './components/ai/NocAiChatbot';

export default function App() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { logToolAccess, logActivity } = useActivity();
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [currentAlarmTab, setCurrentAlarmTab] = useState<CleanAlarmSubTab>('alarm_list');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ToolCategory>('ALL');
  const [selectedWorkbenchToolId, setSelectedWorkbenchToolId] = useState<string>('cek-ea-pop');
  
  const [tools, setTools] = useState<NocTool[]>(() => {
    try {
      const saved = localStorage.getItem('noc_favorite_tool_ids');
      if (saved) {
        const favIds = JSON.parse(saved) as string[];
        return INITIAL_NOC_TOOLS.map((t) => ({
          ...t,
          isFavorite: favIds.includes(t.id),
        }));
      }
    } catch {
      // ignore
    }
    return INITIAL_NOC_TOOLS;
  });

  const handleToggleFavoriteTool = (toolId: string) => {
    setTools((prev) => {
      const updated = prev.map((t) =>
        t.id === toolId ? { ...t, isFavorite: !t.isFavorite } : t
      );
      try {
        const favIds = updated.filter((t) => t.isFavorite).map((t) => t.id);
        localStorage.setItem('noc_favorite_tool_ids', JSON.stringify(favIds));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const [tasks, setTasks] = useState<EchoTask[]>(INITIAL_ECHO_TASKS);
  const [alarms] = useState(MOCK_ALARMS);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // Handle navigation from sidebar
  const handleNavigate = (navId: string, categoryFilter?: ToolCategory) => {
    if (navId === 'tools') {
      setActiveCategoryFilter(categoryFilter || 'ALL');
      if (categoryFilter && categoryFilter !== 'ALL') {
        setActiveNav(`tools-${categoryFilter.toLowerCase()}`);
      } else {
        setActiveNav('tools-all');
      }
    } else if (navId === 'alarms-list' || navId === 'alarms') {
      setCurrentAlarmTab('alarm_list');
      setActiveNav('alarms-list');
    } else if (navId === 'alarms-log') {
      setCurrentAlarmTab('log_aktivitas');
      setActiveNav('alarms-log');
    } else if (navId === 'alarms-chart') {
      setCurrentAlarmTab('progress_chart');
      setActiveNav('alarms-chart');
    } else if (navId === 'alarms-followup') {
      setCurrentAlarmTab('followup_pusat');
      setActiveNav('alarms-followup');
    } else if (navId === 'backbone') {
      setActiveNav('backbone');
      logToolAccess({ id: 'check-bb-ip-jawa-bali', name: 'CHECK BB IP JAWA-BALI', category: 'REPORT' });
    } else {
      setActiveNav(navId);
    }
  };

  // Launch a tool in the interactive workbench (Single Origin, No Redirect!)
  const handleLaunchTool = (tool: NocTool) => {
    if (tool.id === 'echo-team') {
      setActiveNav('echo');
      logActivity({
        title: 'Buka Echo Team Workspace',
        actor: user?.name || 'Rudi',
        badge: 'Task Update',
        iconName: 'Users',
        iconBg: 'bg-indigo-600',
        targetNav: 'echo',
        actionToolId: 'echo-team',
      });
      return;
    }
    setSelectedWorkbenchToolId(tool.id);
    setActiveNav('workbench');
    logToolAccess(tool);
  };

  const handleLaunchToolById = (toolId: string) => {
    if (toolId === 'echo-team') {
      setActiveNav('echo');
      logActivity({
        title: 'Buka Echo Team Workspace',
        actor: user?.name || 'Rudi',
        badge: 'Task Update',
        iconName: 'Users',
        iconBg: 'bg-indigo-600',
        targetNav: 'echo',
        actionToolId: 'echo-team',
      });
      return;
    }
    setSelectedWorkbenchToolId(toolId);
    setActiveNav('workbench');
    const found = tools.find((t) => t.id === toolId);
    if (found) {
      logToolAccess(found);
    } else {
      logToolAccess({ id: toolId, name: toolId.toUpperCase() });
    }
  };

  // Add task to Echo Team
  const handleAddTask = (newTaskData: Omit<EchoTask, 'id' | 'createdAt'>) => {
    const newTask: EchoTask = {
      ...newTaskData,
      id: `echo-task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity({
      title: `Created task: ${newTask.title}`,
      actor: user?.name || 'Rudi',
      badge: 'Task Update',
      iconName: 'Check',
      iconBg: 'bg-blue-600',
      targetNav: 'echo',
    });
  };

  // Move task status
  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (task && newStatus === 'done') {
      logActivity({
        title: `Task moved to Done: ${task.title}`,
        actor: user?.name || 'Rudi',
        badge: 'Task Update',
        iconName: 'Check',
        iconBg: 'bg-[#059669]',
        targetNav: 'echo',
      });
    }
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // If user is not logged in, render the Login Page!
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={`min-h-screen selection:bg-blue-600 selection:text-white flex transition-colors duration-150 ${
      isDark ? 'bg-[#070c17] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Left Sidebar (Desktop Fixed, Mobile Drawer) */}
      <AppSidebar
        activeNav={activeNav}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        taskCount={tasks.length}
        tools={tools}
      />

      {/* Main App Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        
        {/* Global App Top Bar - Shown on Dark Theme Views */}
        {activeNav !== 'workload' && activeNav !== 'logbook' && activeNav !== 'echo' && (
          <AppTopBar
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            alarms={alarms}
            onSelectAlarm={() => setActiveNav('alarms')}
            onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
          />
        )}

        {/* Dynamic Main View */}
        <main className="flex-1">
          {activeNav === 'dashboard' && (
            <NocDashboardView
              tools={tools}
              tasks={tasks}
              onSelectToolById={handleLaunchToolById}
              onNavigateTools={() => {
                setActiveCategoryFilter('ALL');
                setActiveNav('tools-all');
              }}
              onNavigateEcho={(filterStatus?: TaskStatus) => {
                setActiveNav('echo');
              }}
              onNavigateLogBook={() => setActiveNav('logbook')}
              onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
              onToggleFavorite={handleToggleFavoriteTool}
              onNavigateAlarms={(subTab = 'alarm_list') => {
                setCurrentAlarmTab(subTab);
                if (subTab === 'alarm_list') setActiveNav('alarms-list');
                else if (subTab === 'log_aktivitas') setActiveNav('alarms-log');
                else if (subTab === 'progress_chart') setActiveNav('alarms-chart');
                else if (subTab === 'followup_pusat') setActiveNav('alarms-followup');
              }}
            />
          )}

          {(activeNav.startsWith('tools-') || activeNav === 'tools') && (
            <AllToolsCatalogView
              tools={tools}
              initialCategory={activeCategoryFilter}
              onSelectTool={handleLaunchTool}
              onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
              onToggleFavorite={handleToggleFavoriteTool}
            />
          )}

          {activeNav === 'workbench' && (
            <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
              {/* Back to dashboard button */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDark 
                      ? 'bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-slate-800' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
                  }`}
                >
                  &larr; Back to Dashboard
                </button>
                <div className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Integrated Local Workbench (No External Port Redirects)
                </div>
              </div>

              <InteractiveWorkbench
                initialToolId={selectedWorkbenchToolId}
                tools={tools}
                onNavigateEcho={() => setActiveNav('echo')}
              />
            </div>
          )}

          {activeNav === 'echo' && (
            <EchoWorkspace
              tasks={tasks}
              onAddTask={handleAddTask}
              onMoveTask={handleMoveTask}
              onDeleteTask={handleDeleteTask}
              onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
              onBackToDashboard={() => setActiveNav('dashboard')}
            />
          )}

          {activeNav === 'workload' && (
            <TeamWorkloadView />
          )}

          {activeNav === 'server-health' && (
            <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`mb-4 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-slate-800' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                &larr; Back to Dashboard
              </button>
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0c1322] border-[#18263e]' : 'bg-white border-slate-200'}`}>
                <ServerHealthWidget onAskAi={() => setActiveNav('ai-chat')} />
              </div>
            </div>
          )}

          {activeNav === 'ai-chat' && (
            <div className="p-4 sm:p-6 max-w-[1100px] mx-auto">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`mb-4 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-slate-800' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                &larr; Back to Dashboard
              </button>
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0c1322] border-[#18263e]' : 'bg-white border-slate-200'}`}>
                <NocAiChatbot isFullView={true} />
              </div>
            </div>
          )}

          {activeNav === 'logbook' && (
            <LogBookView />
          )}

          {activeNav === 'settings' && (
            <SettingsView
              onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
            />
          )}

          {activeNav === 'backbone' && (
            <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`mb-4 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-slate-800' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                &larr; Back to Dashboard
              </button>
              <BackboneMonitorView />
            </div>
          )}

          {activeNav.startsWith('alarms') && (
            <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`mb-4 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#0f172a] border border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#1e293b]' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                &larr; Back to Dashboard
              </button>
              <div className={`rounded-2xl overflow-hidden border shadow-xl ${
                isDark ? 'border-[#1e293b] bg-[#080d1a]' : 'border-slate-200 bg-white'
              }`}>
                <CleanAlarmEAView
                  currentTab={currentAlarmTab}
                  onTabChange={(tab) => {
                    setCurrentAlarmTab(tab);
                    if (tab === 'alarm_list') setActiveNav('alarms-list');
                    else if (tab === 'log_aktivitas') setActiveNav('alarms-log');
                    else if (tab === 'progress_chart') setActiveNav('alarms-chart');
                    else if (tab === 'followup_pusat') setActiveNav('alarms-followup');
                  }}
                  showTabHeader={true}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick Command Launcher Palette (⌘ K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tools={tools}
        onSelectTool={handleLaunchTool}
        onNavigateEcho={() => {
          setActiveNav('echo');
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Architecture & Mentor Solution Overview Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

    </div>
  );
}
