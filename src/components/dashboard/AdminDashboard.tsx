import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  MoreHorizontal,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Search,
  Bell,
  Menu,
  Activity,
  UserPlus,
  UserCog,
  Clock,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  FileText,
  Megaphone,
  Send,
  Wifi,
  WifiOff,
  Server,
  Globe,
  Terminal,
  Zap,
  ArrowRight,
  ArrowUpDown,
  Filter,
  ToggleLeft,
  ToggleRight,
  Info,
  Copy,
  ExternalLink,
  Hash,
  Mail,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PRESET_USERS } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';
import { AuthUser } from '../../types';
import { INITIAL_NOC_TOOLS, MOCK_ALARMS, INITIAL_ECHO_TASKS } from '../../data/mockData';

// ─── Admin Sidebar Nav Types ────────────────────────────────────────
type AdminNavId =
  | 'overview'
  | 'users'
  | 'tools-config'
  | 'audit-log'
  | 'alarm-policy'
  | 'broadcast'
  | 'admin-settings';

// ─── Mock: Registered Users (Extends from AuthContext Presets) ──────
const REGISTERED_USERS: (AuthUser & { status: 'active' | 'inactive'; lastLogin: string })[] = [
  {
    ...PRESET_USERS[0],
    status: 'active',
    lastLogin: '30 Sep 2026, 08:12',
  },
  {
    ...PRESET_USERS[1],
    status: 'active',
    lastLogin: '30 Sep 2026, 07:55',
  },
  {
    ...PRESET_USERS[2],
    status: 'active',
    lastLogin: '30 Sep 2026, 09:48',
  },
  {
    id: 'user-dallas',
    username: 'dallas.permadi',
    name: 'Dallas Permadi',
    email: 'dallas.permadi@iconpln.co.id',
    role: 'NOC Engineer Shift',
    accessLevel: 'employee',
    initial: 'D',
    avatarBg: 'bg-amber-600',
    shift: 'Shift 2 (16:00 - 00:00 WIB)',
    gatewayIp: '10.12.0.2',
    status: 'active',
    lastLogin: '29 Sep 2026, 16:05',
  },
  {
    id: 'user-fahrizal',
    username: 'moch.fahrizal',
    name: 'Moch. Fahrizal',
    email: 'moch.fahrizal@iconpln.co.id',
    role: 'NOC Engineer Shift',
    accessLevel: 'employee',
    initial: 'F',
    avatarBg: 'bg-rose-600',
    shift: 'Shift 3 (00:00 - 08:00 WIB)',
    gatewayIp: '10.12.0.3',
    status: 'inactive',
    lastLogin: '28 Sep 2026, 00:30',
  },
];

// ─── Mock: Audit Log Entries ─────────────────────────────────────
interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

const MOCK_AUDIT_LOG: AuditEntry[] = [
  { id: 'a1', timestamp: '30 Sep 2026 09:48:12', actor: 'noc.admin', action: 'LOGIN', target: 'Admin Portal', ip: '10.12.100.1', severity: 'info' },
  { id: 'a2', timestamp: '30 Sep 2026 09:32:05', actor: 'rudipradnyana', action: 'TOOL_ACCESS', target: 'CEK EA POP', ip: '10.12.0.1', severity: 'info' },
  { id: 'a3', timestamp: '30 Sep 2026 08:55:41', actor: 'achmad.farisy', action: 'TASK_UPDATE', target: 'Echo Task: Migrasi DWDM Ring-3', ip: '10.12.0.254', severity: 'info' },
  { id: 'a4', timestamp: '30 Sep 2026 08:12:30', actor: 'rudipradnyana', action: 'LOGIN', target: 'Employee Portal', ip: '10.12.0.1', severity: 'info' },
  { id: 'a5', timestamp: '29 Sep 2026 23:45:18', actor: 'system', action: 'ALARM_TRIGGERED', target: 'BB Link: SBY-DPS Latency > 50ms', ip: '10.12.100.254', severity: 'warning' },
  { id: 'a6', timestamp: '29 Sep 2026 22:10:33', actor: 'dallas.permadi', action: 'TOOL_ACCESS', target: 'CHECK BACKBONE IP JAWA-BALI', ip: '10.12.0.2', severity: 'info' },
  { id: 'a7', timestamp: '29 Sep 2026 16:05:12', actor: 'dallas.permadi', action: 'LOGIN', target: 'Employee Portal', ip: '10.12.0.2', severity: 'info' },
  { id: 'a8', timestamp: '29 Sep 2026 11:22:05', actor: 'system', action: 'ALARM_CRITICAL', target: 'POP Denpasar Barat: OLT Port Down', ip: '10.12.100.254', severity: 'critical' },
  { id: 'a9', timestamp: '29 Sep 2026 08:00:01', actor: 'system', action: 'SHIFT_HANDOVER', target: 'Shift 3 → Shift 1', ip: '10.12.100.254', severity: 'info' },
  { id: 'a10', timestamp: '28 Sep 2026 14:30:55', actor: 'moch.fahrizal', action: 'REPORT_EXPORT', target: 'Weekly Alarm Summary PDF', ip: '10.12.0.3', severity: 'info' },
];

