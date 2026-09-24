import React, { useState, useMemo } from 'react';
import { 
  Kanban, 
  ListTodo, 
  BookOpen, 
  BellRing, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  Calendar, 
  Repeat, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Clock, 
  Circle, 
  MoreHorizontal, 
  Filter, 
  CheckSquare, 
  AlertCircle,
  ShieldCheck,
  Building2,
  Trash2,
  Activity,
  ChevronDown,
  List,
  BarChart2
} from 'lucide-react';
import { 
  EchoTask, 
  TaskStatus, 
  TaskType, 
  TaskPriority,
  ShiftLogEntry,
  AlarmItem 
} from '../../types';
import { 
  MOCK_SHIFT_LOGS, 
  MOCK_ALARMS 
} from '../../data/mockData';
import { TeamWorkloadView } from './TeamWorkloadView';
import { LogBookView } from '../tools/LogBookView';
import { AlarmListView } from '../alarms/AlarmListView';
import { LogAktivitasView } from '../alarms/LogAktivitasView';
import { ProgressChartView } from '../alarms/ProgressChartView';
import { FollowUpPusatView } from '../alarms/FollowUpPusatView';

interface EchoWorkspaceProps {
  tasks: EchoTask[];
  onAddTask: (task: Omit<EchoTask, 'id' | 'createdAt'>) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenArchitectureModal: () => void;
  onBackToDashboard?: () => void;
}

export type EchoSubView = 
  | 'task_board' 
  | 'task_list' 
  | 'log_book' 
  | 'clean_alarm'
  | 'alarm_list'
  | 'log_aktivitas'
  | 'progress_chart'
  | 'followup_pusat'
  | 'team_workload';

