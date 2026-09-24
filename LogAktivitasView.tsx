import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  RefreshCw,
  User,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  editor: string;
  popId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
}

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-16 09:18:09',
    editor: 'muhammad.tasir',
    popId: 'CUST_2PWT1013',
    fieldChanged: 'Update SBU',
    oldValue: '—',
    newValue: 'Butuh penggantian perangkat EA karena masih belum bisa',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-16 09:15:29',
    editor: 'muhammad.tasir',
    popId: 'CUST_2PWR033_',
    fieldChanged: 'Update SBU',
    oldValue: '—',
    newValue: 'update dr SBU Hasil Chek Normal, di NMS msh Alarm',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-16 09:15:15',
    editor: 'muhammad.tasir',
    popId: 'CUST_2PWD1002',
    fieldChanged: 'Update SBU',
    oldValue: '—',
    newValue: 'MCT masih commlost butu pergantian simoon',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-16 09:12:55',
    editor: 'muhammad.tasir',
    popId: 'POP_1CLP10002',
    fieldChanged: 'Update SBU',
    oldValue: '—',
    newValue: 'Perlu di ganti EA nya sudah kirim tim masih blm bisa',
  },
  {
    id: 'log-5',
    timestamp: '2026-09-16 09:12:31',
    editor: 'muhammad.tasir',
    popId: 'POP_1CLP10002',
    fieldChanged: 'Update SBU',
    oldValue: '—',
    newValue: 'Perlu di ganti EA nya sudah kirim tim masih blm bisa',
  },
  {
    id: 'log-6',
    timestamp: '2026-09-16 09:07:35',
    editor: 'muhammad.tasir',
    popId: 'GITET AMPEL B',
    fieldChanged: 'Update SBU',
    oldValue: 'kemungkinan untuk perangkat TSM nya perlu di ganti sudah di aciton masih blm bisa',
    newValue: 'Perangkat TSM nya perlu di ganti sudah di aciton masih blm bisa',
  },
  {
    id: 'log-7',
    timestamp: '2026-09-11 07:52:09',
    editor: 'rahmat.iskandar',
    popId: 'POP_1GSK10050',
    fieldChanged: 'Status iCRM',
    oldValue: 'OPEN',
    newValue: 'CLOSED',
  },
  {
    id: 'log-8',
    timestamp: '2026-09-11 07:52:09',
    editor: 'rahmat.iskandar',
    popId: 'POP_1GSK10050',
    fieldChanged: 'Update NOC',
    oldValue: '—',
    newValue: 'update dr SBU: hasil pengecekan dari team internal sbu inverter di lokasi rusak, saat ini dalam proses penggantian',
  },
  {
    id: 'log-9',
    timestamp: '2026-09-10 14:30:11',
    editor: 'dede.hermawan',
    popId: 'POP_1BKJ10000',
    fieldChanged: 'Status NMS',
    oldValue: 'ALARM',
    newValue: 'CLEAR',
  },
  {
    id: 'log-10',
    timestamp: '2026-09-10 11:22:45',
    editor: 'dede.hermawan',
    popId: 'POP_1BKJ10000',
    fieldChanged: 'Waktu Clear Alarm',
    oldValue: '—',
    newValue: '2026-07-22 16:45',
  },
  {
    id: 'log-11',
    timestamp: '2026-09-09 16:45:00',
    editor: 'achmad.farisy',
    popId: 'POP_3BDG00045',
    fieldChanged: 'Update SBU',
    oldValue: '—',
    newValue: 'Tim SBU JBB sudah merapat ke lokasi ODF untuk penyambungan',
  }
];

export const LogAktivitasView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchQuery === '' ||
        log.popId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.editor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.newValue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesField = fieldFilter === 'ALL' || log.fieldChanged === fieldFilter;

      return matchesSearch && matchesField;
    });
  }, [logs, searchQuery, fieldFilter]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Page Header matching SCR-20260917-jbwk.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Log Aktivitas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Riwayat siapa mengedit alarm/tiket, field apa yang diubah, dan kapan.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Stat Card matching SCR-20260917-jbwk.png */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs max-w-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="text-3xl font-black text-slate-900 leading-tight">1790</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Total Perubahan Tercatat</div>
        </div>
      </div>

      {/* Filter & Pencarian matching SCR-20260917-jbwk.png */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
          <Filter className="w-4 h-4" />
          <span className="text-slate-800">Filter & Pencarian</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari POP ID atau nama user..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Field</option>
              <option value="Update SBU">Update SBU</option>
              <option value="Status iCRM">Status iCRM</option>
              <option value="Update NOC">Update NOC</option>
              <option value="Status NMS">Status NMS</option>
              <option value="Waktu Clear Alarm">Waktu Clear Alarm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Table matching SCR-20260917-jbwk.png */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 min-w-[160px]">TANGGAL & WAKTU</th>
                <th className="p-3.5 min-w-[160px]">DIEDIT OLEH</th>
                <th className="p-3.5 min-w-[150px]">POP ID</th>
                <th className="p-3.5 min-w-[130px]">FIELD YANG DIUBAH</th>
                <th className="p-3.5 min-w-[200px]">NILAI LAMA</th>
                <th className="p-3.5 min-w-[260px]">NILAI BARU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada log perubahan yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp */}
                    <td className="p-3.5 font-mono text-slate-700 text-[11px]">
                      {log.timestamp}
                    </td>

                    {/* Editor */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-slate-800 text-[11px]">
                          {log.editor}
                        </span>
                      </div>
                    </td>

                    {/* POP ID */}
                    <td className="p-3.5 font-bold text-slate-900 font-mono text-[11px]">
                      {log.popId}
                    </td>

                    {/* Field Changed */}
                    <td className="p-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold">
                        {log.fieldChanged}
                      </span>
                    </td>

                    {/* Old Value */}
                    <td className="p-3.5 text-slate-500 text-[11px] max-w-[220px]">
                      {log.oldValue === '—' ? (
                        <span className="text-slate-400 font-mono">—</span>
                      ) : (
                        <span>{log.oldValue}</span>
                      )}
                    </td>

                    {/* New Value */}
                    <td className="p-3.5 text-slate-900 text-[11px] font-medium max-w-[280px]">
                      {log.fieldChanged === 'Status iCRM' && log.newValue === 'CLOSED' ? (
                        <strong className="font-bold text-slate-900">{log.newValue}</strong>
                      ) : (
                        <span>{log.newValue}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <strong className="text-slate-700">{filteredLogs.length}</strong> entri log perubahan
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold">1</span>
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