// ─── Mock: Broadcasts ─────────────────────────────────────
interface BroadcastMessage {
  id: string;
  timestamp: string;
  sender: string;
  message: string;
  priority: 'normal' | 'urgent';
  status: 'sent' | 'draft';
}

const INITIAL_BROADCASTS: BroadcastMessage[] = [
  { id: 'bc1', timestamp: '30 Sep 2026, 08:00', sender: 'NOC Central Admin', message: 'Maintenance window BB Link SMG-JKT: 01 Oct 02:00-04:00 WIB. Standby semua shift.', priority: 'urgent', status: 'sent' },
  { id: 'bc2', timestamp: '29 Sep 2026, 14:00', sender: 'NOC Central Admin', message: 'Update firmware OLT POP Surabaya Timur selesai. Semua service restored.', priority: 'normal', status: 'sent' },
  { id: 'bc3', timestamp: '28 Sep 2026, 09:00', sender: 'NOC Central Admin', message: 'Reminder: Submit log book shift sebelum handover. Format baru berlaku hari ini.', priority: 'normal', status: 'sent' },
];

// ═══════════════════════════════════════════════════════════
// Admin Dashboard Component
// ═══════════════════════════════════════════════════════════
export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { activities } = useActivity();

  const [activeNav, setActiveNav] = useState<AdminNavId>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(INITIAL_BROADCASTS);
  const [newBroadcast, setNewBroadcast] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'normal' | 'urgent'>('normal');

  // ─── Computed Stats ────────────────────────────────────
  const stats = useMemo(() => {
    const totalUsers = REGISTERED_USERS.length;
    const activeUsers = REGISTERED_USERS.filter((u) => u.status === 'active').length;
    const totalTools = INITIAL_NOC_TOOLS.length;
    const onlineTools = INITIAL_NOC_TOOLS.filter((t) => t.status === 'ONLINE').length;
    const totalAlarms = MOCK_ALARMS.length;
    const criticalAlarms = MOCK_ALARMS.filter((a) => a.severity === 'CRITICAL').length;
    const totalTasks = INITIAL_ECHO_TASKS.length;
    const doneTasks = INITIAL_ECHO_TASKS.filter((t) => t.status === 'done').length;
    return { totalUsers, activeUsers, totalTools, onlineTools, totalAlarms, criticalAlarms, totalTasks, doneTasks };
  }, []);

  // ─── Admin Sidebar Nav Items ──────────────────────────
  const navItems: { id: AdminNavId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users, badge: `${stats.totalUsers}` },
    { id: 'tools-config', label: 'Tools & Catalog', icon: Terminal, badge: `${stats.totalTools}` },
    { id: 'audit-log', label: 'Audit Log', icon: FileText, badge: `${MOCK_AUDIT_LOG.length}` },
    { id: 'alarm-policy', label: 'Alarm & Policy', icon: AlertTriangle, badge: `${stats.criticalAlarms}` },
    { id: 'broadcast', label: 'Broadcast', icon: Megaphone, badge: `${broadcasts.length}` },
    { id: 'admin-settings', label: 'Admin Settings', icon: Settings },
  ];

  // ─── Helper: Nav Button ───────────────────────────────
  const NavButton: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeNav === item.id;
    return (
      <button
        onClick={() => { setActiveNav(item.id); setIsMobileMenuOpen(false); }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
          isActive
            ? isDark
              ? 'bg-[#15233c] text-white font-semibold shadow-sm border border-indigo-500/30'
              : 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border border-indigo-200'
            : isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111a2e]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`w-4 h-4 ${
              isActive
                ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                : isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span
            className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
              isActive
                ? isDark
                  ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-800/40'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : isDark
                  ? 'text-slate-400 bg-slate-800/70'
                  : 'text-slate-600 bg-slate-100 border border-slate-200'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  // ─── Helper: Stat Card ────────────────────────────────
  const StatCard: React.FC<{
    icon: React.ElementType;
    iconBg: string;
    label: string;
    value: string | number;
    sub: string;
    subColor?: string;
  }> = ({ icon: Icon, iconBg, label, value, sub, subColor }) => (
    <div
      className={`rounded-2xl p-5 border transition-colors ${
        isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </span>
      </div>
      <div className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</div>
      <div className={`text-[11px] ${subColor || (isDark ? 'text-slate-400' : 'text-slate-500')}`}>{sub}</div>
    </div>
  );

  // ─── Handle Broadcast Send ─────────────────────────────
  const handleSendBroadcast = () => {
    if (!newBroadcast.trim()) return;
    const now = new Date();
    const ts = `${now.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const bc: BroadcastMessage = {
      id: `bc-${Date.now()}`,
      timestamp: ts,
      sender: user?.name || 'Admin',
      message: newBroadcast.trim(),
      priority: broadcastPriority,
      status: 'sent',
    };
    setBroadcasts((prev) => [bc, ...prev]);
    setNewBroadcast('');
    setBroadcastPriority('normal');
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      className={`min-h-screen selection:bg-indigo-600 selection:text-white flex transition-colors duration-150 ${
        isDark ? 'bg-[#070c17] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ═══ Mobile Backdrop ═══ */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* ═══ Admin Sidebar ═══ */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-[#0a0f1d] border-[#152033] text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        {/* Top: Logo */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          <div className="flex items-center justify-between gap-3 px-2 mb-6">
            <div onClick={() => setActiveNav('overview')} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-base leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  NOC Admin
                </h1>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Central Management
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`lg:hidden p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Section: MANAGEMENT */}
          <div className="mb-5">
            <div className={`text-[10px] font-bold tracking-wider uppercase px-3.5 mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              MANAGEMENT
            </div>
            <nav className="space-y-1">
              {navItems.slice(0, 4).map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>
          </div>

          {/* Nav Section: OPERATIONS */}
          <div className="mb-5">
            <div className={`text-[10px] font-bold tracking-wider uppercase px-3.5 mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              OPERATIONS
            </div>
            <nav className="space-y-1">
              {navItems.slice(4, 6).map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>
          </div>

          {/* Nav Section: SYSTEM */}
          <div>
            <div className={`text-[10px] font-bold tracking-wider uppercase px-3.5 mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              SYSTEM
            </div>
            <nav className="space-y-1">
              {navItems.slice(6).map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom: User Profile */}
        <div className={`p-4 border-t transition-colors ${isDark ? 'border-[#152033] bg-[#090e1c]' : 'border-slate-200 bg-slate-50/80'}`}>
          <div className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer group ${isDark ? 'hover:bg-[#121c2e]' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${user?.avatarBg || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-indigo-500/20`}>
                {user?.initial || 'N'}
              </div>
              <div className="text-left leading-tight">
                <div className={`text-sm font-semibold transition-colors truncate max-w-[120px] ${isDark ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                  {user?.name || 'Central Admin'}
                </div>
                <div className={`text-[11px] font-medium truncate max-w-[120px] ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  Administrator
                </div>
              </div>
            </div>
            <button className={`p-1 rounded ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => { if (window.confirm('Apakah Anda yakin ingin keluar dari Admin Portal?')) logout(); }}
            className={`w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ═══ Main Container ═══ */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">

        {/* ═══ Admin Top Bar ═══ */}
        <header
          className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors ${
            isDark
              ? 'bg-[#080d19]/90 border-[#152033] text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl border ${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {navItems.find((n) => n.id === activeNav)?.label || 'Overview'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* Right: theme + bell + user */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all cursor-pointer border shadow-2xs ${
                isDark
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border-amber-500/20'
                  : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
              }`}
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#131d31] border-transparent hover:border-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent hover:border-slate-200'}`}>
              <Bell className="w-5 h-5" />
              <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 animate-pulse ${isDark ? 'ring-[#080d19]' : 'ring-white'}`} />
            </div>

            <div className={`hidden sm:flex items-center gap-2 pl-3 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className={`w-8 h-8 rounded-full ${user?.avatarBg || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-xs shadow-md`}>
                {user?.initial || 'N'}
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold">{user?.name || 'Admin'}</div>
                <div className={`text-[10px] ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* ═══ Main Content Area ═══ */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-200">

            {/* ─── Page: Overview ──────────────────────────── */}
            {activeNav === 'overview' && (
              <>
                {/* Page Title */}
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Admin Overview
                  </h1>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Ringkasan operasional NOC Tools & Echo Team Portal
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} iconBg="bg-indigo-600 shadow-indigo-500/25" label="Registered Users" value={stats.totalUsers} sub={`${stats.activeUsers} aktif, ${stats.totalUsers - stats.activeUsers} nonaktif`} />
                  <StatCard icon={Terminal} iconBg="bg-emerald-600 shadow-emerald-500/25" label="NOC Tools" value={stats.totalTools} sub={`${stats.onlineTools} online, ${stats.totalTools - stats.onlineTools} standby`} subColor="text-emerald-500" />
                  <StatCard icon={AlertTriangle} iconBg="bg-rose-600 shadow-rose-500/25" label="Active Alarms" value={stats.totalAlarms} sub={`${stats.criticalAlarms} critical severity`} subColor="text-rose-400" />
                  <StatCard icon={CheckCircle2} iconBg="bg-blue-600 shadow-blue-500/25" label="Echo Tasks" value={stats.totalTasks} sub={`${stats.doneTasks} selesai, ${stats.totalTasks - stats.doneTasks} aktif`} />
                </div>

                {/* Two-Column: Recent Activity + Quick User List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Audit Activity */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Audit Activity</h2>
                      <button onClick={() => setActiveNav('audit-log')} className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                        View all <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                      {MOCK_AUDIT_LOG.slice(0, 5).map((entry) => (
                        <div key={entry.id} className={`py-3 flex items-center justify-between ${isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'} rounded-lg px-2 -mx-2 transition-colors`}>
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              entry.severity === 'critical' ? 'bg-rose-500' : entry.severity === 'warning' ? 'bg-amber-500' : 'bg-indigo-400'
                            }`} />
                            <div className="min-w-0">
                              <div className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {entry.action}: {entry.target}
                              </div>
                              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {entry.actor} · {entry.timestamp.split(' ').slice(3).join(' ')}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono shrink-0 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {entry.ip}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Quick List */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Team Members</h2>
                      <button onClick={() => setActiveNav('users')} className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      {REGISTERED_USERS.map((u) => (
                        <div key={u.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          isDark ? 'bg-[#10192b] border-[#1a2b46] hover:border-indigo-500/30' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${u.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                              {u.initial}
                            </div>
                            <div>
                              <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.name}</div>
                              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.role}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              u.accessLevel === 'admin'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {u.accessLevel}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Broadcasts */}
                <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Broadcasts</h2>
                    </div>
                    <button onClick={() => setActiveNav('broadcast')} className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                      View all <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                    {broadcasts.slice(0, 3).map((bc) => (
                      <div key={bc.id} className="py-3 flex items-start gap-3">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${bc.priority === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-blue-400'}`} />
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{bc.message}</div>
                          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bc.sender} · {bc.timestamp}</div>
                        </div>
                        {bc.priority === 'urgent' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                            URGENT
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── Page: User Management ──────────────────── */}
            {activeNav === 'users' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>User Management</h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kelola akun operator, engineer, dan administrator NOC</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-colors cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                {/* User Table */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-[#10192b] text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                          <th className="text-left px-5 py-3.5">User</th>
                          <th className="text-left px-5 py-3.5">Role</th>
                          <th className="text-left px-5 py-3.5">Access Level</th>
                          <th className="text-left px-5 py-3.5">Shift</th>
                          <th className="text-left px-5 py-3.5">Status</th>
                          <th className="text-left px-5 py-3.5">Last Login</th>
                          <th className="text-right px-5 py-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                        {REGISTERED_USERS.map((u) => (
                          <tr key={u.id} className={`transition-colors ${isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'}`}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full ${u.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md`}>{u.initial}</div>
                                <div>
                                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.name}</div>
                                  <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className={`px-5 py-4 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{u.role}</td>
                            <td className="px-5 py-4">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                                u.accessLevel === 'admin'
                                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {u.accessLevel.toUpperCase()}
                              </span>
                            </td>
                            <td className={`px-5 py-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.shift || '—'}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                <span className={`text-xs font-medium ${u.status === 'active' ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                  {u.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </td>
                            <td className={`px-5 py-4 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.lastLogin}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#1a2b46]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`} title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title="Edit">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`} title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ─── Page: Tools Config ─────────────────────── */}
            {activeNav === 'tools-config' && (
              <>
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Tools & Catalog</h1>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Konfigurasi dan monitor katalog tool NOC yang tersedia</p>
                </div>

                {/* Tool Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['LOOKUP', 'BNG', 'CHECK', 'REPORT'].map((cat) => {
                    const count = INITIAL_NOC_TOOLS.filter((t) => t.category === cat).length;
                    const colors: Record<string, string> = { LOOKUP: 'text-blue-400 bg-blue-500/10 border-blue-500/20', BNG: 'text-rose-400 bg-rose-500/10 border-rose-500/20', CHECK: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', REPORT: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
                    return (
                      <div key={cat} className={`rounded-xl p-3.5 border text-center ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                        <span className={`text-lg font-extrabold ${colors[cat]?.split(' ')[0]}`}>{count}</span>
                        <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cat}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Tools Table */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-[#10192b] text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                          <th className="text-left px-5 py-3.5">Tool Name</th>
                          <th className="text-left px-5 py-3.5">Category</th>
                          <th className="text-left px-5 py-3.5">Status</th>
                          <th className="text-left px-5 py-3.5">Latency</th>
                          <th className="text-left px-5 py-3.5">Path</th>
                          <th className="text-right px-5 py-3.5">Visibility</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                        {INITIAL_NOC_TOOLS.map((tool) => {
                          const catColor: Record<string, string> = { LOOKUP: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', BNG: 'bg-rose-500/20 text-rose-400 border border-rose-500/30', DHCP: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', CHECK: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', REPORT: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
                          return (
                            <tr key={tool.id} className={`transition-colors ${isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'}`}>
                              <td className="px-5 py-3.5">
                                <div className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{tool.name}</div>
                                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tool.description}</div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${catColor[tool.category] || 'bg-slate-500/20 text-slate-400'}`}>
                                  {tool.category}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${tool.status === 'ONLINE' ? 'bg-emerald-500' : tool.status === 'STANDBY' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                  <span className={`text-xs font-medium ${tool.status === 'ONLINE' ? 'text-emerald-500' : tool.status === 'STANDBY' ? 'text-amber-500' : 'text-rose-500'}`}>
                                    {tool.status}
                                  </span>
                                </div>
                              </td>
                              <td className={`px-5 py-3.5 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tool.latencyMs}ms</td>
                              <td className={`px-5 py-3.5 text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{tool.internalPath}</td>
                              <td className="px-5 py-3.5 text-right">
                                <span className="text-emerald-500">
                                  <Eye className="w-4 h-4 inline" />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ─── Page: Audit Log ────────────────────────── */}
            {activeNav === 'audit-log' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Audit Log</h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Riwayat lengkap aktivitas seluruh pengguna dan sistem</p>
                  </div>
                  <button className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
                    isDark ? 'border-slate-800 text-slate-300 hover:text-white hover:bg-[#131d31]' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-[#10192b] text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                          <th className="text-left px-5 py-3.5">Timestamp</th>
                          <th className="text-left px-5 py-3.5">Actor</th>
                          <th className="text-left px-5 py-3.5">Action</th>
                          <th className="text-left px-5 py-3.5">Target</th>
                          <th className="text-left px-5 py-3.5">IP Address</th>
                          <th className="text-left px-5 py-3.5">Severity</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                        {MOCK_AUDIT_LOG.map((entry) => (
                          <tr key={entry.id} className={`transition-colors ${isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'}`}>
                            <td className={`px-5 py-3.5 text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{entry.timestamp}</td>
                            <td className="px-5 py-3.5">
                              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{entry.actor}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                entry.action.includes('LOGIN') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : entry.action.includes('ALARM') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : entry.action.includes('TOOL') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {entry.action}
                              </span>
                            </td>
                            <td className={`px-5 py-3.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{entry.target}</td>
                            <td className={`px-5 py-3.5 text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{entry.ip}</td>
                            <td className="px-5 py-3.5">
                              <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                                entry.severity === 'critical' ? 'bg-rose-500' : entry.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ─── Page: Alarm & Policy ───────────────────── */}
            {activeNav === 'alarm-policy' && (
              <>
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Alarm & Policy</h1>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Konfigurasi threshold alarm, notifikasi eskalasi, dan kebijakan respons</p>
                </div>

                {/* Alarm Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={AlertTriangle} iconBg="bg-rose-600 shadow-rose-500/25" label="CRITICAL Alarms" value={MOCK_ALARMS.filter((a) => a.severity === 'CRITICAL').length} sub="Eskalasi otomatis ke supervisor" subColor="text-rose-400" />
                  <StatCard icon={AlertTriangle} iconBg="bg-amber-600 shadow-amber-500/25" label="MAJOR Alarms" value={MOCK_ALARMS.filter((a) => a.severity === 'MAJOR').length} sub="Notifikasi engineer on-duty" subColor="text-amber-400" />
                  <StatCard icon={AlertTriangle} iconBg="bg-blue-600 shadow-blue-500/25" label="MINOR Alarms" value={MOCK_ALARMS.filter((a) => a.severity === 'MINOR').length} sub="Monitoring & auto-resolve" subColor="text-blue-400" />
                </div>

                {/* Policy Configuration Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Backbone Threshold */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Wifi className="w-4 h-4 text-emerald-500" /> Backbone Link Thresholds
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Latency WARNING', value: '> 30ms', color: 'text-amber-400' },
                        { label: 'Latency CRITICAL', value: '> 50ms', color: 'text-rose-400' },
                        { label: 'Packet Loss WARNING', value: '> 0.1%', color: 'text-amber-400' },
                        { label: 'Packet Loss CRITICAL', value: '> 0.5%', color: 'text-rose-400' },
                        { label: 'Utilization WARNING', value: '> 80%', color: 'text-amber-400' },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg border ${isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'}`}>
                          <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                          <span className={`text-xs font-bold font-mono ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escalation Rules */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Zap className="w-4 h-4 text-amber-500" /> Escalation Rules
                    </h3>
                    <div className="space-y-3">
                      {[
                        { rule: 'CRITICAL alarm unacknowledged > 5 min', action: 'Notify Supervisor + Broadcast', active: true },
                        { rule: 'MAJOR alarm unacknowledged > 15 min', action: 'Auto-escalate to Shift Lead', active: true },
                        { rule: 'MINOR alarm unresolved > 2 hours', action: 'Flag for review', active: true },
                        { rule: 'Shift handover without log book', action: 'Block handover + Alert Admin', active: false },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-2.5 px-3 rounded-lg border ${isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="min-w-0 flex-1">
                            <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.rule}</div>
                            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>→ {item.action}</div>
                          </div>
                          <span className={`shrink-0 ml-3 ${item.active ? 'text-emerald-500' : 'text-slate-500'}`}>
                            {item.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Alarms Table */}
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <div className={`px-5 py-3.5 border-b flex items-center justify-between ${isDark ? 'bg-[#10192b] border-[#16233b]' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Alarms ({MOCK_ALARMS.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-[#0e1628] text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                          <th className="text-left px-5 py-3">Severity</th>
                          <th className="text-left px-5 py-3">EA Code</th>
                          <th className="text-left px-5 py-3">Customer</th>
                          <th className="text-left px-5 py-3">POP</th>
                          <th className="text-left px-5 py-3">Message</th>
                          <th className="text-left px-5 py-3">Assigned</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                        {MOCK_ALARMS.slice(0, 8).map((alarm) => (
                          <tr key={alarm.id} className={`transition-colors ${isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'}`}>
                            <td className="px-5 py-3">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                alarm.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : alarm.severity === 'MAJOR' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>{alarm.severity}</span>
                            </td>
                            <td className={`px-5 py-3 text-xs font-mono font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{alarm.eaCode}</td>
                            <td className={`px-5 py-3 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{alarm.customerName}</td>
                            <td className={`px-5 py-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{alarm.pop}</td>
                            <td className={`px-5 py-3 text-xs max-w-[200px] truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{alarm.alarmMessage}</td>
                            <td className={`px-5 py-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{alarm.assignedEngineer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ─── Page: Broadcast ────────────────────────── */}
            {activeNav === 'broadcast' && (
              <>
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Broadcast & Pengumuman</h1>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kirim pengumuman darurat atau informasi operasional ke seluruh shift</p>
                </div>

                {/* Compose Broadcast */}
                <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Send className="w-4 h-4 text-indigo-400" /> Compose New Broadcast
                  </h3>
                  <div className="space-y-3">
                    <textarea
                      value={newBroadcast}
                      onChange={(e) => setNewBroadcast(e.target.value)}
                      placeholder="Tulis pesan pengumuman untuk seluruh operator..."
                      rows={3}
                      className={`w-full rounded-xl border p-3.5 text-sm resize-none transition-all focus:outline-none focus:ring-2 ${
                        isDark
                          ? 'bg-[#080d19] border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-indigo-600/20'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className={`flex items-center gap-2 text-xs cursor-pointer select-none ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <input
                            type="checkbox"
                            checked={broadcastPriority === 'urgent'}
                            onChange={(e) => setBroadcastPriority(e.target.checked ? 'urgent' : 'normal')}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-700"
                          />
                          <span className="text-rose-400 font-semibold">Mark as URGENT</span>
                        </label>
                      </div>
                      <button
                        onClick={handleSendBroadcast}
                        disabled={!newBroadcast.trim()}
                        className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-colors cursor-pointer`}
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Broadcast</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Broadcast History */}
                <div className={`rounded-2xl border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                  <div className={`px-5 py-3.5 border-b ${isDark ? 'border-[#16233b]' : 'border-slate-200'}`}>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Broadcast History ({broadcasts.length})</h3>
                  </div>
                  <div className={`divide-y ${isDark ? 'divide-[#15233c]' : 'divide-slate-100'}`}>
                    {broadcasts.map((bc) => (
                      <div key={bc.id} className={`px-5 py-4 flex items-start gap-3 transition-colors ${isDark ? 'hover:bg-[#111c30]' : 'hover:bg-slate-50'}`}>
                        <span className={`mt-1.5 w-3 h-3 rounded-full shrink-0 flex items-center justify-center ${bc.priority === 'urgent' ? 'bg-rose-500/20' : 'bg-blue-500/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${bc.priority === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-blue-400'}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{bc.message}</div>
                          <div className={`text-[11px] mt-1 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>{bc.sender}</span>
                            <span>·</span>
                            <span>{bc.timestamp}</span>
                            {bc.priority === 'urgent' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">URGENT</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── Page: Admin Settings ───────────────────── */}
            {activeNav === 'admin-settings' && (
              <>
                <div>
                  <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Settings</h1>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Konfigurasi portal, API key, dan pengaturan sistem</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Portal Configuration */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Settings className="w-4 h-4 text-slate-400" /> Portal Configuration
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Portal Name', value: 'NOC Tools & Echo Team Portal' },
                        { label: 'Environment', value: 'Production' },
                        { label: 'Version', value: 'v2.1.0-beta' },
                        { label: 'Default Timezone', value: 'Asia/Jakarta (WIB)' },
                        { label: 'Session Timeout', value: '24 hours' },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-2.5 px-3 rounded-lg border ${isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'}`}>
                          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
                          <span className={`text-xs font-semibold font-mono ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API & Integration */}
                  <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <KeyRound className="w-4 h-4 text-amber-500" /> API & Integration Keys
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Google Gemini AI', status: 'active', key: 'AIza•••••••' },
                        { label: 'SNMP Polling Gateway', status: 'active', key: '10.12.100.254' },
                        { label: 'RADIUS Server', status: 'active', key: '10.12.200.1' },
                        { label: 'Webhook Notifier', status: 'inactive', key: 'Not configured' },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-2.5 px-3 rounded-lg border ${isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'}`}>
                          <div>
                            <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.label}</div>
                            <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.key}</div>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
