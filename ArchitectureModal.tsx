import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Server, 
  Globe, 
  Layers, 
  Network, 
  Sparkles, 
  Workflow,
  AlertTriangle
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700 text-slate-100 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Tugas Mentor NOC
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Migrasi VPS & Unified URL Architecture
          </span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
          <Workflow className="w-6 h-6 text-blue-400" />
          Solusi Arsitektur: Unified NOC Tools & Echo Team
        </h2>

        {/* Section 1: Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
          
          {/* Kondisi Lama (Sebelum) */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              <span>Kondisi Lama (Permasalahan)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>
                <strong>Banyak Redirect & Port Terpisah:</strong> Saat mengklik &quot;Cek EA POP&quot;, &quot;Cek IP Publik&quot;, dll, user di-redirect ke port/IP lain (misal <code className="text-rose-300">192.168.1.50:8080</code>).
              </li>
              <li>
                <strong>Echo Team di VPS Pegawai:</strong> Website manajemen tugas tim berjalan di server VPS pribadi pegawai, rentan downtime dan tidak terintegrasi.
              </li>
              <li>
                <strong>Pengalaman Terfragmentasi:</strong> Teknisi NOC harus membuka 4-5 tab browser berbeda dengan URL berbeda.
              </li>
            </ul>
          </div>

          {/* Kondisi Baru (Setelah Redesign) */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hasil Redesign (Tugas Selesai)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>
                <strong>Satu Alamat Tunggal (No Redirect):</strong> Semua 23 alat NOC berjalan di domain yang sama (<code className="text-emerald-300">/workbench</code>, <code className="text-emerald-300">/tools/*</code>).
              </li>
              <li>
                <strong>Echo Team Sukses Dimigrasi:</strong> Task Board (To Do, In Progress, Done), Task List, Log Book, Clean Alarm EA & Team Workload kini terintegrasi langsung di dalam NOC Hub.
              </li>
              <li>
                <strong>In-App Diagnostic Workbench:</strong> Teknisi dapat langsung menjalankan query EA, cek IP, Aradial session, dan MPLS trace tanpa keluar dari halaman.
              </li>
            </ul>
          </div>

        </div>

        {/* Section 2: Flow Diagram */}
        <div className="bg-[#090d16] border border-slate-800 rounded-xl p-5 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Topologi Akses Tunggal (Reverse Proxy & Microservices)
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-blue-950/40 border border-blue-800/40 text-blue-300 flex items-center justify-between">
              <span>Client Browser (Teknisi NOC)</span>
              <span className="text-[11px] font-sans bg-blue-900/60 px-2 py-0.5 rounded text-blue-200">
                Single URL: http://noc.internal:3000
              </span>
            </div>

            <div className="flex justify-center text-slate-500 text-sm">&darr; Gateway Router / Internal SPA Router &darr;</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
                <span className="font-bold block text-blue-400">/tools/*</span>
                23 NOC Network Tools
              </div>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
                <span className="font-bold block text-emerald-400">/workbench</span>
                In-App Terminal & Lookup
              </div>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
                <span className="font-bold block text-purple-400">/echo/*</span>
                Echo Team Workspace
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md cursor-pointer"
          >
            Tutup & Lanjutkan Eksplorasi
          </button>
        </div>

      </div>
    </div>
  );
};
