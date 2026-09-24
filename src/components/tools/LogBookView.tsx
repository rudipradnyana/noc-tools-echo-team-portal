import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Bell,
  Check,
  Edit2,
  Trash2,
  ChevronDown
} from 'lucide-react';

interface RoutineLogTask {
  id: string;
  no: number;
  task: string;
  personil: string;
  avatarChar: string;
  isDone: boolean;
}

const INITIAL_ROUTINE_TASKS: RoutineLogTask[] = [
  {
    id: 'rt-1',
    no: 1,
    task: 'Cek status OSPF Router NCS Super Backbone by SIEM',
    personil: 'achmad.farisy',
    avatarChar: 'A',
    isDone: false,
  },
  {
    id: 'rt-2',
    no: 2,
    task: 'Check Point jam 8 all SBU',
    personil: 'achmad.farisy',
    avatarChar: 'A',
    isDone: false,
  },
  {
    id: 'rt-3',
    no: 3,
    task: 'Validasi Alarm EA Comm Lost',
    personil: 'rahmat.iskandar',
    avatarChar: 'R',
    isDone: false,
  },
  {
    id: 'rt-4',
    no: 4,
    task: 'Monitoring ALL CDN',
    personil: 'nabil.ghifary',
    avatarChar: 'N',
    isDone: false,
  },
  {
    id: 'rt-5',
    no: 5,
    task: 'Monitoring Aplikasi Internal NOC',
    personil: 'nabil.ghifary',
    avatarChar: 'N',
    isDone: false,
  },
  {
    id: 'rt-6',
    no: 6,
    task: 'Monitoring IBBC',
    personil: 'nabil.ghifary',
    avatarChar: 'N',
    isDone: false,
  },
  {
    id: 'rt-7',
    no: 7,
    task: 'Monitoring IP Public',
    personil: 'nabil.ghifary',
    avatarChar: 'N',
    isDone: false,
  },
  {
    id: 'rt-8',
    no: 8,
    task: 'Update dashboard Power BI Report Management Gajaren',
    personil: 'jihan.hasanah',
    avatarChar: 'J',
    isDone: false,
  },
  {
    id: 'rt-9',
    no: 9,
    task: 'Monitoring dan Follow Up Tiket Proaktif ke All Regional',
    personil: 'dede.hermawan',
    avatarChar: 'D',
    isDone: false,
  },
  {
    id: 'rt-10',
    no: 10,
    task: 'Monitoring dan Follow Up Tiket Over SLA',
    personil: 'dede.hermawan',
    avatarChar: 'D',
    isDone: false,
  },
  {
    id: 'rt-11',
    no: 11,
    task: 'Checkpoint DirOps dan Regional',
    personil: 'dede.hermawan',
    avatarChar: 'D',
    isDone: false,
  },
  {
    id: 'rt-12',
    no: 12,
    task: 'Monitoring dan Rekap Incident Critical & High',
    personil: 'rudipradnyana',
    avatarChar: 'R',
    isDone: false,
  },
  {
    id: 'rt-13',
    no: 13,
    task: 'Daily Health Check Core Router & DWDM Backbone',
    personil: 'moch.fahrizal',
    avatarChar: 'M',
    isDone: false,
  },
];

const AVAILABLE_PERSONIL = [
  { username: 'achmad.farisy', char: 'A' },
  { username: 'rahmat.iskandar', char: 'R' },
  { username: 'nabil.ghifary', char: 'N' },
  { username: 'jihan.hasanah', char: 'J' },
  { username: 'dede.hermawan', char: 'D' },
  { username: 'rudipradnyana', char: 'R' },
  { username: 'moch.fahrizal', char: 'M' },
  { username: 'dallas.permadi', char: 'D' },
  { username: 'bintang.alamsyah', char: 'B' },
];

export const LogBookView: React.FC = () => {
  const [tasks, setTasks] = useState<RoutineLogTask[]>(INITIAL_ROUTINE_TASKS);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedPersonil, setSelectedPersonil] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Toggle done status
  const handleToggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return filtered.map((t, idx) => ({ ...t, no: idx + 1 }));
    });
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const personilObj = AVAILABLE_PERSONIL.find((p) => p.username === selectedPersonil) || {
      username: selectedPersonil || 'rudipradnyana',
      char: (selectedPersonil || 'R').charAt(0).toUpperCase(),
    };

    const newTask: RoutineLogTask = {
      id: `rt-${Date.now()}`,
      no: tasks.length + 1,
      task: newTaskText.trim(),
      personil: personilObj.username,
      avatarChar: personilObj.char,
      isDone: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setSelectedPersonil('');
  };

  // Counters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isDone).length;
  const incompleteTasks = totalTasks - completedTasks;

  const filteredTasks = useMemo(() => {
    if (!searchFilter.trim()) return tasks;
    return tasks.filter(
      (t) =>
        t.task.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.personil.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [tasks, searchFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      
      {/* Top Bar matching screenshot SCR-20260916-olpa.png */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="relative w-72 sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
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
            <span className="text-xs font-semibold text-slate-700">rudipradnyana</span>
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              R
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Log Book
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Task harian rutin per personil — status otomatis reset setiap hari kerja baru.
          </p>
        </div>

        {/* 3 Metric Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Total Task */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">
                {totalTasks}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Total Task
              </div>
            </div>
          </div>

          {/* Card 2: Selesai */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">
                {completedTasks}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Selesai
              </div>
            </div>
          </div>

          {/* Card 3: Belum Selesai */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Circle className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">
                {incompleteTasks}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Belum Selesai
              </div>
            </div>
          </div>

        </div>

        {/* Input Form Card matching screenshot */}
        <form
          onSubmit={handleAddTask}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 shadow-xs"
        >
          <div className="flex-1 w-full">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Nama task rutin harian..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-64 relative">
            <select
              value={selectedPersonil}
              onChange={(e) => setSelectedPersonil(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer pr-10"
            >
              <option value="">— Pilih Personil —</option>
              {AVAILABLE_PERSONIL.map((p) => (
                <option key={p.username} value={p.username}>
                  {p.username}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </form>

        {/* Routine Tasks Table matching screenshot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">NO</th>
                  <th className="py-3.5 px-4">TASK</th>
                  <th className="py-3.5 px-4 w-48">PERSONIL</th>
                  <th className="py-3.5 px-4 w-36">STATUS</th>
                  <th className="py-3.5 px-4 w-36 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* NO */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                      {item.no}
                    </td>

                    {/* TASK */}
                    <td className="py-3.5 px-4 font-bold text-slate-800 text-xs sm:text-sm">
                      <span className={item.isDone ? 'line-through text-slate-400 font-normal' : ''}>
                        {item.task}
                      </span>
                    </td>

                    {/* PERSONIL */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-[10px] shadow-xs shrink-0">
                          {item.avatarChar}
                        </div>
                        <span className="text-xs font-mono text-slate-700">
                          {item.personil}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4">
                      {item.isDone ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Selesai</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Belum Selesai</span>
                        </span>
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Done button */}
                        <button
                          onClick={() => handleToggleDone(item.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                            item.isDone
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                              : 'bg-[#059669] hover:bg-emerald-700 text-white'
                          }`}
                          title={item.isDone ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>

                        {/* Subtle Edit / Delete icons */}
                        <button
                          onClick={() => handleDeleteTask(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      Tidak ada task rutin yang sesuai pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
