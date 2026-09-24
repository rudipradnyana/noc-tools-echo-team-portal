import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  BarChart2,
  TrendingUp,
  RefreshCw,
  Info,
  Calendar
} from 'lucide-react';

const REGIONAL_ACTIVE_DATA = [
  { name: 'JAKARTA & BANTEN', shortName: 'JAKARTA &...', count: 112 },
  { name: 'JAWA TIMUR', shortName: 'JAWA TIMUR', count: 87 },
  { name: 'JAWA BARAT', shortName: 'JAWA BARAT', count: 48 },
  { name: 'INDONESIA TIMUR', shortName: 'INDONESIA...', count: 44 },
  { name: 'SUMBAGUT', shortName: 'SUMBAGUT', count: 32 },
  { name: 'JAWA TENGAH', shortName: 'JAWA TENG...', count: 10 },
  { name: 'KALIMANTAN', shortName: 'KALIMANTAN', count: 8 },
  { name: 'BALINUSRA', shortName: 'BALINUSRA', count: 8 },
  { name: 'SUMBAGSEL', shortName: 'SUMBAGSEL', count: 7 },
  { name: 'SUMBAGTENG', shortName: 'SUMBAGTENG', count: 2 },
];

const EQUIPMENT_DATA: Record<string, { name: string; count: number }[]> = {
  ALL: [
    { name: 'Batt', count: 150 },
    { name: 'Recty', count: 108 },
    { name: 'TSM Sinergi', count: 48 },
    { name: 'SIMON Hariff', count: 42 },
    { name: 'SBR', count: 8 },
    { name: 'Inverter', count: 3 },
  ],
  'JAKARTA & BANTEN': [
    { name: 'Batt', count: 52 },
    { name: 'Recty', count: 34 },
    { name: 'TSM Sinergi', count: 14 },
    { name: 'SIMON Hariff', count: 10 },
    { name: 'SBR', count: 2 },
    { name: 'Inverter', count: 0 },
  ],
  'JAWA TIMUR': [
    { name: 'Batt', count: 41 },
    { name: 'Recty', count: 28 },
    { name: 'TSM Sinergi', count: 10 },
    { name: 'SIMON Hariff', count: 7 },
    { name: 'SBR', count: 1 },
    { name: 'Inverter', count: 0 },
  ],
  'JAWA BARAT': [
    { name: 'Batt', count: 18 },
    { name: 'Recty', count: 16 },
    { name: 'TSM Sinergi', count: 8 },
    { name: 'SIMON Hariff', count: 5 },
    { name: 'SBR', count: 1 },
    { name: 'Inverter', count: 0 },
  ],
};

const TIMELINE_DATA = [
  { date: '1 Jul', count: 12 },
  { date: '7 Jul', count: 18 },
  { date: '9 Jul', count: 24 },
  { date: '10 Jul', count: 35 },
  { date: '13 Jul', count: 77 },
  { date: '14 Jul', count: 42 },
  { date: '15 Jul', count: 31 },
  { date: '16 Jul', count: 28 },
  { date: '17 Jul', count: 20 },
  { date: '18 Jul', count: 14 },
  { date: '19 Jul', count: 9 },
  { date: '20 Jul', count: 16 },
  { date: '21 Jul', count: 22 },
  { date: '22 Jul', count: 30 },
  { date: '23 Jul', count: 19 },
  { date: '24 Jul', count: 15 },
  { date: '27 Jul', count: 25 },
  { date: '28 Jul', count: 33 },
  { date: '29 Jul', count: 21 },
  { date: '30 Jul', count: 18 },
  { date: '31 Jul', count: 12 },
  { date: '3 Agu', count: 20 },
  { date: '4 Agu', count: 26 },
  { date: '5 Agu', count: 31 },
  { date: '7 Agu', count: 17 },
  { date: '10 Agu', count: 22 },
  { date: '11 Agu', count: 29 },
  { date: '12 Agu', count: 18 },
  { date: '13 Agu', count: 14 },
  { date: '14 Agu', count: 16 },
  { date: '18 Agu', count: 24 },
  { date: '19 Agu', count: 28 },
  { date: '20 Agu', count: 20 },
  { date: '21 Agu', count: 15 },
  { date: '24 Agu', count: 19 },
  { date: '26 Agu', count: 25 },
  { date: '27 Agu', count: 10 },
  { date: '1 Sep', count: 18 },
  { date: '3 Sep', count: 24 },
  { date: '7 Sep', count: 32 },
  { date: '8 Sep', count: 45 },
  { date: '9 Sep', count: 72 },
  { date: '10 Sep', count: 38 },
];

