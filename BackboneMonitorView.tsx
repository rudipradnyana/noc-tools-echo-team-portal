import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Server, 
  Wifi, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  ExternalLink
} from 'lucide-react';
import { BackboneLink, VvipClient } from '../../types';
import { MOCK_BACKBONE_LINKS, MOCK_VVIP_CLIENTS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

export const BackboneMonitorView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen p-4 lg:p-8 space-y-8 rounded-2xl transition-colors ${
      isDark ? 'bg-[#0b101b] text-slate-100' : 'bg-white text-slate-900 border border-slate-200/80 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              isDark 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              Integrated Module
            </span>
            <h1 className={`text-2xl font-black flex items-center gap-2.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Activity className="w-6 h-6 text-blue-500" />
              Check BB IP Jawa-Bali & VVIP Performance
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Status real-time link optik 100G/200G Jawa-Bali dan SLA telemetri VVIP DU PLN & Perbankan (tanpa redirect).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className={`font-semibold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ALL BACKBONE SYSTEMS HEALTHY
          </span>
        </div>
      </div>

      {/* SECTION 1: CHECK BB IP JAWA-BALI */}
      <div className={`border rounded-2xl p-6 shadow-xl transition-colors ${
        isDark ? 'bg-[#101725] border-slate-800' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Server className="w-5 h-5 text-blue-500" />
              Detail Status Port Backbone IP Jawa-Bali
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Monitoring utilisasi bandwidth interface 100GbE / 200GbE antar POP utama.
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded border font-mono text-xs ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
          }`}>
            SNMP Poll Rate: 30s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_BACKBONE_LINKS.map((link) => (
            <div key={link.id} className={`border rounded-xl p-5 transition-colors ${
              isDark ? 'bg-[#0c1220] border-slate-800/90 hover:border-slate-700' : 'bg-white border-slate-200 shadow-2xs hover:border-blue-400'
            }`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs font-mono text-blue-500 font-semibold">{link.segmentName}</div>
                  <div className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {link.origin} &rarr; {link.destination}
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{link.interfaceName}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  link.status === 'NORMAL'
                    ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {link.status}
                </span>
              </div>

              {/* Traffic Progress Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-xs">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Traffic Load:</span>
                  <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {link.currentTrafficGbps} Gbps / {link.capacityGbps} Gbps ({link.utilizationPercent}%)
                  </span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-800' : 'bg-slate-200'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      link.utilizationPercent > 80 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${link.utilizationPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              <div className={`grid grid-cols-2 gap-2 pt-3 border-t text-xs ${
                isDark ? 'border-slate-800/80' : 'border-slate-100'
              }`}>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>RTT Latency:</span>
                  <span className={`font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{link.latencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Packet Loss:</span>
                  <span className={`font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{link.packetLossPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CHECK VVIP DU PLN & PERBANKAN */}
      <div className={`border rounded-2xl p-6 shadow-xl transition-colors ${
        isDark ? 'bg-[#101725] border-slate-800' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Detail Performance Service VVIP (DU PLN, Perbankan, SCADA)
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Penjaminan SLA Uptime 99.999% dan status proteksi jalur ganda.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_VVIP_CLIENTS.map((vvip) => (
            <div key={vvip.id} className={`border rounded-xl p-5 transition-colors ${
              isDark ? 'bg-[#0c1220] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {vvip.serviceId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      SLA: {vvip.slaUptime}% Uptime
                    </span>
                  </div>
                  <h3 className={`text-base font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{vvip.clientName}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Latency:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{vvip.currentLatency} ms</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Jitter:</span>
                    <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{vvip.jitter} ms</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className={`p-2.5 rounded border ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`block text-[10px] uppercase tracking-wider font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Primary Route:
                  </span>
                  <span className="font-mono text-blue-500">{vvip.primaryPath}</span>
                </div>
                <div className={`p-2.5 rounded border ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`block text-[10px] uppercase tracking-wider font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Backup / Protection Route:
                  </span>
                  <span className="font-mono text-purple-500">{vvip.backupPath}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
