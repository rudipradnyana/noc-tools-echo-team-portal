import React, { useState, useMemo } from 'react';
import {
  Filter,
  ArrowRight,
  Terminal,
  Activity,
  Globe,
  Server,
  FileCode2,
  Cpu,
  Boxes,
  Binary,
  Archive,
  Database,
  ShieldAlert,
  MountainSnow,
  FileSpreadsheet,
  ClipboardList,
  GitFork,
  Sliders,
  BookOpen,
  ZapOff,
  Eye,
  GitCommit,
  CheckCircle2,
  Star,
  Users,
  Kanban
} from 'lucide-react';
import { NocTool, ToolCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AllToolsCatalogViewProps {
  tools: NocTool[];
  initialCategory?: ToolCategory;
  onSelectTool: (tool: NocTool) => void;
  onOpenArchitectureModal?: () => void;
  onToggleFavorite?: (toolId: string) => void;
}

const CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: 'ALL', label: 'All Tools' },
  { id: 'BNG', label: 'BNG' },
  { id: 'DHCP', label: 'DHCP' },
  { id: 'LOOKUP', label: 'Lookup' },
  { id: 'CHECK', label: 'Check' },
  { id: 'REPORT', label: 'Report' },
];

export const AllToolsCatalogView: React.FC<AllToolsCatalogViewProps> = ({
  tools,
  initialCategory = 'ALL',
  onSelectTool,
  onToggleFavorite,
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(initialCategory);

  // Sync selectedCategory whenever initialCategory prop changes (e.g. from sidebar navigation)
  React.useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const categoryCounts = useMemo(() => {
    return {
      ALL: tools.length,
      BNG: tools.filter((t) => t.category === 'BNG').length,
      DHCP: tools.filter((t) => t.category === 'DHCP').length,
      LOOKUP: tools.filter((t) => t.category === 'LOOKUP').length,
      CHECK: tools.filter((t) => t.category === 'CHECK').length,
      REPORT: tools.filter((t) => t.category === 'REPORT').length,
    };
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      return selectedCategory === 'ALL' || tool.category === selectedCategory;
    });
  }, [tools, selectedCategory]);

  const renderToolIcon = (iconName: string) => {
    const iconColor = isDark
      ? 'text-blue-400 group-hover:text-white'
      : 'text-blue-600 group-hover:text-blue-800';
    const props = { className: `w-5 h-5 ${iconColor} transition-colors` };
    switch (iconName) {
      case 'Globe': return <Globe {...props} />;
      case 'Server': return <Server {...props} />;
      case 'FileCode2': return <FileCode2 {...props} />;
      case 'Terminal': return <Terminal {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Boxes': return <Boxes {...props} />;
      case 'Binary': return <Binary {...props} />;
      case 'Archive': return <Archive {...props} />;
      case 'Database': return <Database {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'MountainSnow': return <MountainSnow {...props} />;
      case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
      case 'ClipboardList': return <ClipboardList {...props} />;
      case 'GitFork': return <GitFork {...props} />;
      case 'Sliders': return <Sliders {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'ZapOff': return <ZapOff {...props} />;
      case 'Eye': return <Eye {...props} />;
      case 'GitCommit': return <GitCommit {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Kanban': return <Kanban {...props} />;
      default: return <Activity {...props} />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            NOC Internal Tools Catalog
          </h1>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className={`border rounded-2xl p-3.5 sm:p-4 shadow-xs transition-colors ${
        isDark ? 'bg-[#0c1322] border-[#16233b]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id as keyof typeof categoryCounts] ?? 0;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-[#1d4ed8] text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-400/50'
                      : 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : isDark
                      ? 'bg-[#10192b] text-slate-300 hover:bg-[#15233c] border border-[#1a2b46]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    isActive
                      ? isDark
                        ? 'bg-blue-900/80 text-blue-100 border border-blue-400/40'
                        : 'bg-blue-700 text-white'
                      : isDark
                        ? 'bg-[#16233b] text-slate-400 border border-slate-700/50'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            id={`tool-card-${tool.id}`}
            onClick={() => onSelectTool(tool)}
            className={`border rounded-2xl p-5 transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md ${
              isDark
                ? 'bg-[#0c1322] hover:bg-[#111a2e] border-[#16233b] hover:border-blue-500/50'
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div>
              {/* Card Top */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-[#10192b] border-[#1a2b46] group-hover:bg-blue-600/20 group-hover:border-blue-500/40'
                    : 'bg-blue-50 border-blue-100 group-hover:bg-blue-100/80'
                }`}>
                  {renderToolIcon(tool.iconName)}
                </div>
                {/* Favorite Star Button */}
                <button
                  type="button"
                  id={`btn-star-${tool.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(tool.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    tool.isFavorite
                      ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                      : isDark
                        ? 'text-slate-500 hover:text-amber-300 hover:bg-slate-800/60'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                  title={tool.isFavorite ? 'Hapus dari Quick Access' : 'Tambahkan ke Favorit (Quick Access)'}
                >
                  <Star
                    className={`w-4 h-4 transition-all ${
                      tool.isFavorite
                        ? 'fill-amber-400 text-amber-400 scale-110'
                        : isDark
                          ? 'text-slate-400 hover:text-amber-300'
                          : 'text-slate-400 hover:text-amber-500'
                    }`}
                  />
                </button>
              </div>

              {/* Title */}
              <h3 className={`text-sm font-bold transition-colors ${
                isDark
                  ? 'text-white group-hover:text-blue-400'
                  : 'text-slate-900 group-hover:text-blue-600'
              }`}>
                {tool.name}
              </h3>
            </div>

            {/* Bottom Actions */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-[#15233c]' : 'border-slate-100'
            }`}>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                isDark
                  ? 'text-slate-400 bg-slate-900'
                  : 'text-slate-500 bg-slate-100'
              }`}>
                {tool.internalPath}
              </span>
              <span className={`text-xs font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <span>Run</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