export const EchoWorkspace: React.FC<EchoWorkspaceProps> = ({
  tasks,
  onAddTask,
  onMoveTask,
  onDeleteTask,
  onOpenArchitectureModal,
  onBackToDashboard,
}) => {
  const [activeSubView, setActiveSubView] = useState<EchoSubView>('task_board');
  const [isCleanAlarmExpanded, setIsCleanAlarmExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'status' | 'personil'>('status');
  const [typeFilter, setTypeFilter] = useState<'Semua' | 'Harian' | 'Terencana'>('Semua');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskType, setNewTaskType] = useState<TaskType>('Terencana');
  const [newTaskAssignee, setNewTaskAssignee] = useState('achmad.farisy');
  const [newTaskSubtasksTotal, setNewTaskSubtasksTotal] = useState('0');

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'Semua' || task.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [tasks, searchQuery, typeFilter]);

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  const countSemua = tasks.length;
  const countHarian = tasks.filter((t) => t.type === 'Harian').length;
  const countTerencana = tasks.filter((t) => t.type === 'Terencana').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assigneeMap: Record<string, { name: string; username: string; initial: string; avatarBg: string }> = {
      'achmad.farisy': { name: 'Achmad Farisy', username: 'achmad.farisy', initial: 'A', avatarBg: 'bg-blue-600' },
      'dallas.permadi': { name: 'Dallas Permadi', username: 'dallas.permadi', initial: 'D', avatarBg: 'bg-indigo-600' },
      'moch.fahrizal': { name: 'Moch Fahrizal', username: 'moch.fahrizal', initial: 'M', avatarBg: 'bg-emerald-600' },
      'jihan.hasanah': { name: 'Jihan Hasanah', username: 'jihan.hasanah', initial: 'J', avatarBg: 'bg-purple-600' },
      'rahmat.iskan...': { name: 'Rahmat Iskandar', username: 'rahmat.iskan...', initial: 'R', avatarBg: 'bg-cyan-600' },
      'rudi.pradnyana': { name: 'Rudi Pradnyana', username: 'rudipradnyana', initial: 'R', avatarBg: 'bg-blue-600' },
    };

    const assignee = assigneeMap[newTaskAssignee] || assigneeMap['achmad.farisy'];
    const totalSub = parseInt(newTaskSubtasksTotal) || 0;

    onAddTask({
      title: newTaskTitle,
      status: 'todo',
      type: newTaskType,
      priority: newTaskPriority,
      assignee,
      subtasksCompleted: 0,
      subtasksTotal: totalSub > 0 ? totalSub : undefined,
    });

    setNewTaskTitle('');
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-112px)] bg-[#f8fafc] text-slate-800">
      
      {/* ECHO TEAM INNER SIDEBAR (Matches Screenshot 3) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 shrink-0 shadow-sm">
        <div>
          {/* Echo Team Logo */}
          <div className="flex items-center gap-3 px-2 py-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-md">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                Echo Team
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Migrated from VPS
              </span>
            </div>
          </div>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="w-full mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>&larr; NOC Dashboard</span>
            </button>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveSubView('task_board')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeSubView === 'task_board'
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4 text-blue-600" />
              <span>Task Board</span>
            </button>

            <button
              onClick={() => setActiveSubView('task_list')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeSubView === 'task_list'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-4 h-4 text-slate-500" />
              <span>Task List</span>
            </button>

            <button
              onClick={() => setActiveSubView('log_book')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeSubView === 'log_book'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Log Book</span>
            </button>

            {/* Clean Alarm EA with 4 Sub-Items matching SCR-20260917-jbsk.png */}
            <div className="space-y-1">
              <button
                id="btn-clean-alarm-ea"
                onClick={() => {
                  const isUnderCleanAlarm = ['clean_alarm', 'alarm_list', 'log_aktivitas', 'progress_chart', 'followup_pusat'].includes(activeSubView);
                  if (!isUnderCleanAlarm) {
                    setActiveSubView('alarm_list');
                    setIsCleanAlarmExpanded(true);
                  } else {
                    setIsCleanAlarmExpanded(!isCleanAlarmExpanded);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  ['clean_alarm', 'alarm_list', 'log_aktivitas', 'progress_chart', 'followup_pusat'].includes(activeSubView)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className={`w-4 h-4 ${
                    ['clean_alarm', 'alarm_list', 'log_aktivitas', 'progress_chart', 'followup_pusat'].includes(activeSubView)
                      ? 'text-blue-600'
                      : 'text-slate-500'
                  }`} />
                  <span>Clean Alarm EA</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCleanAlarmExpanded ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* 4 Sub-Items matching exact CSS selectors and screenshots */}
              {isCleanAlarmExpanded && (
                <div className="ml-5 pl-3 border-l-2 border-slate-200 py-1 space-y-1">
                  {/* Button 1: Alarm List */}
                  <div
                    id="btn-sub-alarm-list"
                    onClick={() => setActiveSubView('alarm_list')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeSubView === 'alarm_list'
                        ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Alarm List
                  </div>

                  {/* Button 2: Log Aktivitas */}
                  <div
                    id="btn-sub-log-aktivitas"
                    onClick={() => setActiveSubView('log_aktivitas')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeSubView === 'log_aktivitas'
                        ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Log Aktivitas
                  </div>

                  {/* Button 3: Progress Chart */}
                  <div
                    id="btn-sub-progress-chart"
                    onClick={() => setActiveSubView('progress_chart')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeSubView === 'progress_chart'
                        ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Progress Chart
                  </div>

                  {/* Button 4: Follow Up Pusat */}
                  <div
                    id="btn-sub-followup-pusat"
                    onClick={() => setActiveSubView('followup_pusat')}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeSubView === 'followup_pusat'
                        ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    Follow Up Pusat
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveSubView('team_workload')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeSubView === 'team_workload'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Team Workload</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-200 space-y-1">
          <button 
            onClick={onOpenArchitectureModal}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-blue-700 bg-blue-50/60 hover:bg-blue-100/60 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Info Migrasi VPS</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500">
            <Building2 className="w-4 h-4" />
            <span>NOC Cluster Host</span>
          </div>
        </div>
      </aside>

      {/* ECHO MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* ECHO SUB-HEADER (Search, Notification, Profile) */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, projects..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                rudipradnyana
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                R
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: TASK BOARD (KANBAN) */}
        {activeSubView === 'task_board' && (
          <div className="p-6 flex-1 flex flex-col overflow-y-auto">
            
            {/* Title & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Task Board
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage and track your team&apos;s tasks.
                </p>
              </div>

              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Task</span>
              </button>
            </div>

            {/* Filter Controls matching Screenshot 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Left filter toggle: By Status / By Personil */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="p-1 rounded-lg bg-slate-200/70 inline-flex">
                  <button
                    onClick={() => setViewMode('status')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === 'status'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    By Status
                  </button>
                  <button
                    onClick={() => setViewMode('personil')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === 'personil'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    By Personil
                  </button>
                </div>

                {/* Status Pills matching screenshot 3: Semua 78, Harian 29, Terencana 49 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTypeFilter('Semua')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      typeFilter === 'Semua'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Semua <span className="opacity-80 ml-1">{countSemua}</span>
                  </button>

                  <button
                    onClick={() => setTypeFilter('Harian')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      typeFilter === 'Harian'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Repeat className="w-3 h-3 text-slate-400" />
                    <span>Harian</span>
                    <span className="opacity-80">{countHarian}</span>
                  </button>

                  <button
                    onClick={() => setTypeFilter('Terencana')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      typeFilter === 'Terencana'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Terencana</span>
                    <span className="opacity-80">{countTerencana}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KANBAN BOARD COLUMNS (To Do 7, In Progress 20, Done 51) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* COLUMN 1: TO DO */}
              <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-slate-500" />
                    <h3 className="font-bold text-sm text-slate-800">To Do</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                      {todoTasks.length}
                    </span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                <div className="space-y-3">
                  {todoTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow transition-shadow group"
                    >
                      {/* Tags & Action arrows */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            {task.type === 'Harian' ? (
                              <Repeat className="w-2.5 h-2.5" />
                            ) : (
                              <Calendar className="w-2.5 h-2.5" />
                            )}
                            <span>{task.type}</span>
                          </span>
                        </div>

                        {/* Shift buttons & Delete */}
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onMoveTask(task.id, 'in_progress')}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                            title="Move to In Progress"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                            title="Delete task"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2">
                        {task.title}
                      </h4>

                      {/* Subtasks if any */}
                      {task.subtasksTotal !== undefined && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2 font-medium">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.subtasksCompleted || 0}/{task.subtasksTotal} subtask</span>
                        </div>
                      )}

                      {/* Footer: Aktif + Assignee */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Aktif</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 text-[11px] font-mono">
                            {task.assignee.username}
                          </span>
                          <div className={`w-5 h-5 rounded-full ${task.assignee.avatarBg} text-white font-bold flex items-center justify-center text-[10px]`}>
                            {task.assignee.initial}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 2: IN PROGRESS */}
              <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-800">In Progress</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                <div className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow transition-shadow group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            {task.type === 'Harian' ? (
                              <Repeat className="w-2.5 h-2.5" />
                            ) : (
                              <Calendar className="w-2.5 h-2.5" />
                            )}
                            <span>{task.type}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onMoveTask(task.id, 'todo')}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                            title="Move back to To Do"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onMoveTask(task.id, 'done')}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded"
                            title="Move to Done"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                            title="Delete task"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2">
                        {task.title}
                      </h4>

                      {task.subtasksTotal !== undefined && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2 font-medium">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.subtasksCompleted || 0}/{task.subtasksTotal} subtask</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Aktif</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 text-[11px] font-mono">
                            {task.assignee.username}
                          </span>
                          <div className={`w-5 h-5 rounded-full ${task.assignee.avatarBg} text-white font-bold flex items-center justify-center text-[10px]`}>
                            {task.assignee.initial}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 3: DONE */}
              <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-800">Done</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {doneTasks.length}
                    </span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                <div className="space-y-3">
                  {doneTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow transition-shadow group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            {task.type === 'Harian' ? (
                              <Repeat className="w-2.5 h-2.5" />
                            ) : (
                              <Calendar className="w-2.5 h-2.5" />
                            )}
                            <span>{task.type}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onMoveTask(task.id, 'in_progress')}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                            title="Move back to In Progress"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                            title="Delete task"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2">
                        {task.title}
                      </h4>

                      {task.subtasksTotal !== undefined && (
                        <div className="text-[11px] text-emerald-600 flex items-center gap-1 mb-2 font-semibold">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{task.subtasksCompleted || 0}/{task.subtasksTotal} subtask</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-emerald-600 font-semibold text-[11px]">Selesai</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 text-[11px] font-mono">
                            {task.assignee.username}
                          </span>
                          <div className={`w-5 h-5 rounded-full ${task.assignee.avatarBg} text-white font-bold flex items-center justify-center text-[10px]`}>
                            {task.assignee.initial}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: TASK LIST (TABLE VIEW) */}
        {activeSubView === 'task_list' && (
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Semua Tugas Tim (Table View)</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Judul Task</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Prioritas</th>
                    <th className="p-3.5">Jenis</th>
                    <th className="p-3.5">PIC / Assignee</th>
                    <th className="p-3.5">Subtask</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-semibold text-slate-900">{task.title}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5">{task.priority}</td>
                      <td className="p-3.5">{task.type}</td>
                      <td className="p-3.5">
                        <span className="font-mono text-slate-700">{task.assignee.username}</span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {task.subtasksTotal ? `${task.subtasksCompleted || 0}/${task.subtasksTotal}` : '-'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: LOG BOOK (SHIFT HANDOVER) */}
        {activeSubView === 'log_book' && (
          <div className="flex-1 overflow-y-auto">
            <LogBookView />
          </div>
        )}

        {/* VIEW 4: CLEAN ALARM EA SUB-VIEWS */}
        {(activeSubView === 'clean_alarm' || activeSubView === 'alarm_list') && (
          <div className="flex-1 overflow-y-auto">
            <AlarmListView />
          </div>
        )}

        {activeSubView === 'log_aktivitas' && (
          <div className="flex-1 overflow-y-auto">
            <LogAktivitasView />
          </div>
        )}

        {activeSubView === 'progress_chart' && (
          <div className="flex-1 overflow-y-auto">
            <ProgressChartView />
          </div>
        )}

        {activeSubView === 'followup_pusat' && (
          <div className="flex-1 overflow-y-auto">
            <FollowUpPusatView />
          </div>
        )}

        {/* VIEW 5: TEAM WORKLOAD */}
        {activeSubView === 'team_workload' && (
          <div className="flex-1 overflow-y-auto">
            <TeamWorkloadView />
          </div>
        )}

      </main>

      {/* NEW TASK MODAL */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Tambah Tugas Baru Echo
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Judul Tugas / Problem:</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Contoh: Audit BGP Router PE-SBY..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prioritas:</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori / Tipe:</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Terencana">Terencana</option>
                    <option value="Harian">Harian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assignee PIC:</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="achmad.farisy">Achmad Farisy</option>
                    <option value="dallas.permadi">Dallas Permadi</option>
                    <option value="moch.fahrizal">Moch Fahrizal</option>
                    <option value="jihan.hasanah">Jihan Hasanah</option>
                    <option value="rahmat.iskan...">Rahmat Iskandar</option>
                    <option value="rudi.pradnyana">Rudi Pradnyana</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Subtask (opsional):</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={newTaskSubtasksTotal}
                    onChange={(e) => setNewTaskSubtasksTotal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Simpan Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
