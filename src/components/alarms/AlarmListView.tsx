import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface CleanAlarmRecord {
  id: string;
  popCode: string;
  popDetail: string;
  badgeType: string;
  ipAddress: string;
  problemType: string;
  regional: string;
  brand: string;
  equipment: string;
  noTiket: string;
  updateSbu: string;
  waktuClearAlarm: string;
  statusNms: 'ALARM' | 'CLEAR';
  statusIcrm: 'OPEN' | 'CLOSED';
}

const INITIAL_ALARM_RECORDS: CleanAlarmRecord[] = [
  {
    id: 'ea-1',
    popCode: 'POP_1BKJ10000',
    popDetail: 'POP_1BKJ10000_KANTOR CAMAT PUTERI BETUNG...',
    badgeType: 'POP-D',
    ipAddress: '172.30.116.243',
    problemType: 'COMM LOST',
    regional: 'SUMBAGUT',
    brand: 'Hariff',
    equipment: 'Recty',
    noTiket: '—',
    updateSbu: '—',
    waktuClearAlarm: '2026-07-22 16:45',
    statusNms: 'CLEAR',
    statusIcrm: 'CLOSED',
  },
  {
    id: 'ea-2',
    popCode: 'POP_1KPI00001',
    popDetail: 'POP_1KPI00001_KOTA PINANG GI SHELTER PLN',
    badgeType: 'POP-D',
    ipAddress: '172.25.96.187',
    problemType: 'COMM LOST',
    regional: 'SUMBAGUT',
    brand: 'Hariff',
    equipment: 'Recty',
    noTiket: 'A0519269',
    updateSbu: '—',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'OPEN',
  },
  {
    id: 'ea-3',
    popCode: 'POP_1JKT00122',
    popDetail: 'POP_1JKT00122_GANDUL GI 150KV SHELTER TELKOM',
    badgeType: 'POP-A',
    ipAddress: '172.28.14.88',
    problemType: 'HIGH ATTN',
    regional: 'JAKARTA & BANTEN',
    brand: 'Huawei',
    equipment: 'Batt',
    noTiket: 'A0519302',
    updateSbu: 'Pergantian module rectifier sedang dijadwalkan tim regional',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'OPEN',
  },
  {
    id: 'ea-4',
    popCode: 'POP_2SBY00311',
    popDetail: 'POP_2SBY00311_SURABAYA BARAT RUNGKUT SIER',
    badgeType: 'POP-B',
    ipAddress: '172.29.45.102',
    problemType: 'COMM LOST',
    regional: 'JAWA TIMUR',
    brand: 'ZTE',
    equipment: 'Batt',
    noTiket: 'A0519114',
    updateSbu: 'Update SBU: Listrik PLN padam, backup genset beroperasi normal',
    waktuClearAlarm: '2026-08-14 11:20',
    statusNms: 'CLEAR',
    statusIcrm: 'CLOSED',
  },
  {
    id: 'ea-5',
    popCode: 'POP_3BDG00045',
    popDetail: 'POP_3BDG00045_BANDUNG DAGO ATAS SHELTER',
    badgeType: 'POP-C',
    ipAddress: '172.27.80.15',
    problemType: 'PORT DOWN',
    regional: 'JAWA BARAT',
    brand: 'Hariff',
    equipment: 'TSM Sinergi',
    noTiket: 'A0519280',
    updateSbu: 'Pengecekan tim SBU kabel drop optik tergesek pohon',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'OPEN',
  },
  {
    id: 'ea-6',
    popCode: 'POP_4MKS00019',
    popDetail: 'POP_4MKS00019_MAKASSAR PANAKKUKANG POP-D',
    badgeType: 'POP-D',
    ipAddress: '172.31.200.74',
    problemType: 'COMM LOST',
    regional: 'INDONESIA TIMUR',
    brand: 'Huawei',
    equipment: 'SIMON Hariff',
    noTiket: '—',
    updateSbu: '—',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'CLOSED',
  },
  {
    id: 'ea-7',
    popCode: 'POP_5SMG00078',
    popDetail: 'POP_5SMG00078_SEMARANG CANDI GI 150KV',
    badgeType: 'POP-B',
    ipAddress: '172.26.110.33',
    problemType: 'OPTIC LOSS',
    regional: 'JAWA TENGAH',
    brand: 'ZTE',
    equipment: 'Recty',
    noTiket: 'A0518900',
    updateSbu: 'Splicing core DWDM selesai, redaman stabil -18dBm',
    waktuClearAlarm: '2026-09-02 08:30',
    statusNms: 'CLEAR',
    statusIcrm: 'CLOSED',
  },
  {
    id: 'ea-8',
    popCode: 'POP_6DPS00021',
    popDetail: 'POP_6DPS00021_DENPASAR SANUR BEACH RESORT',
    badgeType: 'POP-A',
    ipAddress: '172.29.199.12',
    problemType: 'COMM LOST',
    regional: 'BALINUSRA',
    brand: 'Hariff',
    equipment: 'SBR',
    noTiket: 'A0519340',
    updateSbu: '—',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'OPEN',
  },
  {
    id: 'ea-9',
    popCode: 'POP_7BJM00062',
    popDetail: 'POP_7BJM00062_BANJARMASIN KM 6 SHELTER',
    badgeType: 'POP-C',
    ipAddress: '172.30.88.91',
    problemType: 'INVERTER FAIL',
    regional: 'KALIMANTAN',
    brand: 'Hariff',
    equipment: 'Inverter',
    noTiket: 'A0519188',
    updateSbu: 'Perbaikan modul inverter selesai, power normal',
    waktuClearAlarm: '2026-09-10 14:15',
    statusNms: 'CLEAR',
    statusIcrm: 'CLOSED',
  },
  {
    id: 'ea-10',
    popCode: 'POP_8PLB00014',
    popDetail: 'POP_8PLB00014_PALEMBANG BUKIT BESAR SHELTER',
    badgeType: 'POP-B',
    ipAddress: '172.24.150.21',
    problemType: 'COMM LOST',
    regional: 'SUMBAGSEL',
    brand: 'ZTE',
    equipment: 'Recty',
    noTiket: 'A0519315',
    updateSbu: '—',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'OPEN',
  },
  {
    id: 'ea-11',
    popCode: 'POP_9PKU00008',
    popDetail: 'POP_9PKU00008_PEKANBARU SUDIRMAN GI 150KV',
    badgeType: 'POP-D',
    ipAddress: '172.23.60.105',
    problemType: 'COMM LOST',
    regional: 'SUMBAGTENG',
    brand: 'Hariff',
    equipment: 'Batt',
    noTiket: '—',
    updateSbu: '—',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'CLOSED',
  },
  {
    id: 'ea-12',
    popCode: 'POP_1CLP10002',
    popDetail: 'POP_1CLP10002_CILACAP KROYA GI SHELTER',
    badgeType: 'POP-D',
    ipAddress: '172.26.115.19',
    problemType: 'COMM LOST',
    regional: 'JAWA TENGAH',
    brand: 'Hariff',
    equipment: 'Recty',
    noTiket: 'A0519288',
    updateSbu: 'Perlu diganti EA nya sudah kirim tim masih blm bisa',
    waktuClearAlarm: '—',
    statusNms: 'ALARM',
    statusIcrm: 'OPEN',
  }
];