export const ProgressChartView: React.FC = () => {
  const [selectedRegional, setSelectedRegional] = useState<string>('ALL');
  const [hoveredTimelineIndex, setHoveredTimelineIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const currentEquipment = EQUIPMENT_DATA[selectedRegional] || EQUIPMENT_DATA.ALL;

  // Donut chart calculations (367 active = 43.1%, 485 clear = 56.9%)
  // Circumference of radius 58: 2 * pi * 58 = 364.42
  const circ = 2 * Math.PI * 58;
  const activeOffset = circ * 0.431;

  // SVG Area path for Timeline
  const width = 1100;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;
  const maxVal = 80;

  const points = TIMELINE_DATA.map((d, i) => {
    const x = paddingX + (i / (TIMELINE_DATA.length - 1)) * innerW;
    const y = height - paddingY - (d.count / maxVal) * innerH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header matching SCR-20260917-jbxq.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Progress Chart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Distribusi status alarm EA di NMS.
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

      {/* Top Grid (3 Cards) matching SCR-20260917-jbxq.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Status Alarm di NMS (Donut) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <PieIcon className="w-4 h-4 text-slate-600" />
              <span>Status Alarm di NMS</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Perbandingan alarm yang masih ALARM dan yang sudah CLEAR.
            </p>
          </div>

          <div className="py-6 flex items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                {/* Background full circle (Cleared = Green) */}
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="transparent"
                  stroke="#34d399"
                  strokeWidth="20"
                />
                {/* Partial circle (Active = Red) */}
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="transparent"
                  stroke="#f87171"
                  strokeWidth="20"
                  strokeDasharray={`${activeOffset} ${circ}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-800 leading-none">852</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#f87171] mt-0.5 shrink-0"></span>
                <div>
                  <div className="text-slate-600 font-medium">Alarm Aktif:</div>
                  <div className="font-bold text-slate-900">367 alarm (43.1%)</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#34d399] mt-0.5 shrink-0"></span>
                <div>
                  <div className="text-slate-600 font-medium">Cleared:</div>
                  <div className="font-bold text-slate-900">485 alarm (56.9%)</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-slate-500 font-medium text-[11px]">
                Total: <strong className="text-slate-900">852</strong> alarm
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            Penyelarasan real-time NMS EA
          </div>
        </div>

        {/* Card 2: Alarm Aktif per Regional (Bar Chart) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Alarm Aktif per Regional</span>
              </div>
              {selectedRegional !== 'ALL' && (
                <button
                  onClick={() => setSelectedRegional('ALL')}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Klik salah satu bar untuk melihat rincian per equipment pada regional tersebut.
            </p>
          </div>

          {/* Bars */}
          <div className="py-4 space-y-2">
            {REGIONAL_ACTIVE_DATA.map((reg) => {
              const maxReg = 120;
              const pct = (reg.count / maxReg) * 100;
              const isSelected = selectedRegional === reg.name;

              return (
                <div
                  key={reg.name}
                  onClick={() => setSelectedRegional(isSelected ? 'ALL' : reg.name)}
                  className={`group flex items-center gap-2 text-[11px] cursor-pointer p-1 rounded-lg transition-colors ${
                    isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="w-24 text-slate-600 font-medium truncate shrink-0">
                    {reg.shortName}
                  </span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden flex items-center">
                    <div
                      className={`h-full transition-all ${
                        isSelected ? 'bg-blue-600' : 'bg-blue-500 group-hover:bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                  <span className="w-7 text-right font-bold text-slate-800 text-[11px]">
                    {reg.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Regional aktif terpilih: <strong className="text-blue-600">{selectedRegional}</strong>
          </div>
        </div>

        {/* Card 3: Alarm Aktif per Equipment (Bar Chart) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <span>Alarm Aktif per Equipment</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {selectedRegional === 'ALL'
                ? 'Semua regional (klik bar regional di sebelah kiri untuk filter)'
                : `Menampilkan equipment untuk: ${selectedRegional}`}
            </p>
          </div>

          {/* Bars */}
          <div className="py-6 space-y-3.5">
            {currentEquipment.map((eq) => {
              const maxEq = 160;
              const pct = (eq.count / maxEq) * 100;

              return (
                <div key={eq.name} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-slate-700 font-medium truncate shrink-0">
                    {eq.name}
                  </span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-sm overflow-hidden flex items-center">
                    <div
                      className="h-full bg-emerald-500 transition-all rounded-r-xs"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-slate-800">
                    {eq.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Kategori alarm equipment terbanyak: <strong className="text-emerald-600">Batt (Baterai)</strong>
          </div>
        </div>
      </div>

      {/* Bottom Wide Card: Waktu Clear Alarm per Regional matching SCR-20260917-jbxq.png */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Waktu Clear Alarm per Regional</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {selectedRegional === 'ALL'
                ? 'Semua regional (klik bar regional di atas untuk filter)'
                : `Tren penyelesaian alarm untuk: ${selectedRegional}`}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Cleared Alarms
            </span>
          </div>
        </div>

        {/* Responsive Area Chart */}
        <div className="relative w-full overflow-x-auto pt-2">
          <div className="min-w-[800px]">
            <svg className="w-full h-56" viewBox={`0 0 ${width} ${height}`}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 20, 40, 60, 80].map((val) => {
                const y = height - paddingY - (val / maxVal) * innerH;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <path d={areaD} fill="url(#purpleGradient)" />

              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredTimelineIndex === idx;
                const isPeak = pt.count >= 70;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredTimelineIndex(idx)}
                    onMouseLeave={() => setHoveredTimelineIndex(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : isPeak ? 3.5 : 2}
                      fill={isPeak || isHovered ? '#8b5cf6' : '#a78bfa'}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1}
                    />

                    {/* Peak value label */}
                    {(isPeak || isHovered) && (
                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        fill="#6d28d9"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {pt.count}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* X Axis dates */}
              {points.map((pt, idx) => {
                if (idx % 2 !== 0 && idx !== points.length - 1) return null;
                return (
                  <text
                    key={idx}
                    x={pt.x}
                    y={height - 10}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {pt.date}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hover info banner */}
        {hoveredTimelineIndex !== null && (
          <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs text-purple-900">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Tanggal: <strong>{TIMELINE_DATA[hoveredTimelineIndex].date} 2026</strong></span>
            </div>
            <div>
              Total Alarm Diselesaikan: <strong className="text-purple-700 text-sm">{TIMELINE_DATA[hoveredTimelineIndex].count}</strong>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
