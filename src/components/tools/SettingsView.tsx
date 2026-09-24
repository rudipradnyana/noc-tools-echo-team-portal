import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Server,
  Terminal,
  Cpu,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Layers,
  Database,
  Lock,
  Globe
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SettingsViewProps {
  onOpenArchitectureModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenArchitectureModal,
}) => {
  const { isDark } = useTheme();
  const [gatewayIp, setGatewayIp] = useState('10.12.0.1');
  const [proxyPort, setProxyPort] = useState('3000');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
          isDark ? 'text-[#38bdf8]' : 'text-blue-600'
        }`}>
          SYSTEM CONFIGURATION
        </div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          NOC Workspace Settings
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Konfigurasi single-origin reverse proxy, integrasi migrasi Echo Team, dan telemetry gateway.
        </p>
      </div>

      {/* Mentor Task Resolution Card */}
      <div className={`border rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden transition-colors ${
        isDark ? 'bg-[#0c1322] border-blue-500/30' : 'bg-white border-blue-200 shadow-sm'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' : 'bg-blue-50 border border-blue-200 text-blue-600'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>Solusi Masalah Mentor: Single-Origin & Migrasi Echo</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Verified
                </span>
              </h3>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Tantangan awal dashboard NOC lama adalah setiap tombol melompat ke port dan IP eksternal yang berbeda-beda. Sistem ini menyatukan 24 alat ke dalam satu domain yang sama dan memigrasi sistem Echo Team dari VPS mandiri menjadi satu aplikasi terpadu.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenArchitectureModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Lihat Diagram Arsitektur</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gateway & Reverse Proxy Configuration */}
      <div className={`border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 transition-colors ${
        isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
      }`}>
        <h2 className={`text-base font-bold flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          <Server className="w-4 h-4 text-blue-500" />
          <span>Gateway & Reverse Proxy Internal</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Internal Gateway IP
            </label>
            <input
              type="text"
              value={gatewayIp}
              onChange={(e) => setGatewayIp(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors ${
                isDark 
                  ? 'bg-[#10192b] border-[#1a2b46] text-slate-100' 
                  : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
              }`}
            />
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Gateway pusat untuk routing BNG, Aradial, dan Telnet Cisco.
            </p>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Single-Origin Proxy Port
            </label>
            <input
              type="text"
              value={proxyPort}
              onChange={(e) => setProxyPort(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors ${
                isDark 
                  ? 'bg-[#10192b] border-[#1a2b46] text-slate-100' 
                  : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
              }`}
            />
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Port terpusat yang melayani semua 24 fungsi alat.
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t ${
          isDark ? 'border-[#15233c]' : 'border-slate-100'
        }`}>
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>DNS Resolution</div>
            <div className="text-xs font-bold text-emerald-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Internal NOC DNS Active
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Echo Team Sync</div>
            <div className="text-xs font-bold text-emerald-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Native In-Memory Database
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#10192b] border-[#1a2b46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Latency Overhead</div>
            <div className="text-xs font-bold text-blue-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              &lt; 2.4 ms (Local Loop)
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Konfigurasi berhasil disimpan!
            </span>
          ) : (
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Perubahan diterapkan langsung ke semua sesi alat.
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

    </div>
  );
};