const REGIONAL_STATS = [
  { name: 'JAKARTA & BANTEN', shortName: 'JAKARTA & B...', active: 121, total: 173 },
  { name: 'JAWA TIMUR', shortName: 'JAWA TIMUR', active: 87, total: 139 },
  { name: 'JAWA BARAT', shortName: 'JAWA BARAT', active: 48, total: 157 },
  { name: 'INDONESIA TIMUR', shortName: 'INDONESIA TI...', active: 44, total: 114 },
  { name: 'SUMBAGUT', shortName: 'SUMBAGUT', active: 32, total: 57 },
  { name: 'JAWA TENGAH', shortName: 'JAWA TENGAH', active: 10, total: 62 },
  { name: 'KALIMANTAN', shortName: 'KALIMANTAN', active: 8, total: 57 },
  { name: 'BALINUSRA', shortName: 'BALINUSRA', active: 8, total: 39 },
  { name: 'SUMBAGSEL', shortName: 'SUMBAGSEL', active: 7, total: 24 },
  { name: 'SUMBAGTENG', shortName: 'SUMBAGTENG', active: 2, total: 30 },
];

export const AlarmListView: React.FC = () => {
  const [records, setRecords] = useState<CleanAlarmRecord[]>(INITIAL_ALARM_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegional, setSelectedRegional] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('ALL');
  const [selectedStatusNms, setSelectedStatusNms] = useState<string>('ALL');
  const [selectedStatusIcrm, setSelectedStatusIcrm] = useState<string>('ALL');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Copy IP handler
  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 1500);
  };

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Select all handler
  const handleToggleSelectAll = () => {
    if (selectedRowIds.size === filteredRecords.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Export to CSV/Excel
  const handleExportExcel = () => {
    const headers = [
      'POP Code',
      'Detail',
      'IP Address',
      'Problem',
      'Regional',
      'Brand',
      'Equipment',
      'No Tiket',
      'Update SBU',
      'Waktu Clear',
      'Status NMS',
      'Status iCRM'
    ];
    const rows = filteredRecords.map((r) => [
      r.popCode,
      `"${r.popDetail}"`,
      r.ipAddress,
      r.problemType,
      r.regional,
      r.brand,
      r.equipment,
      r.noTiket,
      `"${r.updateSbu}"`,
      r.waktuClearAlarm,
      r.statusNms,
      r.statusIcrm
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Clean_Alarm_EA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.popCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.popDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.noTiket.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegional = selectedRegional === 'ALL' || r.regional === selectedRegional;
      const matchesBrand = selectedBrand === 'ALL' || r.brand === selectedBrand;
      const matchesEquipment = selectedEquipment === 'ALL' || r.equipment === selectedEquipment;
      const matchesNms = selectedStatusNms === 'ALL' || r.statusNms === selectedStatusNms;
      const matchesIcrm = selectedStatusIcrm === 'ALL' || r.statusIcrm === selectedStatusIcrm;

      return matchesSearch && matchesRegional && matchesBrand && matchesEquipment && matchesNms && matchesIcrm;
    });
  }, [records, searchQuery, selectedRegional, selectedBrand, selectedEquipment, selectedStatusNms, selectedStatusIcrm]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Page Header matching SCR-20260917-jbuf.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Clean Alarm EA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring, pembersihan alarm NMS dan penyelarasan tiket iCRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Cards matching SCR-20260917-jbuf.png */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Alarm */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">852</div>
            <div className="text-xs text-slate-500 font-medium">Total Alarm</div>
          </div>
        </div>

        {/* Card 2: Active Alarm (NMS) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">367</div>
            <div className="text-xs text-slate-500 font-medium">Active Alarm (NMS)</div>
          </div>
        </div>

        {/* Card 3: Cleared (NMS) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">485</div>
            <div className="text-xs text-slate-500 font-medium">Cleared (NMS)</div>
          </div>
        </div>

        {/* Card 4: Tiket OPEN (iCRM) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">85</div>
            <div className="text-xs text-slate-500 font-medium">Tiket OPEN (iCRM)</div>
          </div>
        </div>

        {/* Card 5: CLOSED (iCRM) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">403</div>
            <div className="text-xs text-slate-500 font-medium">CLOSED (iCRM)</div>
          </div>
        </div>
      </div>

      {/* Section: Alarm Aktif per Regional matching SCR-20260917-jbuf.png */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Alarm Aktif per Regional</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {REGIONAL_STATS.map((reg) => {
            const isSelected = selectedRegional === reg.name;
            return (
              <div
                key={reg.name}
                onClick={() => setSelectedRegional(isSelected ? 'ALL' : reg.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 bg-white ${
                  isSelected
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Red square indicator matching screenshot */}
                <div className="w-7 h-7 rounded-lg border border-rose-400 bg-rose-50/70 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-black text-rose-500 leading-none">
                    {reg.active}
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight truncate mt-0.5">
                    {reg.shortName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    dari {reg.total} total alarm
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: Filter & Pencarian matching SCR-20260917-jbuf.png */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
          <Filter className="w-4 h-4" />
          <span className="text-slate-800">Filter & Pencarian</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari POP, IP, No Tiket..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Regional Filter */}
          <div>
            <select
              value={selectedRegional}
              onChange={(e) => setSelectedRegional(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Regional (10)</option>
              {REGIONAL_STATS.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Brand (3)</option>
              <option value="Hariff">Hariff</option>
              <option value="Huawei">Huawei</option>
              <option value="ZTE">ZTE</option>
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Equipment (7)</option>
              <option value="Recty">Recty</option>
              <option value="Batt">Batt</option>
              <option value="TSM Sinergi">TSM Sinergi</option>
              <option value="SIMON Hariff">SIMON Hariff</option>
              <option value="SBR">SBR</option>
              <option value="Inverter">Inverter</option>
            </select>
          </div>

          {/* Status NMS Filter */}
          <div>
            <select
              value={selectedStatusNms}
              onChange={(e) => setSelectedStatusNms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Status NMS</option>
              <option value="ALARM">ALARM</option>
              <option value="CLEAR">CLEAR</option>
            </select>
          </div>
        </div>

        {/* Second Filter row (Status iCRM & Clear Filter) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="w-48">
            <select
              value={selectedStatusIcrm}
              onChange={(e) => setSelectedStatusIcrm(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Status iCRM</option>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {(selectedRegional !== 'ALL' || selectedBrand !== 'ALL' || selectedEquipment !== 'ALL' || selectedStatusNms !== 'ALL' || selectedStatusIcrm !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedRegional('ALL');
                setSelectedBrand('ALL');
                setSelectedEquipment('ALL');
                setSelectedStatusNms('ALL');
                setSelectedStatusIcrm('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Table matching SCR-20260917-jbuf.png */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.size === filteredRecords.length && filteredRecords.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5 min-w-[220px]">POP & DETAIL</th>
                <th className="p-3.5 min-w-[150px]">IP ADDRESS</th>
                <th className="p-3.5 min-w-[160px]">REGIONAL & BRAND</th>
                <th className="p-3.5 min-w-[110px]">EQUIPMENT</th>
                <th className="p-3.5 min-w-[110px]">NO TIKET</th>
                <th className="p-3.5 min-w-[180px]">UPDATE SBU</th>
                <th className="p-3.5 min-w-[130px]">WAKTU CLEAR ALARM</th>
                <th className="p-3.5 min-w-[100px]">STATUS NMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ada alarm yang sesuai dengan filter atau pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((row) => {
                  const isChecked = selectedRowIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(row.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* POP & Detail */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 underline cursor-pointer hover:text-blue-600">
                          {row.popCode}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[240px] mt-0.5">
                          {row.popDetail}
                        </div>
                        <div className="mt-1">
                          <span className="inline-block px-1.5 py-0.2 rounded border border-blue-300 text-blue-700 text-[10px] font-semibold bg-blue-50/60">
                            {row.badgeType}
                          </span>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-slate-800 font-semibold">
                          <span>{row.ipAddress}</span>
                          <button
                            onClick={() => handleCopyIp(row.ipAddress)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                            title="Copy IP"
                          >
                            {copiedIp === row.ipAddress ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tight mt-0.5">
                          {row.problemType}
                        </div>
                      </td>

                      {/* Regional & Brand */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">
                          {row.regional}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Brand: <span className="font-semibold text-slate-700">{row.brand}</span>
                        </div>
                      </td>

                      {/* Equipment */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                          {row.equipment}
                        </span>
                      </td>

                      {/* No Tiket */}
                      <td className="p-3.5">
                        {row.noTiket !== '—' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-mono text-xs font-semibold">
                            {row.noTiket}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Update SBU */}
                      <td className="p-3.5 text-slate-600 text-[11px] max-w-[200px] truncate">
                        {row.updateSbu}
                      </td>

                      {/* Waktu Clear Alarm */}
                      <td className="p-3.5 font-mono text-slate-700 text-[11px]">
                        {row.waktuClearAlarm}
                      </td>

                      {/* Status NMS */}
                      <td className="p-3.5">
                        {row.statusNms === 'CLEAR' ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            CLEAR
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-bold text-rose-600 text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            ALARM
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <strong className="text-slate-700">{filteredRecords.length}</strong> dari{' '}
            <strong className="text-slate-700">{records.length}</strong> entri alarm EA
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 disabled:opacity-50">
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
