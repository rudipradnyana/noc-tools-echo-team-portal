import React, { useState } from 'react';
import { 
  BellRing, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  User, 
  Building, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AlarmItem } from '../../types';
import { MOCK_ALARMS } from '../../data/mockData';

export const CleanAlarmView: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(MOCK_ALARMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'MAJOR' | 'MINOR'>('ALL');
  const [clearingId, setClearingId] = useState<string | null>(null);

  const filteredAlarms = alarms.filter((a) => {
    const matchesSearch =
      a.eaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.pop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.alarmMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleClearAlarm = (alarmId: string) => {
    setClearingId(alarmId);
    setTimeout(() => {
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === alarmId ? { ...a, acknowledged: true, alarmMessage: 'Resolved: Redaman optik normal (-17.9 dBm)' } : a
        )
      );
      setClearingId(null);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                NOC Alarm Incident
              </span>
              <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
                <BellRing className="w-6 h-6 text-rose-400" />
                Clean Alarm EA (Enterprise Access Trouble Ticket)
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manajemen alarm redaman optik tinggi, port down, dan degradasi link sirkuit pelanggan EA secara terpusat.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Pending Alarms: <strong className="text-rose-400">{alarms.filter((a) => !a.acknowledged).length}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari EA Code, Pelanggan, atau POP..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#101726] border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['ALL', 'CRITICAL', 'MAJOR', 'MINOR'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[#101726] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Alarms List */}
        <div className="space-y-3">
          {filteredAlarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`bg-[#101725] border rounded-xl p-5 transition-all ${
                alarm.acknowledged
                  ? 'border-emerald-500/20 bg-emerald-950/5'
                  : alarm.severity === 'CRITICAL'
                  ? 'border-rose-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        alarm.acknowledged
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : alarm.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : alarm.severity === 'MAJOR'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {alarm.acknowledged ? 'ACKNOWLEDGED / RESOLVED' : alarm.severity}
                    </span>

                    <span className="font-mono font-bold text-white text-base">
                      {alarm.eaCode}
                    </span>

                    <span className="text-xs text-slate-400">({alarm.pop})</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-200">
                    {alarm.customerName}
                  </h3>

                  <p className="text-xs text-slate-400 font-mono">
                    {alarm.alarmMessage}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alarm.timestamp}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>PIC: {alarm.assignedEngineer}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!alarm.acknowledged ? (
                    <button
                      onClick={() => handleClearAlarm(alarm.id)}
                      disabled={clearingId === alarm.id}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
                    >
                      {clearingId === alarm.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Clear Alarm EA</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cleared</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
