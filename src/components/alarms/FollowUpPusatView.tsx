import React, { useState } from 'react';
import {
  Users,
  RefreshCw,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface PersonilPerformance {
  username: string;
  name: string;
  avatarChar: string;
  avatarBg: string;
  badgeTheme: 'blue' | 'emerald';
  regionals: string[];
  clearPeriode: number;
  rataRataHari: number;
  peakHarian: number;
  totalSemua: number;
  timeline: { date: string; value: number }[];
  regionalBreakdown: { regional: string; count: number }[];
}

const PERSONIL_DATA: PersonilPerformance[] = [
  {
    username: 'rahmat.iskandar',
    name: 'Rahmat Iskandar',
    avatarChar: 'R',
    avatarBg: 'bg-blue-600',
    badgeTheme: 'blue',
    regionals: ['JAWA TENGAH', 'JAWA TIMUR', 'KALIMANTAN', 'SUMBAGSEL', 'SUMBAGTENG', 'SUMBAGUT'],
    clearPeriode: 1,
    rataRataHari: 0.1,
    peakHarian: 1,
    totalSemua: 184,
    timeline: [
      { date: '27 Agu', value: 0 },
      { date: '1 Sep', value: 0 },
      { date: '3 Sep', value: 1 },
      { date: '7 Sep', value: 0 },
      { date: '8 Sep', value: 0 },
      { date: '9 Sep', value: 0 },
      { date: '10 Sep', value: 0 },
    ],
    regionalBreakdown: [
      { regional: 'JAWA TENGAH', count: 1 },
      { regional: 'JAWA TIMUR', count: 0 },
      { regional: 'KALIMANTAN', count: 0 },
      { regional: 'SUMBAGSEL', count: 0 },
      { regional: 'SUMBAGTENG', count: 0 },
      { regional: 'SUMBAGUT', count: 0 },
    ],
  },
  {
    username: 'dede.hermawan',
    name: 'Dede Hermawan',
    avatarChar: 'D',
    avatarBg: 'bg-emerald-600',
    badgeTheme: 'emerald',
    regionals: ['BALINUSRA', 'INDONESIA TIMUR', 'JAKARTA & BANTEN', 'JAWA BARAT'],
    clearPeriode: 81,
    rataRataHari: 11.6,
    peakHarian: 74,
    totalSemua: 268,
    timeline: [
      { date: '27 Agu', value: 0 },
      { date: '1 Sep', value: 0 },
      { date: '3 Sep', value: 0 },
      { date: '7 Sep', value: 1 },
      { date: '8 Sep', value: 0 },
      { date: '9 Sep', value: 74 },
      { date: '10 Sep', value: 6 },
    ],
    regionalBreakdown: [
      { regional: 'JAWA BARAT', count: 76 },
      { regional: 'JAKARTA & BANTEN', count: 4 },
      { regional: 'BALINUSRA', count: 1 },
      { regional: 'INDONESIA TIMUR', count: 0 },
    ],
  },
];

export const FollowUpPusatView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7' | '15' | '30' | 'ALL'>('7');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header matching SCR-20260917-jbyw.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            FollowUp Pusat
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penilaian kinerja follow-up per personil PUSAT, berdasarkan regional yang menjadi tanggung jawabnya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            {(['7', '15', '30', 'ALL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'ALL' ? 'Semua' : `${r} Hari`}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Personil Cards matching SCR-20260917-jbyw.png */}
      <div className="space-y-6">
        {PERSONIL_DATA.map((p) => {
          const isEmerald = p.badgeTheme === 'emerald';
          const strokeColor = isEmerald ? '#10b981' : '#3b82f6';
          const fillColor = isEmerald ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)';
          const maxVal = Math.max(...p.timeline.map((t) => t.value), 1);

          // SVG mini chart dimensions
          const chartW = 700;
          const chartH = 120;
          const padX = 30;
          const padY = 25;
          const innerW = chartW - padX * 2;
          const innerH = chartH - padY * 2;

          const points = p.timeline.map((t, i) => {
            const x = padX + (i / (p.timeline.length - 1)) * innerW;
            const y = chartH - padY - (t.value / (maxVal * 1.15)) * innerH;
            return { x, y, ...t };
          });

          const pathD = points.reduce((acc, pt, i) => {
            return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
          }, '');

          const areaD = `${pathD} L ${points[points.length - 1].x},${chartH - padY} L ${points[0].x},${chartH - padY} Z`;

          return (
            <div
              key={p.username}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6"
            >
              {/* Top Row: User details & Stats */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
                {/* User info & Assigned Regionals */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${p.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                      {p.avatarChar}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-tight">
                        {p.username}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        PIC Regional Enterprise Access
                      </p>
                    </div>
                  </div>

                  {/* Regional Badges matching screenshot */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.regionals.map((r) => (
                      <span
                        key={r}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                          isEmerald
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Stats on the right matching screenshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  <div className="text-center sm:text-left">
                    <div className={`text-2xl font-black ${isEmerald ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {p.clearPeriode}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Clear (periode)
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-black text-slate-800">
                      {p.rataRataHari}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Rata-rata/hari
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-black text-slate-800">
                      {p.peakHarian}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Peak harian
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-black text-slate-800">
                      {p.totalSemua}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Total (semua)
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart section */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <TrendingUp className={`w-3.5 h-3.5 ${isEmerald ? 'text-emerald-600' : 'text-blue-600'}`} />
                  <span>Tren Penyelesaian Harian</span>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <svg className="w-full h-32" viewBox={`0 0 ${chartW} ${chartH}`}>
                      {/* Grid line */}
                      <line
                        x1={padX}
                        y1={chartH - padY}
                        x2={chartW - padX}
                        y2={chartH - padY}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />

                      {/* Area */}
                      <path d={areaD} fill={fillColor} />

                      {/* Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {points.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={pt.value > 0 ? 4 : 2.5}
                            fill={pt.value > 0 ? strokeColor : '#94a3b8'}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          {pt.value > 0 && (
                            <text
                              x={pt.x}
                              y={pt.y - 8}
                              fill={strokeColor}
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {pt.value}
                            </text>
                          )}
                          {/* X date */}
                          <text
                            x={pt.x}
                            y={chartH - 8}
                            fill="#94a3b8"
                            fontSize="9"
                            textAnchor="middle"
                          >
                            {pt.date}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Regional Breakdown count pills matching SCR-20260917-jbyw.png */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {p.regionalBreakdown.map((item) => (
                    <div
                      key={item.regional}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                        item.count > 0
                          ? isEmerald
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <span className="font-semibold">{item.regional}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        item.count > 0
                          ? isEmerald
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
