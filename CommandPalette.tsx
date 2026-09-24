import React, { useState, useEffect } from 'react';
import { Search, X, Terminal, ExternalLink, ArrowRight, Activity, Globe, Server, CheckCircle2 } from 'lucide-react';
import { NocTool } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: NocTool[];
  onSelectTool: (tool: NocTool) => void;
  onNavigateEcho: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
  onNavigateEcho,
}) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.category.toLowerCase().includes(query.toLowerCase()) ||
    (tool.subtext && tool.subtext.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
        isDark ? 'bg-[#0e1626] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Search Input */}
        <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${
          isDark ? 'border-slate-800 bg-[#0a101d]' : 'border-slate-200 bg-slate-50'
        }`}>
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama alat, IP, EA, atau perintah..."
            className={`w-full bg-transparent focus:outline-none text-sm ${
              isDark ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-200 text-slate-600 border-slate-300'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className={`max-h-96 overflow-y-auto p-2 divide-y ${
          isDark ? 'divide-slate-800/40' : 'divide-slate-100'
        }`}>
          {/* Quick Actions */}
          <div className="pb-2">
            <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Quick Navigation
            </div>
            <button
              onClick={() => {
                onNavigateEcho();
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                isDark ? 'text-slate-200 hover:bg-blue-600/20 hover:text-blue-300' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Buka Team Workload (Echo Team)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Filtered Tools */}
          <div className="pt-2">
            <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              NOC Tools ({filteredTools.length})
            </div>
            {filteredTools.length === 0 ? (
              <div className={`py-8 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tidak ada alat yang sesuai dengan "{query}"
              </div>
            ) : (
              filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors group ${
                    isDark ? 'text-slate-200 hover:bg-[#15233d]' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`font-semibold flex items-center gap-2 ${
                        isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                      }`}>
                        <span>{tool.name}</span>
                        <span className={`text-[10px] font-normal px-1.5 py-0.2 rounded font-mono ${
                          isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-600 bg-slate-200'
                        }`}>
                          {tool.category}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tool.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-500 opacity-0 group-hover:opacity-100 flex items-center gap-1 font-semibold">
                    Jalankan <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between ${
          isDark ? 'bg-[#080d19] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <span>Tekan ESC untuk menutup</span>
          <span className="text-emerald-500 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Semua alat berjalan di port lokal
          </span>
        </div>
      </div>
    </div>
  );
};
