import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  CheckCircle2,
  Calendar,
  Repeat,
  BarChart2,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WorkloadTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  type: 'Terencana' | 'Harian';
  priority: 'Low' | 'Medium' | 'High';
}

interface PersonilWorkload {
  username: string;
  name: string;
  email: string;
  avatarChar: string;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  totalCount: number;
  tasks: WorkloadTask[];
}

const INITIAL_PERSONIL_DATA: PersonilWorkload[] = [];

export const TeamWorkloadView: React.FC = () => {
  const { user } = useAuth();
  const [personilList] = useState<PersonilWorkload[]>(INITIAL_PERSONIL_DATA);
  const [chartMode, setChartMode] = useState<'Bar' | 'Line'>('Bar');
  const [expandedPersonil, setExpandedPersonil] = useState<Record<string, boolean>>({});

  const toggleExpand = (username: string) => {
    setExpandedPersonil((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  // Dimensions for Chart matching screenshot SCR-20260916-olqu.png
  const chartHeight = 160;
  const maxScale = 24;
  const yTicks = [24, 20, 16, 12, 8, 4, 0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      
      {/* Top Bar matching screenshot */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="relative w-72 sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full pl-10 pr-4 py-1.5 rounded-full border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer text-slate-500 hover:text-slate-700">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 right-0"></span>
          </div>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <span className="text-xs font-semibold text-slate-700">{user?.username || 'Operator'}</span>
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {(user?.name || user?.username || 'O').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Team Workload
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Task per personil — dari Task Board.
          </p>
        </div>

        {/* Card 1: Distribusi Task per Personil (Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Distribusi Task per Personil
            </h2>

            {/* Toggle Bar / Line */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setChartMode('Bar')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  chartMode === 'Bar'
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartMode('Line')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  chartMode === 'Line'
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Line
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-1 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-3 rounded-[2px] bg-[#dbeafe] border border-slate-700"></span>
              <span className="text-[11px] font-medium text-slate-600">Total Task</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-3 rounded-[2px] bg-[#dcfce7] border border-slate-700"></span>
              <span className="text-[11px] font-medium text-slate-600">Task Selesai</span>
            </div>
          </div>

          {/* Chart Canvas matching screenshot */}
          {personilList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-medium text-slate-500">Belum ada data distribusi task per personil</p>
            </div>
          ) : (
            <div className="overflow-x-auto pt-2 pb-6">
            <div className="min-w-[840px] h-[250px] relative flex flex-col justify-between pl-8 pr-4">
              
              {/* Grid Lines and Y-Axis */}
              <div className="absolute inset-0 left-8 right-4 flex flex-col justify-between pointer-events-none">
                {yTicks.map((tick) => (
                  <div key={tick} className="flex items-center w-full">
                    <span className="absolute -left-7 text-[10px] font-mono text-slate-600 font-semibold w-5 text-right">
                      {tick}
                    </span>
                    <div className="w-full border-b border-slate-700"></div>
                  </div>
                ))}
              </div>

              {/* Bars or Line Representation */}
              <div className="absolute left-8 right-4 bottom-[72px] top-0 flex items-end justify-between px-2">
                {personilList.map((person) => {
                  const totalH = (person.totalCount / maxScale) * chartHeight;
                  const doneH = (person.doneCount / maxScale) * chartHeight;

                  return (
                    <div key={person.username} className="flex flex-col items-center flex-1 group">
                      {chartMode === 'Bar' ? (
                        <div className="flex items-end justify-center gap-0.5 h-[160px] w-full">
                          {/* Total Task Bar */}
                          <div
                            style={{ height: `${Math.max(totalH, 0)}px` }}
                            className="w-3 sm:w-3.5 bg-[#dbeafe] border border-slate-800 rounded-t-[1px] transition-all hover:bg-blue-300"
                            title={`${person.name}: Total ${person.totalCount}`}
                          />
                          {/* Done Task Bar */}
                          <div
                            style={{ height: `${Math.max(doneH, 0)}px` }}
                            className="w-3 sm:w-3.5 bg-[#dcfce7] border border-slate-800 rounded-t-[1px] transition-all hover:bg-emerald-300"
                            title={`${person.name}: Selesai ${person.doneCount}`}
                          />
                        </div>
                      ) : (
                        <div className="h-[160px] flex items-end justify-center w-full relative">
                          <div
                            style={{ bottom: `${totalH}px` }}
                            className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white absolute shadow-xs"
                            title={`Total: ${person.totalCount}`}
                          />
                          <div
                            style={{ bottom: `${doneH}px` }}
                            className="w-2 h-2 rounded-full bg-emerald-600 border border-white absolute shadow-xs"
                            title={`Selesai: ${person.doneCount}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Slanted Labels matching screenshot */}
              <div className="absolute left-8 right-4 bottom-0 flex items-start justify-between px-2 h-16 pt-2">
                {personilList.map((person) => (
                  <div
                    key={person.username}
                    className="flex-1 flex justify-center text-[10px] text-slate-700 font-medium select-none"
                  >
                    <span className="transform -rotate-30 origin-top-left translate-y-1 block truncate max-w-[68px]">
                      {person.username}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
          )}
        </div>

        {/* Section 2: Personil & Task */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Personil & Task
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
              {personilList.length} personil
            </span>
          </div>

          {/* Personil Accordion Cards */}
          <div className="space-y-3">
            {personilList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">Belum ada personil on-duty</p>
                <p className="text-xs text-slate-400 mt-1">Data personil dummy telah dibersihkan.</p>
              </div>
            ) : (
              personilList.map((person) => {
              const isExpanded = !!expandedPersonil[person.username];
              const todoTasks = person.tasks.filter((t) => t.status === 'todo');
              const doneTasks = person.tasks.filter((t) => t.status === 'done');
              const percentDone = person.totalCount > 0 ? (person.doneCount / person.totalCount) * 100 : 0;

              return (
                <div
                  key={person.username}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleExpand(person.username)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 select-none"
                  >
                    {/* Personil Identity */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {person.avatarChar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {person.username}
                        </div>
                        <div className="text-xs text-slate-400">
                          {person.email}
                        </div>
                      </div>
                    </div>

                    {/* Stats and Progress */}
                    <div className="flex items-center gap-6">
                      {/* Counter pills */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{person.todoCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{person.inProgressCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-semibold text-slate-700">{person.doneCount}</span>
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 w-40 sm:w-48">
                        <div className="text-xs text-slate-500 whitespace-nowrap">
                          Selesai <strong className="text-slate-800">{person.doneCount}/{person.totalCount}</strong>
                        </div>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            style={{ width: `${percentDone}%` }}
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className="text-slate-400 hover:text-slate-600">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Task List matching screenshot */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-4 sm:px-6 py-4 bg-white space-y-4">
                      {/* TO DO Section */}
                      {todoTasks.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                            <span>TO DO</span>
                            <span className="font-mono text-slate-700">{todoTasks.length}</span>
                          </div>

                          <div className="space-y-2">
                            {todoTasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-[#f8fafc] text-xs transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                  <span className="font-semibold text-slate-800">{task.title}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/80">
                                    <Calendar className="w-3 h-3 text-teal-600" />
                                    <span>{task.type}</span>
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-200/80">
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DONE Section */}
                      {doneTasks.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>DONE</span>
                            <span className="font-mono text-slate-700">{doneTasks.length}</span>
                          </div>

                          <div className="space-y-2">
                            {doneTasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-[#f8fafc] text-xs transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span className="font-medium text-slate-700">{task.title}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/80">
                                    {task.type === 'Harian' ? (
                                      <Repeat className="w-3 h-3 text-teal-600" />
                                    ) : (
                                      <Calendar className="w-3 h-3 text-teal-600" />
                                    )}
                                    <span>{task.type}</span>
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                      task.priority === 'High'
                                        ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                                        : 'bg-blue-50 text-blue-600 border border-blue-200/80'
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {person.tasks.length === 0 && (
                        <div className="text-center py-6 text-xs text-slate-400">
                          Belum ada task yang ditugaskan ke personil ini.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>

      </div>
    </div>
  );
};
