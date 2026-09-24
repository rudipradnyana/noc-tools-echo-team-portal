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

const INITIAL_PERSONIL_DATA: PersonilWorkload[] = [
  {
    username: 'achmad.farisy',
    name: 'Achmad Farisy',
    email: 'achmad.farisy@iconpln.co.id',
    avatarChar: 'A',
    todoCount: 1,
    inProgressCount: 0,
    doneCount: 9,
    totalCount: 10,
    tasks: [
      { id: 't1', title: 'Discover all router add solarwinds', status: 'todo', type: 'Terencana', priority: 'Low' },
      { id: 't2', title: 'DevOps aplikasi task list echo', status: 'done', type: 'Harian', priority: 'High' },
      { id: 't3', title: 'Install aplikasi speedtest rkal domain speedtest.iconpln.net.id', status: 'done', type: 'Terencana', priority: 'Low' },
      { id: 't4', title: 'Install aplikasi speedtest Equnix domain speedtest.iconpln.net.id', status: 'done', type: 'Terencana', priority: 'High' },
      { id: 't5', title: 'Konfigurasi SNMPv3 Router Core JABODETABEK', status: 'done', type: 'Terencana', priority: 'Low' },
      { id: 't6', title: 'Audit port flapping POP Gambir & Cawang', status: 'done', type: 'Harian', priority: 'High' },
      { id: 't7', title: 'Testing route failover upstream Singtel', status: 'done', type: 'Terencana', priority: 'Low' },
      { id: 't8', title: 'Review log BNG Aradial sesi subscriber', status: 'done', type: 'Harian', priority: 'Low' },
      { id: 't9', title: 'Update SOP Eskalasi Trouble Ticket Tier-2', status: 'done', type: 'Terencana', priority: 'Low' },
      { id: 't10', title: 'Integrasi script cek EA ke NOC Hub', status: 'done', type: 'Terencana', priority: 'High' },
    ],
  },
  {
    username: 'rahmat',
    name: 'Rahmat Iskandar',
    email: 'rahmat.iskandar@iconpln.co.id',
    avatarChar: 'R',
    todoCount: 9,
    inProgressCount: 0,
    doneCount: 0,
    totalCount: 9,
    tasks: [
      { id: 'r1', title: 'Validasi Alarm EA Comm Lost Regional 2', status: 'todo', type: 'Harian', priority: 'High' },
      { id: 'r2', title: 'Follow up perbaikan patchcord ODF Gandul', status: 'todo', type: 'Terencana', priority: 'Medium' },
      { id: 'r3', title: 'Pemeriksaan redaman SFP DWDM link Cilegon', status: 'todo', type: 'Terencana', priority: 'High' },
    ],
  },
  {
    username: 'dede',
    name: 'Dede Hermawan',
    email: 'dede.hermawan@iconpln.co.id',
    avatarChar: 'D',
    todoCount: 2,
    inProgressCount: 0,
    doneCount: 6,
    totalCount: 8,
    tasks: [
      { id: 'd1', title: 'Monitoring dan Follow Up Tiket Proaktif ke All Regional', status: 'done', type: 'Harian', priority: 'High' },
      { id: 'd2', title: 'Monitoring dan Follow Up Tiket Over SLA', status: 'done', type: 'Harian', priority: 'High' },
      { id: 'd3', title: 'Checkpoint DirOps dan Regional', status: 'done', type: 'Harian', priority: 'Medium' },
      { id: 'd4', title: 'Rekap mingguan MTTR tiket corporate', status: 'done', type: 'Terencana', priority: 'Low' },
      { id: 'd5', title: 'Audit performa link backup PLN Kantor Pusat', status: 'done', type: 'Terencana', priority: 'Medium' },
      { id: 'd6', title: 'Koordinasi perapihan kabel rack server NOC', status: 'done', type: 'Terencana', priority: 'Low' },
      { id: 'd7', title: 'Verifikasi route failover Cikarang data center', status: 'todo', type: 'Terencana', priority: 'High' },
      { id: 'd8', title: 'Review ticket pending SBU Jawa Bagian Barat', status: 'todo', type: 'Harian', priority: 'Medium' },
    ],
  },
  {
    username: 'yafi',
    name: 'Yafi Pratama',
    email: 'yafi.pratama@iconpln.co.id',
    avatarChar: 'Y',
    todoCount: 0,
    inProgressCount: 0,
    doneCount: 0,
    totalCount: 0,
    tasks: [],
  },
  {
    username: 'nabil',
    name: 'Nabil Ghifary',
    email: 'nabil.ghifary@iconpln.co.id',
    avatarChar: 'N',
    todoCount: 6,
    inProgressCount: 0,
    doneCount: 4,
    totalCount: 10,
    tasks: [
      { id: 'n1', title: 'Monitoring ALL CDN (Akamai, Google, Netflix, Cloudflare)', status: 'done', type: 'Harian', priority: 'High' },
      { id: 'n2', title: 'Monitoring Aplikasi Internal NOC Dashboard', status: 'done', type: 'Harian', priority: 'Medium' },
      { id: 'n3', title: 'Monitoring IBBC Core Backbone link', status: 'done', type: 'Harian', priority: 'High' },
      { id: 'n4', title: 'Monitoring IP Public pool utilization', status: 'done', type: 'Harian', priority: 'Medium' },
      { id: 'n5', title: 'Benchmarking latency CDN Akamai via Telkom & Indosat', status: 'todo', type: 'Terencana', priority: 'Low' },
      { id: 'n6', title: 'Analisis DNS recursive query spikes', status: 'todo', type: 'Terencana', priority: 'Medium' },
    ],
  },
  {
    username: 'didik',
    name: 'Didik Kurniawan',
    email: 'didik.kurniawan@iconpln.co.id',
    avatarChar: 'D',
    todoCount: 0,
    inProgressCount: 0,
    doneCount: 0,
    totalCount: 0,
    tasks: [],
  },
  {
    username: 'jihan',
    name: 'Jihan Hasanah',
    email: 'jihan.hasanah@iconpln.co.id',
    avatarChar: 'J',
    todoCount: 2,
    inProgressCount: 0,
    doneCount: 24,
    totalCount: 26,
    tasks: [
      { id: 'j1', title: 'Update dashboard Power BI Report Management Gajaren', status: 'done', type: 'Harian', priority: 'High' },
      { id: 'j2', title: 'Automasi kalkulasi ketersediaan SLA bulanan', status: 'done', type: 'Terencana', priority: 'High' },
      { id: 'j3', title: 'Laporan eksekutif performa backbone Q3', status: 'done', type: 'Terencana', priority: 'Medium' },
      { id: 'j4', title: 'Sinkronisasi data ticketing remedy ke Power BI', status: 'todo', type: 'Terencana', priority: 'Medium' },
      { id: 'j5', title: 'Penyusunan dashboard utilisasi transit global', status: 'todo', type: 'Terencana', priority: 'Low' },
    ],
  },
  {
    username: 'dallas',
    name: 'Dallas Permadi',
    email: 'dallas.permadi@iconpln.co.id',
    avatarChar: 'D',
    todoCount: 5,
    inProgressCount: 0,
    doneCount: 1,
    totalCount: 6,
    tasks: [
      { id: 'dl1', title: 'Optimasi routing BGP Anycast DNS', status: 'done', type: 'Terencana', priority: 'High' },
      { id: 'dl2', title: 'Investigasi latency spike interkoneksi IIX', status: 'todo', type: 'Harian', priority: 'High' },
      { id: 'dl3', title: 'Pembaruan firmware switch aggregation Cisco', status: 'todo', type: 'Terencana', priority: 'Medium' },
    ],
  },
  { username: 'herly', name: 'Herly Santoso', email: 'herly.santoso@iconpln.co.id', avatarChar: 'H', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'bintang', name: 'Bintang Alamsyah', email: 'bintang.alamsyah@iconpln.co.id', avatarChar: 'B', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  {
    username: 'moch',
    name: 'Moch Fahrizal',
    email: 'moch.fahrizal@iconpln.co.id',
    avatarChar: 'M',
    todoCount: 4,
    inProgressCount: 0,
    doneCount: 4,
    totalCount: 8,
    tasks: [
      { id: 'm1', title: 'Create SPP Pengadaan TAC DWDM Fiberhome', status: 'todo', type: 'Terencana', priority: 'Medium' },
      { id: 'm2', title: 'Create SPP Pengadaan TAC DWDM Huawei', status: 'todo', type: 'Terencana', priority: 'Medium' },
      { id: 'm3', title: 'Rekap log maintenance OLT ZTE dan Huawei', status: 'done', type: 'Harian', priority: 'Low' },
      { id: 'm4', title: 'Pengecekan utilisasi slot subrack DWDM Ungaran', status: 'done', type: 'Terencana', priority: 'High' },
    ],
  },
  { username: 'indra', name: 'Indra Gunawan', email: 'indra.gunawan@iconpln.co.id', avatarChar: 'I', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'imronassidiqi3', name: 'Imron Assidiqi', email: 'imronassidiqi3@iconpln.co.id', avatarChar: 'I', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'ocid89', name: 'Ocid Rahmat', email: 'ocid89@iconpln.co.id', avatarChar: 'O', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'meby', name: 'Meby Anggoro', email: 'meby@iconpln.co.id', avatarChar: 'M', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'galihwahyu66210', name: 'Galih Wahyu', email: 'galihwahyu66210@iconpln.co.id', avatarChar: 'G', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'bayu', name: 'Bayu Wicaksono', email: 'bayu.wicaksono@iconpln.co.id', avatarChar: 'B', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  { username: 'aldi', name: 'Aldi Firmansyah', email: 'aldi.firmansyah@iconpln.co.id', avatarChar: 'A', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
  {
    username: 'rudipradnyana',
    name: 'Rudi Pradnyana',
    email: 'rudipradnyana@gmail.com',
    avatarChar: 'R',
    todoCount: 0,
    inProgressCount: 0,
    doneCount: 0,
    totalCount: 0,
    tasks: [],
  },
  { username: 'ahmadfadelviici', name: 'Ahmad Fadel', email: 'ahmadfadelviici@iconpln.co.id', avatarChar: 'A', todoCount: 0, inProgressCount: 0, doneCount: 0, totalCount: 0, tasks: [] },
];

export const TeamWorkloadView: React.FC = () => {
  const [personilList] = useState<PersonilWorkload[]>(INITIAL_PERSONIL_DATA);
  const [chartMode, setChartMode] = useState<'Bar' | 'Line'>('Bar');
  const [expandedPersonil, setExpandedPersonil] = useState<Record<string, boolean>>({
    'achmad.farisy': true,
  });

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
            <span className="text-xs font-semibold text-slate-700">rudipradnyana</span>
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              R
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
            {personilList.map((person) => {
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
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
