import React, { useState } from 'react';
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ServerHealthWidgetProps {
  onAskAi?: (prompt: string) => void;
  isCompact?: boolean;
}

type MetricKey = 'cpu' | 'ram' | 'network' | 'disk';

interface TelemetryPoint {
  time: string;
  cpu: number;
  ram: number;
  network: number; // in Gbps
  disk: number;
}

const TELEMETRY_DATA: TelemetryPoint[] = [
  { time: '00:00', cpu: 22, ram: 54, network: 14.2, disk: 43 },
  { time: '02:00', cpu: 19, ram: 53, network: 11.8, disk: 43 },
  { time: '04:00', cpu: 18, ram: 53, network: 10.5, disk: 43 },
  { time: '06:00', cpu: 25, ram: 55, network: 16.0, disk: 43 },
  { time: '08:00', cpu: 38, ram: 59, network: 22.4, disk: 44 },
  { time: '10:00', cpu: 46, ram: 63, network: 27.1, disk: 44 },
  { time: '11:00', cpu: 42, ram: 62, network: 25.8, disk: 44 },
  { time: '12:00', cpu: 34, ram: 61, network: 24.8, disk: 44 },
];

export const ServerHealthWidget: React.FC<ServerHealthWidgetProps> = ({
  onAskAi,
  isCompact = false,
}) => {
  const { isDark } = useTheme();
  const [activeMetric, setActiveMetric] = useState<MetricKey>('cpu');
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);

  // Current live values
  const currentCpu = 34;
  const currentRam = 61;
  const currentNetwork = 24.8;
  const currentDisk = 44;

  const metricConfigs = {
    cpu: {
      label: 'CPU Load',
      value: `${currentCpu}%`,
      unit: '%',
      color: '#3b82f6',
      gradientId: 'cpuGrad',
      subtext: 'Xeon Gold • 16 Cores • 41°C',
      maxScale: 100,
    },
    ram: {
      label: 'RAM / Memory',
      value: `${currentRam}%`,
      unit: '%',
      color: '#10b981',
      gradientId: 'ramGrad',
      subtext: '19.8 GB / 32 GB Used',
      maxScale: 100,
    },
    network: {
      label: 'Throughput',
      value: `${currentNetwork}G`,
      unit: ' Gbps',
      color: '#06b6d4',
      gradientId: 'netGrad',
      subtext: 'Core Backbone I/O',
      maxScale: 40,
    },
    disk: {
      label: 'NVMe Storage',
      value: `${currentDisk}%`,
      unit: '%',
      color: '#8b5cf6',
      gradientId: 'diskGrad',
      subtext: '512 GB / 1.2 TB Used',
      maxScale: 100,
    },
  };

  const currentCfg = metricConfigs[activeMetric];

  // SVG Chart Dimensions
  const svgWidth = 420;
  const svgHeight = 130;
  const paddingX = 24;
  const paddingY = 16;

  const points = TELEMETRY_DATA.map((pt, i) => {
    const val = pt[activeMetric];
    const x = paddingX + (i / (TELEMETRY_DATA.length - 1)) * (svgWidth - paddingX * 2);
    const normalizedY = (val / currentCfg.maxScale) * (svgHeight - paddingY * 2);
    const y = svgHeight - paddingY - normalizedY;
    return { x, y, data: pt };
  });

  // Generate SVG path command
  const linePath = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm sm:text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Kesehatan Server NOC
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Telemetry Real-time Core Gateway & Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optimal (99.98%)</span>
          </div>
        </div>

        {/* 4 Metric Pill Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mb-3.5">
          {(['cpu', 'ram', 'network', 'disk'] as MetricKey[]).map((key) => {
            const cfg = metricConfigs[key];
            const isActive = activeMetric === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveMetric(key)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-blue-600/15 border-blue-500/50 shadow-xs ring-1 ring-blue-500/30'
                      : 'bg-blue-50 border-blue-300 shadow-xs ring-1 ring-blue-500/20'
                    : isDark
                      ? 'bg-[#10192b] border-[#18263e] hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`text-[10px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {cfg.label.split(' ')[0]}
                </div>
                <div className={`text-xs sm:text-sm font-bold font-mono ${
                  isActive ? 'text-blue-500 dark:text-blue-400' : isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {cfg.value}
                </div>
              </button>
            );
          })}
        </div>

        {/* Chart View Area */}
        <div className={`rounded-xl border p-3 relative overflow-hidden transition-colors ${
          isDark ? 'bg-[#090f1d] border-[#18263e]' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Legend and Active Value */}
          <div className="flex items-center justify-between mb-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCfg.color }} />
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {currentCfg.label}
              </span>
              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ({hoveredPoint ? `${hoveredPoint[activeMetric]}${currentCfg.unit} @ ${hoveredPoint.time}` : `${currentCfg.value}`})
              </span>
            </div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Rentang 12 Jam
            </span>
          </div>

          {/* SVG Line / Area Chart */}
          <div className="w-full relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-28 overflow-visible"
            >
              <defs>
                <linearGradient id={currentCfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentCfg.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={currentCfg.color} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={svgWidth - paddingX}
                y2={paddingY}
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={svgHeight / 2}
                x2={svgWidth - paddingX}
                y2={svgHeight / 2}
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={svgHeight - paddingY}
                x2={svgWidth - paddingX}
                y2={svgHeight - paddingY}
                stroke={isDark ? '#334155' : '#cbd5e1'}
              />

              {/* Area */}
              <path d={areaPath} fill={`url(#${currentCfg.gradientId})`} />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke={currentCfg.color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill={isDark ? '#0b1222' : '#ffffff'}
                  stroke={currentCfg.color}
                  strokeWidth="2"
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseEnter={() => setHoveredPoint(pt.data)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Time labels below chart */}
            <div className="flex justify-between px-2 text-[9px] font-mono text-slate-400 mt-1">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00 WIB</span>
            </div>
          </div>
        </div>

        {/* Core Node Status Chips */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className={`p-2 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#10192b] border-[#18263e]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                BNG Gateway 10.12.0.1
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-500 font-bold shrink-0">UP</span>
          </div>

          <div className={`p-2 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#10192b] border-[#18263e]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Aradial AAA RADIUS
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-500 font-bold shrink-0">UP</span>
          </div>
        </div>
      </div>

      {/* Action Footer: Ask AI to Analyze */}
      {onAskAi && (
        <div className={`pt-3 mt-3 border-t ${isDark ? 'border-[#18263e]' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={() => onAskAi('Analisa performa dan kesehatan server NOC saat ini')}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tanya AI Analisa Kesehatan Server</span>
            <ArrowUpRight className="w-3 h-3 ml-auto opacity-70" />
          </button>
        </div>
      )}
    </div>
  );
};
